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

interface NormalProductEditorProps {
  product: DetailProduct
  onSave: (product: DetailProduct) => void
  onCancel: () => void
  onApplyToQoo10?: () => void
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">대표 이미지</h3>
              <div className="flex gap-6">
                <div className="w-[300px] h-[300px] border rounded-lg overflow-hidden">
                  {editedProduct.ImageUrl ? (
                    <img 
                      src={editedProduct.ImageUrl} 
                      alt="상품 대표 이미지" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>이미지 URL</Label>
                      <Input 
                        value={editedProduct.ImageUrl || ''} 
                        onChange={(e) => handleFieldChange('ImageUrl', e.target.value)}
                        placeholder="이미지 URL을 입력하세요"
                        className="w-[400px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>이미지 업로드</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          // 이미지 업로드 처리
                          if (e.target.files && e.target.files[0]) {
                            // TODO: 이미지 업로드 API 호출
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="space-y-2">
                  <Label>상품코드</Label>
                  <Input value={editedProduct.ItemCode} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>셀러코드</Label>
                  <Input value={editedProduct.SellerCode} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>상품명</Label>
                  <Input 
                    value={editedProduct.ItemTitle} 
                    onChange={(e) => handleFieldChange('ItemTitle', e.target.value)}
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
                  <Label>판매상태</Label>
                  <Select 
                    value={editedProduct.ItemStatus}
                    onValueChange={(value) => handleFieldChange('ItemStatus', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">거래대기</SelectItem>
                      <SelectItem value="S2">거래가능</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">카테고리 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>메인카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.MainCatCd} className="w-1/3" readOnly />
                      <Input value={editedProduct.MainCatNm} className="w-2/3" readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>서브카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.FirstSubCatCd} className="w-1/3" readOnly />
                      <Input value={editedProduct.FirstSubCatNm} className="w-2/3" readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>세컨서브카테고리</Label>
                    <div className="flex gap-2">
                      <Input value={editedProduct.SecondSubCatCd} className="w-1/3" readOnly />
                      <Input value={editedProduct.SecondSubCatNm} className="w-2/3" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">가격/재고 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>판매가</Label>
                    <Input type="number" value={editedProduct.ItemPrice} />
                  </div>

                  <div className="space-y-2">
                    <Label>소비세율</Label>
                    <Input value={editedProduct.TaxRate} />
                  </div>

                  <div className="space-y-2">
                    <Label>공급원가</Label>
                    <Input type="number" value={editedProduct.RetailPrice} />
                  </div>

                  <div className="space-y-2">
                    <Label>정산가격</Label>
                    <Input type="number" value={editedProduct.SettlePrice} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label>재고수량</Label>
                    <Input type="number" value={editedProduct.ItemQty} />
                  </div>

                  <div className="space-y-2">
                    <Label>판매종료일</Label>
                    <Input type="date" value={editedProduct.ExpireDate?.split('T')[0]} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">상품 상세 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>제품번호</Label>
                    <Input value={editedProduct.ModelNM} />
                  </div>

                  <div className="space-y-2">
                    <Label>제조사명</Label>
                    <Input value={editedProduct.ManufacturerDate} />
                  </div>

                  <div className="space-y-2">
                    <Label>브랜드번호</Label>
                    <Input value={editedProduct.BrandNo} />
                  </div>

                  <div className="space-y-2">
                    <Label>소재</Label>
                    <Input value={editedProduct.Material} />
                  </div>

                  <div className="space-y-2">
                    <Label>성인상품 여부</Label>
                    <Select value={editedProduct.AdultYN}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">예</SelectItem>
                        <SelectItem value="N">아니오</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">배송 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>희망배송일</Label>
                    <Input type="number" value={editedProduct.DesiredShippingDate} min="0" max="20" />
                  </div>

                  <div className="space-y-2">
                    <Label>발송가능일 유형</Label>
                    <Select value={editedProduct.AvailableDateType}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label>발송가능일 상세</Label>
                    <Input value={editedProduct.AvailableDateValue} />
                  </div>

                  <div className="space-y-2">
                    <Label>배송비코드</Label>
                    <Input value={editedProduct.ShippingNo} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">원산지/코드 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>원산지 유형</Label>
                    <Select value={editedProduct.ProductionPlaceType}>
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
                    <Label>원산지</Label>
                    <Input value={editedProduct.ProductionPlace} />
                  </div>

                  <div className="space-y-2">
                    <Label>산업코드 유형</Label>
                    <Select value={editedProduct.IndustrialCodeType}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label>산업코드</Label>
                    <Input value={editedProduct.IndustrialCode} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기타 정보</h3>
                
                <div className="space-y-2">
                  <Label>연락처</Label>
                  <Input value={editedProduct.ContactInfo} />
                </div>

                <div className="space-y-2">
                  <Label>동영상 URL</Label>
                  <Input value={editedProduct.VideoURL} />
                </div>

                <div className="space-y-2">
                  <Label>검색 키워드</Label>
                  <Input value={editedProduct.Keyword} />
                </div>

                <div className="space-y-2">
                  <Label>등록일</Label>
                  <Input value={editedProduct.ListedDate} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>수정일</Label>
                  <Input value={editedProduct.ChangedDate} readOnly />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "options" && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">옵션 목록</h3>
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // 옵션 추가 로직
                  }}
                >
                  옵션 추가
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>옵션명1</TableHead>
                  <TableHead>옵션값1</TableHead>
                  <TableHead>옵션명2</TableHead>
                  <TableHead>옵션값2</TableHead>
                  <TableHead>옵션명3</TableHead>
                  <TableHead>옵션값3</TableHead>
                  <TableHead className="text-right">가격</TableHead>
                  <TableHead className="text-right">수량</TableHead>
                  <TableHead>상품타입코드</TableHead>
                  {isEditing && <TableHead>관리</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedProduct.Options?.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.name1 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, name1: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.name1 || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.value1 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, value1: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.value1 || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.name2 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, name2: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.name2 || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.value2 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, value2: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.value2 || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.name3 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, name3: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.name3 || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={option.value3 || ''} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, value3: e.target.value } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.value3 || '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input 
                          type="number"
                          value={option.price} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, price: Number(e.target.value) } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.price.toLocaleString()
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input 
                          type="number"
                          value={option.qty} 
                          onChange={(e) => {
                            const updatedOptions = editedProduct.Options?.map(opt => 
                              opt.id === option.id ? { ...opt, qty: Number(e.target.value) } : opt
                            )
                            handleFieldChange('Options', updatedOptions)
                          }}
                        />
                      ) : (
                        option.qty.toLocaleString()
                      )}
                    </TableCell>
                    <TableCell>{option.itemTypeCode || '-'}</TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const updatedOptions = editedProduct.Options?.filter(opt => opt.id !== option.id)
                            handleFieldChange('Options', updatedOptions)
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