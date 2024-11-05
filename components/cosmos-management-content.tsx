'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Company {
  Id: string
  Name: string
}

interface Platform {
  Id: string
  CompanyId: string
  Platform: string
  SellerId: string
  IsActive: boolean
}

interface CosmosProduct {
  id: string
  ItemCode: string
  Flag: string
  ItemTitle: string
  ItemPrice: number
  ItemQty: number
  ItemStatus: string
  SellerCode: string
  LastSyncDate: string
}

interface Option {
  id: string;
  name1: string | null;
  value1: string | null;
  name2: string | null;
  value2: string | null;
  name3: string | null;
  value3: string | null;
  name4: string | null;
  value4: string | null;
  name5: string | null;
  value5: string | null;
  price: number;
  qty: number;
  itemTypeCode: string | null;
  flag: string;
  createdAt: string;
  updatedAt: string;
}

interface DetailProduct extends CosmosProduct {
  ItemDetail: string
  ImageUrl: string
  OptionMainimage: string
  OptionType: string
  OptionQty: string
  BrandNo: string
  RetailPrice: number
  ShippingNo: string
  Weight: number
  OriginCountryId: string
  SeasonType: string
  Keyword: string
  AttributeInfo: string
  options: Option[];
}

export function CosmosManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)

  const [products, setProducts] = useState<CosmosProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [selectedProduct, setSelectedProduct] = useState<DetailProduct | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

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
    } else {
      setProducts([])
      setTotalItems(0)
    }
  }, [selectedCompany, selectedPlatform, selectedTab, page])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/company')
      const data = await response.json()
      if (Array.isArray(data)) {
        setCompanies(data)
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  const fetchPlatforms = async (companyId: string) => {
    try {
      const response = await fetch(`/api/company/${companyId}/platform`)
      if (!response.ok) {
        throw new Error('Failed to fetch platforms')
      }
      const data = await response.json()
      setPlatforms(data)
    } catch (error) {
      console.error('Failed to fetch platforms:', error)
      setPlatforms([])
    }
  }

  const fetchProducts = async () => {
    if (!selectedCompany || !selectedPlatform) return

    setIsLoading(true)
    try {
      const flag = selectedTab === 'all' ? '' : selectedTab
      const response = await fetch(
        `/api/qoo10/cosmos/products?companyId=${selectedCompany}&platformId=${selectedPlatform}&page=${page}&flag=${flag}`
      )
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.items)
        setTotalPages(data.totalPages)
        setTotalItems(data.total)
      } else {
        console.error('Failed to fetch products:', data.error)
        setProducts([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncToCosmos = async () => {
    if (!selectedCompany || !selectedPlatform) {
      alert('업체와 플랫폼을 선택해주세요.')
      return
    }

    setIsSyncing(true)
    try {
      const response = await fetch('/api/qoo10/cosmos/sync', {
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
        throw new Error('Failed to sync with Cosmos DB')
      }

      const result = await response.json()
      alert(`Cosmos DB 동기화가 완료되었습니다. 총 ${result.totalProducts}개의 상품이 동기화되었습니다.`)
    } catch (error) {
      console.error('Failed to sync with Cosmos DB:', error)
      alert('Cosmos DB 동기화에 실패했습니다.')
    } finally {
      setIsSyncing(false)
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

  const handleEditClick = async (itemCode: string) => {
    try {
      const response = await fetch(`/api/qoo10/cosmos/products/${itemCode}`)
      if (!response.ok) throw new Error('상품 조회에 실패했습니다.')
      
      const product = await response.json()
      setSelectedProduct(product)
      setIsDetailDialogOpen(true)
    } catch (error) {
      console.error('상품 조회 실패:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <div className="w-[200px]">
          <Select
            value={selectedCompany}
            onValueChange={(value) => {
              setSelectedCompany(value)
              setSelectedPlatform('')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="업체 선택" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
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
          onClick={handleSyncToCosmos}
          disabled={!selectedCompany || !selectedPlatform || isSyncing}
          className="ml-2"
        >
          {isSyncing ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Cosmos DB 동기화 중...
            </>
          ) : (
            <>
              <span className="mr-2">↻</span>
              Cosmos DB 동기화
            </>
          )}
        </Button>
      </div>

      {selectedCompany && selectedPlatform && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="all">
              전체 ({totalItems})
            </TabsTrigger>
            <TabsTrigger value="NONE">
              일반 상품 ({products?.filter(p => p.Flag === 'NONE').length || 0})
            </TabsTrigger>
            <TabsTrigger value="MOVE">
              무브 상품 ({products?.filter(p => p.Flag === 'MOVE').length || 0})
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 border rounded-lg">
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
                  <TableHead>최종 동기화</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        데이터를 불러오는 중...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !products || products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.ItemCode}</TableCell>
                      <TableCell>{product.SellerCode || '-'}</TableCell>
                      <TableCell>{product.ItemTitle}</TableCell>
                      <TableCell className="text-right">
                        {product.ItemPrice?.toLocaleString() || 0}원
                      </TableCell>
                      <TableCell className="text-right">
                        {product.ItemQty?.toLocaleString() || 0}
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
                        {new Date(product.LastSyncDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(product.ItemCode)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="py-2 px-4">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        </Tabs>
      )}

      {/* 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 상세 정보 ({selectedProduct?.Flag === 'MOVE' ? '무브 상품' : '일반 상품'})</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* 이미지 섹션 */}
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

              {/* 기본 정보 섹션 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상품코드</Label>
                  <Input value={selectedProduct.ItemCode} readOnly />
                  <Label>상품명</Label>
                  <Input value={selectedProduct.ItemTitle} readOnly />
                  <Label>브랜드 번호</Label>
                  <Input value={selectedProduct.BrandNo || '-'} readOnly />
                </div>
                <div>
                  <Label>판매가</Label>
                  <Input value={selectedProduct.ItemPrice.toLocaleString()} readOnly />
                  <Label>재고</Label>
                  <Input value={selectedProduct.ItemQty.toLocaleString()} readOnly />
                  <Label>배송비 코드</Label>
                  <Input value={selectedProduct.ShippingNo || '-'} readOnly />
                </div>
              </div>

              {/* 옵션 정보 섹션 */}
              {selectedProduct.OptionType && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">옵션 정보</h3>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProduct.OptionType.split('$$').map((option: string, index: number) => {
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
              )}

              {/* 상세 설명 */}
              <div>
                <Label>상품 상세설명</Label>
                <div 
                  className="border rounded-lg p-4 min-h-[200px] bg-white"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.ItemDetail }}
                />
              </div>

              {/* 추가 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>원산지</Label>
                  <Input value={selectedProduct.OriginCountryId || '-'} readOnly />
                </div>
                <div>
                  <Label>시즌</Label>
                  <Input value={selectedProduct.SeasonType?.replace('$$', ', ') || '-'} readOnly />
                </div>
                <div>
                  <Label>키워드</Label>
                  <Input value={selectedProduct.Keyword || '-'} readOnly />
                </div>
              </div>

              {/* 옵션 정보 테이블 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">옵션 정보</h3>
                <div className="border rounded-lg p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">옵션1</th>
                        <th className="px-4 py-2 text-left">값1</th>
                        <th className="px-4 py-2 text-left">옵션2</th>
                        <th className="px-4 py-2 text-left">값2</th>
                        <th className="px-4 py-2 text-right">가격</th>
                        <th className="px-4 py-2 text-right">수량</th>
                        <th className="px-4 py-2 text-left">코드</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.options?.map((option, index) => (
                        <tr key={option.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{option.name1 || '-'}</td>
                          <td className="px-4 py-2">{option.value1 || '-'}</td>
                          <td className="px-4 py-2">{option.name2 || '-'}</td>
                          <td className="px-4 py-2">{option.value2 || '-'}</td>
                          <td className="px-4 py-2 text-right">
                            {option.price?.toLocaleString() || 0}원
                          </td>
                          <td className="px-4 py-2 text-right">
                            {option.qty?.toLocaleString() || 0}
                          </td>
                          <td className="px-4 py-2">{option.itemTypeCode || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 옵션 요약 정보 */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">총 옵션 수</h4>
                    <p className="text-2xl">{selectedProduct.options?.length || 0}개</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">총 재고 수량</h4>
                    <p className="text-2xl">
                      {selectedProduct.options?.reduce((sum, opt) => sum + (opt.qty || 0), 0).toLocaleString()}개
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">옵션 유형</h4>
                    <p className="text-2xl">{selectedProduct.Flag === 'MOVE' ? '무브' : '일반'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 