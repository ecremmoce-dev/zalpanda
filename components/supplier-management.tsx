'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { CompanySupply } from "@/types"

interface SupplierManagementProps {
  supplierData: CompanySupply[]
  selectedSupplier: CompanySupply | null
  onSupplierSelect: (supplier: CompanySupply) => void
  onSupplierManagement: () => void
}

export function SupplierManagement({
  supplierData,
  selectedSupplier,
  onSupplierSelect,
  onSupplierManagement
}: SupplierManagementProps) {
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('')

  const supplierColumns = [
    {
      accessorKey: "supplyname",
      header: "공급사명",
    },
    {
      accessorKey: "vendproductcd",
      header: "밴더코드",
    },
    {
      accessorKey: "contact",
      header: "연락처",
    },
    {
      accessorKey: "email",
      header: "이메일",
    },
    {
      accessorKey: "managername",
      header: "담당자",
    },
    {
      accessorKey: "created",
      header: "등록일",
      cell: ({ row }: { row: any }) => {
        return new Date(row.original.created).toLocaleDateString()
      }
    }
  ]

  const handleSupplierSearch = (term: string) => {
    setSupplierSearchTerm(term)
    // 검색 로직 구현
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-2xl font-bold">공급사</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onSupplierManagement}
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
            onRowClick={(row) => onSupplierSelect(row.original)}
            selectedRow={selectedSupplier}
          />
        )}
      </CardContent>
    </Card>
  )
} 