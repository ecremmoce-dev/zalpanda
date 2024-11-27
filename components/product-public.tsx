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

export default function SupplierProductPage() {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")

  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      await fetchUserData(data.user)
    }
  }

  const fetchUserData = async (user: any) => {
    const companyAccount = await supabase.from('company_account')
      .select('*')
      .eq('supabaseuserid', user.id)
    
    if (!companyAccount.error) {
      const { data, error } = await supabase.from('account_company')
        .select('*')
        .eq('accountid', companyAccount.data[0].id)

        if (!error) {
          fetchSupplierData(data[0].companyid)
        }
    }
  }

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
    // const { data, error } = await supabase
    //   .from('item_customer_maps')
    //   .select(`
    //     *,
    //     items!itemid(variationsku)
    //   `)
    //   .eq('companyid', companyid)
    //   .eq('itemcustomerid', itemCustomerId)

    const { data, error } = await supabase
      .from('item_customer_maps')
      .select(`
        *,
        items!inner(*)
      `)
      .eq('companyid', companyid)
      .eq('itemcustomerid', itemCustomerId)

    // const { data, error } = await supabase
    //   .from('item_customer_maps')
    //   .select()
    //   .eq('companyid', companyid)
    //   .eq('itemcustomerid', itemCustomerId)
    //   .then(async ({ data, error }) => {
    //     if (error) return { data: null, error }
        
    //     // 조인을 위한 itemid 배열 생성
    //     const itemIds = data.map(item => item.itemid)
        
    //     // items 테이블에서 관련 데이터 조회
    //     const { data: itemsData, error: itemsError } = await supabase
    //       .from('items')
    //       .select('id, variationsku')
    //       .in('id', itemIds)
        
    //     if (itemsError) return { data: null, error: itemsError }
        
    //     // 데이터 병합
    //     const mergedData = data.map(map => ({
    //       ...map,
    //       variationsku: itemsData.find(item => item.id === map.itemid)?.variationsku
    //     }))
        
    //     return { data: mergedData, error: null }
    //   })

    if (!error) {
      console.log(data);
      setSelectedSupplier(supplierName)
      setFilteredProducts(data)
    }
  }

  const handleSupplierSelect = (row: any) => {
    const { name: supplierName, id: itemCustomerId, companyid } = row;
    
    fetchProductData(itemCustomerId, companyid, supplierName);
  }

  const handleSupplierSearch = () => {
    // Implement the search logic here
    console.log("Searching for:", supplierSearchTerm)
  }

  const handleProductRegistration = (method: string) => {
    // Implement the product registration logic here
    console.log("Registering product via:", method)
  }

  const handleDownloadList = () => {
    // Implement the download logic here
    console.log("Downloading list")
  }

  // Supplier columns
  const supplierColumns: ColumnDef<typeof supplierData[0]>[] = [
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

  // Product columns
  const productColumns = [
    //{ accessorKey: "id", header: "번호" },
    { accessorKey: "variationsku", header: "SKU" },
    // {
    //   accessorKey: "image",
    //   header: "이미지",
    //   cell: () => <div className="w-10 h-10 bg-gray-200 rounded"></div>,
    // },
    // { accessorKey: "name", header: "상품명" },
    // {
    //   accessorKey: "price",
    //   header: "공급가 (원)",
    //   cell: ({ row }: { row: any }) => row.original.price.toLocaleString(),
    // },
    // { accessorKey: "supplier", header: "공급사" },
    // { accessorKey: "stock", header: "재고 (개)" },
    // { accessorKey: "registrationDate", header: "등록일" },
    // {
    //   id: "actions",
    //   cell: () => (
    //     <Button variant="ghost" size="sm">
    //       Edit
    //     </Button>
    //   ),
    // },
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
            {selectedSupplier ? `${selectedSupplier} 공용상품` : '공용상품'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={productColumns}
            data={filteredProducts}
            showActionButtons={false}
          />
        </CardContent>
      </Card>
    </div>
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
  })

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Input
              placeholder="Filter..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange?.(event.target.value)}
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
                <DropdownMenuItem onSelect={() => onProductRegistration?.("직접 입력")}>
                  직접 입력
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onProductRegistration?.("Url 입력")}>
                  Url 입력
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onProductRegistration?.("파일 업로드")}>
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

