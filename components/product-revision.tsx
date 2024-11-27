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

interface Supplier {
  id: number
  code: string
  company: string
  website: string
  brand: string
  registrationDate: string
}

interface Product {
  id: string
  variationsku: string
  thumbnailurl: string
  name: string
  originalname: string
  content: string
  originalcontent: string
  updatedat: string
  createdat: string
  category?: string
  stocks?: {
    nowstock: number
  }
}

const categories = ['전체', '의류', '식품', '전자제품', '가구', '화장품', '사무용품']

export default function SupplierProductManagement() {
  const [userData, setUserData] = useState<any>(null)
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [supplierSearch, setSupplierSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)

  const { user } = useUserDataStore();

  useEffect(() => {
    if (user) fetchSupplierData(user!.companyid)
  }, [user])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error;
      
      setSupplierData(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProductData = async (itemCustomerId: string, companyid: string, supplierName: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          thumbnailurl,
          name,
          originalname,
          content,
          originalcontent,
          updatedat,
          createdat,
          stocks (
            nowstock
          )
        `)
        .eq('companyid', companyid)
        .eq('supplyid', itemCustomerId)
        .order('createdat', { ascending: false })

      if (error) throw error;

      setSelectedSupplier({
        id: parseInt(itemCustomerId),
        company: supplierName,
        code: '',
        website: '',
        brand: '',
        registrationDate: new Date().toISOString()
      });
      
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
    }
  }

  const handleSupplierSelect = (row: any) => {
    const { supplyname: supplierName, id: itemCustomerId, companyid } = row;
    fetchProductData(itemCustomerId, companyid, supplierName);
  }

  const supplierColumns: ColumnDef<any>[] = [
    { accessorKey: "supplyname", header: "회사명" },
    { accessorKey: "managername", header: "담당자" },
    { accessorKey: "created", header: "등록일" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          onClick={() => handleSupplierSelect(row.original)}
          variant="outline"
          size="sm"
        >
          선택
        </Button>
      ),
    },
  ]

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
      accessorKey: "variationsku",
      header: "SKU",
      cell: ({ row }) => row.original.variationsku || '-'
    },
    {
      accessorKey: "thumbnailurl",
      header: "이미지",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={row.original.thumbnailurl || '/placeholder.svg'}
            alt={row.original.name || '상품 이미지'}
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      ),
    },
    { 
      accessorKey: "originalname",
      header: "원본 상품명",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.originalname || row.original.name}>
          {row.original.originalname || row.original.name || '-'}
        </div>
      )
    },
    { 
      accessorKey: "name",
      header: "보정 상품명",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={row.original.name}>
          {row.original.name || '-'}
        </div>
      )
    },
    { 
      accessorKey: "updatedat",
      header: "마지막 수정일",
      cell: ({ row }) => {
        const date = row.original.updatedat || row.original.createdat
        return date ? new Date(date).toLocaleString('ko-KR') : '-'
      }
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
    { accessorKey: "id", header: "#" },
    { accessorKey: "sku", header: "SKU" },
    {
      accessorKey: "image",
      header: "이미지",
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.originalName}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    { accessorKey: "originalDescription", header: "원본 본문" },
    { accessorKey: "correctedDescription", header: "보정 본문" },
    { accessorKey: "lastModified", header: "마지막 수정일" },
  ]

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">공급사</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSupplierTableExpanded(!isSupplierTableExpanded)}
          >
            {isSupplierTableExpanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </CardHeader>
        <CardContent>
          {isSupplierTableExpanded && (
            <DataTable 
              columns={supplierColumns}
              data={supplierData}
              searchTerm={supplierSearch}
              onSearchTermChange={setSupplierSearch}
              showActionButtons={false}
            />
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {selectedSupplier ? `${selectedSupplier.company} 상품 목록` : '상품 목록'}
          </CardTitle>
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
                data={products}
                searchTerm={productSearch}
                onSearchTermChange={setProductSearch}
                showActionButtons={true}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
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
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchTerm: string
  onSearchTermChange: (term: string) => void
  showActionButtons: boolean
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchTerm,
  onSearchTermChange,
  showActionButtons,
  categories,
  selectedCategory,
  onCategoryChange,
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
    },
  })

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filter..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              className="max-w-sm"
            />
            {categories && onCategoryChange && (
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="���테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">상품 등록</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>직접 입력</DropdownMenuItem>
                <DropdownMenuItem>Url 입력</DropdownMenuItem>
                <DropdownMenuItem>파일 업로드</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              목록 다운로드
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
