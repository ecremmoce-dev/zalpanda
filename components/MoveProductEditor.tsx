import { useState } from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// React-Quill 동적 임포트
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false }
)

interface MoveProductEditorProps {
  product: any
  onSave: (product: any) => void
  onCancel: () => void
}

export default function MoveProductEditor({ product, onSave, onCancel }: MoveProductEditorProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [editedProduct, setEditedProduct] = useState(product)

  const handleFieldChange = (field: string, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>무브상품 수정 - {product.ItemCode}</DialogTitle>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="option">옵션 정보</TabsTrigger>
          <TabsTrigger value="detail">상세 설명</TabsTrigger>
          <TabsTrigger value="additional">추가 정보</TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        {activeTab === 'basic' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>상품명</Label>
                <Input
                  value={editedProduct.ItemSeriesName}
                  onChange={(e) => handleFieldChange('ItemSeriesName', e.target.value)}
                />
              </div>
              <div>
                <Label>프로모션명</Label>
                <Input
                  value={editedProduct.PromotionName}
                  onChange={(e) => handleFieldChange('PromotionName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>판매가</Label>
                <Input
                  type="number"
                  value={editedProduct.ItemPrice}
                  onChange={(e) => handleFieldChange('ItemPrice', e.target.value)}
                />
              </div>
              <div>
                <Label>정가</Label>
                <Input
                  type="number"
                  value={editedProduct.RetailPrice}
                  onChange={(e) => handleFieldChange('RetailPrice', e.target.value)}
                />
              </div>
              <div>
                <Label>세율</Label>
                <Input
                  type="number"
                  value={editedProduct.TaxRate}
                  onChange={(e) => handleFieldChange('TaxRate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>스타일 번호</Label>
                <Input
                  value={editedProduct.StyleNumber}
                  onChange={(e) => handleFieldChange('StyleNumber', e.target.value)}
                />
              </div>
              <div>
                <Label>TPO 번호</Label>
                <Input
                  value={editedProduct.TpoNumber}
                  onChange={(e) => handleFieldChange('TpoNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 옵션 정보 탭 */}
        {activeTab === 'option' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>옵션 타입</Label>
                <Input
                  value={editedProduct.OptionType}
                  onChange={(e) => handleFieldChange('OptionType', e.target.value)}
                />
              </div>
              <div>
                <Label>옵션 수량</Label>
                <Input
                  value={editedProduct.OptionQty}
                  onChange={(e) => handleFieldChange('OptionQty', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>옵션 메인 이미지</Label>
              <Input
                value={editedProduct.OptionMainimage}
                onChange={(e) => handleFieldChange('OptionMainimage', e.target.value)}
              />
            </div>

            <div>
              <Label>옵션 서브 이미지</Label>
              <Input
                value={editedProduct.OptionSubimage}
                onChange={(e) => handleFieldChange('OptionSubimage', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 상세 설명 탭 */}
        {activeTab === 'detail' && (
          <div className="space-y-4 py-4">
            <div>
              <Label>상세 설명</Label>
              <ReactQuill
                value={editedProduct.ItemDescription}
                onChange={(value) => handleFieldChange('ItemDescription', value)}
                className="h-[400px] mb-12"
              />
            </div>
          </div>
        )}

        {/* 추가 정보 탭 */}
        {activeTab === 'additional' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>소재 정보</Label>
                <Input
                  value={editedProduct.MaterialInfo}
                  onChange={(e) => handleFieldChange('MaterialInfo', e.target.value)}
                />
              </div>
              <div>
                <Label>소재 번호</Label>
                <Input
                  value={editedProduct.MaterialNumber}
                  onChange={(e) => handleFieldChange('MaterialNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>속성 정보</Label>
                <Input
                  value={editedProduct.AttributeInfo}
                  onChange={(e) => handleFieldChange('AttributeInfo', e.target.value)}
                />
              </div>
              <div>
                <Label>시즌 타입</Label>
                <Input
                  value={editedProduct.SeasonType}
                  onChange={(e) => handleFieldChange('SeasonType', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>세탁 정보</Label>
                <Input
                  value={editedProduct.WashinginfoWashing}
                  onChange={(e) => handleFieldChange('WashinginfoWashing', e.target.value)}
                />
              </div>
              <div>
                <Label>신축성</Label>
                <Input
                  value={editedProduct.WashinginfoStretch}
                  onChange={(e) => handleFieldChange('WashinginfoStretch', e.target.value)}
                />
              </div>
              <div>
                <Label>비침</Label>
                <Input
                  value={editedProduct.WashinginfoSeethrough}
                  onChange={(e) => handleFieldChange('WashinginfoSeethrough', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={() => onSave(editedProduct)}>
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  )
} 