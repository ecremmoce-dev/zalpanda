'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Company } from '@/types'

interface CompanyFormProps {
  initialData?: Company | null
  onSuccess: () => void
}

export function CompanyForm({ initialData, onSuccess }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    Name: initialData?.Name || '',
    NameEn: initialData?.NameEn || '',
    BizNum: initialData?.BizNum || '',
    BizType: initialData?.BizType || '',
    BizClass: initialData?.BizClass || '',
    OwnerName: initialData?.OwnerName || '',
    Tel: initialData?.Tel || '',
    Email: initialData?.Email || '',
    ManagerName: initialData?.ManagerName || ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const url = initialData 
        ? `/api/company/${initialData.Id}`
        : '/api/company'
      
      const method = initialData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save company')
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to submit company:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="Name">회사명</Label>
        <Input
          id="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="NameEn">회사명 (영문)</Label>
        <Input
          name="NameEn"
          value={formData.NameEn}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizNum">사업자번호</Label>
        <Input
          name="BizNum"
          value={formData.BizNum}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizType">업태</Label>
        <Input
          name="BizType"
          value={formData.BizType}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizClass">업종</Label>
        <Input
          name="BizClass"
          value={formData.BizClass}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="OwnerName">대표자명</Label>
        <Input
          name="OwnerName"
          value={formData.OwnerName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="Tel">연락처</Label>
        <Input
          name="Tel"
          value={formData.Tel}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="Email">이메일</Label>
        <Input
          name="Email"
          type="email"
          value={formData.Email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ManagerName">담당자명</Label>
        <Input
          name="ManagerName"
          value={formData.ManagerName}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        등록
      </Button>
    </form>
  )
} 