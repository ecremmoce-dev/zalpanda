import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface MoveProductFormProps {
  product: any
  isEditing: boolean
  onSave: (data: any) => void
}

export function MoveProductForm({ product, isEditing, onSave }: MoveProductFormProps) {
  return (
    <div className="space-y-6">
      {/* 무브상품 전용 필드들 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>시리즈명</Label>
          <Input value={product.ItemSeriesName || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>스타일 번호</Label>
          <Input value={product.StyleNumber || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>TPO 번호</Label>
          <Input value={product.TpoNumber || '-'} readOnly={!isEditing} />
        </div>
      </div>

      {/* 무브상품 옵션 정보 */}
      <div>
        <Label>옵션 정보</Label>
        <div className="grid grid-cols-2 gap-4">
          {product.OptionType?.split('$$').map((option: string, index: number) => {
            const [name, color, isDefault] = option.split('||*')
            return (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
                {isDefault === 'Y' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">기본</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 무브상품 세부 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>시즌</Label>
          <Input value={product.SeasonType?.replace('$$', ', ') || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>소재 정보</Label>
          <Input value={product.MaterialInfo || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>소재 번호</Label>
          <Input value={product.MaterialNumber?.replace('$$', ', ') || '-'} readOnly={!isEditing} />
        </div>
      </div>

      {/* 무브상품 세탁 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>세탁 방법</Label>
          <Input value={product.WashinginfoWashing || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>신축성</Label>
          <Input value={product.WashinginfoStretch || '-'} readOnly={!isEditing} />
        </div>
        <div>
          <Label>두께감</Label>
          <Input value={product.WashinginfoThickness || '-'} readOnly={!isEditing} />
        </div>
      </div>
    </div>
  )
} 