'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CompanySupply } from '@/types'
import { z } from 'zod'

interface SupplyFormProps {
  companyId: string
  initialData: CompanySupply | null
  onSuccess: () => void
}

// 한글을 영문으로 변환하는 함수
const convertToEng = (str: string) => {
  const KOREAN_TO_ENG: { [key: string]: string } = {
    'ㄱ': 'g', 'ㄲ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'd',
    'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'b', 'ㅅ': 's',
    'ㅆ': 's', 'ㅇ': 'e', 'ㅈ': 'j', 'ㅉ': 'j', 'ㅊ': 'c',
    'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
    '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma',
    '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'ca',
    '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha'
  };

  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (/[a-zA-Z]/.test(char)) {
      // 영문인 경우 소문자로 변환
      result += char.toLowerCase();
    } else if (KOREAN_TO_ENG[char]) {
      // 한글인 경우 매핑된 영문으로 변환
      result += KOREAN_TO_ENG[char];
    }
  }
  return result;
}

// 밴더코드 생성 함수
const generateVendorCode = (name: string) => {
  const eng = convertToEng(name);
  // 첫 5글자만 사용하고, 부족한 경우 'x'로 채움
  return (eng + 'xxxxx').slice(0, 5);
}

const formSchema = z.object({
  vendproductcd: z.string().nullable().optional(),
})

export function SupplyForm({ companyId, initialData, onSuccess }: SupplyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // 초기 빈 데이터 객체 생성
  const emptyFormData = {
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
    notes: '',
    vendproductcd: ''
  }
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CompanySupply>({
    defaultValues: initialData || emptyFormData
  })

  // 공급업체명이 변경될 때마다 밴더코드 자동 생성
  const supplyName = watch('supplyname')
  useEffect(() => {
    // 초기 데이터가 없, 새로운 등록일 때만 자동 생성
    if (supplyName && !initialData) {
      const vendorCode = generateVendorCode(supplyName)
      setValue('vendproductcd', vendorCode)
    }
  }, [supplyName, setValue, initialData])

  // 폼 제출 후 성공 시 초기화
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
            onChange={(e) => {
              register('supplyname').onChange(e);  // 기존 register의 onChange 유지
              // 새로운 등록일 때만 밴더코드 자동 생성
              if (!initialData) {
                const vendorCode = generateVendorCode(e.target.value);
                setValue('vendproductcd', vendorCode);
              }
            }}
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

      {/* 밴더코드 */}
      <div className="space-y-2">
        <Label htmlFor="vendproductcd">밴더코드</Label>
        <Input
          id="vendproductcd"
          {...register('vendproductcd')}
          maxLength={5}
          placeholder={initialData ? '' : '공급업체명 입력시 자동생성됩니다'}
          disabled={true}
        />
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