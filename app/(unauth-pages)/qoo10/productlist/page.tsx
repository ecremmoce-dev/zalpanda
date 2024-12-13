'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { SupplierManagement } from "@/components/supplier-management"
import { CompanySupply } from "@/types"

export default function ProductListPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<CompanySupply | null>(null)
  const [supplierData, setSupplierData] = useState<CompanySupply[]>([])

  const handleSupplierManagement = () => {
    // 공급사 관리 페이지로 이동하거나 모달 열기
  }

  const handleSupplierSelect = (supplier: CompanySupply) => {
    setSelectedSupplier(supplier)
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          <Button className="lg:hidden" size="icon" variant="ghost">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
          <h1 className="font-semibold">QOO10 공급사 관리</h1>
        </header>
        <main className="flex flex-1 flex-col p-6">
          <SupplierManagement 
            supplierData={supplierData}
            selectedSupplier={selectedSupplier}
            onSupplierSelect={handleSupplierSelect}
            onSupplierManagement={handleSupplierManagement}
          />
        </main>
      </div>
    </div>
  )
} 