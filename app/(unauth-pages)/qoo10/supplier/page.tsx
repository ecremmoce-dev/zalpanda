"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

interface Supplier {
  id: string
  supplyname: string
  managername: string
  created: string
  companyid: string
  vendproductcd: string
  contact?: string
  address?: string
  businessnumber?: string
  email?: string
  fax?: string
  website?: string
  managertel?: string
  manageremail?: string
  bankaccount?: string
  bankname?: string
  paymentterms?: string
  currency?: string
  notes?: string
}

// 업체명을 이니셜로 변환하는 함수 추가
const generateVendProductCode = (companyName: string): string => {
  // 한글 초성 추출 함수
  const getInitialSound = (char: string): string => {
    const initial = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const unicode = char.charCodeAt(0) - 0xAC00;
    if (unicode < 0) {
      // 한글이 아닌 경우 원문자 반환
      return char.toUpperCase();
    }
    const initialIndex = Math.floor(unicode / 28 / 21);
    return initial[initialIndex];
  };

  // 한글 초성을 영문자로 변환
  const initialToEng: { [key: string]: string } = {
    'ㄱ': 'G', 'ㄲ': 'G', 'ㄴ': 'N', 'ㄷ': 'D', 'ㄸ': 'D',
    'ㄹ': 'R', 'ㅁ': 'M', 'ㅂ': 'B', 'ㅃ': 'B', 'ㅅ': 'S',
    'ㅆ': 'S', 'ㅇ': 'O', 'ㅈ': 'J', 'ㅉ': 'J', 'ㅊ': 'C',
    'ㅋ': 'K', 'ㅌ': 'T', 'ㅍ': 'P', 'ㅎ': 'H'
  };

  // 공백으로 단어 분리
  const words = companyName.trim().split(/\s+/);
  let code = '';

  // 각 단어의 첫 글자 처리
  for (let word of words) {
    if (word.length > 0) {
      const initial = getInitialSound(word[0]);
      code += initialToEng[initial] || word[0].toUpperCase();
    }
  }

  // 5자리로 맞추기
  while (code.length < 5) {
    // 부족한 길이만큼 마지막 문자 반복
    code += code[code.length - 1] || 'X';
  }

  // 5자리로 자르기
  return code.slice(0, 5);
};

export default function SupplierManagement() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    supplyname: '',
    managername: '',
    vendproductcd: '',
    contact: '',
    address: '',
    businessnumber: '',
    email: '',
    fax: '',
    website: '',
    managertel: '',
    manageremail: '',
    bankaccount: '',
    bankname: '',
    paymentterms: '',
    currency: 'KRW',
    notes: ''
  })
  const { user } = useUserDataStore()

  useEffect(() => {
    if (user) {
      fetchSuppliers()
    }
  }, [user])

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('company_supply')
        .select('*')
        .eq('companyid', user?.companyid)

      if (error) throw error
      setSuppliers(data || [])
    } catch (error) {
      console.error('공급사 목록을 불러오는데 실패했습니다:', error)
      alert('공급사 목록을 불러오는데 실패했습니다.')
    }
  }

  const handleAddSupplier = async () => {
    try {
      if (!newSupplier.supplyname || !newSupplier.managername) {
        alert('필수 필드를 입력해주세요.')
        return
      }

      // 공급사코드가 없는 경��� 자동 생성
      const vendproductcd = newSupplier.vendproductcd || generateVendProductCode(newSupplier.supplyname);

      const supplierData = {
        supplyname: newSupplier.supplyname,
        managername: newSupplier.managername,
        vendproductcd,
        contact: newSupplier.contact,
        address: newSupplier.address,
        businessnumber: newSupplier.businessnumber,
        email: newSupplier.email,
        fax: newSupplier.fax,
        website: newSupplier.website,
        managertel: newSupplier.managertel,
        manageremail: newSupplier.manageremail,
        bankaccount: newSupplier.bankaccount,
        bankname: newSupplier.bankname,
        paymentterms: newSupplier.paymentterms,
        currency: newSupplier.currency,
        notes: newSupplier.notes,
        companyid: user?.companyid,
      }

      if (newSupplier.id) {
        // 수정
        const { error } = await supabase
          .from('company_supply')
          .update({
            ...supplierData,
            updated: new Date().toISOString()
          })
          .eq('id', newSupplier.id)

        if (error) throw error
      } else {
        // 추가
        const { error } = await supabase
          .from('company_supply')
          .insert([{
            ...supplierData,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
          }])

        if (error) throw error
      }

      setIsAddDialogOpen(false)
      setNewSupplier({
        supplyname: '',
        managername: '',
        vendproductcd: '',
        contact: '',
        address: '',
        businessnumber: '',
        email: '',
        fax: '',
        website: '',
        managertel: '',
        manageremail: '',
        bankaccount: '',
        bankname: '',
        paymentterms: '',
        currency: 'KRW',
        notes: ''
      })
      await fetchSuppliers()
      
    } catch (error) {
      console.error('공급사 처리에 실패했습니다:', error)
      alert('공급사 처리에 실패했습니다.')
    }
  }

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('company_supply')
        .delete()
        .eq('id', supplierId)

      if (error) throw error
      await fetchSuppliers()
      
    } catch (error) {
      console.error('공급사 삭제에 실패했습니다:', error)
      alert('공급사 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          이전으로
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>공급사 관리</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            공급사 추가
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{supplier.supplyname}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>담당자: {supplier.managername}</p>
                    <p>공급사코드: {supplier.vendproductcd || '-'}</p>
                    <p>등록일: {new Date(supplier.created).toLocaleDateString()}</p>
                    {supplier.businessnumber && <p>사업자번호: {supplier.businessnumber}</p>}
                    {supplier.contact && <p>연락처: {supplier.contact}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewSupplier(supplier)
                      setIsAddDialogOpen(true)
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>공급사 {newSupplier.id ? '수정' : '추가'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">회사명 *</label>
              <Input
                className="col-span-3"
                value={newSupplier.supplyname}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewSupplier(prev => ({
                    ...prev,
                    supplyname: value,
                    // 공급사코드가 비어있을 때만 자동 생성
                    vendproductcd: prev.vendproductcd || generateVendProductCode(value)
                  }))
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">공급사코드</label>
              <div className="col-span-3 flex gap-2">
                <Input
                  value={newSupplier.vendproductcd}
                  onChange={(e) => setNewSupplier(prev => ({
                    ...prev,
                    vendproductcd: e.target.value.toUpperCase()
                  }))}
                  maxLength={5}
                  placeholder="5자리 영문"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewSupplier(prev => ({
                    ...prev,
                    vendproductcd: generateVendProductCode(prev.supplyname)
                  }))}
                >
                  자동생성
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">담당자명 *</label>
              <Input
                className="col-span-3"
                value={newSupplier.managername}
                onChange={(e) => setNewSupplier(prev => ({
                  ...prev,
                  managername: e.target.value
                }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">사업자번호</label>
              <Input
                className="col-span-3"
                value={newSupplier.businessnumber}
                onChange={(e) => setNewSupplier(prev => ({
                  ...prev,
                  businessnumber: e.target.value
                }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">연락처</label>
              <Input
                className="col-span-3"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier(prev => ({
                  ...prev,
                  contact: e.target.value
                }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setNewSupplier({
                supplyname: '',
                managername: '',
                vendproductcd: '',
                contact: '',
                address: '',
                businessnumber: '',
                email: '',
                fax: '',
                website: '',
                managertel: '',
                manageremail: '',
                bankaccount: '',
                bankname: '',
                paymentterms: '',
                currency: 'KRW',
                notes: ''
              })
            }}>
              취소
            </Button>
            <Button onClick={handleAddSupplier}>
              {newSupplier.id ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 