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
import { Code } from 'lucide-react'
import { Eye } from 'lucide-react'
import { FileText } from 'lucide-react'
import { Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import CategorySelector from './CategorySelector'

interface NormalProductEditorProps {
  product: DetailProduct
  onSave: (product: DetailProduct) => Promise<void>
  onCancel: () => void
  onApplyToQoo10: () => Promise<void>
}

// 일본 지역 상수 추가
const JAPAN_REGIONS = [
  { value: '0', label: '선택안함' },
  { value: 'HOKKAIDO', label: '北海道(HOKKAIDO)' },
  { value: 'AOMORI', label: '青森県(AOMORI)' },
  { value: 'IWATE', label: '岩手県(IWATE)' },
  { value: 'MIYAGI', label: '宮城県(MIYAGI)' },
  { value: 'AKITA', label: '秋田県(AKITA)' },
  { value: 'YAMAGATA', label: '山形県(YAMAGATA)' },
  { value: 'FUKUSHIMA', label: '福島県(FUKUSHIMA)' },
  { value: 'IBARAKI', label: '茨城県(IBARAKI)' },
  { value: 'TOCHIGI', label: '栃木県(TOCHIGI)' },
  { value: 'GUMMA', label: '群馬県(GUMMA)' },
  { value: 'SAITAMA', label: '埼玉県(SAITAMA)' },
  { value: 'CHIBA', label: '千葉県(CHIBA)' },
  { value: 'TOKYO', label: '東京都(TOKYO)' },
  { value: 'KANAGAWA', label: '神奈川県(KANAGAWA)' },
  { value: 'NIIGATA', label: '新潟県(NIIGATA)' },
  { value: 'TOYAMA', label: '富山県(TOYAMA)' },
  { value: 'ISHIKAWA', label: '石川県(ISHIKAWA)' },
  { value: 'FUKUI', label: '福井県(FUKUI)' },
  { value: 'YAMANASHI', label: '山梨県(YAMANASHI)' },
  { value: 'NAGANO', label: '長野県(NAGANO)' },
  { value: 'GIFU', label: '岐阜県(GIFU)' },
  { value: 'SHIZUOK', label: '静岡県(SHIZUOK)' },
  { value: 'SHIZUOKA', label: '静岡県(SHIZUOKA)' },
  { value: 'AICHI', label: '愛知県(AICHI)' },
  { value: 'MIE', label: '三重県(MIE)' },
  { value: 'SHIGA', label: '滋賀県(SHIGA)' },
  { value: 'KYOTO', label: '京都府(KYOTO)' },
  { value: 'OSAKA', label: '大阪府(OSAKA)' },
  { value: 'HYOGO', label: '兵庫県(HYOGO)' },
  { value: 'NARA', label: '奈良県(NARA)' },
  { value: 'WAKAYAMA', label: '和歌山県(WAKAYAMA)' },
  { value: 'TOTTORI', label: '鳥取県(TOTTORI)' },
  { value: 'SHIMANE', label: '島根県(SHIMANE)' },
  { value: 'OKAYAMA', label: '岡山県(OKAYAMA)' },
  { value: 'HIROSHIMA', label: '広島県(HIROSHIMA)' },
  { value: 'YAMAGUCHI', label: '山口県(YAMAGUCHI)' },
  { value: 'TOKUSHIMA', label: '徳島県(TOKUSHIMA)' },
  { value: 'KAGAWA', label: '香川県(KAGAWA)' },
  { value: 'EHIME', label: '愛媛県(EHIME)' },
  { value: 'KOCHI', label: '高知県(KOCHI)' },
  { value: 'FUKUOKA', label: '福岡県(FUKUOKA)' },
  { value: 'SAGA', label: '佐賀県(SAGA)' },
  { value: 'NAGASAKI', label: '長崎県(NAGASAKI)' },
  { value: 'KUMAMOTO', label: '熊本県(KUMAMOTO)' },
  { value: 'OITA', label: '大分県(OITA)' },
  { value: 'MIYAZAKI', label: '宮崎県(MIYAZAKI)' },
  { value: 'KAGOSHIMA', label: '鹿児島県(KAGOSHIMA)' },
  { value: 'OKINAWA', label: '沖縄県(OKINAWA)' }
];

// 국가 코드 옵션 수정
const COUNTRY_OPTIONS = [
  { value: '_SELECT_', label: '선택', disabled: true },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: '_DIVIDER_', label: '==================', disabled: true },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AI', label: 'ANGUILLA' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AE', label: 'Arab Emirates' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AW', label: 'Aruba' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'austria' },
  // ... 중간 생략 ...
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' }
];

export default function NormalProductEditor({ product, onSave, onCancel, onApplyToQoo10 }: NormalProductEditorProps) {
  const [isEditing, setIsEditing] = useState(true)
  const [editedProduct, setEditedProduct] = useState(product)
  const [activeTab, setActiveTab] = useState("basic")
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const handleFieldChange = (field: keyof DetailProduct, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(editedProduct);
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

  const formatHtml = (html: string): string => {
    try {
      return html
        .replace(/>\s+</g, '>\n<')
        .replace(/(<[^>]+>)/g, match => `\n${match}\n`)
        .split('\n')
        .filter(line => line.trim())
        .map(line => '  ' + line.trim())
        .join('\n');
    } catch (error) {
      console.error('HTML 포맷팅 실패:', error);
      return html;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">상품 상세 정보</h2>
        <div className="flex gap-4">
          <div className="flex gap-4 ml-4">
            <Button 
              onClick={() => {
                if (confirm('QOO10에 상품 정보를 전송하시겠습니까?')) {
                  onApplyToQoo10();
                }
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Globe className="w-4 h-4" />
              QOO10 전송
            </Button>
            <Button onClick={handleSave}>
              저장
            </Button>
            <Button variant="outline" onClick={() => {
              //setIsEditing(false)
              //setEditedProduct(product)
              onCancel()
            }}>
              닫기
            </Button>
          </div>
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
                <h3 className="text-lg font-semibold">대표 이미지</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">이미지 URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={editedProduct.ImageUrl || ''} 
                      onChange={(e) => handleFieldChange('ImageUrl', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      placeholder="이미지 URL을 입력하세요"
                    />
                  </div>
                </div>
                
                {/* 이미지 미리보기 */}
                {editedProduct.ImageUrl && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700 block mb-2">미리보기</Label>
                    <div className="relative w-[200px] h-[200px] border rounded-lg overflow-hidden">
                      <img
                        src={editedProduct.ImageUrl}
                        alt="대 이미지"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
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
                
              {isEditing && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-sm font-medium text-gray-700">카테고리 변경</Label>
                      <span className="text-sm text-gray-500">
                        * 카테고리를 변경하려면 아래에서 새로운 카테고리를 선택하세요.
                      </span>
                    </div>
                    <CategorySelector
                      onSelect={(category) => {
                        handleFieldChange('MainCatCd', category.mainCatCd);
                        handleFieldChange('MainCatNm', category.mainCatNm);
                        handleFieldChange('FirstSubCatCd', category.firstSubCatCd);
                        handleFieldChange('FirstSubCatNm', category.firstSubCatNm);
                        handleFieldChange('SecondSubCatCd', category.secondSubCatCd);
                        handleFieldChange('SecondSubCatNm', category.secondSubCatNm);
                      }}
                      sellerAuthKey={editedProduct.SellerAuthKey}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-6">
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
                        <SelectValue placeholder="원산지 유형 택" />
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
                    {editedProduct.ProductionPlaceType === '1' ? (
                      // 국내일 경우 일본 지역 선택
                      <Select 
                        value={editedProduct.ProductionPlace}
                        onValueChange={(value) => handleFieldChange('ProductionPlace', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                          <SelectValue placeholder="지역 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {JAPAN_REGIONS.map(region => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : editedProduct.ProductionPlaceType === '2' ? (
                      // 해외일 경우 국가 선택
                      <Select 
                        value={editedProduct.ProductionPlace}
                        onValueChange={(value) => handleFieldChange('ProductionPlace', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_OPTIONS.map(country => (
                            <SelectItem 
                              key={country.value} 
                              value={country.value}
                              disabled={country.disabled}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // 기타일 경우 텍스트 입력
                      <Input 
                        value={editedProduct.ProductionPlace} 
                        onChange={(e) => handleFieldChange('ProductionPlace', e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    )}
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
                        <SelectItem value="3">당발송</SelectItem>
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
                          message += '상 페이지 반영까지 최대 10분이 소요될 수 있습니다.';
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
                    {!editedProduct.Options || editedProduct.Options.length === 0 ? (
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
                      editedProduct.Options.map((option) => (
                        <TableRow key={option.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Input
                              value={option.name1 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, name1: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.value1 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, value1: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                              className={!isNaN(Number(option.value1)) ? 'text-right' : ''}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.name2 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, name2: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.value2 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, value2: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                              className={!isNaN(Number(option.value2)) ? 'text-right' : ''}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.name3 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, name3: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.value3 || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, value3: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                              className={!isNaN(Number(option.value3)) ? 'text-right' : ''}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={option.price || 0}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, price: Number(e.target.value) } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={option.qty || 0}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, qty: Number(e.target.value) } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={option.itemTypeCode || ''}
                              onChange={(e) => {
                                const updatedOptions = editedProduct.Options?.map(opt =>
                                  opt.id === option.id ? { ...opt, itemTypeCode: e.target.value } : opt
                                );
                                handleFieldChange('Options', updatedOptions);
                              }}
                              disabled={!isEditing}
                            />
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedOptions = editedProduct.Options?.filter(opt => opt.id !== option.id);
                                  handleFieldChange('Options', updatedOptions);
                                }}
                                className="hover:bg-red-100"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </TableCell>
                          )}
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
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded"></div>
                  <h3 className="text-lg font-semibold">상품 상세 설명</h3>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setHtmlSource(editedProduct.ItemDetail || '');
                        setHtmlDialogOpen(true);
                      }}
                    >
                      <Code className="w-4 h-4" />
                      HTML 소스
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setPreviewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      미리보기
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
                    }
                  }}
                />
              </div>

              {!isEditing && editedProduct.ItemDetail && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-4">미리보기</h4>
                  <div 
                    className="border rounded-lg p-4 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: editedProduct.ItemDetail }}
                  />
                </div>
              )}
            </div>

            {/* HTML 소스 편집 다이얼로그 */}
            <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    HTML 소스 편집
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col h-[calc(90vh-8rem)]">
                  {/* 툴바 */}
                  <div className="flex items-center gap-2 p-2 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        try {
                          const formatted = formatHtml(htmlSource);
                          setHtmlSource(formatted);
                        } catch (error) {
                          console.error('HTML 포맷팅 실패:', error);
                          alert('HTML 포맷팅에 실패했습니다.');
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      포맷
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewDialogOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      미리보기
                    </Button>
                    <div className="flex-1" />
                    <span className="text-sm text-gray-500">
                      * Ctrl + S로 저장, Esc로 취소할 수 있습니다.
                    </span>
                  </div>

                  {/* 에디터 영역 */}
                  <div className="flex-1 min-h-0 p-4">
                    <textarea
                      value={htmlSource}
                      onChange={(e) => setHtmlSource(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        resize: 'none',
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                      onKeyDown={(e) => {
                        // Ctrl + S로 저장
                        if (e.ctrlKey && e.key === 's') {
                          e.preventDefault();
                          handleFieldChange('ItemDetail', htmlSource);
                          setHtmlDialogOpen(false);
                        }
                        // Esc로 취소
                        if (e.key === 'Escape') {
                          setHtmlDialogOpen(false);
                        }
                        // Tab 키 처리
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          const start = e.currentTarget.selectionStart;
                          const end = e.currentTarget.selectionEnd;
                          const newValue = htmlSource.substring(0, start) + '  ' + htmlSource.substring(end);
                          setHtmlSource(newValue);
                          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                        }
                      }}
                      spellCheck={false}
                      placeholder="HTML 코드를 입력하세요..."
                    />
                  </div>

                  {/* 하단 버튼 */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setHtmlDialogOpen(false)}
                      className="flex items-center gap-1"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={() => {
                        handleFieldChange('ItemDetail', htmlSource);
                        setHtmlDialogOpen(false);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      적용
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* HTML 미리보기 다이얼로그 */}
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle>HTML 미리보기</DialogTitle>
                </DialogHeader>
                <div 
                  className="flex-1 min-h-0 p-4 border rounded-md overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: htmlDialogOpen ? htmlSource : editedProduct.ItemDetail || '' 
                  }}
                />
                <DialogFooter>
                  <Button onClick={() => setPreviewDialogOpen(false)}>
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Tabs>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button onClick={handleSave}>
            저장
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              //setIsEditing(false)
              //setEditedProduct(product)
              onCancel()
            }}
          >
            닫기
          </Button>
          
        </div>
      )}
    </div>
  )
} 