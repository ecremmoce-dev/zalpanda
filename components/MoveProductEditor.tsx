import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Globe, Image } from 'lucide-react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateMoveProduct } from '@/lib/api/qoo10'  // API 함수 import 추가

interface MoveProductEditorProps {
  product: any // DetailProduct 타입 정의 필요
  onSave: (product: any) => void
  onCancel: () => void
  onApplyToQoo10?: () => void
}

// API 별 에러 메시지 매핑 수정
const ERROR_MESSAGES = {
  // UpdateMoveGoods API 에러
  UPDATE_MOVE_GOODS: {
    '-10000': 'API 인증키가 유효하지 않습니다.',
    '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
    '-10002': '검수 중인 상품은 수정할 수 없습니다.',
    '-10003': '거래중지된 상품은 수정할 수 없습니다.',
    '-10004': '거래제한된 상품은 수정할 수 없습니다.',
    '-10005': '승인거부된 상품은 수정할 수 없습니다.',
    '-10006': '판매종료일은 필수 입력값입니다.',
    '-10007': '판매종료일 형식이 올바르지 않습니다. (YYYY-MM-DD)',
    '-10101': '처리 중 오류가 발생했습니다.',
  },
  // EditMoveGoodsPrice API 에러
  EDIT_MOVE_PRICE: {
    '-20000': '가격 정보 업데이트에 실패했습니다.',
    '-20001': '판매가는 0보다 커야 합니다.',
    '-20002': '판매가 형식이 올바르지 않습니다.',
  },
  // EditMoveGoodsInventory API 에러
  EDIT_MOVE_INVENTORY: {
    '-30000': '재고 정보 업데이트에 실패했습니다.',
    '-30001': '재고수량은 0 이상이어야 합니다.',
    '-30002': '재고수량 형식이 올바르지 않습니다.',
  }
};

export default function MoveProductEditor({ product, onSave, onCancel, onApplyToQoo10 }: MoveProductEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState(product)
  const [activeTab, setActiveTab] = useState("basic")

  // 옵션 파싱 함수들
  const parseOptions = () => {
    const mainImages = parseOptionString(editedProduct.OptionMainimage)
    const quantities = parseOptionString(editedProduct.OptionQty)
    const types = parseOptionString(editedProduct.OptionType)

    return mainImages.map(img => ({
      color: img.key,
      imageUrl: img.value,
      sizes: quantities
        .filter(q => q.key === img.key)
        .map(q => ({
          size: q.subKey,
          qty: parseInt(q.value),
          itemTypeCode: q.extra
        })),
      colorCode: types.find(t => t.key === img.key)?.value || '',
      isMain: types.find(t => t.key === img.key)?.extra === 'Y'
    }))
  }

  const parseOptionString = (optionStr: string = '') => {
    return optionStr.split('$$').map(opt => {
      const [keyPart, valuePart] = opt.split('||*')
      if (valuePart?.includes('||*')) {
        const [subKey, value, extra] = valuePart.split('||*')
        return { key: keyPart, subKey, value, extra }
      }
      return { key: keyPart, value: valuePart }
    })
  }

  const handleFieldChange = (field: string, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(editedProduct)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const options = parseOptions()

  // QOO10 전송 핸들러 수정
  const handleApplyToQoo10 = async () => {
    try {
      if (!confirm('QOO10에 상품 정보를 전송하시겠습니까?')) {
        return;
      }

      // ExpireDate 필수값 체크
      if (!editedProduct.ExpireDate) {
        alert('판매종료일은 필수 입력값입니다.');
        return;
      }

      const responses = await updateMoveProduct({
        ItemCode: editedProduct.ItemCode,
        SellerCode: editedProduct.SellerCode,
        SecondSubCat: editedProduct.SecondSubCat,
        ItemSeriesName: editedProduct.ItemSeriesName,
        PromotionName: editedProduct.PromotionName,
        ItemPrice: editedProduct.ItemPrice,
        RetailPrice: editedProduct.RetailPrice,
        TaxRate: editedProduct.TaxRate,
        OptionType: editedProduct.OptionType,
        OptionMainimage: editedProduct.OptionMainimage,
        OptionSubimage: editedProduct.OptionSubimage,
        OptionQty: editedProduct.OptionQty,
        StyleNumber: editedProduct.StyleNumber,
        TpoNumber: editedProduct.TpoNumber,
        SeasonType: editedProduct.SeasonType,
        MaterialInfo: editedProduct.MaterialInfo,
        MaterialNumber: editedProduct.MaterialNumber,
        AttributeInfo: editedProduct.AttributeInfo,
        ItemDescription: editedProduct.ItemDescription,
        WashinginfoWashing: editedProduct.WashinginfoWashing,
        WashinginfoStretch: editedProduct.WashinginfoStretch,
        WashinginfoFit: editedProduct.WashinginfoFit,
        WashinginfoThickness: editedProduct.WashinginfoThickness,
        WashinginfoLining: editedProduct.WashinginfoLining,
        WashinginfoSeethrough: editedProduct.WashinginfoSeethrough,
        ImageOtherUrl: editedProduct.ImageOtherUrl,
        VideoNumber: editedProduct.VideoNumber,
        ShippingNo: editedProduct.ShippingNo,
        AvailableDateValue: editedProduct.AvailableDateValue,
        DesiredShippingDate: editedProduct.DesiredShippingDate,
        Keyword: editedProduct.Keyword,
        OriginType: editedProduct.OriginType,
        OriginRegionId: editedProduct.OriginType === '1' ? editedProduct.ProductionPlace : '',
        OriginCountryId: editedProduct.OriginType === '2' ? editedProduct.ProductionPlace : '',
        OriginOthers: editedProduct.OriginType === '3' ? editedProduct.ProductionPlace : '',
        Weight: editedProduct.Weight,
        SellerAuthKey: editedProduct.SellerAuthKey,
        ExpireDate: editedProduct.ExpireDate?.split('T')[0],
      });

      // API 응답 처리
      const [updateBasicResult, updatePriceResult, updateInventoryResult] = await Promise.all(responses);

      // 결과 메시지 생성
      let resultMessage = '== QOO10 전송 결과 ==\n\n';

      // 1. UpdateMoveGoods API 결과
      resultMessage += '1. UpdateMoveGoods API (기본 정보 업데이트)\n';
      resultMessage += `호출 URL: /GMKT.INC.Front.QAPIService/ebayjapan.qapi?method=ItemsBasic.UpdateMoveGoods\n`;
      resultMessage += `결과: ${updateBasicResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      resultMessage += `응답코드: ${updateBasicResult.ResultCode}\n`;
      resultMessage += `응답메시지: ${updateBasicResult.ResultMsg}\n`;
      if (updateBasicResult.ResultCode !== 0) {
        resultMessage += `상세오류: ${ERROR_MESSAGES.UPDATE_MOVE_GOODS[updateBasicResult.ResultCode] || '알 수 없는 오류'}\n`;
      }
      resultMessage += '\n';

      // 2. EditMoveGoodsPrice API 결과
      resultMessage += '2. EditMoveGoodsPrice API (가격 정보 업데이트)\n';
      resultMessage += `호출 URL: /GMKT.INC.Front.QAPIService/ebayjapan.qapi?method=ItemsOrder.EditMoveGoodsPrice\n`;
      resultMessage += `결과: ${updatePriceResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      resultMessage += `응답코드: ${updatePriceResult.ResultCode}\n`;
      resultMessage += `응답메시지: ${updatePriceResult.ResultMsg}\n`;
      if (updatePriceResult.ResultCode !== 0) {
        resultMessage += `상세오류: ${ERROR_MESSAGES.EDIT_MOVE_PRICE[updatePriceResult.ResultCode] || '알 수 없는 오류'}\n`;
      }
      resultMessage += '\n';

      // 3. EditMoveGoodsInventory API 결과
      resultMessage += '3. EditMoveGoodsInventory API (재고 정보 업데이트)\n';
      resultMessage += `호출 URL: /GMKT.INC.Front.QAPIService/ebayjapan.qapi?method=ItemsOptions.EditMoveGoodsInventory\n`;
      resultMessage += `결과: ${updateInventoryResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      resultMessage += `응답코드: ${updateInventoryResult.ResultCode}\n`;
      resultMessage += `응답메시지: ${updateInventoryResult.ResultMsg}\n`;
      if (updateInventoryResult.ResultCode !== 0) {
        resultMessage += `상세오류: ${ERROR_MESSAGES.EDIT_MOVE_INVENTORY[updateInventoryResult.ResultCode] || '알 수 없는 오류'}\n`;
      }

      // 전체 결과 요약
      const isAllSuccess = [updateBasicResult, updatePriceResult, updateInventoryResult]
        .every(result => result.ResultCode === 0);

      resultMessage += '\n=== 전송 결과 요약 ===\n';
      if (isAllSuccess) {
        resultMessage += '✨ 모든 API 호출이 성공적으로 완료되었습니다.';
      } else {
        resultMessage += '⚠️ 일부 API 호출이 실패했습니다.\n';
        resultMessage += '실패한 API:\n';
        if (updateBasicResult.ResultCode !== 0) resultMessage += '- UpdateMoveGoods (기본 정보)\n';
        if (updatePriceResult.ResultCode !== 0) resultMessage += '- EditMoveGoodsPrice (가격 정보)\n';
        if (updateInventoryResult.ResultCode !== 0) resultMessage += '- EditMoveGoodsInventory (재고 정보)\n';
      }

      alert(resultMessage);

    } catch (error) {
      console.error('Failed to apply to QOO10:', error);
      let errorMessage = 'QOO10 전송 중 오류가 발생했습니다.\n\n';
      
      if (error instanceof Error) {
        errorMessage += `오류 유형: ${error.name}\n`;
        errorMessage += `오류 메시지: ${error.message}\n`;
        if (error.stack) {
          errorMessage += `\n상세 정보:\n${error.stack}`;
        }
      } else {
        errorMessage += '알 수 없는 오류가 발생했습니다.';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">무브상품 상세 정보</h2>
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
                onClick={handleApplyToQoo10}
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

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="options">옵션 정보</TabsTrigger>
          <TabsTrigger value="description">상세 설명</TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        {activeTab === "basic" && (
          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">기본 정보</h3>
              
              <div className="space-y-2">
                <Label>상품코드</Label>
                <Input value={editedProduct.ItemCode} readOnly />
              </div>

              <div className="space-y-2">
                <Label>셀러코드</Label>
                <Input 
                  value={editedProduct.SellerCode} 
                  onChange={(e) => handleFieldChange('SellerCode', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>상품명</Label>
                <Input 
                  value={editedProduct.ItemSeriesName} 
                  onChange={(e) => handleFieldChange('ItemSeriesName', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>홍보용 상품명</Label>
                <Input 
                  value={editedProduct.PromotionName} 
                  onChange={(e) => handleFieldChange('PromotionName', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>판매가</Label>
                <Input 
                  type="number"
                  value={editedProduct.ItemPrice} 
                  onChange={(e) => handleFieldChange('ItemPrice', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>소비세율</Label>
                <Input 
                  value={editedProduct.TaxRate} 
                  onChange={(e) => handleFieldChange('TaxRate', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>판매종료일</Label>
                <Input 
                  type="date"
                  value={editedProduct.ExpireDate?.split('T')[0]} 
                  onChange={(e) => handleFieldChange('ExpireDate', e.target.value)}
                  readOnly={!isEditing}
                  min={new Date().toISOString().split('T')[0]} // 오늘 이후 날짜만 선택 가능
                />
              </div>
            </div>

            {/* 원산지/배송 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">원산지/배송 정보</h3>

              <div className="space-y-2">
                <Label>원산지 유형</Label>
                <Select 
                  value={editedProduct.OriginType}
                  onValueChange={(value) => handleFieldChange('OriginType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">국내</SelectItem>
                    <SelectItem value="2">해외</SelectItem>
                    <SelectItem value="3">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>원산지 국가</Label>
                <Input 
                  value={editedProduct.OriginCountryId} 
                  onChange={(e) => handleFieldChange('OriginCountryId', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>배송비코드</Label>
                <Input 
                  value={editedProduct.ShippingNo} 
                  onChange={(e) => handleFieldChange('ShippingNo', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>상품 무게 (kg)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={editedProduct.Weight} 
                  onChange={(e) => handleFieldChange('Weight', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {/* 옵션 정보 탭 */}
        {activeTab === "options" && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">컬러/사이즈 옵션</h3>
            </div>

            {options.map((colorOption, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-[200px] h-[200px] border rounded-lg overflow-hidden">
                    <img 
                      src={colorOption.imageUrl} 
                      alt={colorOption.color}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <Label>컬러명</Label>
                        <Input value={colorOption.color} readOnly={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>컬러코드</Label>
                        <Input value={colorOption.colorCode} readOnly={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>대표 컬러</Label>
                        <Input value={colorOption.isMain ? '예' : '아니오'} readOnly />
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>사이즈</TableHead>
                          <TableHead className="text-right">수량</TableHead>
                          <TableHead>상품타입코드</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {colorOption.sizes.map((size, sizeIndex) => (
                          <TableRow key={sizeIndex}>
                            <TableCell>{size.size}</TableCell>
                            <TableCell className="text-right">
                              {isEditing ? (
                                <Input 
                                  type="number"
                                  value={size.qty}
                                  className="w-24 text-right"
                                  onChange={(e) => {
                                    // 수량 변경 로직
                                  }}
                                />
                              ) : (
                                size.qty.toLocaleString()
                              )}
                            </TableCell>
                            <TableCell>{size.itemTypeCode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 상세 설명 탭 */}
        {activeTab === "description" && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">상품 상세 설명</h3>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // HTML 소스 보기/편집
                  }}
                >
                  HTML 소스
                </Button>
              )}
            </div>

            <div className="border rounded-lg">
              <CKEditor
                editor={ClassicEditor}
                data={editedProduct.ItemDescription || ''}
                disabled={!isEditing}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleFieldChange('ItemDescription', data);
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
                  }
                }}
              />
            </div>

            {!isEditing && editedProduct.ItemDescription && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-4">미리보기</h4>
                <div 
                  className="border rounded-lg p-4"
                  dangerouslySetInnerHTML={{ __html: editedProduct.ItemDescription }}
                />
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
} 