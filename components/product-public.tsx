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
import { SupplierSelector } from "@/components/supplier-selector"

export default function SupplierProductPage() {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

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
    if (user && supplier && supplier.id) {
      await fetchProductData(supplier.id, user.companyid)
    }
  }

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
    console.log("Downloading list")
    // 실제 다운로드 로직 구현
  }

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDetailDialogOpen(true);
  };

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
    },
    { 
      accessorKey: "variationsku", 
      header: "SKU",
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
      accessorKey: "thumbnailurl",
      header: "이미지",
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
      cell: ({ row }: { row: any }) => (
        <div 
          className="cursor-pointer hover:text-blue-500"
          onClick={() => handleProductClick(row.original.id)}
          style={{ wordBreak: 'break-word', maxWidth: '400px' }}
        >
          {row.original.name}
        </div>
      )
    },
    {
      accessorKey: "consumerprice",
      header: "공급가 (원)",
      cell: ({ row }: { row: any }) => {
        const price = row.original.consumerprice;
        return price ? price.toLocaleString() : '0';
      },
    },
    { 
      accessorKey: "stocks.nowstock",
      header: "재고(개)",
      cell: ({ row }: { row: any }) => {
        const stock = row.original.stocks?.nowstock;
        return stock ? stock.toLocaleString() : '0';
      },
    },
    { 
      accessorKey: "createdat", 
      header: "등록일",
      cell: ({ row }: { row: any }) => {
        const date = row.original.createdat;
        return date ? new Date(date).toLocaleDateString() : '-';
      }
    },
  ]

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <SupplierSelector 
          onSupplierSelect={handleSupplierSelect}
          onDownloadList={handleDownloadList}
          onProductRegistration={handleProductRegistration}
        />

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {selectedSupplier ? `${selectedSupplier.supplyname} 공용상품` : '공용상품'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={productColumns}
              data={filteredProducts}
              showActionButtons={true}
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
  showActionButtons: boolean
}

function DataTable<TData, TValue>({
  columns,
  data,
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
  })

  const { selectedSupplier } = useSupplierStore()

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4 py-2">
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
