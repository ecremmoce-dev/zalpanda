'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { RefreshCw, Edit } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Company {
  Id: string
  Name: string
  platforms?: Platform[]
}

interface Platform {
  Id: string
  CompanyId: string
  Platform: string
  SellerId: string
  IsActive: boolean
}

interface Product {
  ItemCode: string
  ItemTitle: string
  ItemPrice: number
  ItemQty: number
  ItemStatus: string
  Flag: string
  SellerCode: string
  CreatedAt: string
  LastFetchDate: string
}

export function ProductManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedTab, setSelectedTab] = useState('all')
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchPlatforms(selectedCompany)
    } else {
      setPlatforms([])
      setSelectedPlatform('')
    }
  }, [selectedCompany])

  useEffect(() => {
    if (selectedCompany && selectedPlatform) {
      fetchProducts()
    }
  }, [selectedCompany, selectedPlatform])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/company')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setCompanies(data)
      } else {
        console.error('Expected array of companies but got:', data)
        setCompanies([])
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      setCompanies([])
    }
  }

  const fetchPlatforms = async (companyId: string) => {
    try {
      const response = await fetch(`/api/company/${companyId}/platform`)
      const data = await response.json()
      setPlatforms(data)
    } catch (error) {
      console.error('Failed to fetch platforms:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/qoo10/products?companyId=${selectedCompany}&platformId=${selectedPlatform}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncProducts = async () => {
    if (!selectedCompany || !selectedPlatform) {
      alert('업체와 플랫폼을 택해주세요.')
      return
    }

    setIsSyncing(true)
    try {
      const response = await fetch(`/api/qoo10/products/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          platformId: selectedPlatform
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync products')
      }

      const result = await response.json()
      console.log('동기화 결과:', result)
      alert(`상품 동기화가 완료되었습니다. 총 ${result.totalProducts}개의 상품이 동기화되었습니다.`)
      fetchProducts() // 상품 목록 새로고침
    } catch (error) {
      console.error('Failed to sync products:', error)
      alert('상품 동기화에 실패했습니다.')
    } finally {
      setIsSyncing(false)
    }
  }

  const getFilteredProducts = () => {
    switch (selectedTab) {
      case 'none':
        return products.filter(p => p.Flag === 'NONE')
      case 'move':
        return products.filter(p => p.Flag === 'MOVE')
      default:
        return products
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'S2':
        return 'bg-green-100 text-green-800'
      case 'S1':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditProduct = async (itemCode: string, flag: string) => {
    try {
      const response = await fetch(`/api/qoo10/products/${itemCode}?flag=${flag}`)
      const data = await response.json()
      setSelectedProduct(data)
      setIsDetailDialogOpen(true)
    } catch (error) {
      console.error('Failed to fetch product details:', error)
    }
  }

  // 상품 상세 정보 수정을 위한 핸들러 추가
  const handleProductDetailChange = (field: string, value: any) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [field]: value
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">상품 관리</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-[200px]">
          <Select
            value={selectedCompany}
            onValueChange={setSelectedCompany}
          >
            <SelectTrigger>
              <SelectValue placeholder="업체 선택" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(companies) && companies.map((company) => (
                <SelectItem key={company.Id} value={company.Id}>
                  {company.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}
            disabled={!selectedCompany || platforms.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="플랫폼 선택" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.Id} value={platform.Id}>
                  {platform.Platform} ({platform.SellerId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSyncProducts}
          disabled={!selectedCompany || !selectedPlatform || isSyncing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '동기화 중...' : 'QOO10 상품 동기화'}
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            전체 ({products.length})
          </TabsTrigger>
          <TabsTrigger value="none">
            일반 상품 ({products.filter(p => p.Flag === 'NONE').length})
          </TabsTrigger>
          <TabsTrigger value="move">
            무브 상품 ({products.filter(p => p.Flag === 'MOVE').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품코드</TableHead>
                  <TableHead>셀러코드</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead className="text-right">판매가</TableHead>
                  <TableHead className="text-right">재고</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>구분</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>최종 동기화</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredProducts().map((product) => (
                  <TableRow key={product.ItemCode}>
                    <TableCell>{product.ItemCode}</TableCell>
                    <TableCell>{product.SellerCode || '-'}</TableCell>
                    <TableCell>{product.ItemTitle}</TableCell>
                    <TableCell className="text-right">
                      {product.ItemPrice ? product.ItemPrice.toLocaleString() : 0}원
                    </TableCell>
                    <TableCell className="text-right">
                      {product.ItemQty ? product.ItemQty.toLocaleString() : 0}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(product.ItemStatus)}`}>
                        {product.ItemStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.Flag === 'MOVE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.Flag === 'MOVE' ? '무브' : '일반'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.CreatedAt ? new Date(product.CreatedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {product.LastFetchDate ? new Date(product.LastFetchDate).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product.ItemCode, product.Flag)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        수정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 상세 정보 ({selectedProduct?.Flag === 'MOVE' ? '무브 상품' : '일반 상품'})</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">대표 이미지</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>메인 이미지</Label>
                    {selectedProduct.ImageUrl && (
                      <img 
                        src={selectedProduct.ImageUrl} 
                        alt="상품 이미지" 
                        className="mt-2 max-h-[300px] object-contain mx-auto border rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <Label>옵션 이미지</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-[400px] overflow-y-auto">
                      {selectedProduct.OptionMainimage?.split('$$').map((img: string, index: number) => {
                        const imageUrl = img.split('||*')[1]
                        return imageUrl ? (
                          <div key={index} className="relative aspect-square">
                            <img 
                              src={imageUrl}
                              alt={`옵션 이미지 ${index + 1}`}
                              className="w-full h-full object-cover border rounded"
                            />
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>상품코드</Label>
                    <Input value={selectedProduct.ItemCode} readOnly />
                  </div>
                  <div>
                    <Label>셀러코드</Label>
                    <Input value={selectedProduct.SellerCode || '-'} readOnly />
                  </div>
                  <div>
                    <Label>상품명</Label>
                    <Input value={selectedProduct.ItemTitle || selectedProduct.ItemSeriesName || ''} readOnly />
                  </div>
                  <div>
                    <Label>브랜드 번호</Label>
                    <Input value={selectedProduct.BrandNo || '-'} readOnly />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>판매가</Label>
                    <Input type="number" value={selectedProduct.ItemPrice || 0} readOnly />
                  </div>
                  <div>
                    <Label>정가</Label>
                    <Input type="number" value={selectedProduct.RetailPrice || 0} readOnly />
                  </div>
                  <div>
                    <Label>배송비 코드</Label>
                    <Input value={selectedProduct.ShippingNo || '-'} readOnly />
                  </div>
                  <div>
                    <Label>무게</Label>
                    <Input value={`${selectedProduct.Weight || 0} kg`} readOnly />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">옵션 정보</h3>
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {selectedProduct.OptionType?.split('$$').map((option: string, index: number) => {
                      const [name, color, isDefault] = option.split('||*')
                      return (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>원산지 유형</Label>
                  <Input value={selectedProduct.OriginType || '-'} readOnly />
                </div>
                <div>
                  <Label>원산지 국가</Label>
                  <Input value={selectedProduct.OriginCountryId || '-'} readOnly />
                </div>
                <div>
                  <Label>시즌</Label>
                  <Input value={selectedProduct.SeasonType?.replace('$$', ', ') || '-'} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>상품 상세설명</Label>
                <div 
                  className="border rounded-lg p-4 min-h-[200px] bg-white"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.ItemDescription || '' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>키워드</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProduct.Keyword?.split(',').map((keyword: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>속성 정보</Label>
                  <Input value={selectedProduct.AttributeInfo || '-'} readOnly />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 