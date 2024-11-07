import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CommonProductFieldsProps {
  product: any
  isEditing: boolean
  onFieldChange: (field: string, value: any) => void
}

export function CommonProductFields({ product, isEditing, onFieldChange }: CommonProductFieldsProps) {
  return (
    <div className="space-y-6">
      {/* 이미지 섹션 */}
      <div className="space-y-4">
        <div>
          <Label>메인 이미지</Label>
          {product.ImageUrl && (
            <img 
              src={product.ImageUrl} 
              alt="상품 이미지" 
              className="mt-2 max-h-[300px] object-contain mx-auto border rounded-lg"
            />
          )}
        </div>
        {product.OptionMainimage && (
          <div>
            <Label>옵션 이미지</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-[400px] overflow-y-auto">
              {product.OptionMainimage.split('$$').map((img: string, index: number) => {
                const imageUrl = img.split('||*')[1]
                return imageUrl ? (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={imageUrl}
                      alt={`옵션 이미지 ${index + 1}`}
                      className="w-full h-full object-contain border rounded-lg"
                    />
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>상품코드</Label>
          <Input value={product.ItemCode || '-'} readOnly />
        </div>
        <div>
          <Label>셀러코드</Label>
          <Input 
            value={product.SellerCode || '-'} 
            onChange={e => onFieldChange('SellerCode', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
        <div>
          <Label>상품명</Label>
          <Input 
            value={product.ItemTitle || product.ItemSeriesName || ''} 
            onChange={e => onFieldChange('ItemTitle', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>판매가</Label>
          <Input 
            type="number" 
            value={product.ItemPrice || 0} 
            onChange={e => onFieldChange('ItemPrice', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
        <div>
          <Label>정가</Label>
          <Input 
            type="number" 
            value={product.RetailPrice || 0} 
            onChange={e => onFieldChange('RetailPrice', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
        <div>
          <Label>세율</Label>
          <Input 
            type="number" 
            value={product.TaxRate || 0} 
            onChange={e => onFieldChange('TaxRate', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>배송비 코드</Label>
          <Input 
            value={product.ShippingNo || '-'} 
            onChange={e => onFieldChange('ShippingNo', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
        <div>
          <Label>무게</Label>
          <Input 
            value={`${product.Weight || 0} kg`} 
            onChange={e => onFieldChange('Weight', e.target.value)}
            readOnly={!isEditing} 
          />
        </div>
        <div>
          <Label>성인상품 여부</Label>
          <Input value={product.AdultYN === 'Y' ? '성인상품' : '일반상품'} readOnly />
        </div>
      </div>
    </div>
  )
} 