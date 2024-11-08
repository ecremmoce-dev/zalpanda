import { DetailProduct } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { useState } from 'react'
import { Edit } from 'lucide-react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Image } from 'lucide-react'
import { Globe } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, X, Upload } from 'lucide-react'

interface NormalProductEditorProps {
  product: DetailProduct
  onSave: (product: DetailProduct) => Promise<void>
  onCancel: () => void
  onApplyToQoo10: () => Promise<void>
}

export default function NormalProductEditor({ product, onSave, onCancel, onApplyToQoo10 }: NormalProductEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState(product)
  const [activeTab, setActiveTab] = useState("basic")

  const handleFieldChange = (field: keyof DetailProduct, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(editedProduct);
      setIsEditing(false);
      setEditedProduct(editedProduct);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장에 실패했습니다.');
    }
  }

  const handleApplyToQoo10 = async () => {
    if (!editedProduct) return

    const results = [] // API 호출 결과를 저장할 배열

    try {
      // 일반 상품인 경우
      console.log('[QOO10 적용] UpdateGoods API 호출 시작...')
      
      // 발송 가능일 처리
      let availableDateValue = '3'  // 기본값
      let desiredShippingDate = 3   // 기본값
      
      switch (editedProduct.AvailableDateType) {
        case '0': // 일반발송
          availableDateValue = '3'
          desiredShippingDate = 3
          break
        case '1': // 상품준비일
          availableDateValue = editedProduct.AvailableDateValue || '4'
          desiredShippingDate = parseInt(availableDateValue)
          break
        case '2': // 출시일
          availableDateValue = editedProduct.AvailableDateValue || ''
          desiredShippingDate = 0
          break
        case '3': // 당일발송
          availableDateValue = editedProduct.AvailableDateValue || '14:00'
          desiredShippingDate = 0
          break
        default:
          availableDateValue = '3'
          desiredShippingDate = 3
      }

      // 판매종료일 식 변환 (YYYY-MM-DD 형식으로)
      const expireDate = editedProduct.ExpireDate 
        ? new Date(editedProduct.ExpireDate).toISOString().split('T')[0]
        : '';

      const updateGoodsResponse = await fetch(`/api/qoo10/products/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ItemCode: editedProduct.ItemCode,
          SellerCode: editedProduct.SellerCode,
          SecondSubCat: editedProduct.SecondSubCatCd,
          ItemTitle: editedProduct.ItemTitle,
          PromotionName: editedProduct.PromotionName,
          IndustrialCodeType: editedProduct.IndustrialCodeType,
          IndustrialCode: editedProduct.IndustrialCode,
          BrandNo: editedProduct.BrandNo,
          ManufactureDate: editedProduct.ManufacturerDate,
          ModelNm: editedProduct.ModelNM,
          Material: editedProduct.Material,
          ProductionPlaceType: editedProduct.ProductionPlaceType,
          ProductionPlace: editedProduct.ProductionPlace,
          RetailPrice: editedProduct.RetailPrice,
          AdultYN: editedProduct.AdultYN,
          ContactInfo: editedProduct.ContactInfo,
          ShippingNo: editedProduct.ShippingNo,
          Weight: editedProduct.Weight,
          AvailableDateType: editedProduct.AvailableDateType,
          AvailableDateValue: availableDateValue,
          DesiredShippingDate: desiredShippingDate,
          Keyword: editedProduct.Keyword,
          SellerAuthKey: editedProduct.SellerAuthKey,
          ExpireDate: expireDate // 변환된 날짜 형식 사용
        })
      })

      const updateGoodsResult = await updateGoodsResponse.json()
      console.log('[QOO10 적용] UpdateGoods API 응답:', updateGoodsResult)
      
      results.push({
        api: 'UpdateGoods (상품 기본정보)',
        success: updateGoodsResult.ResultCode === 0,
        message: updateGoodsResult.ResultMsg,
        returnMessage: `상태코드: ${updateGoodsResult.ResultCode}, 메시지: ${updateGoodsResult.ResultMsg}`
      })

      // ... 나머지 API 호출 코드는 그대로 유지

      // 결과 메시지 생성
      const successResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      let resultMessage = '== QOO10 적용 결과 ==\n\n'

      if (successResults.length > 0) {
        resultMessage += '✅ 성공한 API:\n'
        successResults.forEach(r => {
          resultMessage += `- ${r.api}\n  ${r.returnMessage}\n`
        })
        resultMessage += '\n'
      }

      if (failedResults.length > 0) {
        resultMessage += '❌ 실패한 API:\n'
        failedResults.forEach(r => {
          resultMessage += `- ${r.api}\n  ${r.returnMessage}\n`
        })
      }

      if (failedResults.length === 0) {
        resultMessage += '\n✨ 모든 API 호출이 성공적으로 완료되었습니다.'
      }

      alert(resultMessage)

    } catch (error: any) {
      console.error('[QOO10 적용] 실패:', error)
      alert(`QOO10 적용 실패: ${error.message || '알 수 없는 오류가 발생했습니다.'}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">상품 상세 정보</h2>
        <div className="flex gap-4">
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                수정하기
              </Button>
              <Button 
                onClick={onApplyToQoo10}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Globe className="w-4 h-4" />
                QOO10 전송
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false)
                setEditedProduct(product)
              }}>
                취소
              </Button>
              <Button onClick={handleSave}>
                저장
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">상품 정보</TabsTrigger>
          <TabsTrigger value="options">옵션 정보</TabsTrigger>
          <TabsTrigger value="description">상세 설명</TabsTrigger>
        </TabsList>

        {activeTab === "basic" && (
          <div className="mt-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                <h3 className="text-lg font-semibold">기본 정보</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">상품코드</Label>
                    <Input 
                      value={editedProduct.ItemCode} 
                      readOnly 
                      className="bg-gray-50 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">셀러코드</Label>
                    <Input 
                      value={editedProduct.SellerCode} 
                      onChange={(e) => handleFieldChange('SellerCode', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">상품명</Label>
                  <Input 
                    value={editedProduct.ItemTitle} 
                    onChange={(e) => handleFieldChange('ItemTitle', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">홍보용 상품명</Label>
                  <Input 
                    value={editedProduct.PromotionName} 
                    onChange={(e) => handleFieldChange('PromotionName', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">판매가</Label>
                    <div className="relative">
                      <Input 
                        type="number"
                        value={editedProduct.ItemPrice} 
                        onChange={(e) => handleFieldChange('ItemPrice', e.target.value)}
                        readOnly={!isEditing}
                        className={`pr-12 ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        원
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">소비세율</Label>
                    <div className="relative">
                      <Input 
                        type="number"
                        value={editedProduct.TaxRate} 
                        onChange={(e) => handleFieldChange('TaxRate', e.target.value)}
                        readOnly={!isEditing}
                        className={`pr-8 ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">재고수량</Label>
                    <div className="relative">
                      <Input 
                        type="number"
                        value={editedProduct.ItemQty} 
                        onChange={(e) => handleFieldChange('ItemQty', e.target.value)}
                        readOnly={!isEditing}
                        className={`pr-8 ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        개
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">판매종료일</Label>
                    <Input 
                      type="date"
                      value={editedProduct.ExpireDate?.split('T')[0]} 
                      onChange={(e) => handleFieldChange('ExpireDate', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">판매상태</Label>
                  <Select
                    value={editedProduct.ItemStatus}
                    onValueChange={(value) => handleFieldChange('ItemStatus', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                      <SelectValue placeholder="판매상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">거래대기</SelectItem>
                      <SelectItem value="S2">거래가능</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-green-500 rounded"></div>
                <h3 className="text-lg font-semibold">카테고리 정보</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">메인카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.MainCatCd} className="w-1/3 bg-gray-50" readOnly />
                      <Input value={editedProduct.MainCatNm} className="w-2/3 bg-gray-50" readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">서브카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.FirstSubCatCd} className="w-1/3 bg-gray-50" readOnly />
                      <Input value={editedProduct.FirstSubCatNm} className="w-2/3 bg-gray-50" readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">세컨서브카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.SecondSubCatCd} className="w-1/3 bg-gray-50" readOnly />
                      <Input value={editedProduct.SecondSubCatNm} className="w-2/3 bg-gray-50" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-purple-500 rounded"></div>
                <h3 className="text-lg font-semibold">원산지/코드 정보</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">원산지 유형</Label>
                    <Select 
                      value={editedProduct.ProductionPlaceType}
                      onValueChange={(value) => handleFieldChange('ProductionPlaceType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                        <SelectValue placeholder="원산지 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">국내</SelectItem>
                        <SelectItem value="2">해외</SelectItem>
                        <SelectItem value="3">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">원산지</Label>
                    <Input 
                      value={editedProduct.ProductionPlace} 
                      onChange={(e) => handleFieldChange('ProductionPlace', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">산업코드 유형</Label>
                    <Select 
                      value={editedProduct.IndustrialCodeType}
                      onValueChange={(value) => handleFieldChange('IndustrialCodeType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                        <SelectValue placeholder="산업코드 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="J">JAN</SelectItem>
                        <SelectItem value="K">KAN</SelectItem>
                        <SelectItem value="I">ISBN</SelectItem>
                        <SelectItem value="U">UPC</SelectItem>
                        <SelectItem value="E">EAN</SelectItem>
                        <SelectItem value="H">HS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">산업코드</Label>
                    <Input 
                      value={editedProduct.IndustrialCode} 
                      onChange={(e) => handleFieldChange('IndustrialCode', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-orange-500 rounded"></div>
                <h3 className="text-lg font-semibold">배송 정보</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">배송비코드</Label>
                    <Input 
                      value={editedProduct.ShippingNo} 
                      onChange={(e) => handleFieldChange('ShippingNo', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">희망배송일</Label>
                    <Input 
                      type="number"
                      value={editedProduct.DesiredShippingDate} 
                      onChange={(e) => handleFieldChange('DesiredShippingDate', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      min="0"
                      max="20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">발송가능일 유형</Label>
                    <Select 
                      value={editedProduct.AvailableDateType}
                      onValueChange={(value) => handleFieldChange('AvailableDateType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                        <SelectValue placeholder="발송가능일 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">일반발송</SelectItem>
                        <SelectItem value="1">상품준비일</SelectItem>
                        <SelectItem value="2">출시일</SelectItem>
                        <SelectItem value="3">당일발송</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">발송가능일 상세</Label>
                    <Input 
                      value={editedProduct.AvailableDateValue} 
                      onChange={(e) => handleFieldChange('AvailableDateValue', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "options" && (
          <div className="mt-6 space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded"></div>
                    옵션 목록
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 ml-3">
                    상품의 옵션 정보를 관리할 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newOption = {
                          id: `new_${Date.now()}`,
                          name1: '',
                          value1: '',
                          name2: '',
                          value2: '',
                          name3: '',
                          value3: '',
                          price: 0,
                          qty: 0,
                          itemTypeCode: '',
                          flag: 'NONE',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        };
                        
                        handleFieldChange('Options', [...(editedProduct.Options || []), newOption]);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      옵션 추가
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/qoo10/products/inventory', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            ItemCode: editedProduct.ItemCode,
                            SellerCode: editedProduct.SellerCode,
                            Options: editedProduct.Options,
                            SellerAuthKey: editedProduct.SellerAuthKey
                          }),
                        });

                        const result = await response.json();

                        // 결과 메시지 생성
                        let message = '== QOO10 옵션정보 전송 결과 ==\n\n';
                        
                        if (result.ResultCode === 0) {
                          message += '✅ 옵션정보 전송 성공\n';
                          message += '상품 페이지 반영까지 최대 10분이 소요될 수 있습니다.';
                        } else {
                          message += '❌ 옵션정보 전송 실패\n';
                          message += `오류 코드: ${result.ResultCode}\n`;
                          message += `오류 메시지: ${result.details || result.ResultMsg}`;
                        }

                        alert(message);

                      } catch (error) {
                        console.error('Failed to send inventory info:', error);
                        alert('옵션정보 전송 중 오류가 발생했습니다.');
                      }
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    QOO10 옵션정보 전송
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">옵션명1</TableHead>
                      <TableHead className="font-semibold">옵션값1</TableHead>
                      <TableHead className="font-semibold">옵션명2</TableHead>
                      <TableHead className="font-semibold">옵션값2</TableHead>
                      <TableHead className="font-semibold">옵션명3</TableHead>
                      <TableHead className="font-semibold">옵션값3</TableHead>
                      <TableHead className="text-right font-semibold">가격</TableHead>
                      <TableHead className="text-right font-semibold">수량</TableHead>
                      <TableHead className="font-semibold">상품타입코드</TableHead>
                      {isEditing && <TableHead className="w-[100px]"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedProduct.Options?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          등록된 옵션이 없습니다.
                          {isEditing && (
                            <div className="mt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const newOption = {
                                    id: `new_${Date.now()}`,
                                    name1: '',
                                    value1: '',
                                    name2: '',
                                    value2: '',
                                    name3: '',
                                    value3: '',
                                    price: 0,
                                    qty: 0,
                                    itemTypeCode: '',
                                    flag: 'NONE',
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                  };
                                  handleFieldChange('Options', [newOption]);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                첫 옵션 추가하기
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      editedProduct.Options?.map((option) => (
                        <TableRow key={option.Id} className="hover:bg-gray-50">
                          <TableCell>
                            <Input
                              value={option.Name1 || ''}
                              onChange={(e) => {
                                setEditedProduct(prev => ({
                                  ...prev,
                                  Options: prev.Options?.map(opt =>
                                    opt.Id === option.Id ? { ...opt, Name1: e.target.value } : opt
                                  )
                                }))
                              }}
                            />
                          </TableCell>
                          <TableCell>{option.Name1 || '-'}</TableCell>
                          <TableCell>
                            <Input
                              value={option.Value1 || ''}
                              onChange={(e) => {
                                setEditedProduct(prev => ({
                                  ...prev,
                                  Options: prev.Options?.map(opt =>
                                    opt.Id === option.Id ? { ...opt, Value1: e.target.value } : opt
                                  )
                                }))
                              }}
                            />
                          </TableCell>
                          {/* 나머지 필드들도 같은 방식으로 대문자로 시작하는 프로퍼티 이름 사용 */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "description" && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">상품 상세 설명</h3>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // HTML 소스 보기/편집 모달 열기
                      // TODO: HTML 소스 편집 기능 구현
                    }}
                  >
                    HTML 소스
                  </Button>
                </div>
              )}
            </div>

            <div className="border rounded-lg">
              <CKEditor
                editor={ClassicEditor}
                data={editedProduct.ItemDetail || ''}
                disabled={!isEditing}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleFieldChange('ItemDetail', data);
                }}
                config={{
                  toolbar: {
                    items: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      'link',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'imageUpload',
                      'blockQuote',
                      'insertTable',
                      'mediaEmbed',
                      'undo',
                      'redo',
                      '|',
                      'alignment',
                      'fontSize',
                      'fontColor',
                      'fontBackgroundColor'
                    ]
                  },
                  image: {
                    toolbar: [
                      'imageTextAlternative',
                      'imageStyle:full',
                      'imageStyle:side'
                    ]
                  },
                  alignment: {
                    options: ['left', 'center', 'right', 'justify']
                  },
                  table: {
                    contentToolbar: [
                      'tableColumn',
                      'tableRow',
                      'mergeTableCells'
                    ]
                  },
                  heading: {
                    options: [
                      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                    ]
                  }
                }}
              />
            </div>

            {!isEditing && editedProduct.ItemDetail && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-4">미리보기</h4>
                <div 
                  className="border rounded-lg p-4"
                  dangerouslySetInnerHTML={{ __html: editedProduct.ItemDetail }}
                />
              </div>
            )}
          </div>
        )}
      </Tabs>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsEditing(false)
              setEditedProduct(product)
            }}
          >
            취소
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </div>
      )}
    </div>
  )
} 