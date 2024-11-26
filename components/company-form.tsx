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
      parentcompanyid: parentCompanyId || null,
      name: '',
      biznum: '',
      biztype: '',
      bizclass: '',
      ownername: '',
      tel: '',
      email: '',
      managername: '',
      managertel: '',
      managerposition: '',
      manageremail: '',
    }
  });

  const onSubmit = async (data: Partial<Company>) => {
    try {
      setIsLoading(true);
      
      const { id, created, updated, deleted, ...submitData } = data;
      
      const response = await fetch(initialData ? `/api/company/${initialData.id}` : '/api/company', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          parentcompanyid: parentCompanyId || submitData.parentcompanyid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save company');
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
        <Label htmlFor="name">회사명</Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          disabled={isLoading}
        />
        {errors.name && (
          <span className="text-sm text-red-500">회사명은 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="biznum">사업자번호</Label>
        <Input
          id="biznum"
          {...register('biznum', { required: true })}
          disabled={isLoading}
        />
        {errors.biznum && (
          <span className="text-sm text-red-500">사업자번호는 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="biztype">업태</Label>
        <Input
          id="biztype"
          {...register('biztype')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bizclass">업종</Label>
        <Input
          id="bizclass"
          {...register('bizclass')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownername">대표자명</Label>
        <Input
          id="ownername"
          {...register('ownername', { required: true })}
          disabled={isLoading}
        />
        {errors.ownername && (
          <span className="text-sm text-red-500">대표자명은 필수입니다.</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tel">연락처</Label>
        <Input
          id="tel"
          {...register('tel')}
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