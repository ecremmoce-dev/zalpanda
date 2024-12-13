'use client'

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
import SupplierSection from "@/components/supplier-section"
import { useSupplierStore } from "@/store/modules/supplierStore"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface OptionData {
  label: string
  price: number
  stock: number
  value: string
  children: OptionData[]
  optionNo: number
  isChild?: boolean
  parentLabel?: string
}

interface ProductPrice {
  id: string
  variationsku: string
  name: string
  thumbnailurl: string
  purchaseprice: number
  consumerprice: number
  platformprice: number
  currency: string
  exchangerate: number
  krw: number
  platform: string
  country: string
  exchangedate: string
  brandname?: string
  groupname?: string
  groupvalue?: string
  options?: {
    original_json?: any
    modified_json?: OptionData[]
  }
  isExpanded?: boolean
}

// 배열을 청크로 나누는 유틸리티 함수 추가
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunked: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  return chunked
}

export function ProductExchange() {
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isSupplierTableExpanded, setIsSupplierTableExpanded] = useState(true)
  const { user } = useUserDataStore()
  const { selectedSupplier, setSelectedSupplier } = useSupplierStore()
  const [products, setProducts] = useState<ProductPrice[]>([])
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    if (user && user.companyid) {
      fetchSupplierData(user.companyid)
    }
  }, [user])

  useEffect(() => {
    const loadData = async () => {
      if (selectedSupplier?.id && user?.companyid) {
        setLoading(true)
        setProducts([])
        try {
          await fetchProductPrices()
        } catch (error) {
          console.error('Failed to load products:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadData()
  }, [selectedSupplier?.id])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error
      
      setSupplierData(data)
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  const fetchProductPrices = async () => {
    try {
      if (!user?.companyid || !selectedSupplier?.id) {
        console.log('Missing required data:', { 
          companyId: user?.companyid, 
          supplierId: selectedSupplier?.id 
        })
        return
      }

      setLoading(true)
      console.log('Fetching products for supplier:', selectedSupplier.id)

      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          thumbnailurl,
          purchaseprice,
          consumerprice,
          supplyid
        `)
        .eq('supplyid', selectedSupplier.id.toString())
        .eq('companyid', user.companyid)
        .order('createdat', { ascending: false })

      if (itemsError) {
        console.error('Items Error:', itemsError)
        throw itemsError
      }

      if (!itemsData || itemsData.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      const itemIds = itemsData.map(item => item.id)
      const chunkedItemIds = chunkArray(itemIds, 10) // 10개씩 나누기

      let allPricesData: any[] = []
      let allOptionsData: any[] = []

      // 청크별로 prices 데이터 조회
      for (const chunk of chunkedItemIds) {
        const { data: pricesData, error: pricesError } = await supabase
          .from('prices')
          .select('*')
          .in('itemid', chunk)

        if (pricesError) {
          console.error('Prices Error:', pricesError)
          continue
        }

        if (pricesData) {
          allPricesData = [...allPricesData, ...pricesData]
        }
      }

      // 청크별로 options 데이터 조회
      for (const chunk of chunkedItemIds) {
        const { data: optionsData, error: optionsError } = await supabase
          .from('item_options_new')
          .select(`
            id,
            itemid,
            original_json,
            modified_json,
            createdat,
            updatedat
          `)
          .in('itemid', chunk)
          .order('createdat', { ascending: false })

        if (optionsError) {
          console.error('Options Error:', optionsError)
          continue
        }

        if (optionsData) {
          console.log('Options Data for chunk:', chunk, optionsData)
          allOptionsData = [...allOptionsData, ...optionsData]
        }
      }

      // 데이터 포맷팅
      const formattedData: ProductPrice[] = []
      
      itemsData.forEach(item => {
        const itemPrices = allPricesData.filter(price => price.itemid === item.id)
        const itemOption = allOptionsData.find(opt => opt.itemid === item.id)
        
        let parsedModifiedJson = null
        if (itemOption?.modified_json) {
          try {
            if (typeof itemOption.modified_json === 'string') {
              parsedModifiedJson = JSON.parse(itemOption.modified_json)
            } else {
              parsedModifiedJson = itemOption.modified_json
            }
          } catch (e) {
            console.error('Failed to parse modified_json:', e)
          }
        }

        if (itemPrices.length > 0) {
          itemPrices.forEach(price => {
            formattedData.push({
              id: price.id,
              variationsku: item.variationsku || '',
              name: item.name || '',
              thumbnailurl: item.thumbnailurl || '',
              purchaseprice: item.purchaseprice || 0,
              consumerprice: item.consumerprice || 0,
              platformprice: price.platformprice || 0,
              currency: price.currency || '',
              exchangerate: price.exchangerate || 0,
              krw: price.krw || 0,
              platform: price.platform || '',
              country: price.country || '',
              exchangedate: price.exchangedate || '',
              brandname: itemOption?.modified_json?.brandName || '',
              groupname: itemOption?.modified_json?.groupName || '',
              groupvalue: itemOption?.modified_json?.groupValue || '',
              options: itemOption ? {
                modified_json: parsedModifiedJson,
                original_json: itemOption.original_json
              } : undefined,
              isExpanded: false,
            })
          })
        } else {
          formattedData.push({
            id: item.id,
            variationsku: item.variationsku || '',
            name: item.name || '',
            thumbnailurl: item.thumbnailurl || '',
            purchaseprice: item.purchaseprice || 0,
            consumerprice: item.consumerprice || 0,
            platformprice: 0,
            currency: '',
            exchangerate: 0,
            krw: 0,
            platform: '',
            country: '',
            exchangedate: '',
            brandname: itemOption?.modified_json?.brandName || '',
            groupname: itemOption?.modified_json?.groupName || '',
            groupvalue: itemOption?.modified_json?.groupValue || '',
            options: itemOption ? {
              modified_json: parsedModifiedJson,
              original_json: itemOption.original_json
            } : undefined,
            isExpanded: false,
          })
        }
      })

      setProducts(formattedData)
      console.log('Formatted Products:', formattedData)

    } catch (error) {
      console.error('Failed to fetch product prices:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSupplierSearch = () => {
    if (!supplierSearchTerm || !user) {
      if (user) {
        fetchSupplierData(user.companyid)
      }
      return
    }

    const filteredData = supplierData.filter(supplier =>
      supplier.supplyname.includes(supplierSearchTerm) ||
      supplier.managername.includes(supplierSearchTerm)
    )
    setSupplierData(filteredData)
  }

  const handleSupplierSelect = async (supplier: any) => {
    try {
      if (!supplier?.id || !user?.companyid) return

      console.log('Selecting supplier:', supplier)
      
      setProducts([])
      setCurrentPage(1)
      setProductSearchTerm("")
      
      await setSelectedSupplier({
        id: supplier.id,
        supplyname: supplier.supplyname,
        managername: supplier.managername,
        created: supplier.created,
        companyid: supplier.companyid
      })

      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select(`
          id,
          variationsku,
          name,
          thumbnailurl,
          purchaseprice,
          consumerprice,
          supplyid
        `)
        .eq('supplyid', supplier.id.toString())
        .eq('companyid', user.companyid)
        .order('createdat', { ascending: false })

      if (itemsError) {
        console.error('Items Error:', itemsError)
        return
      }

      if (!itemsData || itemsData.length === 0) {
        setProducts([])
        return
      }

      const itemIds = itemsData.map(item => item.id)
      const chunkedItemIds = chunkArray(itemIds, 10) // 10개씩 나누기

      let allPricesData: any[] = []
      let allOptionsData: any[] = []

      // 청크별로 prices 데이터 조회
      for (const chunk of chunkedItemIds) {
        const { data: pricesData, error: pricesError } = await supabase
          .from('prices')
          .select('*')
          .in('itemid', chunk)

        if (pricesError) {
          console.error('Prices Error:', pricesError)
          continue
        }

        if (pricesData) {
          allPricesData = [...allPricesData, ...pricesData]
        }
      }

      // 청크별로 options 데이터 조회
      for (const chunk of chunkedItemIds) {
        const { data: optionsData, error: optionsError } = await supabase
          .from('item_options_new')
          .select(`
            id,
            itemid,
            original_json,
            modified_json,
            createdat,
            updatedat
          `)
          .in('itemid', chunk)
          .order('createdat', { ascending: false })

        if (optionsError) {
          console.error('Options Error:', optionsError)
          continue
        }

        if (optionsData) {
          console.log('Options Data for chunk:', chunk, optionsData)
          allOptionsData = [...allOptionsData, ...optionsData]
        }
      }

      // 데이터 포맷팅
      const formattedData: ProductPrice[] = []
      
      itemsData.forEach(item => {
        const itemPrices = allPricesData.filter(price => price.itemid === item.id)
        const itemOption = allOptionsData.find(opt => opt.itemid === item.id)
        
        let parsedModifiedJson = null
        if (itemOption?.modified_json) {
          try {
            if (typeof itemOption.modified_json === 'string') {
              parsedModifiedJson = JSON.parse(itemOption.modified_json)
            } else {
              parsedModifiedJson = itemOption.modified_json
            }
          } catch (e) {
            console.error('Failed to parse modified_json:', e)
          }
        }

        if (itemPrices.length > 0) {
          itemPrices.forEach(price => {
            formattedData.push({
              id: price.id,
              variationsku: item.variationsku || '',
              name: item.name || '',
              thumbnailurl: item.thumbnailurl || '',
              purchaseprice: item.purchaseprice || 0,
              consumerprice: item.consumerprice || 0,
              platformprice: price.platformprice || 0,
              currency: price.currency || '',
              exchangerate: price.exchangerate || 0,
              krw: price.krw || 0,
              platform: price.platform || '',
              country: price.country || '',
              exchangedate: price.exchangedate || '',
              brandname: itemOption?.modified_json?.brandName || '',
              groupname: itemOption?.modified_json?.groupName || '',
              groupvalue: itemOption?.modified_json?.groupValue || '',
              options: itemOption ? {
                modified_json: parsedModifiedJson,
                original_json: itemOption.original_json
              } : undefined,
              isExpanded: false,
            })
          })
        } else {
          formattedData.push({
            id: item.id,
            variationsku: item.variationsku || '',
            name: item.name || '',
            thumbnailurl: item.thumbnailurl || '',
            purchaseprice: item.purchaseprice || 0,
            consumerprice: item.consumerprice || 0,
            platformprice: 0,
            currency: '',
            exchangerate: 0,
            krw: 0,
            platform: '',
            country: '',
            exchangedate: '',
            brandname: itemOption?.modified_json?.brandName || '',
            groupname: itemOption?.modified_json?.groupName || '',
            groupvalue: itemOption?.modified_json?.groupValue || '',
            options: itemOption ? {
              modified_json: parsedModifiedJson,
              original_json: itemOption.original_json
            } : undefined,
            isExpanded: false,
          })
        }
      })

      setProducts(formattedData)
      console.log('Formatted Products:', formattedData)

    } catch (error) {
      console.error('Error selecting supplier:', error)
      setProducts([])
    }
  }

  const handleProductSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearchTerm(event.target.value)
  }

  const filteredProducts = products.filter(product => {
    const searchTerm = productSearchTerm.toLowerCase()
    return (
      product.variationsku.toLowerCase().includes(searchTerm) ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.brandname?.toLowerCase().includes(searchTerm)
    )
  })

  const toggleRowExpand = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isExpanded: !product.isExpanded }
        : product
    ))
  }

  const renderOptionDetails = (options: any) => {
    if (!options?.modified_json) return null

    let optionsArray: OptionData[] = []

    try {
      // 옵션 데이터 파싱
      if (typeof options.modified_json === 'string') {
        const parsed = JSON.parse(options.modified_json)
        optionsArray = Array.isArray(parsed) ? parsed : [parsed]
      } else if (Array.isArray(options.modified_json)) {
        optionsArray = options.modified_json
      } else {
        optionsArray = [options.modified_json]
      }

      // 모든 옵션과 하위 옵션을 플랫하게 만들기
      const flattenedOptions = optionsArray.reduce((acc: OptionData[], option: OptionData) => {
        if (!option) return acc

        // 메인 옵션 추가
        acc.push({
          ...option,
          isChild: false
        })

        // 하위 옵션이 있으면 추가
        if (Array.isArray(option.children) && option.children.length > 0) {
          option.children.forEach((child: OptionData) => {
            if (!child) return
            acc.push({
              ...child,
              isChild: true,
              parentLabel: option.label
            })
          })
        }

        return acc
      }, [])

      return (
        <div className="px-4 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>구분</TableHead>
                <TableHead>옵션명</TableHead>
                <TableHead className="text-right">옵션가</TableHead>
                <TableHead className="text-right">재고</TableHead>
                <TableHead>옵션값</TableHead>
                <TableHead>옵션번호</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenedOptions.map((option, index) => (
                <TableRow 
                  key={`${option.optionNo || index}-${index}`}
                  className={option.isChild ? "bg-gray-50" : ""}
                >
                  <TableCell>
                    {option.isChild ? "└ 하위옵션" : "메인옵션"}
                  </TableCell>
                  <TableCell className={option.isChild ? "pl-8" : ""}>
                    {option.isChild ? `${option.parentLabel} > ${option.label}` : option.label || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {option.price?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right">
                    {option.stock?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell>{option.value || '-'}</TableCell>
                  <TableCell>{option.optionNo || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    } catch (e) {
      console.error('Failed to parse options:', e, options.modified_json)
      return null
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <SupplierSection 
        supplierData={supplierData}
        supplierSearchTerm={supplierSearchTerm}
        setSupplierSearchTerm={setSupplierSearchTerm}
        handleSupplierSearch={handleSupplierSearch}
        isSupplierTableExpanded={isSupplierTableExpanded}
        setIsSupplierTableExpanded={setIsSupplierTableExpanded}
        handleSupplierSelect={handleSupplierSelect}
      />

      <Card className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {selectedSupplier ? `${selectedSupplier.supplyname} 상품 목록` : '상품 목록'}
          </h2>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="SKU 또는 상품명 검색"
              value={productSearchTerm}
              onChange={handleProductSearch}
              className="w-[300px]"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>이미지</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>브랜드</TableHead>
                <TableHead>옵션</TableHead>
                <TableHead className="text-right">매입가</TableHead>
                <TableHead className="text-right">소비자가</TableHead>
                <TableHead className="text-right">플랫폼가격</TableHead>
                <TableHead>통화</TableHead>
                <TableHead className="text-right">환율</TableHead>
                <TableHead className="text-right">원화환산</TableHead>
                <TableHead>플랫폼</TableHead>
                <TableHead>국가</TableHead>
                <TableHead>환율기준일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-10">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-10">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpand(product.id)}
                        >
                          {product.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>{product.variationsku}</TableCell>
                      <TableCell>
                        <img 
                          src={product.thumbnailurl || 'https://via.placeholder.com/40'} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brandname}</TableCell>
                      <TableCell>{product.groupname} {product.groupvalue}</TableCell>
                      <TableCell className="text-right">{product.purchaseprice?.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.consumerprice?.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.platformprice?.toLocaleString()}</TableCell>
                      <TableCell>{product.currency}</TableCell>
                      <TableCell className="text-right">{product.exchangerate?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.krw?.toLocaleString()}</TableCell>
                      <TableCell>{product.platform}</TableCell>
                      <TableCell>{product.country}</TableCell>
                      <TableCell>{new Date(product.exchangedate).toLocaleDateString()}</TableCell>
                    </TableRow>
                    {product.isExpanded && (
                      <TableRow>
                        <TableCell colSpan={15} className="bg-gray-50">
                          {renderOptionDetails(product.options)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              전체 {filteredProducts.length}개 중 {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredProducts.length)}개 표시
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {renderPagination()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">페이지당 항목:</span>
              <select
                className="border rounded p-1"
                value={itemsPerPage}
                onChange={(e) => {
                  setCurrentPage(1)
                  setItemsPerPage(Number(e.target.value))
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 