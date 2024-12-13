"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useSupplierStore } from "@/store/modules/supplierStore"
import { useRouter } from 'next/navigation'

interface SupplierSectionProps {
  supplierData: any[]
  supplierSearchTerm: string
  setSupplierSearchTerm: (term: string) => void
  handleSupplierSearch: () => void
  isSupplierTableExpanded: boolean
  setIsSupplierTableExpanded: (expanded: boolean) => void
  handleSupplierSelect: (supplier: any) => void
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchTerm,
  onSearchTermChange,
  onSearch,
  showActionButtons,
  selectedSupplier,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  onSearch?: () => void
  showActionButtons?: boolean
  selectedSupplier?: any
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      {showActionButtons && (
        <div className="flex items-center py-4">
          <Input
            placeholder="회사명 또는 담당자명을 입력하세요"
            value={searchTerm}
            onChange={(event) => onSearchTermChange?.(event.target.value)}
            className="max-w-sm"
          />
          <Button onClick={onSearch} className="ml-2">
            검색
          </Button>
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
                  className={selectedSupplier?.id === (row.original as any)?.id ? "bg-blue-100" : ""}
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
    </div>
  )
}

export default function SupplierSection({
  supplierData,
  supplierSearchTerm,
  setSupplierSearchTerm,
  handleSupplierSearch,
  isSupplierTableExpanded,
  setIsSupplierTableExpanded,
  handleSupplierSelect
}: SupplierSectionProps) {
  const { selectedSupplier } = useSupplierStore()
  const router = useRouter()

  const supplierColumns: ColumnDef<any>[] = [
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

  const handleSupplierManagement = () => {
    router.push('/qoo10/supplier')
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-2xl font-bold">공급사</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSupplierManagement}
          >
            공급사 관리
          </Button>
        </div>
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
            showActionButtons={true}
            selectedSupplier={selectedSupplier}
          />
        )}
      </CardContent>
    </Card>
  )
} 