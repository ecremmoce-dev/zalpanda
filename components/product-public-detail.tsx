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
}

interface ProductDetailProps {
  productId: string
}

// 옵션 인터페이스 추가
interface ItemOption {
  id: string
  itemid: string
  variationsku: string
  consumerprice: number
  purchaseprice: number
  groupname: string
  groupvalue: string
  color: string
  material: string
  noticeinfo: string
  size: string
  voproductid: string
  expirationday: number
  feature: string
  packageunit: string
  weightunit: string
  createdat: string
  updatedat: string
  currentstock: number
  safetystock: number
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

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()
  const [productData, setProductData] = React.useState<ProductDetail | null>(null)
  const [optionData, setOptionData] = React.useState<ItemOption[]>([])
  const [thumbnailImages, setThumbnailImages] = React.useState<ItemImage[]>([])
  const [contentImages, setContentImages] = React.useState<ItemImage[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  // 옵션 데이터 조회 함수 수정
  const fetchOptionData = async (itemId: string) => {
    try {
      const { data: optionsData, error: optionsError } = await supabase
        .from('item_options')
        .select('*')
        .eq('itemid', itemId)

      if (optionsError) throw optionsError

      // 재고 정보는 items 테이블의 stocks에서 가져옴
      const { data: stockData } = await supabase
        .from('items')
        .select('stocks!left (nowstock, safetystock)')
        .eq('id', itemId)
        .single()

      const optionsWithStock = optionsData.map(option => ({
        ...option,
        currentstock: stockData?.stocks?.[0]?.nowstock || 0,
        safetystock: stockData?.stocks?.[0]?.safetystock || 0
      }))

      setOptionData(optionsWithStock)
    } catch (error) {
      console.error('Failed to fetch option data:', error)
    }
  }

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
      fetchOptionData(productId)
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
          brandname,
          consumerprice,
          status,
          item_options!left (
            purchaseprice,
            color,
            material,
            noticeinfo,
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
        purchaseprice: data.item_options?.[0]?.purchaseprice || 0,
        color: data.item_options?.[0]?.color || '',
        material: data.item_options?.[0]?.material || '',
        noticeinfo: data.item_options?.[0]?.noticeinfo || '',
        size: data.item_options?.[0]?.size || '',
        currentstock: data.stocks?.[0]?.nowstock || 0,
        safetystock: data.stocks?.[0]?.safetystock || 0,
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
          <CardTitle className="text-2xl font-bold">상품 상세</CardTitle>
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
                  <p className="text-sm text-muted-foreground">{productData.supplyname}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">상품명</h3>
                  <p className="text-sm text-muted-foreground">{productData.name}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">카테고리</h3>
                <p className="text-sm text-muted-foreground">{productData.categorypath || '-'}</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">무게 / 크기</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">무게</h4>
                  <p className="text-sm text-muted-foreground">{productData.weight || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">가로(Length)</h4>
                  <p className="text-sm text-muted-foreground">{productData.length || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">세로(Width)</h4>
                  <p className="text-sm text-muted-foreground">{productData.width || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">높이(Height)</h4>
                  <p className="text-sm text-muted-foreground">{productData.height || '-'}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">가격 / 재고</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">소비자가</h4>
                  <p className="text-sm text-muted-foreground">{productData.consumerprice?.toLocaleString()}원</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">구매가</h4>
                  <p className="text-sm text-muted-foreground">{productData.purchaseprice?.toLocaleString()}원</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">재고</h4>
                  <p className="text-sm text-muted-foreground">{productData.currentstock?.toLocaleString()}개</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">안전재고</h4>
                  <p className="text-sm text-muted-foreground">{productData.safetystock?.toLocaleString()}개</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">SKU</h4>
                  <p className="text-sm text-muted-foreground">{productData.variationsku}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">HSCode</h4>
                  <p className="text-sm text-muted-foreground">{productData.hscode || '-'}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">고시정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">사이즈</h4>
                  <p className="text-sm text-muted-foreground">{productData.size || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">색상</h4>
                  <p className="text-sm text-muted-foreground">{productData.color || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">소재</h4>
                  <p className="text-sm text-muted-foreground">{productData.material || '-'}</p>
                </div>
              </div>
            </div>
            {thumbnailImages.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">상품 이미지</h3>
                  <Carousel className="w-full max-w-xl mx-auto">
                    <CarouselContent>
                      {thumbnailImages.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <div className="p-1">
                            <div className="relative aspect-square overflow-hidden rounded-lg">
                              <img
                                src={image.url}
                                alt={`상품 이미지 ${index + 1}`}
                                className="object-contain w-full h-full max-h-[300px]"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
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
                        <DialogContent className="max-w-2xl">
                          <div className="relative aspect-[3/4] max-h-[600px]">
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
            {optionData.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">옵션 정보</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left text-sm font-medium">SKU</th>
                          <th className="p-2 text-left text-sm font-medium">옵션그룹</th>
                          <th className="p-2 text-left text-sm font-medium">옵션값</th>
                          <th className="p-2 text-left text-sm font-medium">소비자가</th>
                          <th className="p-2 text-left text-sm font-medium">구매가</th>
                          <th className="p-2 text-left text-sm font-medium">색상</th>
                          <th className="p-2 text-left text-sm font-medium">사이즈</th>
                          <th className="p-2 text-left text-sm font-medium">재고</th>
                          <th className="p-2 text-left text-sm font-medium">안전재고</th>
                          <th className="p-2 text-left text-sm font-medium">포장단위</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optionData.map((option) => (
                          <tr key={option.id} className="border-b">
                            <td className="p-2 text-sm">{option.variationsku || '-'}</td>
                            <td className="p-2 text-sm">{option.groupname || '-'}</td>
                            <td className="p-2 text-sm">{option.groupvalue || '-'}</td>
                            <td className="p-2 text-sm">{option.consumerprice?.toLocaleString()}원</td>
                            <td className="p-2 text-sm">{option.purchaseprice?.toLocaleString()}원</td>
                            <td className="p-2 text-sm">{option.color || '-'}</td>
                            <td className="p-2 text-sm">{option.size || '-'}</td>
                            <td className="p-2 text-sm">{option.currentstock?.toLocaleString()}</td>
                            <td className="p-2 text-sm">{option.safetystock?.toLocaleString()}</td>
                            <td className="p-2 text-sm">{option.packageunit || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {optionData.some(option => option.feature) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">특징</h4>
                      {optionData.map(option => option.feature && (
                        <p key={option.id} className="text-sm text-muted-foreground">{option.feature}</p>
                      ))}
                    </div>
                  )}
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
                  initialData={productData}
                  onSave={async (formData) => {
                    try {
                      const { error } = await supabase
                        .from('items')
                        .update({
                          name: formData.name,
                          content: formData.content,
                          weight: formData.weight,
                          width: formData.width,
                          length: formData.length,
                          height: formData.height,
                          hscode: formData.hscode,
                          barcode: formData.barcode,
                          consumerprice: formData.consumerprice,
                          status: formData.status,
                        })
                        .eq('id', productId);

                      if (error) throw error;

                      // 옵션 정보 업데이트
                      if (formData.options) {
                        for (const option of formData.options) {
                          const { error: optionError } = await supabase
                            .from('item_options')
                            .update({
                              color: option.color,
                              size: option.size,
                              material: option.material,
                              purchaseprice: option.purchaseprice,
                            })
                            .eq('id', option.id);

                          if (optionError) throw optionError;
                        }
                      }

                      alert('상품 정보가 성공적으로 수정되었습니다.');
                      setIsEditDialogOpen(false);
                      // 상품 정보 새로고침
                      fetchProductDetail();
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
