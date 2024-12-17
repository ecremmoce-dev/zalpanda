"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronRight, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
import { useSupplierStore } from "@/store/modules/supplierStore"
import { useRouter } from 'next/navigation'

interface SupplierSelectorProps {
  onSupplierSelect?: (supplier: any) => void;
  onDownloadList?: () => void;
  onProductRegistration?: (method: string) => void;
  className?: string;
  hideControls?: boolean;
}

export function SupplierSelector({ 
  onSupplierSelect, 
  onDownloadList,
  onProductRegistration,
  className,
  hideControls = false
}: SupplierSelectorProps) {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  
  const { user } = useUserDataStore()
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchSupplierData(user.companyid)
    }
  }, [user])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error
      
      const formattedData = data.map(supplier => ({
        ...supplier,
        created: new Date(supplier.created).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '-').replace('.', '')
      }))
      
      setSupplierData(formattedData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSupplierSearch = () => {
    if (!supplierSearchTerm.trim()) {
      if (user) fetchSupplierData(user.companyid)
      return
    }

    const filteredData = supplierData.filter(supplier =>
      supplier.supplyname.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
      supplier.managername.toLowerCase().includes(supplierSearchTerm.toLowerCase())
    )
    setSupplierData(filteredData)
  }

  const handleSupplierSelect = async (supplier: any) => {
    if (user && supplier && supplier.id) {
      const supplierInfo = {
        id: supplier.id,
        supplyname: supplier.supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid: supplier.companyid
      }
      
      setSelectedSupplier(supplierInfo)
      
      if (onSupplierSelect) {
        onSupplierSelect(supplier)
      }
    }
  }

  const handleProductRegistration = (method: string) => {
    if (onProductRegistration) {
      onProductRegistration(method)
    } else {
      router.push(`/product/public/new?type=${method}`)
    }
  }

  const handleDownloadList = () => {
    if (onDownloadList) {
      onDownloadList()
    } else {
      console.log("Downloading list")
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>공급사</CardTitle>
        <div className="flex items-center space-x-2">
          {selectedSupplier && (
            <span className="text-lg font-medium">{selectedSupplier.supplyname}</span>
          )}
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSupplierTableExpanded(!isSupplierTableExpanded)}
          >
            {isSupplierTableExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isSupplierTableExpanded && (
          <>
          <div className="flex items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2 w-[60%]">
              <Input
                placeholder="공급사명을 검색하세요"
                className="w-full"
                value={supplierSearchTerm}
                onChange={(e) => setSupplierSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSupplierSearch()
                  }
                }}
              />
              <Button size="sm" className="whitespace-nowrap" onClick={handleSupplierSearch}>
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
            {!hideControls && (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">상품 등록</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleProductRegistration("direct")}>
                      직접 입력
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleProductRegistration("url")}>
                      Url 입력
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleProductRegistration("upload")}>
                      파일 업로드
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={handleDownloadList}>
                  <Download className="mr-2 h-4 w-4" />
                  목록 다운로드
                </Button>
              </div>
            )}
          </div>
         
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">회사명</TableHead>
                  <TableHead className="w-[20%]">담당자</TableHead>
                  <TableHead className="w-[30%]">등록일</TableHead>
                  <TableHead className="w-[20%]">선택</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      표시할 공급사가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  supplierData.map((supplier) => (
                    <TableRow 
                      key={supplier.id}
                      className={selectedSupplier?.id === supplier.id ? "bg-muted" : ""}
                    >
                      <TableCell>{supplier.supplyname}</TableCell>
                      <TableCell>{supplier.managername}</TableCell>
                      <TableCell>{supplier.created}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSupplierSelect(supplier)}
                          variant={selectedSupplier?.id === supplier.id ? "default" : "outline"}
                        >
                          선택
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default SupplierSelector; 