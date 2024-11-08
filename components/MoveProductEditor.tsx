import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Globe, Image, Plus, Upload, X, Code, FileText, Eye } from 'lucide-react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateMoveProduct } from '@/lib/api/qoo10'  // API 함수 import 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog' // 다이얼로그 컴포넌트 추가

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

// 타입 정의 추가
interface Size {
  size: string;
  qty: number;
  itemTypeCode: string;
}

interface ColorOption {
  color: string;
  imageUrl: string;
  subImages: string[];
  colorCode: string;
  isMain: boolean;
  sizes: Size[];
}

export default function MoveProductEditor({ product, onSave, onCancel, onApplyToQoo10 }: MoveProductEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState(product)
  const [activeTab, setActiveTab] = useState("basic")
  const [dialogOpen, setDialogOpen] = useState(false) // 다이얼로그 상태 추가
  const [resultMessage, setResultMessage] = useState('') // 결과 메시지 상태 추가
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // 옵션 파싱 함수들
  const parseOptions = () => {
    try {
      // 메인 이미지 파싱
      const mainImages = (editedProduct.OptionMainimage || '').split('$$').map(opt => {
        const [color, imageUrl] = opt.split('||*');
        return { color, imageUrl };
      });

      // 서브 이미지 파싱
      const subImages = (editedProduct.OptionSubimage || '').split('$$').map(opt => {
        const [color, ...urls] = opt.split('||*');
        return { color, urls };
      });

      const types = (editedProduct.OptionType || '').split('$$').map(opt => {
        const [color, colorCode, isMain] = opt.split('||*');
        return { color, colorCode, isMain: isMain === 'Y' };
      });

      const quantities = (editedProduct.OptionQty || '').split('$$').map(opt => {
        const [color, size, qty, code] = opt.split('||*');
        return { color, size, qty: parseInt(qty) || 0, code };
      });

      // 컬러별로 데이터 병합
      const colorGroups = mainImages.map(main => {
        const type = types.find(t => t.color === main.color) || { colorCode: '', isMain: false };
        const subImageGroup = subImages.find(s => s.color === main.color);
        const sizes = quantities
          .filter(q => q.color === main.color)
          .map(q => ({
            size: q.size,
            qty: q.qty,
            itemTypeCode: q.code
          }));

        return {
          color: main.color,
          imageUrl: main.imageUrl,
          subImages: subImageGroup ? subImageGroup.urls.filter(url => url) : [], // 빈 값 필터링
          colorCode: type.colorCode,
          isMain: type.isMain,
          sizes
        };
      });

      return colorGroups;
    } catch (error) {
      console.error('Failed to parse options:', error);
      return [];
    }
  };

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

  const [options, setOptions] = useState<ColorOption[]>(() => parseOptions());

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
      console.log("editedProduct.OriginCountryId", editedProduct.OriginCountryId);
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
        OriginCountryId: editedProduct.OriginType === '2' ? editedProduct.OriginCountryId : '',
        OriginOthers: editedProduct.OriginType === '3' ? editedProduct.ProductionPlace : '',
        Weight: editedProduct.Weight,
        SellerAuthKey: editedProduct.SellerAuthKey,
        ExpireDate: editedProduct.ExpireDate?.split('T')[0],
      });
      console.log("responses", responses);
      // API 응답 처리
      const [updateBasicResult, updatePriceResult, updateInventoryResult] = await Promise.all(responses);

      // 결과 메시지 생성
      let message = '== QOO10 전송 결과 ==\n\n';

      // 1. UpdateMoveGoods API 결과
      message += '1. UpdateMoveGoods API (기본 정보 업데이트)\n';
      message += `결과: ${updateBasicResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      message += `응답코드: ${updateBasicResult.ResultCode}\n`;
      message += `응답메시지: ${updateBasicResult.ResultMsg}\n`;
      if (updateBasicResult.ResultCode !== 0) {
        message += `상세오류: ${ERROR_MESSAGES.UPDATE_MOVE_GOODS[updateBasicResult.ResultCode] || '알 수 없는 오류'}\n`;
      }
      message += '\n';

      // 2. EditMoveGoodsPrice API 결과
      message += '2. EditMoveGoodsPrice API (가격 정보 업데이트)\n';
      message += `결과: ${updatePriceResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      message += `응답코드: ${updatePriceResult.ResultCode}\n`;
      message += `응답메시지: ${updatePriceResult.ResultMsg}\n`;
      if (updatePriceResult.ResultCode !== 0) {
        message += `상세오류: ${ERROR_MESSAGES.EDIT_MOVE_PRICE[updatePriceResult.ResultCode] || '알 수 없는 오류'}\n`;
      }
      message += '\n';

      // 3. EditMoveGoodsInventory API 결과
      message += '3. EditMoveGoodsInventory API (재고 정보 업데이트)\n';
      message += `결과: ${updateInventoryResult.ResultCode === 0 ? '✅ 성공' : '❌ 실패'}\n`;
      message += `응답코드: ${updateInventoryResult.ResultCode}\n`;
      message += `응답메시지: ${updateInventoryResult.ResultMsg}\n`;
      if (updateInventoryResult.ResultCode !== 0) {
        message += `상세오류: ${ERROR_MESSAGES.EDIT_MOVE_INVENTORY[updateInventoryResult.ResultCode] || '알 수 없는 오류'}\n`;
      }

      // 전체 결과 요약
      const isAllSuccess = [updateBasicResult, updatePriceResult, updateInventoryResult]
        .every(result => result.ResultCode === 0);

      message += '\n=== 전송 결과 요약 ===\n';
      if (isAllSuccess) {
        message += '✨ 모든 API 호출이 성공적으로 완료되었습니다.';
      } else {
        message += '⚠️ 일부 API 출이 실패했습니다.\n';
        message += '실패한 API:\n';
        if (updateBasicResult.ResultCode !== 0) message += '- UpdateMoveGoods (기본 정보)\n';
        if (updatePriceResult.ResultCode !== 0) message += '- EditMoveGoodsPrice (가격 정보)\n';
        if (updateInventoryResult.ResultCode !== 0) message += '- EditMoveGoodsInventory (재고 정보)\n';
      }

      setResultMessage(message);
      setDialogOpen(true); // 다이얼로그 열기

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
      
      setResultMessage(errorMessage);
      setDialogOpen(true); // 다이얼로그 열기
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

      {/* 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QOO10 전송 결과</DialogTitle>
            <DialogDescription>
              <pre>{resultMessage}</pre>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="options">옵션 정보</TabsTrigger>
          <TabsTrigger value="description">상세 설명</TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        {activeTab === "basic" && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 기본 정보 섹션 */}
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
                        className="bg-gray-50"
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
                    <Label className="text-sm font-medium text-gray-700">홍보용 상품명</Label>
                    <Input 
                      value={editedProduct.PromotionName} 
                      onChange={(e) => handleFieldChange('PromotionName', e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                      placeholder="홍보용 상품명을 입력하세요"
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
              </div>

              {/* 원산지/배송 정보 섹션 */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-green-500 rounded"></div>
                  <h3 className="text-lg font-semibold">원산지/배송 정보</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">원산지 유</Label>
                      <Select 
                        value={editedProduct.OriginType}
                        onValueChange={(value) => handleFieldChange('OriginType', value)}
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
                      <Label className="text-sm font-medium text-gray-700">산지 국가</Label>
                      <Input 
                        value={editedProduct.OriginCountryId} 
                        onChange={(e) => handleFieldChange('OriginCountryId', e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                        placeholder="예: KR, JP"
                      />
                    </div>
                  </div>

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
                      <Label className="text-sm font-medium text-gray-700">상품 무게</Label>
                      <div className="relative">
                        <Input 
                          type="number"
                          step="0.1"
                          value={editedProduct.Weight} 
                          onChange={(e) => handleFieldChange('Weight', e.target.value)}
                          readOnly={!isEditing}
                          className={`pr-12 ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 옵션 정보 탭 */}
        {activeTab === "options" && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">컬러/사이즈 옵션</h3>
                <p className="text-sm text-gray-500 mt-1">컬러별 이미지와 사이즈 옵션을 관리할 수 있습니다.</p>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // 컬러 추가 로직...
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      컬러 추가
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('모든 옵션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                          // 옵션 전체 삭제
                          setOptions([]);
                          // 관련된 모든 옵션 문자열 초기화
                          setEditedProduct(prev => ({
                            ...prev,
                            OptionType: '',
                            OptionMainimage: '',
                            OptionSubimage: '',
                            OptionQty: ''
                          }));
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                      전체 삭제
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {options.map((colorOption, index) => (
                <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  {/* 컬러 헤더 */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border shadow-sm"
                            style={{ backgroundColor: colorOption.colorCode || '#ffffff' }}
                          />
                          <span className="font-medium">{colorOption.color || '새로운 컬러'}</span>
                        </div>
                        {colorOption.isMain && (
                          <div className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            대표 컬러
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`"${colorOption.color}" 컬러를 삭제하시겠습니까?`)) {
                              // 해당 컬러 옵션 삭제
                              const newOptions = options.filter(opt => opt.color !== colorOption.color);
                              
                              // OptionType, OptionMainimage, OptionSubimage, OptionQty 문자열 업데이트
                              const newOptionType = newOptions.map(opt => 
                                `${opt.color}||*${opt.colorCode || ''}||*${opt.isMain ? 'Y' : 'N'}`
                              ).join('$$');

                              const newOptionMainimage = newOptions.map(opt => 
                                `${opt.color}||*${opt.imageUrl || ''}`
                              ).join('$$');

                              const newOptionSubimage = newOptions.map(opt => 
                                `${opt.color}||*${opt.subImages.join('||*')}`
                              ).join('$$');

                              const newOptionQty = newOptions.flatMap(opt => 
                                opt.sizes.map(s => 
                                  `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                )
                              ).join('$$');

                              // 상태 업데이트
                              setEditedProduct(prev => ({
                                ...prev,
                                OptionType: newOptionType,
                                OptionMainimage: newOptionMainimage,
                                OptionSubimage: newOptionSubimage,
                                OptionQty: newOptionQty
                              }));
                              setOptions(newOptions);
                            }
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          컬러 삭제
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-3 gap-6">
                    {/* 이미지 섹션 */}
                    <div className="w-[240px] space-y-4">
                      {/* 메인 이미지 */}
                      <div>
                        <Label>메인 이미지</Label>
                        <div className="mt-2 aspect-square border rounded-lg overflow-hidden bg-gray-50">
                          {colorOption.imageUrl ? (
                            <img 
                              src={colorOption.imageUrl} 
                              alt={`${colorOption.color} 메인이미지`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 서브 이미지 */}
                      <div>
                        <Label>서브 이미지</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {colorOption.subImages?.map((subImage, subIndex) => (
                            <div key={subIndex} className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                              {subImage ? (
                                <img 
                                  src={subImage} 
                                  alt={`${colorOption.color} 서브이미지 ${subIndex + 1}`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 옵션 정보 섹션 */}
                    <div className="col-span-2 space-y-6">
                      {/* 컬러 정보 */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>컬러명</Label>
                          <Input 
                            value={colorOption.color}
                            maxLength={20}
                            readOnly={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>컬러코드</Label>
                          <Input 
                            value={colorOption.colorCode}
                            placeholder="#000000"
                            readOnly={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>대표 컬러</Label>
                          {isEditing ? (
                            <Select
                              value={colorOption.isMain ? 'Y' : 'N'}
                              onValueChange={(value) => {
                                // 새로운 options 배열 생성
                                const newOptions = options.map(opt => ({
                                  ...opt,
                                  isMain: opt.color === colorOption.color ? value === 'Y' : false
                                }));

                                // OptionType 문자열 업데이트
                                const newOptionType = newOptions.map(opt => 
                                  `${opt.color}||*${opt.colorCode || ''}||*${opt.isMain ? 'Y' : 'N'}`
                                ).join('$$');

                                // editedProduct의 OptionType 업데이트
                                setEditedProduct(prev => ({
                                  ...prev,
                                  OptionType: newOptionType
                                }));
                                
                                // options 상태 업데이트
                                setOptions(newOptions);
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="대표 컬러 여부 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Y">예</SelectItem>
                                <SelectItem value="N">아니오</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input 
                              value={colorOption.isMain ? '예' : '아니오'} 
                              readOnly 
                              className="mt-1"
                            />
                          )}
                        </div>
                      </div>

                      {/* 사이즈 정보 */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>사이즈 옵션</Label>
                          {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              // 새로운 사이즈 옵션 추가
                              const newSizes = [...colorOption.sizes, {
                                size: '',  // 새로운 사이즈
                                qty: 0,    // 초기 수량
                                itemTypeCode: ''  // 판매자옵션코드
                              }];

                              // 전체 옵션 문자열 업데이트
                              const newOptions = options.map(opt => 
                                opt.color === colorOption.color 
                                  ? { ...opt, sizes: newSizes }
                                  : opt
                              );

                              // OptionQty 문자열 업데이트
                              const newQuantities = newOptions.flatMap(opt => 
                                opt.sizes.map(s => 
                                  `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                )
                              ).join('$$');

                              // 상태 업데이트
                              setEditedProduct(prev => ({
                                ...prev,
                                OptionQty: newQuantities
                              }));
                              setOptions(newOptions);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            사이즈 추가
                          </Button>
                        )}
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>사이즈</TableHead>
                              <TableHead className="text-right">수량</TableHead>
                              <TableHead>판매자옵션코드</TableHead>
                              {isEditing && <TableHead className="w-[100px]"></TableHead>}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {colorOption.sizes.map((size, sizeIndex) => (
                              <TableRow key={sizeIndex}>
                                <TableCell>
                                  {isEditing ? (
                                    <Input 
                                      value={size.size}
                                      onChange={(e) => {
                                        const newSizes = [...colorOption.sizes];
                                        newSizes[sizeIndex] = {
                                          ...newSizes[sizeIndex],
                                          size: e.target.value
                                        };

                                        const newOptions = options.map(opt => 
                                          opt.color === colorOption.color 
                                            ? { ...opt, sizes: newSizes }
                                            : opt
                                        );

                                        // OptionQty 문자열 업데이트
                                        const newQuantities = newOptions.flatMap(opt => 
                                          opt.sizes.map(s => 
                                            `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                          )
                                        ).join('$$');

                                        setEditedProduct(prev => ({
                                          ...prev,
                                          OptionQty: newQuantities
                                        }));
                                        setOptions(newOptions);
                                      }}
                                      placeholder="사이즈 입력"
                                      className="w-32"
                                    />
                                  ) : (
                                    size.size
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {isEditing ? (
                                    <Input 
                                      type="number"
                                      value={size.qty}
                                      min="0"
                                      className="w-24 text-right"
                                      onChange={(e) => {
                                        const newQty = parseInt(e.target.value) || 0;
                                        const newSizes = [...colorOption.sizes];
                                        newSizes[sizeIndex].qty = newQty;

                                        // OptionQty 문자열 업데이트
                                        const newQuantities = options.flatMap(opt => 
                                          opt.sizes.map(s => 
                                            `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                          )
                                        ).join('$$');

                                        // 상태 업데이트
                                        setEditedProduct(prev => ({
                                          ...prev,
                                          OptionQty: newQuantities
                                        }));
                                        setOptions(options.map(opt => 
                                          opt.color === colorOption.color ? { ...opt, sizes: newSizes } : opt
                                        ));
                                      }}
                                    />
                                  ) : (
                                    size.qty.toLocaleString()
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Input 
                                      value={size.itemTypeCode || ''}
                                      placeholder="예: BLACK-S"
                                      onChange={(e) => {
                                        const newCode = e.target.value;
                                        const newSizes = [...colorOption.sizes];
                                        newSizes[sizeIndex].itemTypeCode = newCode;

                                        // OptionQty 문자열 업데이트
                                        const newQuantities = options.flatMap(opt => 
                                          opt.sizes.map(s => 
                                            `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                          )
                                        ).join('$$');

                                        // 상태 업데이트
                                        setEditedProduct(prev => ({
                                          ...prev,
                                          OptionQty: newQuantities
                                        }));
                                        setOptions(options.map(opt => 
                                          opt.color === colorOption.color ? { ...opt, sizes: newSizes } : opt
                                        ));
                                      }}
                                    />
                                  ) : (
                                    size.itemTypeCode
                                  )}
                                </TableCell>
                                {isEditing && (
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        const newSizes = colorOption.sizes.filter((_, i) => i !== sizeIndex);
                                        const newOptions = options.map(opt => 
                                          opt.color === colorOption.color 
                                            ? { ...opt, sizes: newSizes }
                                            : opt
                                        );

                                        const newQuantities = newOptions.flatMap(opt => 
                                          opt.sizes.map(s => 
                                            `${opt.color}||*${s.size}||*${s.qty}||*${s.itemTypeCode || ''}`
                                          )
                                        ).join('$$');

                                        setEditedProduct(prev => ({
                                          ...prev,
                                          OptionQty: newQuantities
                                        }));
                                        setOptions(newOptions);
                                      }}
                                    >
                                      삭제
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  className="flex items-center gap-2"
                  onClick={() => {
                    // HTML 소스 편집 다이얼로그 열기
                    setHtmlDialogOpen(true);
                    setHtmlSource(editedProduct.ItemDescription || '');
                  }}
                >
                  <Code className="w-4 h-4" />
                  HTML 소스
                </Button>
              )}
            </div>

            {/* HTML 소스 편집 다이얼로그 */}
            <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>HTML 소스 편집</DialogTitle>
                  <DialogDescription>
                    HTML 태그를 직접 편집할 수 있습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 min-h-0">
                  <textarea
                    value={htmlSource}
                    onChange={(e) => setHtmlSource(e.target.value)}
                    className="w-full h-[calc(100vh-300px)] p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      whiteSpace: 'pre',
                      overflowWrap: 'normal',
                      overflowX: 'auto'
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // HTML 포맷팅
                        try {
                          const formatted = prettier.format(htmlSource, {
                            parser: 'html',
                            plugins: [prettierHtml],
                            printWidth: 80,
                            tabWidth: 2,
                            useTabs: false,
                            semi: true,
                            singleQuote: true,
                            trailingComma: 'none',
                            bracketSpacing: true,
                            jsxBracketSameLine: false,
                            arrowParens: 'avoid',
                            proseWrap: 'preserve'
                          });
                          setHtmlSource(formatted);
                        } catch (error) {
                          console.error('Failed to format HTML:', error);
                          alert('HTML 포맷팅에 실패했습니다.');
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      포맷
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // HTML 미리보기
                        setPreviewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      미리보기
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setHtmlDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={() => {
                        handleFieldChange('ItemDescription', htmlSource);
                        setHtmlDialogOpen(false);
                      }}
                    >
                      적용
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* HTML 미리보기 다이얼로그 */}
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>HTML 미리보기</DialogTitle>
                </DialogHeader>
                <div 
                  className="flex-1 min-h-0 p-4 border rounded-md overflow-auto"
                  dangerouslySetInnerHTML={{ __html: htmlSource }}
                />
                <DialogFooter>
                  <Button onClick={() => setPreviewDialogOpen(false)}>
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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