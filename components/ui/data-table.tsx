'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'

interface DataTableProps {
  columns: any[]
  data: any[]
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onSearch: (term: string) => void
  showActionButtons?: boolean
  onRowClick?: (row: any) => void
  selectedRow?: any
}

export function DataTable({
  columns,
  data,
  searchTerm,
  onSearchTermChange,
  onSearch,
  showActionButtons = false,
  onRowClick,
  selectedRow
}: DataTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => {
            onSearchTermChange(e.target.value)
            onSearch(e.target.value)
          }}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
            {showActionButtons && <TableHead className="text-right">관리</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`cursor-pointer ${selectedRow?.id === row.id ? 'bg-gray-100' : ''}`}
            >
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                </TableCell>
              ))}
              {showActionButtons && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 