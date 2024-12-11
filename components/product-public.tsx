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
import { ChevronDown, ChevronRight, Search, Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ProductDetail from "@/components/product-public-detail"
import { useSupplierStore } from "@/store/modules/supplierStore"

export default function SupplierProductPage() {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [productSearch, setProductSearch] = useState('');

  const { user } = useUserDataStore();
  const router = useRouter()
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore()

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await initializeSupplierData(user.companyid)
        // 선택된 공급사가 있으면 상품 데이터 로드
        if (selectedSupplier?.id) {
          console.log('Loading products for selected supplier:', selectedSupplier)
          await fetchProductData(selectedSupplier.id.toString(), user.companyid)
        }
      }
    }
    
    initializeData()
  }, [user, selectedSupplier?.id])

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

  const fetchProductData = async (supplyId: string, companyId: string) => {
    try {
      console.log('Fetching products for:', { supplyId, companyId }); // 디버깅용 로그

      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          thumbnailurl,
          consumerprice,
          createdat,
          orginurl,
          ecsku,
          sellersku,
          stocks (
            nowstock
          )
        `)
        .eq('companyid', companyId)
        .eq('supplyid', supplyId)
        .order('createdat', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Fetched products:', data); // 디버깅용 로그

      // 데이터 가공
      const formattedData = data.map(item => ({
        ...item,
        stocks: {
          nowstock: item.stocks?.[0]?.nowstock || 0
        }
      }));

      setFilteredProducts(formattedData);
    } catch (error) {
      console.error('Error in fetchProductData:', error);
      setFilteredProducts([]);
    }
  };

  const handleSupplierSelect = async (supplier: any) => {
    try {
      if (!user || !supplier || !supplier.id) {
        console.error('Invalid supplier or user data');
        return;
      }

      console.log('Selected supplier:', supplier); // 디버깅용 로그

      // 공급사 정보 설정
      const supplierInfo = {
        id: supplier.id,
        supplyname: supplier.supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid: supplier.companyid
      };

      // 선택된 공급사 정보 업���이트
      setSelectedSupplier(supplierInfo);
      
      // 상품 데이터 로드
      await fetchProductData(supplier.id.toString(), user.companyid);

    } catch (error) {
      console.error('Error in handleSupplierSelect:', error);
      setFilteredProducts([]);
    }
  };

  const handleSupplierSearch = () => {
    if (!supplierSearchTerm) {
      // If search term is empty, reset to original supplier data
      initializeSupplierData(user.companyid);
      return;
    }

    const filteredData = supplierData.filter(supplier =>
      supplier.supplyname.includes(supplierSearchTerm) ||
      supplier.managername.includes(supplierSearchTerm)
    );
    setSupplierData(filteredData);
  }

  const initializeSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid);

      if (error) throw error;
      setSupplierData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleProductRegistration = (method: string) => {
    router.push(`/product/public/new?type=${method}`)
  }

  const handleDownloadList = () => {
    // Implement the download logic here
    console.log("Downloading list")
  }

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDetailDialogOpen(true);
  };

  const handleProductSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearch(event.target.value);
  };

  const filteredProductsList = filteredProducts.filter(product =>
    (product.name && product.name.toLowerCase().includes(productSearch.toLowerCase())) ||
    (product.variationsku && product.variationsku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Supplier columns
  const supplierColumns: ColumnDef<typeof supplierData[0]>[] = [
    { accessorKey: "supplyname", header: "회사명" },
    { accessorKey: "managername", header: "담당자" },
    { accessorKey: "created", header: "등록일" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => handleSupplierSelect(row.original)}
          variant={selectedSupplier?.id === row.original.id ? "default" : "outline"}
          className={selectedSupplier?.id === row.original.id ? "bg-blue-500 text-white" : ""}
        >
          선택
        </Button>
      ),
    },
  ]

  // Product columns
  const productColumns = [
    {
      id: "number",
      header: "No.",
      cell: ({ row }: { row: any }) => {
        return row.index + 1;
      },
      size: 30,
    },
    { 
      accessorKey: "variationsku", 
      header: "SKU",
      size: 120,
      cell: ({ row }: { row: any }) => (
        <div 
          className="cursor-pointer hover:text-blue-500"
          onClick={() => handleProductClick(row.original.id)}
        >
          {row.original.variationsku}
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
      size: 80,
      cell: ({ row }: { row: any }) => (
        <div 
          className="cursor-pointer"
          onClick={() => handleProductClick(row.original.id)}
        >
          <img 
            className="w-10 h-10 bg-gray-200 rounded hover:opacity-80 transition-opacity" 
            src={row.original.thumbnailurl || ""} 
            alt=""
          />
        </div>
      ),
    },
    { 
      accessorKey: "name", 
      header: "상품명",
      size: 400,
      cell: ({ row }: { row: any }) => (
        <div 
          className="cursor-pointer hover:text-blue-500"
          onClick={() => handleProductClick(row.original.id)}
          style={{ wordBreak: 'break-word' }}
        >
          {row.original.name}
        </div>
      )
    },
    {
      accessorKey: "consumerprice",
      header: "공급가 (원)",
      size: 100,
      cell: ({ row }: { row: any }) => {
        const price = row.original.consumerprice;
        return price ? price.toLocaleString() : '0';
      },
    },
    { 
      accessorKey: "stocks.nowstock",
      header: "재고(개)",
      size: 80,
      cell: ({ row }: { row: any }) => {
        const stock = row.original.stocks?.nowstock;
        return stock ? stock.toLocaleString() : '0';
      },
    },
    { 
      accessorKey: "createdat", 
      header: "등록일",
      size: 100,
      cell: ({ row }: { row: any }) => {
        const date = row.original.createdat;
        return date ? new Date(date).toLocaleDateString() : '-';
      }
    },
    {
      id: "actions",
      header: "원문보기",
      size: 100,
      cell: ({ row }: { row: any }) => {
        const orginurl = row.original.orginurl;
        return orginurl ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(orginurl, '_blank', 'noopener,noreferrer')}
          >
            원문보기
          </Button>
        ) : null;
      },
    },
  ]

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">공급사</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedSupplier && (
                <span className="text-lg font-medium">{selectedSupplier.supplyname}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSupplierTableExpanded(!isSupplierTableExpanded)}
              >
                {isSupplierTableExpanded ? <ChevronDown /> : <ChevronRight />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isSupplierTableExpanded && (
              <DataTable 
                columns={supplierColumns}
                data={supplierData}
                searchTerm={supplierSearchTerm}
                onSearchTermChange={setSupplierSearchTerm}
                onSearch={handleSupplierSearch}
                onDownloadList={handleDownloadList}
                onProductRegistration={handleProductRegistration}
                showActionButtons={true}
              />
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {selectedSupplier ? `공용상품 목록 [ ${selectedSupplier.supplyname} ]` : '공용상품 목록'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center w-full mb-4">
              <Input
                placeholder="SKU 또는 상품명을 입력하세요"
                value={productSearch}
                onChange={handleProductSearch}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    // Trigger search logic if needed
                  }
                }}
                className="max-w-full mr-2"
              />
              <Button onClick={() => {/* Trigger search logic if needed */}}>
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
            <DataTable 
              columns={productColumns}
              data={filteredProductsList}
              showActionButtons={false}
            />
          </CardContent>
        </Card>
      </div>


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
  onDownloadList?: () => void
  onProductRegistration?: (method: string) => void
  showActionButtons: boolean
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchTerm = "",
  onSearchTermChange,
  onSearch,
  onDownloadList,
  onProductRegistration,
  showActionButtons,
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
    columnResizeMode: 'onChange',
  })

  const { selectedSupplier } = useSupplierStore()

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Input
              placeholder="Filter..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch?.();
                }
              }}
              className="max-w-sm mr-2"
            />
            <Button onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">상품 등록</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => onProductRegistration?.("direct")}>
                  직접 입력
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onProductRegistration?.("url")}>
                  Url 입력
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onProductRegistration?.("upload")}>
                  파일 업로드
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onDownloadList}>
              <Download className="mr-2 h-4 w-4" />
              목록 다운로드
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table style={{ tableLayout: 'fixed', width: '100%', fontSize: '0.875rem' }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4 py-2" style={{ width: header.getSize() }}>
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
                  className={selectedSupplier?.id === row.original.id ? "bg-blue-100 text-black" : ""}
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
