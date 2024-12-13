"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'
import ProductEditPage from "@/components/product-public-edit"
import { Label } from "@/components/ui/label"

interface ProductDetail {
  id: string
  variationsku: string
  name: string
  hscode: string
  barcode: string
  weight: number
  width: number
  length: number
  height: number
  memo: string
  thumbnailurl: string
  content: string
  contenthtml: string
  brandname: string
  purchaseprice: number
  consumerprice: number
  status: string
  color: string
  material: string
  noticeinfo: string
  size: string
  currentstock: number
  safetystock: number
  producturl: string
  supplyid: string
  supplyname: string
  categorymapid: string
  categoryid: string
  categorypath: string
  stocks: {
    nowstock: number
    safetystock: number
  }
}

interface ProductDetailProps {
  productId: string
}

// 옵션 타입 정의
interface ItemOption {
  label: string;
  price: number;
  stock: number;
  value: string;
  children: ItemOption[];
  optionNo: number;
  // 테이블 표시를 위한 추가 필드들
  variationsku?: string;
  groupname?: string;
  groupvalue?: string;
  consumerprice?: number;
  purchaseprice?: number;
  color?: string;
  size?: string;
  currentstock?: number;
  safetystock?: number;
  packageunit?: string;
}

// 인터페이스 추가
interface ItemImage {
  id: string
  index: number
  type: string
  url: string
  groupseq: number
  hasGroupAlias: boolean
  groupalias: string | null
  createdat: string
}

// 인터페이스 추가
interface NoticeInfo {
  [key: string]: string;
}

// Product 인터페이스 수정
interface Product {
  id: string
  name: string
  variationsku: string
  thumbnailurl: string
  stocks: {
    nowstock: number
    safetystock: number
  }
  // ... 다른 필드들
}

// priorityFields 배열 추가 (컴���트 외부에 선언)
const priorityFields = [
  '상품번호',
  '상품상태',
  '제조사',
  '브랜드',
  '모델명',
  '원산지',
  '제조일자',
  '유효기간',
  '치수',
  '색상',
  '제품소재',
  '취급주의사항',
  'KC인증정보'
];

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()
  const [productData, setProductData] = React.useState<ProductDetail | null>(null)
  const [optionData, setOptionData] = React.useState<ItemOption[]>([])
  const [thumbnailImages, setThumbnailImages] = React.useState<ItemImage[]>([])
  const [contentImages, setContentImages] = React.useState<ItemImage[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  // 옵션 데이터를 가져오는 부분 수정
  const fetchItemOptions = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('item_options_new')
        .select('modified_json')
        .eq('itemid', itemId);

      if (error) throw error;

      const options = data.map((option: any) => {
        const parsedOption = JSON.parse(option.modified_json);
        return {
          ...parsedOption,
          variationsku: parsedOption.value,
          groupname: parsedOption.label,
          groupvalue: parsedOption.value,
          consumerprice: parsedOption.price,
          purchaseprice: parsedOption.price,
          currentstock: parsedOption.stock,
          safetystock: 0,
          color: '-',
          size: '-',
          packageunit: '-'
        };
      });

      setOptionData(options);
      return options;
    } catch (error) {
      console.error('옵션 데이터 로딩 중 오류 발생:', error);
      return [];
    }
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = async (selectedOption: ItemOption) => {
    const optionId = selectedOption.optionNo;
    const itemId = productId;

    // 옵션 업데이트 API 호출
    try {
      await fetch(`/api/items/${itemId}/options/${optionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modified_json: {
            label: selectedOption.label,
            price: selectedOption.price,
            stock: selectedOption.stock,
            value: selectedOption.value,
            children: selectedOption.children,
            optionNo: selectedOption.optionNo
          }
        })
      });
    } catch (error) {
      console.error('옵션 업데이트 중 오류 발생:', error);
    }
  }

  // 옵션 렌더링 부분
  const renderOptions = (options: ItemOption[]) => {
    return options.map((option) => (
      <div key={option.optionNo}>
        <select 
          onChange={(e) => handleOptionSelect(JSON.parse(e.target.value))}
        >
          <option value="">선택하세요</option>
          {options.map((opt) => (
            <option 
              key={opt.optionNo}
              value={JSON.stringify(opt)}
            >
              {opt.label} {opt.price > 0 ? `(+${opt.price}원)` : ''} 
              {opt.stock <= 0 ? ' (품절)' : ''}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  // 이미지 데이터 조회 함수 수정
  const fetchImageData = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('item_images')
        .select(`
          id,
          index,
          type,
          url,
          groupseq,
          groupalias,
          createdat
        `)
        .eq('itemid', itemId)
        .eq('language', 'ko')
        .order('type')
        .order('index')
        .order('createdat')
        .order('groupseq')

      if (error) throw error

      console.log('Image Data:', data);

      // hasGroupAlias 필드 추가하여 데이터 변환
      const formattedData = data.map(img => ({
        ...img,
        hasGroupAlias: img.groupalias !== null
      }))

      // 이미지 타입별로 분류 (대문자로 변경)
      const thumbnails = formattedData.filter(img => img.type === 'THUMBNAIL')
      const contents = formattedData.filter(img => img.type === 'MAIN_CONTENT')

      console.log('Thumbnails:', thumbnails);
      console.log('Contents:', contents);

      setThumbnailImages(thumbnails)
      setContentImages(contents)
    } catch (error) {
      console.error('Failed to fetch images:', error)
    }
  }

  React.useEffect(() => {
    if (productId) {
      fetchProductDetail()
      fetchItemOptions(productId)
      fetchImageData(productId)
    }
  }, [productId])

  const fetchProductDetail = async () => {
    if (!productId) return;

    try {
      // 기본 상품 정보 조회
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          hscode,
          barcode,
          weight,
          width,
          length,
          height,
          memo,
          thumbnailurl,
          content,
          contenthtml,
          brandname,
          consumerprice,
          purchaseprice,
          noticeinfo,
          status,
          item_options!left (
            purchaseprice,
            color,
            material,
            size
          ),
          stocks!left (
            nowstock,
            safetystock
          ),
          company_supply!left (
            id,
            supplyname
          )
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      // 카테고리 정보 별도 조회
      const { data: categoryData, error: categoryError } = await supabase
        .from('item_category_maps')
        .select(`
          id,
          categoryid
        `)
        .eq('itemid', productId)
        .single()

      if (categoryError) {
        console.error('Failed to fetch category:', categoryError)
      }

      let categoryPath = '카테고리 정보 없음';
      if (categoryData) {
        const { data: categoryInfo, error: categoryInfoError } = await supabase
          .from('categories')
          .select('id, pathname')
          .eq('id', categoryData.categoryid)
          .single()
        
        if (categoryInfoError) {
          console.error('Failed to fetch category info:', categoryInfoError)
        } else {
          categoryPath = categoryInfo.pathname || '카테고리 정보 없음';
        }
      }

      console.log('Category Data:', categoryData); // 디버깅용 로그

      const formattedData: ProductDetail = {
        ...data,
        contenthtml: data.contenthtml || '',
        purchaseprice: data.purchaseprice || 0,
        color: data.item_options?.[0]?.color || '',
        material: data.item_options?.[0]?.material || '',
        size: data.item_options?.[0]?.size || '',
        stocks: {
          nowstock: data.stocks?.nowstock || 0,
          safetystock: data.stocks?.safetystock || 0
        },
        producturl: '',
        supplyid: data.company_supply?.id || '',
        supplyname: data.company_supply?.supplyname || '',
        categorymapid: categoryData?.id || '',
        categoryid: categoryData?.categoryid || '',
        categorypath: categoryPath
      }

      console.log('Formatted Data:', formattedData) // 디버깅용 로그

      setProductData(formattedData)
    } catch (error) {
      console.error('Failed to fetch product detail:', error)
    }
  }

  // 수정 버튼 핸들러 수정
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  if (!productData) return null

  return (
    <div className="container mx-auto py-2">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">기본 정보</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handleEdit}
            >
              수정
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">공급사</h3>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.supplyname}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">상품명</h3>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.name}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">카테고리</h3>
                <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.categorypath || '-'}</p>
              </div>
            </div>
            {thumbnailImages.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">상품 이미지</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {thumbnailImages.map((image, index) => (
                      <Dialog key={image.id}>
                        <DialogTrigger asChild>
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group max-h-[250px]">
                            <img
                              src={image.url}
                              alt={`상품 이미지 ${index + 1}`}
                              className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm">클릭하여 확대</span>
                            </div>
                            <span className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                              {index + 1}
                            </span>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-[70vw] max-h-[70vh] overflow-y-auto">
                          <div className="relative aspect-[3/4] max-h-[70vh]">
                            <img
                              src={image.url}
                              alt={`상품 이미지 ${index + 1}`}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              </>
            )}
            {contentImages.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">상세 이미지</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {contentImages.map((image, index) => (
                      <Dialog key={image.id}>
                        <DialogTrigger asChild>
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group max-h-[250px]">
                            <img
                              src={image.url}
                              alt={`상세 이미지 ${index + 1}`}
                              className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm">클릭하여 확대</span>
                            </div>
                            <span className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                              {index + 1}
                            </span>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-[70vw] max-h-[70vh] overflow-y-auto">
                          <div className="relative aspect-[3/4] max-h-[70vh]">
                            <img
                              src={image.url}
                              alt={`상세 이미지 ${index + 1}`}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">무게 / 크기</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">무게</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.weight || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">가로(Length)</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.length || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">세로(Width)</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.width || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">높이(Height)</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.height || '-'}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">가격 / 재고</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">공급가</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.consumerprice?.toLocaleString()} 원</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">판매가</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.purchaseprice?.toLocaleString()} 원</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">재고</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.stocks?.nowstock?.toLocaleString() || 0} 개</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">안전재고</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.stocks?.safetystock?.toLocaleString() || 0} 개</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">SKU</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.variationsku}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">HSCode</h4>
                  <p className="text-sm text-muted-foreground bg-gray-100 p-2 rounded">{productData.hscode || '-'}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">고시정보</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(() => {
                  // 기본값을 빈 객체로 설정
                  let noticeData: NoticeInfo = {};
                  
                  try {
                    // initialData가 있고 noticeinfo가 있을 때만 파싱 시도
                    if (productData?.noticeinfo) {
                      noticeData = JSON.parse(productData.noticeinfo);
                    }
                    console.log('Parsed Notice Data:', noticeData);
                  } catch (e) {
                    console.error('Failed to parse noticeinfo:', e);
                    // 파싱 실패시 빈 객체 유지
                    noticeData = {};
                  }

                  // 우선순위가 있는 필드를 먼저 표시
                  const priorityEntries = priorityFields
                    .filter(field => noticeData && noticeData[field])
                    .map(field => [field, noticeData[field]]);

                  // 나머지 필드 표시 (우선순위에 없는 필드들)
                  const otherEntries = Object.entries(noticeData || {})
                    .filter(([key]) => !priorityFields.includes(key))
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

                  const allEntries = [...priorityEntries, ...otherEntries];

                  return allEntries.length > 0 ? (
                    allEntries.map(([key, value], index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {key}
                        </Label>
                        <div className="text-sm font-medium break-words bg-gray-50 p-2 rounded">
                          {value}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-muted-foreground">
                      고시정보가 없습니다.
                    </div>
                  );
                })()}
              </div>
            </div>
            {optionData.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">옵션 정보</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left text-sm font-medium">옵션명</th>
                          <th className="p-2 text-left text-sm font-medium">옵션값</th>
                          <th className="p-2 text-left text-sm font-medium">가격</th>
                          <th className="p-2 text-left text-sm font-medium">재고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optionData.map((option) => (
                          <tr key={option.optionNo} className="border-b">
                            <td className="p-2 text-sm">{option.label}</td>
                            <td className="p-2 text-sm">{option.value}</td>
                            <td className="p-2 text-sm">{option.price?.toLocaleString()} 원</td>
                            <td className="p-2 text-sm">{option.stock?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[1600px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 수정</DialogTitle>
            <DialogDescription>
              상품 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          {productData && (
            <div className="p-6">
              <div className="space-y-8">
                <ProductEditPage
                  initialData={{
                    id: productData.id,
                    name: productData.name,
                    content: productData.content,
                    contenthtml: productData.contenthtml,
                    weight: productData.weight || 0,
                    width: productData.width || 0,
                    length: productData.length || 0,
                    height: productData.height || 0,
                    hscode: productData.hscode || '',
                    barcode: productData.barcode || '',
                    consumerprice: productData.consumerprice || 0,
                    status: productData.status || '',
                    size: productData.size || '',
                    color: productData.color || '',
                    material: productData.material || '',
                    options: optionData || [],
                    categorypath: productData.categorypath || '',
                    brandname: productData.brandname || '',
                    purchaseprice: productData.purchaseprice || 0,
                    currentstock: productData.currentstock || 0,
                    safetystock: productData.safetystock || 0,
                    supplyname: productData.supplyname || '',
                    noticeinfo: productData.noticeinfo || '',
                    memo: productData.memo || '',
                    thumbnailurl: productData.thumbnailurl || '',
                    variationsku: productData.variationsku || ''
                  }}
                  onSave={async (formData) => {
                    try {
                      // 1. 상품 기본 정보 업데이트
                      const { error } = await supabase
                        .from('items')
                        .update({
                          name: formData.name,
                          content: formData.content,
                          contenthtml: formData.contenthtml,
                          weight: formData.weight,
                          width: formData.width,
                          length: formData.length,
                          height: formData.height,
                          hscode: formData.hscode,
                          barcode: formData.barcode,
                          consumerprice: formData.consumerprice,
                          status: formData.status,
                          brandname: formData.brandname,
                          memo: formData.memo,
                          noticeinfo: formData.noticeinfo,
                          purchaseprice: formData.purchaseprice,
                          variationsku: formData.variationsku,
                          updatedat: new Date().toISOString()
                        })
                        .eq('id', productId);

                      if (error) throw error;

                      // 2. 옵션 정보 업데이트
                      if (formData.options) {
                        for (const option of formData.options) {
                          const { error: optionError } = await supabase
                            .from('item_options')
                            .update({
                              color: option.color,
                              size: option.size,
                              material: option.material,
                              purchaseprice: option.purchaseprice,
                              noticeinfo: option.noticeinfo,
                              groupname: option.groupname,
                              groupvalue: option.groupvalue,
                              packageunit: option.packageunit,
                              weightunit: option.weightunit,
                              updatedat: new Date().toISOString()
                            })
                            .eq('id', option.id);

                          if (optionError) throw optionError;
                        }
                      }

                      // 3. 상품 데이터 새로고침
                      await fetchProductDetail();
                      await fetchItemOptions(productId);
                      await fetchImageData(productId);

                      // 4. 다이얼로그 닫기
                      setIsEditDialogOpen(false);
                      
                      alert('상품 정보가 성공적으로 수정되었습니다.');
                    } catch (error) {
                      console.error('Failed to update product:', error);
                      alert('상품 수정에 실패했습니다.');
                    }
                  }}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
