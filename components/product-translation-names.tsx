"use client"

import React, { useState, useMemo, useEffect } from 'react'
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
import { ChevronUp, Pencil, Trash, Globe, Languages } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserDataStore } from "@/store/modules"
import { supabase } from "@/utils/supabase/client"
import { SupplierSelector } from "@/components/supplier-selector"

interface CountryLanguagePair {
  country: string;
  language: string;
}

interface PlatformSelection {
  platform: string;
  countryLanguagePairs: CountryLanguagePair[];
}

const initialPlatformSelections: PlatformSelection[] = [
  {
    platform: 'SHOPEE',
    countryLanguagePairs: [
      { country: 'MY', language: 'my' },
      { country: 'ID', language: 'id' }
    ]
  },
  {
    platform: 'LAZADA',
    countryLanguagePairs: [
      { country: 'TH', language: 'th' },
      { country: 'VN', language: 'vi' },
      { country: 'ID', language: 'id' }
    ]
  }
]

export default function ProductTranslation() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [platformSelections, setPlatformSelections] = useState<PlatformSelection[]>(initialPlatformSelections)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('product-name')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [nameFilter, setNameFilter] = useState('')
  const [categories, setCategories] = useState(['전체', '자동차용품', '스포츠용품', '서비스'])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // 필터 관련 state 추가
  const [platformFilter, setPlatformFilter] = useState('SHOPEE')
  const [countryFilter, setCountryFilter] = useState('KR')
  const [languageFilter, setLanguageFilter] = useState('en')

  const { user } = useUserDataStore()

  useEffect(() => {
    if (user) fetchSupplierData(user!.companyid)
  }, [user])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProductData = async (itemCustomerId: string, companyid: string, supplierName: string) => {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        translated_names(*),
        translated_contents(*)
      `)
      .eq('companyid', companyid)
      .eq('supplyid', itemCustomerId)
      .gte('createdat', '2024-03-01T00:00:00.000Z')
      .in('variationsku', [
        "3583481362",
        "10359844564",
        "10359844566",
        "33721024644",
        "35329309196",
        "35329309194",
        "35329309192",
        "35329309190",
        "35329309189",
        "9323027126",
        "36213735593"
      ])
      .order('createdat', { ascending: false })

    if (!error) {
      setSelectedSupplier(itemCustomerId)
      setProducts(data)
    }
  }

  const handleSupplierSelect = async (supplier: any) => {
    console.log(supplier);

    if (user && supplier && supplier.id) {
      await fetchProductData(supplier.id, user.companyid, supplier.supplyname)
    }
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
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = categoryFilter === '전체' || product.category === categoryFilter
      const matchesName = product.name?.toLowerCase().includes(nameFilter.toLowerCase())
      return matchesCategory && matchesName
    })
  }, [products, categoryFilter, nameFilter])

  
  const handleTranslate = async () => {
    const selectedItems = products.filter(product => selectedProducts.includes(product.id));

    let target = 'name';
    let targetFolder = 'translated_names';

    if (activeTab === 'description') {
      target = 'content';
      targetFolder = 'translated_contents';
    }

    try {
      const result = await translateText(selectedItems.map((item) => item[target]), languageFilter);
      
      // 번역 결과를 products 배열에 업데이트
      const updatedProducts = products.map(product => {
        if (selectedProducts.includes(product.id)) {
          const translatedIndex = selectedItems.findIndex(item => item.id === product.id)
          const translatedResult = [...product[targetFolder]]
          const hasTranslated = product[targetFolder].find((item: any) => item.platform === platformFilter && item.country === countryFilter && item.language === languageFilter)

          if (hasTranslated) {
            translatedResult.map((item: any) => {
              if (item.platform === platformFilter && item.country === countryFilter && item.language === languageFilter) {
                item.translatedNew = result.translations[translatedIndex].translatedText
              }
            })
          } else {
            translatedResult.push({
              itemid: product.id,
              country: countryFilter,
              language: languageFilter,
              platform: platformFilter,
              originaltext: product.name,
              translatedNew: result.translations[translatedIndex].translatedText,
              iscompleted: false,
              compamyid: product.companyid,
              updatedat: new Date().toISOString()
            })
          }

          return {
            ...product,
            [targetFolder]: translatedResult,
          };
        }
        return product;
      });

      setProducts(updatedProducts)
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const handleTranslateSave = async () => {
    try {
      // 상품명 번역 데이터 필터링
      const translatedNames = products
        .filter((product: any) => product.translated_names.find((item: any) => item.translatedNew))
        .map((product: any) => product.translated_names.filter((item: any) => item.translatedNew))
        .flat();

      // 본문 번역 데이터 필터링
      const translatedContents = products
        .filter((product: any) => product.translated_contents.find((item: any) => item.translatedNew))
        .map((product: any) => product.translated_contents.filter((item: any) => item.translatedNew))
        .flat();

      // 상품명 번역 저장
      if (translatedNames.length > 0) {
        const namesUpsertData = translatedNames.map((item: any) => ({
          id: item.translated ? item.id : crypto.randomUUID(),
          itemid: item.itemid,
          country: item.country,
          language: item.language,
          platform: item.platform,
          originaltext: item.originaltext,
          translated: item.translatedNew,
          iscompleted: false,
          compamyid: item.compamyid,
          updatedat: new Date().toISOString()
        }));

        const { error: namesError } = await supabase
          .from("translated_names")
          .upsert(namesUpsertData, { onConflict: 'id' });

        if (namesError) throw namesError;
      }

      // 본문 번역 저장
      if (translatedContents.length > 0) {
        const contentsUpsertData = translatedContents.map((item: any) => ({
          id: item.translated ? item.id : crypto.randomUUID(),
          itemid: item.itemid,
          country: item.country,
          language: item.language,
          platform: item.platform,
          originaltext: item.originaltext,
          translated: item.translatedNew,
          iscompleted: false,
          compamyid: item.compamyid,
          updatedat: new Date().toISOString()
        }));

        const { error: contentsError } = await supabase
          .from("translated_contents")
          .upsert(contentsUpsertData, { onConflict: 'id' });

        if (contentsError) throw contentsError;
      }

      if (translatedNames.length === 0 && translatedContents.length === 0) {
        console.log('번역 변경사항이 없습니다.');
      } else {
        console.log('번역이 성공적으로 저장되었습니다.');
      }

    } catch (error) {
      console.error('Translation save error:', error);
    }
  };

  async function translateText(text: string[], targetLanguage: string) {
    try {
      const response = await fetch('/api/translate/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: text,
          targetLanguage: targetLanguage
        }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  const handleEditClick = (product: any) => {
    console.log('수정 버튼 클릭:', product);
  };

  const handleDeleteClick = async (product: any) => {
    let target = 'translated_names';
    if (activeTab === 'description') target = "translated_contents"

    try {
      const targetProduct = product[target].find((item: any) => item.platform === platformFilter && item.country === countryFilter && item.language === languageFilter)
      
      if (targetProduct.id) await supabase.from(`${target}`).delete().eq('id', targetProduct.id)

      const updatedProducts = products.map((e: any) => {
        if (e.id === product.id) {
          return {
            ...e,
            [target]: e[target].filter((item: any) => item.id !== targetProduct.id)
          }
        }
        return e
      })
      setProducts(updatedProducts)
    } catch (error) {
      console.error('Translation error:', error);
    }

    
  };

  return (
    <div className="container mx-auto py-6">
      <SupplierSelector onSupplierSelect={handleSupplierSelect} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>언어 및 플랫폼 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="플랫폼 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHOPEE">SHOPEE</SelectItem>
                <SelectItem value="LAZADA">LAZADA</SelectItem>
                <SelectItem value="VO">VO</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="국가 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KR">대한민국 (KR)</SelectItem>
                <SelectItem value="MY">말레이시아 (MY)</SelectItem>
                <SelectItem value="VN">베트남 (VN)</SelectItem>
                <SelectItem value="SG">싱가포르 (SG)</SelectItem>
                <SelectItem value="ID">인도네시아 (ID)</SelectItem>
                <SelectItem value="TH">태국 (TH)</SelectItem>
                <SelectItem value="PH">필리핀 (PH)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="언어 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">영어 (EN)</SelectItem>
                <SelectItem value="zh-CN">중국어 (CN)</SelectItem>
                <SelectItem value="zh-Hans">중국어 간체 (Hans)</SelectItem>
                <SelectItem value="th">태국어 (TH)</SelectItem>
                <SelectItem value="my">말레이어 (MY)</SelectItem>
                <SelectItem value="vi">베트남어 (VN)</SelectItem>
                <SelectItem value="id">인도네시아어 (ID)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedSupplier ? (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="product-name">상품명 번역</TabsTrigger>
                  <TabsTrigger value="description">본문 번역</TabsTrigger>
                  <TabsTrigger value="option-name">옵션명 번역</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center justify-between">
                <div className='flex items-center space-x-2 '>
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleTranslate}
                  >
                    번역
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleTranslateSave}>저장</Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="select-all"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAllProducts}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  전체 선택
                </label>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>SKU</TableHead>
                    {/* <TableHead className="w-[40%]">상품명</TableHead> */}
                    <TableHead className="w-[40%]">
                      {
                        activeTab === 'product-name' ? '상품명' : activeTab === 'description' ? '본문' : '옵션명'
                      }
                    </TableHead>
                    <TableHead className="w-[40%]">번역</TableHead>
                    <TableHead>수정</TableHead>
                    <TableHead>삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleProductSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>{product.variationsku}</TableCell>
                      <TableCell>
                        {
                          activeTab === 'product-name' ? product.name : activeTab === 'description' ? product.content : product.optionname
                        }
                      </TableCell>
                      <TableCell>
                        {
                          activeTab === 'product-name' ? (
                            product.translated_names.find((item: any) => item.language === languageFilter)
                            ? (
                                product.translated_names.find((item: any) => item.language === languageFilter).translatedNew
                                ? product.translated_names.find((item: any) => item.language === languageFilter).translatedNew
                                : product.translated_names.find((item: any) => item.language === languageFilter).translated
                              )
                            : ''
                          ) : activeTab === 'description' ? (
                            product.translated_contents.find((item: any) => item.language === languageFilter)
                            ? (
                                product.translated_contents.find((item: any) => item.language === languageFilter).translatedNew
                                ? product.translated_contents.find((item: any) => item.language === languageFilter).translatedNew
                                : product.translated_contents.find((item: any) => item.language === languageFilter).translated
                              )
                            : ''
                          ) : (
                            product.translated_options.find((item: any) => item.language === languageFilter)
                            ? (
                                product.translated_options.find((item: any) => item.language === languageFilter).translatedNew
                                ? product.translated_options.find((item: any) => item.language === languageFilter).translatedNew
                                : product.translated_options.find((item: any) => item.language === languageFilter).translated
                              )
                            : ''
                          )
                        }
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">공급사를 선택하면 상품 목록이 표시됩니다.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

