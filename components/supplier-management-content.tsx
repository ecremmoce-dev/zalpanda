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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  code: string
  contact: string
  address: string
  createdAt: string
  updatedAt: string
}

export function SupplierManagementContent() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact: '',
    address: ''
  })

  // 공급사 목록 조회
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // 공급사 추가/수정 핸들러
  const handleSubmit = async () => {
    try {
      const url = editingSupplier 
        ? `/api/suppliers/${editingSupplier.id}`
        : '/api/suppliers'
      
      const method = editingSupplier ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save supplier')

      setDialogOpen(false)
      fetchSuppliers()
      resetForm()
    } catch (error) {
      console.error('Failed to save supplier:', error)
      alert('공급사 저장에 실패했습니다.')
    }
  }

  // 공급사 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm('이 공급사를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete supplier')

      fetchSuppliers()
    } catch (error) {
      console.error('Failed to delete supplier:', error)
      alert('공급사 삭제에 실패했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      contact: '',
      address: ''
    })
    setEditingSupplier(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">공급사 관리</h2>
        <Button 
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          공급사 추가
        </Button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">공급사명</TableHead>
              <TableHead className="font-semibold">공급사코드</TableHead>
              <TableHead className="font-semibold">연락처</TableHead>
              <TableHead className="font-semibold">주소</TableHead>
              <TableHead className="font-semibold">등록일</TableHead>
              <TableHead className="font-semibold text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="animate-spin mb-2">⟳</div>
                    <div>데이터를 불러오는 중...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="mb-2">📦</div>
                    <div>등록된 공급사가 없습니다.</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-50">
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell className="font-mono">{supplier.code}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    {new Date(supplier.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSupplier(supplier)
                          setFormData({
                            name: supplier.name,
                            code: supplier.code,
                            contact: supplier.contact,
                            address: supplier.address
                          })
                          setDialogOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? '공급사 수정' : '공급사 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>공급사명</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="공급사명을 입력하세요"
              />
            </div>
            <div>
              <Label>공급사코드</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="공급사코드를 입력하세요"
              />
            </div>
            <div>
              <Label>연락처</Label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="연락처를 입력하세요"
              />
            </div>
            <div>
              <Label>주소</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="주소를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingSupplier ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 