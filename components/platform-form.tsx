'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from "@/components/ui/switch"

interface Platform {
  Id: string
  Platform: string
  SellerId: string
  Password?: string
  ApiKey?: string
  SecretKey?: string
  Memo?: string
  IsActive: boolean
}

interface PlatformFormProps {
  companyId: string
  initialData?: Platform | null
  onSuccess: () => void
}

export function PlatformForm({ companyId, initialData, onSuccess }: PlatformFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    Platform: initialData?.Platform || '',
    SellerId: initialData?.SellerId || '',
    Password: initialData?.Password || '',
    ApiKey: initialData?.ApiKey || '',
    SecretKey: initialData?.SecretKey || '',
    AccessToken: initialData?.AccessToken || '',
    RefreshToken: initialData?.RefreshToken || '',
    TokenExpiryDate: initialData?.TokenExpiryDate || '',
    IsActive: initialData?.IsActive ?? true,
    Memo: initialData?.Memo || ''
  })

  // 초기 데이터가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        Platform: initialData.Platform,
        SellerId: initialData.SellerId,
        Password: initialData.Password || '',
        ApiKey: initialData.ApiKey || '',
        SecretKey: initialData.SecretKey || '',
        AccessToken: initialData.AccessToken || '',
        RefreshToken: initialData.RefreshToken || '',
        TokenExpiryDate: initialData.TokenExpiryDate || '',
        IsActive: initialData.IsActive,
        Memo: initialData.Memo || ''
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = initialData 
        ? `/api/company/${companyId}/platform/${initialData.Id}`
        : `/api/company/${companyId}/platform`
      
      const method = initialData ? 'PUT' : 'POST'

      // 서버로 전송할 때는 소문자 필드명으로 변환하고 빈 값 처리
      const requestBody = {
        platform: formData.Platform,
        sellerid: formData.SellerId,
        password: formData.Password || null,
        apikey: formData.ApiKey || null,
        secretkey: formData.SecretKey || null,
        accesstoken: formData.AccessToken || null,
        refreshtoken: formData.RefreshToken || null,
        tokenexpirydate: formData.TokenExpiryDate || null,
        isactive: formData.IsActive,
        memo: formData.Memo || null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save platform')
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to submit platform:', error)
      alert('플랫폼 정보 저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="platform">플랫폼 *</Label>
        <Select
          defaultValue={formData.Platform}
          value={formData.Platform}
          onValueChange={(value) => setFormData({ ...formData, Platform: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="플랫폼 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="QOO10">Qoo10</SelectItem>
            <SelectItem value="SHOPIFY">Shopify</SelectItem>
            <SelectItem value="RAKUTEN">Rakuten</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sellerId">판매자 ID *</Label>
        <Input
          value={formData.SellerId}
          onChange={(e) => setFormData({ ...formData, SellerId: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          value={formData.Password}
          onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          value={formData.ApiKey}
          onChange={(e) => setFormData({ ...formData, ApiKey: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secretKey">Secret Key</Label>
        <Input
          value={formData.SecretKey}
          onChange={(e) => setFormData({ ...formData, SecretKey: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memo">메모</Label>
        <Input
          value={formData.Memo}
          onChange={(e) => setFormData({ ...formData, Memo: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.IsActive}
          onCheckedChange={(checked) => setFormData({ ...formData, IsActive: checked })}
        />
        <Label>사용 여부</Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? '저장 중...' : (initialData ? '수정' : '등록')}
      </Button>
    </form>
  )
} 