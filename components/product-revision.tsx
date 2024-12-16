"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Search, Download, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import ProductDetail from "@/components/product-public-detail"
import { useSupplierStore } from "@/store/modules/supplierStore"
import { useRouter } from 'next/navigation'
import { SupplierSelector } from "@/components/supplier-selector"

interface Product {
  id: string
  variationsku: string
  ecsku: string
  sellersku: string
  thumbnailurl: string
  name: string
  originalname: string
  content: string
  contenthtml: string
  originalcontent: string
  updatedat: string
  createdat: string
  category?: string
  stocks: {
    nowstock: number
  }
}

const categories = ['전체', '의류', '식품', '전자제품', '가구', '화장품', '사무용품']
const DEFAULT_IMAGE = 'https://via.placeholder.com/150'

export default function SupplierProductManagement() {
  const [userData, setUserData] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [editingContent, setEditingContent] = useState<string>('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")

  const { user } = useUserDataStore();
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore();
  const router = useRouter()

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await fetchProductData(selectedSupplier.id, user.companyid)
      }
    }
    
    initializeData()
  }, [user, selectedSupplier])

  const fetchProductData = async (supplyid: string | number, companyid: string) => {
    try {
      console.log('Fetching products with params:', { supplyid, companyid });
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          ecsku,
          sellersku,
          thumbnailurl,
          name,
          originalname,
          content,
          contenthtml,
          originalcontent,
          updatedat,
          createdat,
          stocks (
            nowstock
          )
        `)
        .eq('companyid', companyid)
        .eq('supplyid', supplyid.toString())
        .order('createdat', { ascending: false })

      if (error) throw error;

      const formattedData = data.map(item => ({
        ...item,
        contenthtml: item.contenthtml || '',
        stocks: item.stocks ? (item.stocks[0] || { nowstock: 0 }) : { nowstock: 0 }
      }));

      console.log('Formatted data:', formattedData);
      setProducts(formattedData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
    }
  }

  const handleSupplierSelect = async (supplier: any) => {
    if (user && supplier && supplier.id) {
      const { supplyname, id, companyid } = supplier
      setSelectedSupplier({
        id,
        supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid
      })
      
      await fetchProductData(id, user.companyid)
    }
  }

  const handleEditContent = async (productId: string, newContent: string, newContentHtml: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ 
          content: newContent,
          contenthtml: newContentHtml
        })
        .eq('id', productId)

      if (error) throw error;

      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, content: newContent, contenthtml: newContentHtml }
          : product
      ))
      
      setEditingProductId(null)
      setEditingContent('')
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update content:', error)
      alert('본문 수정에 실패했습니다.')
    }
  }

  const handleProductSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearch(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    (product.name?.toLowerCase() || '').includes(productSearch.toLowerCase()) ||
    (product.variationsku?.toLowerCase() || '').includes(productSearch.toLowerCase())
  );

  const handleSupplierSearch = () => {
    if (!supplierSearchTerm || !user) {
      if (user) {
        fetchProductData(selectedSupplier.id, user.companyid);
      }
      return;
    }

    const filteredData = products.filter(product =>
      product.supplyname.includes(supplierSearchTerm) ||
      product.managername.includes(supplierSearchTerm)
    );
    setProducts(filteredData);
  }

  const productColumns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    { 
      id: "number",
      header: "번호",
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1}
        </div>
      )
    },
    { 
      accessorKey: "ecsku",
      header: "EC SKU",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          {row.original.ecsku || '-'}
        </div>
      )
    },
    { 
      accessorKey: "sellersku",
      header: "Seller SKU",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          {row.original.sellersku || '-'}
        </div>
      )
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          <img
            src={row.original.thumbnailurl || DEFAULT_IMAGE}
            alt={row.original.name || '상품 이미지'}
            className="w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
      ),
    },
    { 
      accessorKey: "originalname",
      header: "원본 상품명",
      cell: ({ row }) => (
        <div 
          className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-blue-500"
          title={row.original.originalname}
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.originalname || '-'}
        </div>
      )
    },
    { 
      accessorKey: "name",
      header: "보정 상품명",
      cell: ({ row }) => (
        <div 
          className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-blue-500" 
          title={row.original.name}
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.name || '-'}
        </div>
      )
    },
    { 
      accessorKey: "updatedat",
      header: "마지막 수정일",
      cell: ({ row }) => {
        const date = row.original.updatedat || row.original.createdat
        return date ? new Date(date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replace(/\//g, '.').replace(' ', ' ') : '-'
      }
    },
    { 
      id: "edit",
      header: "수정",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingProductId(row.original.id)
            setEditingContent(row.original.content || '')
            setIsEditDialogOpen(true)
          }}
        >
          수정
        </Button>
      )
    }
  ]

  const productDescriptionColumns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    { 
      accessorKey: "ecsku",
      header: "EC SKU",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          {row.original.ecsku || '-'}
        </div>
      )
    },
    { 
      accessorKey: "sellersku",
      header: "Seller SKU",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          {row.original.sellersku || '-'}
        </div>
      )
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          <img
            src={row.original.thumbnailurl || DEFAULT_IMAGE}
            alt={row.original.name}
            className="w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
      ),
    },
    { 
      accessorKey: "originalcontent",
      header: "원본 본문",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.originalcontent}>
          {row.original.originalcontent || '-'}
        </div>
      )
    },
    { 
      accessorKey: "content",
      header: "보정 본문",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.content}>
          {row.original.content || '-'}
        </div>
      )
    },
    { 
      accessorKey: "updatedat",
      header: "마지막 수정일",
      cell: ({ row }) => {
        const date = row.original.updatedat || row.original.createdat
        return date ? new Date(date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', '').replace(/\//g, '.').replace(' ', ' ') : '-'
      }
    },
    { 
      id: "edit",
      header: "수정",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingProductId(row.original.id)
            setEditingContent(row.original.content || '')
            setIsEditDialogOpen(true)
          }}
        >
          수정
        </Button>
      )
    }
  ]

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDetailDialogOpen(true);
  };

  const handleProductRegistration = (method: string) => {
    router.push(`/product/public/new?type=${method}`)
  }

  return (
    <>
      <div className="container mx-auto py-6 space-y-8">
        <SupplierSelector onSupplierSelect={handleSupplierSelect} />

        <Card>
          <CardHeader>
            <CardTitle>상품 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="product-name-correction" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="product-name-correction">상품명 보정</TabsTrigger>
                  <TabsTrigger value="product-description-correction">상품 본문 보정</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={selectedProducts.length === 0}>
                        Options
                        <MoreHorizontal className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>원문 {`>`} 보정 옮기기</DropdownMenuItem>
                      <DropdownMenuItem>정리하기</DropdownMenuItem>
                      <DropdownMenuItem>되돌리기</DropdownMenuItem>
                      <DropdownMenuItem>Replace</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="default">저장</Button>
                </div>
              </div>

              <TabsContent value="product-name-correction">
                <DataTable 
                  columns={productColumns}
                  data={filteredProducts}
                  searchTerm={productSearch}
                  onSearchTermChange={setProductSearch}
                  showActionButtons={true}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  selectedSupplier={selectedSupplier}
                />
              </TabsContent>
              <TabsContent value="product-description-correction">
                <DataTable 
                  columns={productDescriptionColumns}
                  data={products}
                  searchTerm={productSearch}
                  onSearchTermChange={setProductSearch}
                  showActionButtons={true}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  selectedSupplier={selectedSupplier}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[1200px] h-[800px] flex flex-col">
          <DialogHeader>
            <DialogTitle>보정 본문 수정</DialogTitle>
          </DialogHeader>
          <div className="flex-1 grid grid-cols-2 gap-6 py-4 overflow-hidden">
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-2">원본 본문</label>
              <div className="flex-1 p-4 bg-gray-50 rounded-md overflow-y-auto whitespace-pre-wrap">
                {products.find(p => p.id === editingProductId)?.originalcontent || '-'}
              </div>
            </div>
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-2">보정 본문</label>
              <textarea
                defaultValue={editingContent}
                onChange={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                  setEditingContent(e.currentTarget.value)
                }}
                className="flex-1 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  minHeight: '600px',
                  lineHeight: '1.5',
                  fontSize: '16px'
                }}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingProductId(null)
                setEditingContent('')
              }}
            >
              취소
            </Button>
            <Button 
              onClick={() => editingProductId && handleEditContent(editingProductId, editingContent, '')}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[1600px] max-h-[95vh] overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle>상품 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedProductId && (
            <ProductDetail 
              productId={selectedProductId} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  onSearch?: () => void
  showActionButtons: boolean
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  currentPage?: number
  onPageChange?: (page: number) => void
  selectedSupplier?: any
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchTerm,
  onSearchTermChange,
  onSearch,
  showActionButtons,
  categories,
  selectedCategory,
  onCategoryChange,
  currentPage,
  onPageChange,
  selectedSupplier,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage || 0,
        pageSize: 10,
      },
    },
  })

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center w-full">
            <Input
              placeholder="SKU 또는 상품명을 입력하세요"
              value={searchTerm}
              onChange={(event) => onSearchTermChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch?.();
                }
              }}
              className="max-w-full mr-2"
            />
            <Button onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    ${row.getIsSelected() ? "bg-blue-50" : ""} 
                    ${selectedSupplier?.id === (row.original as any)?.id ? "bg-blue-100" : ""}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = table.getState().pagination.pageIndex - 1;
              onPageChange && onPageChange(newPage);
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = table.getState().pagination.pageIndex + 1;
              onPageChange && onPageChange(newPage);
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}