"use client"

import React, { useState } from 'react'
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from "next/navigation"

// Mock data for suppliers
const supplierData = [
  { id: 1, name: 'ecremmoce', company: 'ecremmoce', manager: '이코머스', registrationDate: '2023-07-20 14:10:32' },
  { id: 2, name: '울티모', company: 'ultimo', manager: '전강생품', registrationDate: '2023-08-05 09:23:42' },
  { id: 3, name: '줄리엣컴퍼니', company: 'jully and color', manager: '채선', registrationDate: '2023-08-05 09:29:58' },
  { id: 4, name: '바네코코', company: 'baniaco', manager: 'baniaco', registrationDate: '2023-08-10 11:35:01' },
  { id: 5, name: 'ROCKCAKE', company: 'ROCKCAKE', manager: '특카이크', registrationDate: '2023-08-10 13:57:57' },
]

// Mock data for products
const productData = [
  { id: 1, sku: '5550330059', name: '이니수 꼴래겐시기 2개묶X맨즈X(푸른)/짙날 부유 실물형 컨체커기 둡생축제 푸시', price: 13440, supplier: '울티모', stock: 52, registrationDate: '2023-12-12 13:59:36' },
  { id: 2, sku: '6877363442', name: '이니수 비나 여성 향낭더뉴 TOP X 스페스 치지꽉 락선생 피마닌 타타', price: 26250, supplier: '울티모', stock: 23, registrationDate: '2023-12-12 13:59:36' },
  { id: 3, sku: '7085472469', name: '이니수 워프 만사서딩 150ml X 2백스 치지꽉 수용성 물려진', price: 56400, supplier: '울티모', stock: 33, registrationDate: '2023-12-12 13:59:36' },
  { id: 4, sku: '7222595476', name: '이니수 스털 제털 바스트 430조코조롭 마실향물결 안계좀기제모 V존저석 역소윰', price: 71000, supplier: '울티모', stock: 21, registrationDate: '2023-12-12 13:59:36' },
  { id: 5, sku: '7672734032', name: '폴리고제폐워 퓨전한 백수으롭 70ml/530달 국내산 100%', price: 28800, supplier: '울티모', stock: 32, registrationDate: '2023-12-12 13:59:36' },
]

export default function SupplierProductPage() {
  const router = useRouter()
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState(productData)
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)

  const handleSupplierSelect = (supplierName: string) => {
    setSelectedSupplier(supplierName)
    setFilteredProducts(productData.filter(product => product.supplier === supplierName))
    setIsSupplierTableExpanded(false)
  }

  const handleEdit = (id: string) => {
    router.push(`/product/public/${id}`)
  }

  // Supplier columns
  const supplierColumns: ColumnDef<typeof supplierData[0]>[] = [
    { accessorKey: "id", header: "번호" },
    { accessorKey: "name", header: "코드" },
    { accessorKey: "company", header: "회사명" },
    { accessorKey: "manager", header: "담당일" },
    { accessorKey: "registrationDate", header: "등록일" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          onClick={() => handleSupplierSelect(row.original.name)}
          variant="outline"
          size="sm"
        >
          선택
        </Button>
      ),
    },
  ]

  // Product columns
  const productColumns: ColumnDef<typeof productData[0]>[] = [
    { accessorKey: "id", header: "번호" },
    { accessorKey: "sku", header: "SKU" },
    {
      accessorKey: "image",
      header: "이미지",
      cell: () => <div className="w-10 h-10 bg-gray-200 rounded"></div>,
    },
    { accessorKey: "name", header: "상품명" },
    {
      accessorKey: "price",
      header: "공급가 (원)",
      cell: ({ row }) => row.original.price.toLocaleString(),
    },
    { accessorKey: "supplier", header: "공급사" },
    { accessorKey: "stock", header: "재고 (개)" },
    { accessorKey: "registrationDate", header: "등록일" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(row.original.id.toString())}
        >
          Edit
        </Button>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">공급사</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSupplierTableExpanded(!isSupplierTableExpanded)}
        >
          {isSupplierTableExpanded ? <ChevronDown /> : <ChevronRight />}
        </Button>
      </div>
      {isSupplierTableExpanded && (
        <DataTable columns={supplierColumns} data={supplierData} />
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">
        {selectedSupplier ? `${selectedSupplier} 공용상품` : '공용상품'}
      </h2>
      <DataTable columns={productColumns} data={filteredProducts} />
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns,
  data,
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

