'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type CompanyInfo = {
  Id: string;
  Name: string;
  BizNum: string;
  OwnerName: string;
  Tel: string;
  Email: string;
  ManagerName: string;
  CreatedAt: string;
}

export function CompanyInfoContent() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<CompanyInfo[]>([])
  const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/company')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "오류",
        description: "회사 목록을 불러오는데 실패했습니다."
      })
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleEdit = (company: CompanyInfo) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/company/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete company')
      
      setCompanies(companies.filter(company => company.Id !== id))
      toast({
        description: "성공적으로 삭제되었습니다."
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "오류",
        description: "삭제하는데 실패했습니다."
      })
    }
  }

  const handleSave = async (formData: CompanyInfo) => {
    setIsLoading(true)
    try {
      if (selectedCompany) {
        const response = await fetch(`/api/company/${selectedCompany.Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error('Failed to update company')
        
        setCompanies(companies.map(company => 
          company.Id === selectedCompany.Id ? { ...formData, Id: selectedCompany.Id } : company
        ))
        toast({
          description: "성공적으로 수정되었습니다."
        })
      } else {
        const response = await fetch('/api/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error('Failed to create company')
        const data = await response.json()
        
        setCompanies([...companies, { ...formData, Id: data.id }])
        toast({
          description: "성공적으로 추가되었습니다."
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "오류",
        description: "저장하는데 실패했습니다."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">회원정보 목록</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCompany(null)}>
              새 회원 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCompany ? '회원정보 수정' : '새 회원 추가'}
              </DialogTitle>
            </DialogHeader>
            <CompanyForm company={selectedCompany} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>회사명</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>대표자명</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>담당자명</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.Id}>
                <TableCell className="font-medium">{company.Name}</TableCell>
                <TableCell>{company.BizNum}</TableCell>
                <TableCell>{company.OwnerName}</TableCell>
                <TableCell>{company.Tel}</TableCell>
                <TableCell>{company.Email}</TableCell>
                <TableCell>{company.ManagerName}</TableCell>
                <TableCell>{company.CreatedAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(company)}
                    >
                      수정
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(company.Id)}
                    >
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function CompanyForm({ company, onSave }: { company: CompanyInfo | null, onSave: (company: CompanyInfo) => void }) {
  const [formData, setFormData] = useState<CompanyInfo>(
    company || {
      Id: '',
      Name: '',
      BizNum: '',
      OwnerName: '',
      Tel: '',
      Email: '',
      ManagerName: '',
      CreatedAt: new Date().toISOString().split('T')[0]
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="Name">회사명</Label>
          <Input 
            id="Name" 
            name="Name" 
            value={formData.Name} 
            onChange={handleChange}
            placeholder="회사명을 입력하세요"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="BizNum">사업자번호</Label>
          <Input 
            id="BizNum" 
            name="BizNum" 
            value={formData.BizNum} 
            onChange={handleChange}
            placeholder="000-00-00000"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="OwnerName">대표자명</Label>
          <Input 
            id="OwnerName" 
            name="OwnerName" 
            value={formData.OwnerName} 
            onChange={handleChange}
            placeholder="대표자명을 입력하세요"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Tel">전화번호</Label>
          <Input 
            id="Tel" 
            name="Tel" 
            value={formData.Tel} 
            onChange={handleChange}
            placeholder="00-0000-0000"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Email">이메일</Label>
          <Input 
            id="Email" 
            name="Email" 
            type="email" 
            value={formData.Email} 
            onChange={handleChange}
            placeholder="example@company.com"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ManagerName">담당자명</Label>
          <Input 
            id="ManagerName" 
            name="ManagerName" 
            value={formData.ManagerName} 
            onChange={handleChange}
            placeholder="담당자명을 입력하세요"
            required 
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        저장
      </Button>
    </form>
  )
}