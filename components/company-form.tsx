'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Company } from '@/types'

interface CompanyFormProps {
  initialData: Company | null;
  parentCompanyId?: string | null;
  onSuccess: () => void;
}

export function CompanyForm({ initialData, parentCompanyId, onSuccess }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<Company>({
    defaultValues: initialData || {
      Id: '',
      Name: '',
      BizNum: '',
      BizType: '',
      BizClass: '',
      OwnerName: '',
      Tel: '',
      Email: '',
      ManagerName: '',
      ManagerTel: '',
      ManagerPosition: '',
      ManagerEmail: '',
      ParentCompanyId: parentCompanyId || null,
    }
  });

  const onSubmit = async (data: Company) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/company', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          ParentCompanyId: parentCompanyId || data.ParentCompanyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save company');
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save company:', error);
      alert('업체 정보 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="Name">회사명</Label>
        <Input
          id="Name"
          {...register('Name', { required: true })}
          disabled={isLoading}
        />
        {errors.Name && (
          <span className="text-sm text-red-500">회사명은 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizNum">사업자번호</Label>
        <Input
          id="BizNum"
          {...register('BizNum', { required: true })}
          disabled={isLoading}
        />
        {errors.BizNum && (
          <span className="text-sm text-red-500">사업자번호는 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizType">업태</Label>
        <Input
          id="BizType"
          {...register('BizType')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="BizClass">업종</Label>
        <Input
          id="BizClass"
          {...register('BizClass')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="OwnerName">대표자명</Label>
        <Input
          id="OwnerName"
          {...register('OwnerName', { required: true })}
          disabled={isLoading}
        />
        {errors.OwnerName && (
          <span className="text-sm text-red-500">대표자명은 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="Tel">연락처</Label>
        <Input
          id="Tel"
          {...register('Tel')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="Email">이메일</Label>
        <Input
          id="Email"
          type="email"
          {...register('Email')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ManagerName">담당자명</Label>
        <Input
          id="ManagerName"
          {...register('ManagerName')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ManagerTel">담당자 연락처</Label>
        <Input
          id="ManagerTel"
          {...register('ManagerTel')}
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
  );
} 