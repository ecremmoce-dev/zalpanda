'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Edit, Trash } from 'lucide-react'

interface Supplier {
  id: string
  companyid: string
  supplyname: string
  contact: string
  email: string
  managername: string
  vendproductcd: string
  created: string
}

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [companies, setCompanies] = useState<any[]>([])

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchSuppliers(selectedCompany)
    }
  }, [selectedCompany])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/company')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  const fetchSuppliers = async (companyId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/company/${companyId}/supply`)
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setSuppliers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (supplier: Supplier) => {
    // 수정 기능 구현
    console.log('Edit supplier:', supplier)
  }

  const handleDelete = async (supplierId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/company/${selectedCompany}/supply/${supplierId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete supplier')
      
      // 삭제 후 목록 새로고침
      await fetchSuppliers(selectedCompany)
      alert('공급사가 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">공급사 목록</h2>
        <div className="flex gap-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="업체 선택" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>새 공급사 등록</Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>공급사명</TableHead>
              <TableHead>밴더코드</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.supplyname}</TableCell>
                <TableCell>{supplier.vendproductcd}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.managername}</TableCell>
                <TableCell>
                  {new Date(supplier.created).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(supplier)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
} 