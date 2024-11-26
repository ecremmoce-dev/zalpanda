'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CompanySupply } from '@/types'

interface SupplyFormProps {
  companyId: string
  initialData: CompanySupply | null
  onSuccess: () => void
}

export function SupplyForm({ companyId, initialData, onSuccess }: SupplyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<CompanySupply>({
    defaultValues: initialData || {
      companyid: companyId,
      supplyname: '',
      contact: '',
      address: '',
      businessnumber: '',
      email: '',
      fax: '',
      website: '',
      managername: '',
      managertel: '',
      manageremail: '',
      bankaccount: '',
      bankname: '',
      paymentterms: '',
      currency: 'KRW',
      notes: ''
    }
  })

  const onSubmit = async (data: Partial<CompanySupply>) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(
        initialData 
          ? `/api/company/${companyId}/supply/${initialData.id}`
          : `/api/company/${companyId}/supply`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            companyid: companyId
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error details:', errorData)
        throw new Error(errorData.error || 'Failed to save supply')
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save supply:', error)
      alert(`공급업체 정보 저장에 실패했습니다: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supplyname">공급업체명</Label>
          <Input
            id="supplyname"
            {...register('supplyname', { required: true })}
            disabled={isLoading}
          />
          {errors.supplyname && (
            <span className="text-sm text-red-500">공급업체명은 필수입니다.</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessnumber">사업자번호</Label>
          <Input
            id="businessnumber"
            {...register('businessnumber')}
            disabled={isLoading}
          />
        </div>
       
      </div>

      {/* 연락처 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">연락처</Label>
          <Input
            id="contact"
            {...register('contact')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fax">팩스</Label>
          <Input
            id="fax"
            {...register('fax')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 웹사이트와 이메일 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">웹사이트</Label>
          <Input
            id="website"
            {...register('website')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 주소 (한 줄 전체 사용) */}
      <div className="space-y-2">
        <Label htmlFor="address">주소</Label>
        <Input
          id="address"
          {...register('address')}
          disabled={isLoading}
        />
      </div>

      {/* 담당자 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="managername">담당자명</Label>
          <Input
            id="managername"
            {...register('managername')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="managertel">담당자 연락처</Label>
          <Input
            id="managertel"
            {...register('managertel')}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manageremail">담당자 이메일</Label>
          <Input
            id="manageremail"
            type="email"
            {...register('manageremail')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 은행 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankname">은행명</Label>
          <Input
            id="bankname"
            {...register('bankname')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankaccount">계좌번호</Label>
          <Input
            id="bankaccount"
            {...register('bankaccount')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentterms">결제조건</Label>
          <Input
            id="paymentterms"
            {...register('paymentterms')}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">통화</Label>
          <Input
            id="currency"
            {...register('currency')}
            defaultValue="KRW"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 비고 (한 줄 전체 사용) */}
      <div className="space-y-2">
        <Label htmlFor="notes">비고</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          disabled={isLoading}
        />
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