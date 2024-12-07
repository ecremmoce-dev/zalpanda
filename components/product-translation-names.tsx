"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, X, ExternalLink, ChevronUp } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";

type CountryLanguagePair = {
  country: string;
  language: string;
}

type PlatformSelection = {
  platform: string;
  countryLanguagePairs: CountryLanguagePair[];
}

const initialPlatformSelections: PlatformSelection[] = [
  {
    platform: '',
    countryLanguagePairs: [
      { country: '', language: '' },
      { country: '', language: '' }
    ]
  },
  {
    platform: '',
    countryLanguagePairs: [
      { country: '', language: '' },
      { country: '', language: '' },
      { country: '', language: '' }
    ]
  },
  {
    platform: '',
    countryLanguagePairs: [
      { country: '', language: '' }
    ]
  }
]

export default function ProductTranslation() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [platformSelections, setPlatformSelections] = useState<PlatformSelection[]>(initialPlatformSelections)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [isSupplierCardExpanded, setIsSupplierCardExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState('product-name')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [nameFilter, setNameFilter] = useState('')
  const [categories, setCategories] = useState(['전체', '자동차용품', '스포츠용품', '서비스'])
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // 페이지당 아이템 수

  const { user } = useUserDataStore();

  useEffect(() => {
    if (user) fetchSupplierData(user!.companyid)
  }, [user])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error;
      
      setSupplierData(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProductData = async (itemCustomerId: string, companyid: string) => {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        stocks!inner(*)
      `)
      .eq('companyid', companyid)
      .eq('supplyid', itemCustomerId)
      .order('createdat', { ascending: false })

    if (!error) {
      setSelectedSupplier(itemCustomerId)
      setProducts(data)
    }
  }

  const toggleSupplierCard = () => setIsSupplierCardExpanded(!isSupplierCardExpanded)

  const addPlatform = () => {
    setPlatformSelections([...platformSelections, { platform: '', countryLanguagePairs: [{ country: '', language: '' }] }])
  }

  const addCountryLanguage = (platformIndex: number) => {
    const newPlatformSelections = [...platformSelections]
    newPlatformSelections[platformIndex].countryLanguagePairs.push({ country: '', language: '' })
    setPlatformSelections(newPlatformSelections)
  }

  const updatePlatform = (index: number, value: string) => {
    const newPlatformSelections = [...platformSelections]
    newPlatformSelections[index].platform = value
    setPlatformSelections(newPlatformSelections)
  }

  const updateCountry = (platformIndex: number, pairIndex: number, value: string) => {
    const newPlatformSelections = [...platformSelections]
    newPlatformSelections[platformIndex].countryLanguagePairs[pairIndex].country = value
    setPlatformSelections(newPlatformSelections)
  }

  const updateLanguage = (platformIndex: number, pairIndex: number, value: string) => {
    const newPlatformSelections = [...platformSelections]
    newPlatformSelections[platformIndex].countryLanguagePairs[pairIndex].language = value
    setPlatformSelections(newPlatformSelections)
  }

  const deletePlatform = (platformIndex: number) => {
    const newPlatformSelections = platformSelections.filter((_, index) => index !== platformIndex)
    setPlatformSelections(newPlatformSelections)
  }

  const deleteCountryLanguagePair = (platformIndex: number, pairIndex: number) => {
    const newPlatformSelections = [...platformSelections]
    newPlatformSelections[platformIndex].countryLanguagePairs = 
      newPlatformSelections[platformIndex].countryLanguagePairs.filter((_, index) => index !== pairIndex)
    setPlatformSelections(newPlatformSelections)
  }

  const handleSupplierSelect = (row: any) => {
    const { id: itemCustomerId, companyid } = row;

    fetchProductData(itemCustomerId, companyid);
  }

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      const currentPageIds = currentItems.map(product => product.id)
      setSelectedProducts(prev => 
        [...new Set([...prev, ...currentPageIds])]
      )
    } else {
      const currentPageIds = currentItems.map(product => product.id)
      setSelectedProducts(prev => 
        prev.filter(id => !currentPageIds.includes(id))
      )
    }
  }

  const toggleRowExpansion = (productId: number) => {
    setExpandedRows(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const filteredProducts = products.filter(product => 
    (categoryFilter === '전체' || product.category === categoryFilter) &&
    product.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    setExpandedRows([]) // 페이지 변경시 확장된 행 초기화
  }

  // 페이지네이션 헬퍼 함수 추가
  const getPageNumbers = (current: number, total: number) => {
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 2) return [1, 2, 3];
    if (current >= total - 1) return [total - 2, total - 1, total];

    return [current - 1, current, current + 1];
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Supplier Card - Now with collapsible functionality */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>공급사</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSupplierCard}
            aria-label={isSupplierCardExpanded ? "Collapse supplier card" : "Expand supplier card"}
          >
            {isSupplierCardExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {isSupplierCardExpanded && (
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input placeholder="공급사를 검색하세요" className="max-w-sm" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회사명</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">선택</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierData.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.supplyname}</TableCell>
                    <TableCell>{supplier.managername}</TableCell>
                    <TableCell>{supplier.created}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSupplierSelect(supplier)}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Platform Selection Card - Keeping existing UI */}
      <Card>
        <CardHeader>
          <CardTitle>언어 및 플랫폼 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {platformSelections.map((platformSelection, platformIndex) => (
            <div key={platformIndex} className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-1/3 flex items-center space-x-2">
                  <Select onValueChange={(value) => updatePlatform(platformIndex, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="플랫폼 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="ebay">eBay</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePlatform(platformIndex)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-2/3 space-y-2">
                  {platformSelection.countryLanguagePairs.map((pair, pairIndex) => (
                    <div key={pairIndex} className="flex items-center space-x-2">
                      <Select onValueChange={(value) => updateCountry(platformIndex, pairIndex, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select onValueChange={(value) => updateLanguage(platformIndex, pairIndex, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="언어 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                      {pairIndex > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCountryLanguagePair(platformIndex, pairIndex)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full h-10 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100"
                    onClick={() => addCountryLanguage(platformIndex)}
                  >
                    + 국가와 언어 추가
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex">
            <div className="w-1/3">
              <Button 
                variant="ghost" 
                className="w-full h-10 bg-muted hover:bg-muted/80"
                onClick={addPlatform}
              >
                + 플랫폼 추가
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updated Product List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>검색결과</CardTitle>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{filteredProducts.length}</span> results found
              </div>
              <div className="text-sm text-green-600">
                <span className="font-medium">{selectedProducts.length}</span> selected
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">삭제</Button>
              <Button variant="outline" size="sm">번역</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedSupplier ? (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="product-name">상품명 번역</TabsTrigger>
                  <TabsTrigger value="description">본문 번역</TabsTrigger>
                  <TabsTrigger value="option-name">옵션명 번역</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="상품명 검색"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={currentItems.length > 0 && currentItems.every(product => 
                    selectedProducts.includes(product.id)
                  )}
                  onCheckedChange={handleSelectAllProducts}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  전체 선택
                </label>
              </div>
              <div className="space-y-2">
                {currentItems.map((product) => (
                  <div key={product.id} className="border rounded-lg">
                    <div className="flex items-start p-4 gap-4">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        className="mt-1"
                      />
                      <img
                        src={product.thumbnailurl}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleRowExpansion(product.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {expandedRows.includes(product.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <p className="font-medium line-clamp-2">{product.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.variationsku}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {expandedRows.includes(product.id) && (
                      <div className="border-t p-4">
                        <Tabs defaultValue="original">
                          <TabsList className="mb-4">
                            <TabsTrigger value="original">원본</TabsTrigger>
                            <TabsTrigger value="country">국가</TabsTrigger>
                            <TabsTrigger value="language">언어</TabsTrigger>
                            <TabsTrigger value="category">번역</TabsTrigger>
                            <TabsTrigger value="status">수정</TabsTrigger>
                            <TabsTrigger value="action">삭제</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                
                {getPageNumbers(currentPage, totalPages).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">공급사를 선택하면 상품 목록이 표시됩니다.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

