import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface NormalProductFormProps {
  product: any
  isEditing: boolean
  onSave: (data: any) => void
}

export function NormalProductForm({ product, isEditing, onSave }: NormalProductFormProps) {
  return (
    <div className="space-y-6">
      {/* 일반상품 전용 필드들 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>메인 카테고리</Label>
          <div className="flex gap-2">
            <Input value={product.MainCatCd || '-'} readOnly />
            <Input value={product.MainCatNm || '-'} readOnly />
          </div>
        </div>
        <div>
          <Label>서브 카테고리</Label>
          <div className="flex gap-2">
            <Input value={product.FirstSubCatCd || '-'} readOnly />
            <Input value={product.FirstSubCatNm || '-'} readOnly />
          </div>
        </div>
        <div>
          <Label>세컨드 카테고리</Label>
          <div className="flex gap-2">
            <Input value={product.SecondSubCatCd || '-'} readOnly />
            <Input value={product.SecondSubCatNm || '-'} readOnly />
          </div>
        </div>
      </div>

      {/* 일반상품 추가 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>모델명</Label>
          <Input value={product.ModelNM || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>제조일자</Label>
          <Input value={product.ManufacturerDate || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>소재</Label>
          <Input value={product.Material || '-'} readOnly={!isEditing} />
        </div>
      </div>
    </div>
  )
} 