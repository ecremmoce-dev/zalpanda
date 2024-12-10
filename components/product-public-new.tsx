'use client'

import React, { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const PAGE_SIZE = 10;

type StatusType = 'pending' | 'start' | 'completed' | 'failed' | 'binding';

const STATUS_LABELS: Record<StatusType, string> = {
  pending: '대기',
  start: '진행중',
  completed: '완료',
  failed: '실패',
  binding: '바인딩'
};

export default function ProductRegistration() {
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([])
  const [crawlingUrl, setCrawlingUrl] = useState("")
  const [crawlingCurrentPage, setCrawlingCurrentPage] = useState(1)
  const [crawlingResultsCurrentPage, setCrawlingResultsCurrentPage] = useState(1)
  const [selectedCrawlingItem, setSelectedCrawlingItem] = useState<string | null>(null)
  const [crawlingProgress, setCrawlingProgress] = useState<any[]>([])
  const [selectedCrawlingTaskType, setSelectedCrawlingTaskType] = useState<string>('naver')
  const [crawlingBrandList, setCrawlingBrandList] = useState<any[]>([])
  const [selectedCrawlingBrand, setSelectedCrawlingBrand] = useState<any>(null)
  const [crawlingResults, setCrawlingResults] = useState<any[]>([])
  const [selectedCrawlingResults, setSelectedCrawlingResults] = useState<any[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(true)
  const [isDetailImagesOpen, setIsDetailImagesOpen] = useState(true)
  const [isContentHtmlOpen, setIsContentHtmlOpen] = useState(true)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [isSpecificationsOpen, setIsSpecificationsOpen] = useState(true)
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(true)
  const [isOtherInfoOpen, setIsOtherInfoOpen] = useState(true)
  const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>(['pending', 'start', 'completed', 'failed', 'binding'])
  const [crawlingSelectList, setCrawlingSelectList] = useState<{ name: string; code: string }[]>([])

  const { user } = useUserDataStore();

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)
  const crawlingTotalPages = Math.ceil(crawlingProgress.length / itemsPerPage)

  const handleSearch = () => {
    const filtered = filteredSuppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSuppliers(filtered)
    setCurrentPage(1)
  }

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const paginatedCrawlingProgress = crawlingProgress.slice(
    (crawlingCurrentPage - 1) * itemsPerPage,
    crawlingCurrentPage * itemsPerPage
  )

  const filteredCrawlingResults = selectedCrawlingItem
    ? crawlingResults.filter(result => result.id === selectedCrawlingItem)
    : crawlingResults

  const crawlingResultsTotalPages = Math.ceil(filteredCrawlingResults.length / itemsPerPage)

  const handleSelectedSupplier = (supplier: any) => {
    fetchCrawlingProgress(supplier)
    setSelectedSupplier(supplier)
    setSelectedCrawlingResults([])
  }

  const handleSetCrawlingtaskqueue = async () => {
    try {
      if (selectedSupplier) {
        const { id : supplierId, companyid } = selectedSupplier
        
        const { error } = await supabase.from('crawlingtaskqueue')
        .insert([
          {
            company_supply_id: supplierId,
            company_id: companyid,
            status: 'pending',
            task_type: selectedCrawlingTaskType,
            target_url: selectedCrawlingBrand?.url ?? crawlingUrl,
            updated_at: new Date().toISOString(),
            brand_title: selectedCrawlingBrand?.title ?? null,
            brand_code: selectedCrawlingBrand?.brand_code ?? null,
          }
        ])
        .select()

        if (error) throw error;

        fetchCrawlingProgress(selectedSupplier)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSaveSelectedCrawlingResults = async () => {
    if (selectedCrawlingResults.length === 0) return
    
    try {
      const { error } = await supabase
      .from('crawlingproductlist')
      .upsert(
        selectedCrawlingResults
          .filter(item => item.detail_status === 'pending')
          .map(item => ({
            ...item,
            detail_status: 'start',
            updated_at: new Date().toISOString(),
          })
        )
      )
      .select()

    if (error) throw error
      
      // 업데이트 성공 후 선택 초기화
      setSelectedCrawlingResults([])
      
      // 필요한 경우 목록 새로고침
      if (selectedCrawlingItem) {
        fetchCrawlingProductList(selectedCrawlingItem)
      }
      
    } catch (error) {
      console.error('Failed to save selected items:', error)
    }
  }

  const handleShowCrawlingProductDetail = async (item: any) => {
    try {
      const { data, error } = await supabase
        .from('crawlingproductdetail')
        .select('*')
        .eq('product_id', item.id)
        .single()

      if (error) throw error

      setSelectedProductDetail(data)
      setShowDetailModal(true)
    } catch (error) {
      console.error('상세 정보 조회 실패:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSupplierData(user!.companyid)
      fetchCrawlingBrandList()
    }
  }, [user])

  useEffect(() => {
    if (selectedSupplier) {
      const filteredProgress = crawlingProgress.filter(item => item.supplierId === selectedSupplier)
      setCrawlingProgress(filteredProgress)
      setCrawlingCurrentPage(1)
      setSelectedCrawlingItem(null)
    } else {
      setCrawlingProgress(crawlingProgress)
    }
  }, [selectedSupplier])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase.from('company_supply')
        .select('*')
        .eq('companyid', companyid)

      if (error) throw error;
      
      setFilteredSuppliers(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCrawlingProgress = async (supplier: any) => {
    try {
      const { id : supplierId, companyid } = supplier
      const { data, error } = await supabase.from('crawlingtaskqueue')
        .select('*')
        .eq('company_supply_id', supplierId)
        .eq('company_id', companyid)

      if (error) throw error;

      setCrawlingProgress(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCrawlingBrandList = async () => {
    try {
      const { data, error } = await supabase.from('crawlingbrand').select('*')

      if (error) throw error;

      setCrawlingBrandList(data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCrawlingProductList = async (id: string) => {
    try {
      const { data, error } = await supabase.from('crawlingproductlist')
      .select('*')
      .eq('que_id', id)
      .order('detail_status', { ascending: false, nullsFirst: false })

      if (error) throw error;

      setCrawlingResults(data)
    } catch (error) {
      console.log(error);
    }
  }

  const getFilteredResults = () => {
    return crawlingResults.filter(item => selectedStatuses.includes(item.detail_status as StatusType));
  };

  const filteredResultsTotalPages = Math.ceil(getFilteredResults().length / PAGE_SIZE);

  const handleBinding = async () => {
    const itemsToUpdate = selectedCrawlingResults.filter(item => item.detail_status === 'completed');
    
    try {
      const { error: updateError } = await supabase
        .from('crawlingproductlist')
        .upsert(
          itemsToUpdate.map(item => ({
            ...item,
            detail_status: 'binding',
            updated_at: new Date().toISOString(),
          }))
        )
        .select();
      console.log(updateError);

      if (updateError) throw updateError;

      try {
        for (const item of itemsToUpdate) {
          const { data: detailData, error: detailError } = await supabase
            .from('crawlingproductdetail')
            .select('*')
            .eq('product_id', item.id)
            .single();
          if (detailError) throw detailError;

          const detail = detailData.detail_json;
          const specs = detailData.specifications;

          const itemData = {
            id: crypto.randomUUID(), // 브라우저 내장 UUID 생성 함수 사용
            variationsku: detail.sku?.toString() || null,
            name: detail.title,
            hscode: null,
            barcode: null,
            weight: null,
            width: null,
            length: null,
            height: null,
            memo: null,
            thumbnailurl: detail.thumbnails?.[0] || null,
            companyid: user?.companyid,
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            brandname: detail.brand,
            content: detail.contentHtml,
            status: 'PENDING',
            consumerprice: detail.price,
            contenthtml: detail.contentHtml,
            supplyid: selectedSupplier?.id,
            originalcontent: detail.contentHtml,
            originalname: detail.title,
            noticeinfo: JSON.stringify(detail.productNotice || specs),
            purchaseprice: detail.beforeDiscount || detail.price,
          };

          const { data: savedItem, error: itemError } = await supabase
            .from('items')
            .insert([itemData])
            .select()
            .single();
          if (itemError) throw itemError;

          // options 데이터 저장
          // if (detail.options && detail.options.length > 0) {
          //   const optionsData = detail.options.map((option: any) => ({
          //     id: crypto.randomUUID(),
          //     itemid: savedItem.id,
          //     variationsku: option.sku?.toString() || null,
          //     consumerprice: option.price || detail.price,
          //     purchaseprice: option.price || detail.beforeDiscount || detail.price,
          //     groupname: Object.keys(option).filter(key => !['sku', 'price'].includes(key))[0] || 'default',
          //     groupvalue: Object.values(option).filter((_, index) => !['sku', 'price'].includes(Object.keys(option)[index]))[0]?.toString() || null,
          //     color: option.color || null,
          //     material: option.material || null,
          //     size: option.size || null,
          //     voproductid: null,
          //     expirationday: null,
          //     feature: null,
          //     packageunit: null,
          //     weightunit: null,
          //     createdat: new Date().toISOString(),
          //     updatedat: new Date().toISOString(),
          //     origin_json: JSON.stringify(option)
          //   }));

          //   const { error: optionsError } = await supabase
          //     .from('item_options')
          //     .insert(optionsData);

          //   if (optionsError) throw optionsError;
          // }
          
          if (detail.modifyOptions && detail.modifyOptions.length > 0) {
            const optionsData = detail.modifyOptions.map((option: any) => ({
              id: crypto.randomUUID(), 
              itemid: savedItem.id, 
              original_json: JSON.stringify(option), 
              modified_json: JSON.stringify(option), 
              createdat: new Date().toISOString(), 
              updatedat: new Date().toISOString(), 
            }));
          
            const { error: optionsError } = await supabase
              .from('item_options_new') 
              .insert(optionsData);

            if (optionsError) throw optionsError;
          }

          const images = [
            ...(detail.thumbnails || []).map((url: string, index: number) => ({
              id: crypto.randomUUID(),
              type: 'THUMBNAIL',
              url,
              index: 4,
              itemid: savedItem.id,
              width: null,
              height: null,
              createdat: new Date().toISOString(),
              updatedat: new Date().toISOString(),
              groupalias: null,
              groupseq: null,
              tag: null,
              language: 'ko'
            })),
            ...(detail.detailImages || []).map((url: string, index: number) => ({
              id: crypto.randomUUID(),
              type: 'MAIN_CONTENT',
              url,
              index,
              itemid: savedItem.id,
              width: null,
              height: null,
              createdat: new Date().toISOString(),
              updatedat: new Date().toISOString(),
              groupalias: null,
              groupseq: null,
              tag: null,
              language: 'ko'
            }))
          ];

          const { error: imageError } = await supabase
            .from('item_images')
            .insert(images);

          if (imageError) throw imageError;
        }

        setSelectedCrawlingResults([]);
        if (selectedCrawlingItem) {
          fetchCrawlingProductList(selectedCrawlingItem);
        }
        
      } catch (bindingError) {
        const { error: rollbackError } = await supabase
          .from('crawlingproductlist')
          .upsert(
            itemsToUpdate.map(item => ({
              ...item,
              detail_status: 'completed',
              updated_at: new Date().toISOString(),
            }))
          )
          .select();

        if (rollbackError) {
          console.error('Failed to rollback status:', rollbackError);
        }

        if (selectedCrawlingItem) {
          fetchCrawlingProductList(selectedCrawlingItem);
        }

        throw new Error('바인딩 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Failed to bind items:', error);
      alert('바인딩 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleStatusChange = (status: StatusType) => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      // 상태가 변경될 때 페이지 초기화
      setCrawlingResultsCurrentPage(1);
      return newStatuses;
    });
  };

  useEffect(() => {
    setCrawlingResultsCurrentPage(1);
  }, [selectedStatuses]);

  useEffect(() => {
    const fetchCrawlingSelectList = async () => {
      try {
        const { data, error } = await supabase.from('crawlingselectlist').select('name, code');
        if (error) throw error;
        setCrawlingSelectList(data);
      } catch (error) {
        console.error('Failed to fetch crawling select list:', error);
      }
    };

    fetchCrawlingSelectList();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="job" className="space-y-4">
        <TabsList className="w-fit mb-6">
          <TabsTrigger value="job">직업 입력</TabsTrigger>
          <TabsTrigger value="url">URL 입력</TabsTrigger>
          <TabsTrigger value="file">파일 업로드</TabsTrigger>
        </TabsList>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>공급사 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="공급사명 또는 코드로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleSearch}>검색</Button>
              </div>
              <div className="rounded-md border">
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
                    {paginatedSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.supplyname}</TableCell>
                        <TableCell>{supplier.managername}</TableCell>
                        <TableCell>{supplier.created}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectedSupplier(supplier)}
                          >
                            {selectedSupplier === supplier.id ? "선택됨" : "선택"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="job">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category1">카테고리 1</SelectItem>
                      <SelectItem value="category2">카테고리 2</SelectItem>
                      <SelectItem value="category3">카테고리 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="weight">무게</Label>
                  <div className="flex items-center gap-2">
                    <Input id="weight" type="number" placeholder="0" />
                    <span>kg</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>치수</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Input id="length" type="number" placeholder="0" />
                      <span>cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="width" type="number" placeholder="0" />
                      <span>cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="height" type="number" placeholder="0" />
                      <span>cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Crawling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select defaultValue={selectedCrawlingTaskType} onValueChange={(value) => {
                    setSelectedCrawlingTaskType(value)
                    setSelectedCrawlingBrand(null)
                    setCrawlingUrl("")
                    setSelectedCrawlingResults([])
                  }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="네이버 스토어 스마트" />
                    </SelectTrigger>
                    <SelectContent>
                    {crawlingSelectList.map((item) => ( // DB에서 가져온 데이터로 SelectItem 생성
                        <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    {
                      selectedCrawlingTaskType === 'naver'
                      ? <>
                        <Input 
                        placeholder="URL을 입력하세요" 
                        value={crawlingUrl}
                        onChange={(e) => setCrawlingUrl(e.target.value)}
                      />
                      </>
                      : <>
                        <Select onValueChange={(value) => setSelectedCrawlingBrand(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={null} />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              crawlingBrandList
                                .filter(brand => brand.source === selectedCrawlingTaskType)
                                .map((brand) => (
                                  <SelectItem value={brand}>{brand.title}</SelectItem>
                                ))
                            }
                          </SelectContent>
                        </Select>
                      </>
                    }
                  </div>
                  <Button
                    disabled={selectedCrawlingTaskType === 'naver' ? !crawlingUrl : !selectedCrawlingBrand}
                    onClick={handleSetCrawlingtaskqueue}
                  >검색</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">진행사항</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>TYPE</TableHead>
                            <TableHead>브랜드</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>요청일시</TableHead>
                            <TableHead className="text-right">선택</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedCrawlingProgress.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.task_type}</TableCell>
                              <TableCell>{item.brand_title ? `${item.task_type} - ${item.brand_title}` : "네이버"}</TableCell>
                              <TableCell>
                                <p className="truncate overflow-ellipsis overflow-hidden max-w-[500px]">{item.target_url}</p>
                              </TableCell>
                              <TableCell>{item.status}</TableCell>
                              <TableCell>{`${item.updated_at.slice(0, 10)} ${item.updated_at.slice(11, 13)}:${item.updated_at.slice(14, 16)}`}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCrawlingItem(item.id);
                                    setCrawlingResultsCurrentPage(1);
                                    fetchCrawlingProductList(item.id)
                                    setSelectedCrawlingResults([])
                                  }}
                                >
                                  {selectedCrawlingItem === item.id ? "선택됨" : "선택"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Pagination className="mt-2">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCrawlingCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={crawlingCurrentPage === 1}
                          />
                        </PaginationItem>
                        {[...Array(crawlingTotalPages)].map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => setCrawlingCurrentPage(index + 1)}
                              isActive={crawlingCurrentPage === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCrawlingCurrentPage(prev => Math.min(prev + 1, crawlingTotalPages))}
                            disabled={crawlingCurrentPage === crawlingTotalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">결과목록</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-4 border rounded-md p-2">
                          {(Object.entries(STATUS_LABELS) as [StatusType, string][]).map(([status, label]) => (
                            <label key={status} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedStatuses.includes(status)}
                                onChange={() => handleStatusChange(status)}
                                className="w-4 h-4"
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                        <div className="space-x-2">
                          <Button 
                            onClick={handleBinding}
                            disabled={selectedCrawlingResults.filter(item => item.detail_status === 'completed').length === 0}
                          >
                            선택항목 바인딩 ({selectedCrawlingResults.filter(item => item.detail_status === 'completed').length})
                          </Button>
                          <Button 
                            onClick={() => handleSaveSelectedCrawlingResults()}
                            disabled={selectedCrawlingResults.length === 0}
                          >
                            선택항목 저장 ({selectedCrawlingResults.length})
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <input 
                                type="checkbox"
                                checked={crawlingResults.length > 0 && selectedCrawlingResults.length === crawlingResults.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCrawlingResults(crawlingResults);
                                  } else {
                                    setSelectedCrawlingResults([]);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </TableHead>
                            <TableHead>TYPE</TableHead>
                            <TableHead>브랜드</TableHead>
                            <TableHead>이미지</TableHead>
                            <TableHead>상품명</TableHead>
                            <TableHead>가격</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>선택</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredResults()
                            .slice((crawlingResultsCurrentPage - 1) * PAGE_SIZE, crawlingResultsCurrentPage * PAGE_SIZE)
                            .map((item) => (
                              <TableRow 
                                key={item.id}
                                className={selectedCrawlingResults.includes(item) ? "bg-muted/50" : ""}
                              >
                                <TableCell>
                                  <input 
                                    type="checkbox"
                                    checked={selectedCrawlingResults.includes(item)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCrawlingResults([...selectedCrawlingResults, item]);
                                      } else {
                                        setSelectedCrawlingResults(
                                          selectedCrawlingResults.filter((selected) => selected.id !== item.id)
                                        );
                                      }
                                    }}
                                    className="w-4 h-4"
                                  />
                                </TableCell>
                                <TableCell>{item.task_type}</TableCell>
                                <TableCell>{item.brand_title}</TableCell>
                                <TableCell>
                                  <img src={item.image_src} alt="상품이미지" className="w-32 h-32 object-cover" />
                                </TableCell>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{STATUS_LABELS[item.detail_status as StatusType] || item.detail_status}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline" 
                                    size="sm" 
                                    disabled={item.detail_status !== 'completed'}
                                    onClick={() => {
                                      handleShowCrawlingProductDetail(item)
                                    }}
                                  >
                                    상세보기
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Pagination className="mt-2">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCrawlingResultsCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={crawlingResultsCurrentPage === 1}
                          />
                        </PaginationItem>
                        {Array.from({ length: filteredResultsTotalPages }, (_, i) => i + 1)
                          .filter(page => 
                            page === 1 || 
                            page === filteredResultsTotalPages || 
                            Math.abs(page - crawlingResultsCurrentPage) <= 2
                          )
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setCrawlingResultsCurrentPage(page)}
                                  isActive={crawlingResultsCurrentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCrawlingResultsCurrentPage(prev => 
                              Math.min(prev + 1, filteredResultsTotalPages)
                            )}
                            disabled={crawlingResultsCurrentPage === filteredResultsTotalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline">파일 선택</Button>
                  <span className="text-sm text-muted-foreground">선택된 파일이 없습니다</span>
                </div>
                
                <div className="rounded-lg border h-[400px] flex items-center justify-center text-muted-foreground">
                  업로드된 데이터가 없습니다
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedProductDetail && (
            <div className="space-y-4">
              {/* 1. 기본 정보 섹션 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기본 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">상품 설명</h4>
                      <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                        {isDescriptionOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="bg-muted rounded-lg p-4 mt-2">
                        <p className="whitespace-pre-wrap">{selectedProductDetail.description}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              {/* 2. 이미지 섹션 */}
              {(selectedProductDetail.detail_json?.thumbnails || selectedProductDetail.detail_json?.detailImages) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">이미지 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 썸네일 이미지 */}
                    {selectedProductDetail.detail_json?.thumbnails && (
                      <Collapsible open={isThumbnailsOpen} onOpenChange={setIsThumbnailsOpen}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">썸네일 이미지 ({selectedProductDetail.detail_json.thumbnails.length})</h4>
                          <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                            {isThumbnailsOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {selectedProductDetail.detail_json.thumbnails.map((url: string, index: number) => (
                              <div key={index} className="aspect-square relative">
                                <img 
                                  src={url} 
                                  alt={`썸네일 이미지 ${index + 1}`}
                                  className="object-cover rounded-lg w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    
                    {/* 세 이미지 */}
                    {selectedProductDetail.detail_json?.detailImages && (
                      <Collapsible open={isDetailImagesOpen} onOpenChange={setIsDetailImagesOpen}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">상세 이미지 ({selectedProductDetail.detail_json.detailImages.length})</h4>
                          <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                            {isDetailImagesOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {selectedProductDetail.detail_json.detailImages.map((url: string, index: number) => (
                              <div key={index} className="aspect-square relative">
                                <img 
                                  src={url} 
                                  alt={`상세 이미지 ${index + 1}`}
                                  className="object-cover rounded-lg w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 3. 상세 내용 섹션 */}
              {selectedProductDetail.detail_json?.contentHtml && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">상세 내용</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Collapsible open={isContentHtmlOpen} onOpenChange={setIsContentHtmlOpen}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">HTML 컨텐츠</h4>
                        <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                          {isContentHtmlOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div 
                          className="bg-muted p-3 rounded mt-2"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedProductDetail.detail_json.contentHtml 
                          }} 
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}

              {/* 4. 옵션 정보 섹션 */}
              {selectedProductDetail.detail_json?.options && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">옵션 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Collapsible open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">옵션 목록 ({selectedProductDetail.detail_json.options.length})</h4>
                        <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                          {isOptionsOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="grid gap-2 mt-2">
                          {selectedProductDetail.detail_json.options.map((option: any, index: number) => (
                            <div key={index} className="bg-muted p-3 rounded">
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(option).map(([key, value]) => (
                                  <div key={key} className="col-span-1">
                                    <span className="font-medium">{key}: </span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}

              {/* 5. 기타 정보 섹션 */}
              {Object.entries(selectedProductDetail.detail_json || {})
                .filter(([key]) => !['options', 'contentHtml', 'productNotice', 'thumbnails', 'detailImages'].includes(key))
                .length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">기타 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Collapsible open={isOtherInfoOpen} onOpenChange={setIsOtherInfoOpen}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">추가 정보</h4>
                        <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                          {isOtherInfoOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="bg-muted rounded-lg p-4 mt-2">
                          {Object.entries(selectedProductDetail.detail_json || {})
                            .filter(([key]) => !['options', 'contentHtml', 'productNotice', 'thumbnails', 'detailImages'].includes(key))
                            .map(([key, value]) => (
                              <div key={key} className="grid grid-cols-3 gap-4 border-b py-2 last:border-0">
                                <span className="font-medium">{key}</span>
                                <span className="col-span-2">{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}

              {/* 6. 스펙 정보 섹션 */}
              {Object.keys(selectedProductDetail.specifications || {}).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">스펙 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Collapsible open={isSpecificationsOpen} onOpenChange={setIsSpecificationsOpen}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">상세 스펙</h4>
                        <CollapsibleTrigger className="hover:bg-muted p-1 rounded">
                          {isSpecificationsOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="bg-muted rounded-lg p-4 mt-2">
                          {Object.entries(selectedProductDetail.specifications || {}).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-3 gap-4 border-b py-2 last:border-0">
                              <span className="font-medium">{key}</span>
                              <span className="col-span-2">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

