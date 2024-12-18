'use client'

import React, { useState, useEffect, useMemo, useRef } from "react"
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
import { useUserDataStore } from "@/store/modules"
import { useSupplierStore } from "@/store/modules/supplierStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SupplierSelector } from "@/components/supplier-selector"
import { useSearchParams } from 'next/navigation'
import { platform } from "os"

const PAGE_SIZE = 10;

type StatusType = 'pending' | 'in_progress' | 'completed' | 'failed' | 'binding' | 'start';

const STATUS_LABELS: Record<StatusType, string> = {
  pending: '대기중',
  start: '진행중',
  in_progress: '진행중',
  completed: '완료',
  failed: '실패',
  binding: '바인딩완료'
};

const EXCLUDED_CATEGORIES = ['HOME', 'ALL', 'SHOP'];

export default function ProductRegistration() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  
  const getInitialTab = () => {
    switch (type) {
      case 'url':
        return 'url'
      case 'upload':
        return 'file'
      case 'direct':
      default:
        return 'job'
    }
  }

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
  const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>(['pending', 'in_progress', 'completed', 'failed', 'binding', 'start'])
  const [crawlingSelectList, setCrawlingSelectList] = useState<{ name: string; code: string }[]>([])
  const [showExcludedCategoriesModal, setShowExcludedCategoriesModal] = useState(false);
  const [excludedItems, setExcludedItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{[key: string]: string}>({});
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [newCategories, setNewCategories] = useState<{
    [key: string]: {
      name: string;
      pathname: string;
      depth: number;
      parentId: string | null;
    }
  }>({});
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [categoryInputModes, setCategoryInputModes] = useState<{[key: string]: 'select' | 'input'}>({});
  const [showCategoryManageModal, setShowCategoryManageModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { user } = useUserDataStore()
  const selectedStoreSupplier = useSupplierStore(state => state.selectedSupplier)

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

  const handleSupplierSelect = async (supplier: any) => {
    try {
      // 공급사 전체 정보를 다시 조회
      const { data: fullSupplierData, error: supplierError } = await supabase
        .from('company_supply')
        .select(`
          id,
          companyid,
          supplyname,
          contact,
          address,
          businessnumber,
          email,
          fax,
          website,
          managername,
          managertel,
          manageremail,
          bankaccount,
          bankname,
          paymentterms,
          currency,
          notes,
          created,
          updated,
          vendproductcd
        `)
        .eq('id', supplier.id)
        .single();

      if (supplierError) throw supplierError;

      console.log('Selected Supplier Full Data:', fullSupplierData); // 데이터 확인용 로그

      if (!fullSupplierData.vendproductcd) {
        throw new Error('공급사의 vendproductcd가 설정되지 않았습니다.');
      }

      setSelectedSupplier(fullSupplierData);
      setSelectedCrawlingResults([]);
      setSelectedCrawlingItem(null);
      setCrawlingCurrentPage(1);
      
      const { data, error } = await supabase
        .from('crawlingtaskqueue')
        .select('*')
        .eq('company_supply_id', supplier.id)
        .eq('company_id', supplier.companyid)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCrawlingProgress(data || []);
    } catch (error) {
      console.error('공급사 선택 또는 크롤링 진행상황 조회 실패:', error);
      alert(error instanceof Error ? error.message : '공급사 정보 로딩 중 오류가 발생했습니다.');
      setCrawlingProgress([]);
    }
  };

  const handleSetCrawlingtaskqueue = async () => {
    try {
      if (selectedSupplier) {
        const { id : supplierId, companyid } = selectedSupplier
        
        const { error } = await supabase
          .from('crawlingtaskqueue')
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

        if (error) throw error
      }
    } catch (error) {
      console.error('크롤링 작업 등록 실패:', error)
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
      
      // 업데이트 성공 후 선 기화
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
    const initializeData = async () => {
      if (user) {
        await fetchSupplierData(user.companyid)
        await fetchCrawlingBrandList()
        
        if (selectedStoreSupplier) {
          try {
            const { data, error } = await supabase
              .from('crawlingtaskqueue')
              .select('*')
              .eq('company_supply_id', selectedStoreSupplier.id)
              .eq('company_id', selectedStoreSupplier.companyid)
              .order('updated_at', { ascending: false })

            if (error) throw error
            setCrawlingProgress(data || [])
            setSelectedSupplier(selectedStoreSupplier)
          } catch (error) {
            console.error('초기 크롤링 진행상황 로딩 실패:', error)
            setCrawlingProgress([])
          }
        }
      }
    }

    initializeData()
  }, [user, selectedStoreSupplier])

  useEffect(() => {
    if (!selectedSupplier) return

    const crawlingTaskChannel = supabase
      .channel('crawling-task-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crawlingtaskqueue',
          filter: `company_supply_id=eq.${selectedSupplier.id}`,
        },
        (payload) => {
          if (payload.new && 'company_supply_id' in payload.new) {
            switch (payload.eventType) {
              case 'INSERT':
                setCrawlingProgress(prev => [payload.new, ...prev])
                break
              case 'UPDATE':
                setCrawlingProgress(prev => 
                  prev.map(item => item.id === payload.new.id ? payload.new : item)
                )
                break
              case 'DELETE':
                setCrawlingProgress(prev => 
                  prev.filter(item => item.id !== payload.old.id)
                )
                break
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(crawlingTaskChannel)
    }
  }, [selectedSupplier])

  const fetchSupplierData = async (companyid: string) => {
    try {
      const { data, error } = await supabase
        .from('company_supply')
        .select(`
          id,
          companyid,
          supplyname,
          contact,
          address,
          businessnumber,
          email,
          fax,
          website,
          managername,
          managertel,
          manageremail,
          bankaccount,
          bankname,
          paymentterms,
          currency,
          notes,
          created,
          updated,
          vendproductcd
        `)
        .eq('companyid', companyid);

      if (error) throw error;
      
      setFilteredSuppliers(data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const saveItem = async (detail: any, supplier: any, product_id: string) => {
    try {
      // supplier 데이터 재확인
      const { data: supplierData, error: supplierError } = await supabase
        .from('company_supply')
        .select('*')
        .eq('companyid', user?.companyid)
        .eq('id', supplier.id)
        .single();

      if (supplierError) throw supplierError;

      // 원본 URL 가져오기 - detail.product_id 대신 item.id 사용
      const { data: productData, error: productError } = await supabase
        .from('crawlingproductlist')
        .select('url, task_type')
        .eq('id', product_id)
        .single();

      if (productError) throw productError;

      // ECSKU 생성을 위한 최대 인덱스 조회
      const { data: skuHistory, error: skuError } = await supabase
        .from('items_sku_history')
        .select('maxidx')
        .eq('companyid', user?.companyid)
        .eq('supplyid', supplier.id)
        .single();

      let nextIdx = 1;
      if (skuError && skuError.code !== 'PGRST116') {
        throw skuError;
      } else if (skuHistory) {
        nextIdx = (skuHistory.maxidx || 0) + 1;
      }

      const formattedIdx = nextIdx.toString().padStart(5, '0');
      const ecsku = supplierData.vendproductcd 
        ? `${supplierData.vendproductcd}${formattedIdx}`
        : `TEMP${formattedIdx}`; // vendproductcd가 없는 경우 임시 prefix 사용

      const itemData = {
        id: crypto.randomUUID(),
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
        supplyid: supplier.id,
        originalcontent: detail.contentHtml,
        originalname: detail.title,
        noticeinfo: JSON.stringify(detail.productNotice || specs),
        purchaseprice: detail.beforeDiscount || detail.price,
        ecsku: ecsku,
        sellersku: detail.sku?.toString() || null,
        orginurl: productData.url,
        fromplatform: productData.task_type
      };

      // items 테이블 저장
      const { data: savedItem, error: itemError } = await supabase
        .from('items')
        .insert([itemData])
        .select()
        .single();

      if (itemError) throw itemError;

      // items_sku_history 업데이트 또는 생성
      const { error: historyError } = await supabase
        .from('items_sku_history')
        .upsert({
          companyid: user?.companyid,
          supplyid: supplier.id,
          maxidx: nextIdx,
        });

      if (historyError) throw historyError;

      return savedItem;
    } catch (error) {
      console.error('상품 저장 실패:', error);
      throw error;
    }
  };

  const handleBinding = async () => {
    try {
      const itemsToUpdate = selectedCrawlingResults.filter(item => item.detail_status === 'completed');
      const excludedCategories = EXCLUDED_CATEGORIES;
      
      // 네버가 아닌 상품들만 카테고리 체크
      const nonNaverItems = itemsToUpdate.filter(item => item.task_type !== 'naver');
      
      // 네이버가 아닌 상품들에 대해서만 카테고리 체크
      const itemsWithExcludedCategories = [];
      for (const item of nonNaverItems) {
        const { data: detailData } = await supabase
          .from('crawlingproductdetail')
          .select('*')
          .eq('product_id', item.id)
          .single();

        const category = detailData?.detail_json?.category;
        const categoryString = typeof category === 'string' ? category : '';
        
        if (!categoryString || 
            excludedCategories.some(excluded => 
              categoryString.toUpperCase().split('>').some(cat => 
                cat.trim() === excluded
              )
            )) {
          itemsWithExcludedCategories.push({
            ...item,
            category: categoryString || '카테고리 없음',
            title: detailData.detail_json.title,
            id: item.id
          });
        }
      }
      
      // 네이버가 아닌 상품 중 제외 카테고리가 있으면 팝업 표시
      if (itemsWithExcludedCategories.length > 0) {
        setExcludedItems(itemsWithExcludedCategories);
        setSelectedCategories({});
        setShowExcludedCategoriesModal(true);
        return;
      }

      // 모든 상품(네이버 + 비네이버) 처리
      for (const item of itemsToUpdate) {
        const { data: detailData, error: detailError } = await supabase
          .from('crawlingproductdetail')
          .select('*')
          .eq('product_id', item.id)
          .single();
        
        if (detailError) throw detailError;

        const detail = detailData.detail_json;
        const specs = detailData.specifications;

        // 상 저장
        const savedItem = await saveItem(detail, selectedSupplier, detailData.product_id);

        // 네이버 상품의 경우 카테고리 바로 저장
        if (item.task_type === 'naver' && detail.category?.path) {
          const categoryPaths = detail.category.path.split('>');
          const categoryIds = detail.category.wholeId.split('>');
          
          let parentCategoryId = null;
          
          // 카테고리 층 구조 순차로 저장
          for (let i = 0; i < categoryPaths.length; i++) {
            const categoryName = categoryPaths[i].trim();
            const categoryId = categoryIds[i];
            const fullPath = categoryPaths.slice(0, i + 1).join('>');

            // 현 depth 카테고리가 이미 존재하는지 확인
            const { data: existingCategory } = await supabase
              .from('categories')
              .select('*')
              .eq('platform', 'SMART_STORE')
              .eq('country', 'KR')
              .eq('categoryid', categoryId)
              .single();

            let currentCategoryId;
            if (existingCategory) {
              currentCategoryId = existingCategory.id;
            } else {
              // 새 카테고리 성
              const { data: savedCategory, error: categoryError } = await supabase
                .from('categories')
                .insert({
                  id: crypto.randomUUID(),
                  categoryid: categoryId,
                  platform: 'SMART_STORE',
                  country: 'KR',
                  parentcategoryid: parentCategoryId,
                  name: categoryName,
                  pathname: fullPath,
                  createdat: new Date().toISOString(),
                  depth: i
                })
                .select()
                .single();

              if (categoryError) throw categoryError;
              currentCategoryId = savedCategory.id;
            }

            // 다 depth의 부모 카테고리 ID로 설정
            parentCategoryId = currentCategoryId;

            // 마지막 depth의 카테고리일 경우 item과 매핑
            if (i === categoryPaths.length - 1) {
              const { error: mapError } = await supabase
                .from('item_category_maps')
                .insert({
                  id: crypto.randomUUID(),
                  companyid: user?.companyid,
                  categoryid: currentCategoryId,
                  itemid: savedItem.id,
                  createdat: new Date().toISOString()
                });

              if (mapError) throw mapError;
            }
          }
        }

        // 옵션과 이미지 처리는 모든 상품에 공통로 적용
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

        // 이미지 처리
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

        // 크롤링 상태 업이트
        const { error: updateError } = await supabase
          .from('crawlingproductlist')
          .update({ detail_status: 'binding' })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      setSelectedCrawlingResults([]);
      if (selectedCrawlingItem) {
        fetchCrawlingProductList(selectedCrawlingItem);
      }

    } catch (error) {
      console.error('바인딩 처리 중 오류:', error);
      alert('바인딩 처리 중 오류가 발생했습니다.');
    }
  };

  const handleStatusChange = (status: StatusType) => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      // 상태가 변될 때 페이지 초기화
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('platform', selectedCrawlingTaskType.toUpperCase())
          .eq('country', 'KR')
          .order('pathname', { ascending: true });

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      }
    };

    fetchCategories();
  }, [selectedCrawlingTaskType]);

  const handleCategorySearch = (searchTerm: string, itemId: string) => {
    setCategorySearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredCategories([]);
      return;
    }

    const filtered = categories.filter(category => 
      category.pathname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleAddNewCategory = async (itemId: string) => {
    try {
      const newCategory = newCategories[itemId];
      if (!newCategory?.name) return;

      // 동일한 이름 카테고리가 있는지 인 (platform 함께 체크)
      const { data: existingCategory, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .eq('name', newCategory.name)
        .single();

      if (existingCategory) {
        alert(`이미 존재하는 카테고리입니다: ${existingCategory.pathname}`);
        return;
      }

      const { data: lastCategory } = await supabase
        .from('categories')
        .select('categoryid')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .order('categoryid', { ascending: false })
        .limit(1)
        .single();

      const newCategoryId = lastCategory 
        ? (parseInt(lastCategory.categoryid) + 1).toString()
        : '50000000';

      const newCategoryData = {
        id: crypto.randomUUID(),
        categoryid: newCategoryId,
        platform: selectedCrawlingTaskType.toUpperCase(),
        country: 'KR',
        parentcategoryid: newCategory.parentId,
        name: newCategory.name,
        pathname: newCategory.pathname,
        createdat: new Date().toISOString(),
        depth: newCategory.depth
      };

      const { data: insertedCategory, error } = await supabase
        .from('categories')
        .insert([newCategoryData])
        .select()
        .single();

      if (error) throw error;

      // 테고리 목록 새로고침 (platform 필터 포함)
      const { data: updatedCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .order('pathname', { ascending: true });

      if (fetchError) throw fetchError;
      
      setCategories(updatedCategories || []);
      setSelectedCategories({
        ...selectedCategories,
        [itemId]: insertedCategory.id
      });

      // 해당 아이템의 새 카테고리 입력 상태 초기화
      setNewCategories(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      setCategoryInputModes(prev => ({
        ...prev,
        [itemId]: 'select'
      }));

    } catch (error) {
      console.error('새 카테고리 추가 실패:', error);
      alert('카테고리 추가 중 오류가 발생했습니다.');
    }
  };

  const handleBindingWithCategories = async () => {
    try {
      for (const item of excludedItems) {
        const { data: supplierData, error: supplierError } = await supabase
          .from('company_supply')
          .select('*')
          .eq('companyid', user?.companyid)
          .eq('id', selectedSupplier.id)
          .single();


        const { data: detailData, error: detailError } = await supabase
          .from('crawlingproductdetail')
          .select('*')
          .eq('product_id', item.id)
          .single();

        if (detailError) throw detailError;

        // 원본 URL 가져오기
        const { data: productData, error: productError } = await supabase
          .from('crawlingproductlist')
          .select('url, task_type')
          .eq('id', item.id)
          .single();

        if (productError) throw productError;

        // ECSKU 생성을 위한 최대 인덱스 조회
        const { data: skuHistory, error: skuError } = await supabase
          .from('items_sku_history')
          .select('maxidx')
          .eq('companyid', user?.companyid)
          .eq('supplyid', selectedSupplier.id)
          .single();

        let nextIdx = 1;
        if (skuError && skuError.code !== 'PGRST116') {
          throw skuError;
        } else if (skuHistory) {
          nextIdx = (skuHistory.maxidx || 0) + 1;
        }

        const formattedIdx = nextIdx.toString().padStart(5, '0');
        const ecsku = `${supplierData.vendproductcd}${formattedIdx}`

        const detail = detailData.detail_json;
        const specs = detailData.specifications;

        const itemData = {
          id: crypto.randomUUID(),
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
          consumerprice: detail.beforeDiscount || detail.price,
          contenthtml: detail.contentHtml,
          supplyid: selectedSupplier.id,
          originalcontent: detail.contentHtml,
          originalname: detail.title,
          noticeinfo: JSON.stringify(detail.productNotice || specs),
          purchaseprice: detail.beforeDiscount || detail.price,
          ecsku: ecsku,
          sellersku: detail.sku?.toString() || null,
          orginurl: productData.url,
          fromplatform: productData.task_type,  
        };

        // items 테이블에 저장
        const { data: savedItem, error: itemError } = await supabase
          .from('items')
          .insert([itemData])
          .select()
          .single();

        if (itemError) throw itemError;

        // items_sku_history 업데이트
        const { error: historyError } = await supabase
          .from('items_sku_history')
          .upsert({
            companyid: user?.companyid,
            supplyid: selectedSupplier.id,
            maxidx: nextIdx,
          });

        if (historyError) throw historyError;

        // ... 나머지 코드 (카테고리 매핑, 옵션, 이미지 처리 등)
        const selectedCategoryId = selectedCategories[item.id];
        if (selectedCategoryId) {
          // 카테고리 매핑 저장
          const { error: mapError } = await supabase
            .from('item_category_maps')
            .insert({
              id: crypto.randomUUID(),
              companyid: user?.companyid,
              categoryid: selectedCategoryId,
              itemid: savedItem.id,
              createdat: new Date().toISOString()
            });

          if (mapError) throw mapError;
        }

        // 옵션 저장
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

        // 이미지 저장
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

        // 크롤링 상태 업데이트
        const { error: updateError } = await supabase
          .from('crawlingproductlist')
          .update({ detail_status: 'binding' })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      setShowExcludedCategoriesModal(false);
      setSelectedCrawlingResults([]);
      if (selectedCrawlingItem) {
        fetchCrawlingProductList(selectedCrawlingItem);
      }

    } catch (error) {
      console.error('바인딩 처리 중 오류:', error);
      alert('바인딩 처리 중 오류가 발생했습니다.');
    }
  };

  const CategoryInputRow = ({ item }: { item: any }) => {
    const [mode, setMode] = useState('select');
    const [inputValue, setInputValue] = useState('');

    // 카테고리 목록 새로고침 함수
    const refreshCategories = async () => {
      try {
        const { data: updatedCategories, error } = await supabase
          .from('categories')
          .select('*')
          .eq('platform', selectedCrawlingTaskType.toUpperCase())
          .eq('country', 'KR')
          .order('pathname', { ascending: true });

        if (error) throw error;
        setCategories(updatedCategories || []);
      } catch (error) {
        console.error('카테고리 목록 새���고침 실패:', error);
      }
    };

    const handleAdd = async () => {
      if (inputValue.trim()) {
        setNewCategories(prev => ({
          ...prev,
          [item.id]: {
            name: inputValue,
            pathname: inputValue,
            depth: 0,
            parentId: null
          }
        }));
        await handleAddNewCategory(item.id);
        await refreshCategories(); // 카테고리 목록 새로고침
        setInputValue('');
        setMode('select');
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={mode === 'select' ? "default" : "outline"}
            size="sm"
            onClick={() => setMode('select')}
          >
            카테고리 선택
          </Button>
          <Button
            variant={mode === 'input' ? "default" : "outline"}
            size="sm"
            onClick={() => setMode('input')}
          >
            카테고리 직접입력
          </Button>
        </div>

        {mode === 'select' ? (
          <div className="w-full">
            {categories.length > 0 ? (
              <Select 
                value={selectedCategories[item.id] || ''} 
                onValueChange={(value) => {
                  setSelectedCategories({
                    ...selectedCategories,
                    [item.id]: value
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categories
                    .sort((a, b) => a.pathname.localeCompare(b.pathname))
                    .map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                      >
                        {category.pathname}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">
                등록된 카테고리가 없습니다.
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="새 카테고리명 입력"
            />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!inputValue.trim()}
            >
              추가
            </Button>
          </div>
        )}

        {selectedCategories[item.id] && (
          <div className="mt-1 text-sm text-blue-600">
            {categories.find(c => c.id === selectedCategories[item.id])?.pathname}
          </div>
        )}
      </div>
    );
  };

  const handleAddCategory = async (itemId: string) => {
    try {
      const newCategory = newCategories[newCategoryName];
      if (!newCategory?.name) return;

      // 동일한 이름 카테고리가 있는지 확인 (platform 함께 체크)
      const { data: existingCategory, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .eq('name', newCategory.name)
        .single();

      if (existingCategory) {
        alert(`이미 존재하는 카테고리입니다: ${existingCategory.pathname}`);
        return;
      }

      const { data: lastCategory } = await supabase
        .from('categories')
        .select('categoryid')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .order('categoryid', { ascending: false })
        .limit(1)
        .single();

      const newCategoryId = lastCategory 
        ? (parseInt(lastCategory.categoryid) + 1).toString()
        : '50000000';

      const newCategoryData = {
        id: crypto.randomUUID(),
        categoryid: newCategoryId,
        platform: selectedCrawlingTaskType.toUpperCase(),
        country: 'KR',
        parentcategoryid: newCategory.parentId,
        name: newCategory.name,
        pathname: newCategory.pathname,
        createdat: new Date().toISOString(),
        depth: newCategory.depth
      };

      const { data: insertedCategory, error } = await supabase
        .from('categories')
        .insert([newCategoryData])
        .select()
        .single();

      if (error) throw error;

      // 카테고리 목록 새로고침 (platform 필터 포함)
      const { data: updatedCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .order('pathname', { ascending: true });

      if (fetchError) throw fetchError;
      
      setCategories(updatedCategories || []);
      setSelectedCategories({
        ...selectedCategories,
        [newCategoryName]: insertedCategory.id
      });

      // 해당 아이템의 새 카테고리 입력 상태 초기화
      setNewCategories(prev => {
        const next = { ...prev };
        delete next[newCategoryName];
        return next;
      });
      setCategoryInputModes(prev => ({
        ...prev,
        [newCategoryName]: 'select'
      }));

    } catch (error) {
      console.error('새 카테고리 추가 실패:', error);
      alert('카테고리 추가중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      // 카테고리 목록 새로고침 (platform 필터 포함)
      const { data: updatedCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('platform', selectedCrawlingTaskType.toUpperCase())
        .eq('country', 'KR')
        .order('pathname', { ascending: true });

      if (fetchError) throw fetchError;
      
      setCategories(updatedCategories || []);
      setSelectedCategories(prev => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });

    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      alert('카테고리 삭제중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue={getInitialTab()} className="space-y-4">
        <TabsList className="w-fit mb-6">
          <TabsTrigger value="job">직접 등록</TabsTrigger>
          <TabsTrigger value="url">URL 입력</TabsTrigger>
          <TabsTrigger value="file">파일 업로드</TabsTrigger>
        </TabsList>

        <SupplierSelector 
          onSupplierSelect={handleSupplierSelect} 
          className="mb-6" 
          hideControls={true}
        />

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
                  <Label>치</Label>
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
                      <SelectValue placeholder="네이버 스토어 마트" />
                    </SelectTrigger>
                    <SelectContent>
                    {crawlingSelectList.map((item) => ( // DB에서 가져온 이터로 SelectItem 생성
                        <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    {
                      selectedCrawlingTaskType === 'naver'
                      ? <>
                        <Input 
                        placeholder="URL 입력하세요" 
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
                    <h3 className="text-lg font-semibold mb-2">진행상황</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>쇼핑몰</TableHead>
                            <TableHead>브랜드</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>요일시</TableHead>
                            <TableHead className="text-right">선택</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedCrawlingProgress.map((item) => (
                            <TableRow 
                              key={item.id}
                              className={selectedCrawlingItem === item.id ? "bg-muted/50" : ""}
                            >
                              <TableCell>{item.task_type}</TableCell>
                              <TableCell>{item.brand_title ? `${item.task_type} - ${item.brand_title}` : "네이버"}</TableCell>
                              <TableCell>
                                <p className="truncate overflow-ellipsis overflow-hidden max-w-[500px]">{item.target_url}</p>
                              </TableCell>
                              <TableCell>{STATUS_LABELS[item.status as StatusType] || item.status}</TableCell>
                              <TableCell>{`${item.updated_at.slice(0, 10)} ${item.updated_at.slice(11, 13)}:${item.updated_at.slice(14, 16)}`}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant={selectedCrawlingItem === item.id ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCrawlingItem(item.id);
                                    setCrawlingResultsCurrentPage(1);
                                    fetchCrawlingProductList(item.id)
                                    setSelectedCrawlingResults([])
                                  }}
                                >
                                  선택
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
                            <TableHead>쇼핑몰</TableHead>
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
                                onClick={() => {
                                  // 체크박스 토글
                                  if (selectedCrawlingResults.includes(item)) {
                                    setSelectedCrawlingResults(
                                      selectedCrawlingResults.filter((selected) => selected.id !== item.id)
                                    );
                                  } else {
                                    setSelectedCrawlingResults([...selectedCrawlingResults, item]);
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
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
                                  <img 
                                    src={item.image_src} 
                                    alt="상품이미지" 
                                    className="w-32 h-32 object-cover cursor-pointer" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(item.url, '_blank');
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{STATUS_LABELS[item.detail_status as StatusType] || item.detail_status}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline" 
                                      size="sm" 
                                      disabled={item.detail_status !== 'completed'}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowCrawlingProductDetail(item);
                                      }}
                                    >
                                      상세보기
                                    </Button>
                                    <Button
                                      variant="outline" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(item.url, '_blank');
                                      }}
                                    >
                                      원본보기
                                    </Button>
                                  </div>
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
                  <Button variant="outline">파일 업로드</Button>
                  <span className="text-sm text-muted-foreground">택된 파일이 없습니다</span>
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
                      <h4 className="font-medium">상세 설명</h4>
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

              {/* 2. 이미지 션 */}
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
                    
                    {/* 세부 이미지 */}
                    {selectedProductDetail.detail_json?.detailImages && (
                      <Collapsible open={isDetailImagesOpen} onOpenChange={setIsDetailImagesOpen}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">세부 이미지 ({selectedProductDetail.detail_json.detailImages.length})</h4>
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
                                  alt={`세부 이미지 ${index + 1}`}
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

              {/* 3. 상세 내용 섹 */}
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

      <Dialog open={showExcludedCategoriesModal} onOpenChange={setShowExcludedCategoriesModal}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>제외된 카테고리 항목</DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">일괄 카테고리 선택</h4>
              <div className="flex gap-2">
                <Select 
                  onValueChange={(value) => {
                    // 모든 아이템에 대해 선택된 카테고리 적용
                    const newSelectedCategories = { ...selectedCategories };
                    excludedItems.forEach(item => {
                      newSelectedCategories[item.id] = value;
                    });
                    setSelectedCategories(newSelectedCategories);
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {categories
                      .sort((a, b) => a.pathname.localeCompare(b.pathname))
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.pathname}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    // 선택된 카테고리 초기화
                    setSelectedCategories({});
                  }}
                >
                  초기화
                </Button>
              </div>
            </div>

            <div className="py-4">
              <div className="rounded-md border">
                <div className="max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="w-[400px]">상품명</TableHead>
                        <TableHead className="w-[200px]">현재 카테고리</TableHead>
                        <TableHead>
                          <span>새 카테고리</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {excludedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="align-top font-medium">{item.title}</TableCell>
                          <TableCell className="align-top text-sm text-muted-foreground">{item.category}</TableCell>
                          <TableCell>
                            <CategoryInputRow item={item} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowExcludedCategoriesModal(false)}>
              취소
            </Button>
            <Button 
              onClick={handleBindingWithCategories}
              disabled={Object.keys(selectedCategories).length === 0}
            >
              선택한 카테고리로 바인딩
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">제외된 카테고리 항목</h3>
        <Button
          variant="outline"
          onClick={() => setShowCategoryManageModal(true)}
        >
          카테고리 관리
        </Button>
      </div>

      <Dialog open={showCategoryManageModal} onOpenChange={setShowCategoryManageModal}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>카테고리 관리</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="새 카테고리명 입력"
              />
              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                추가
              </Button>
            </div>
            <div className="h-[400px] overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="flex justify-between items-center p-2 hover:bg-muted">
                  <span>{category.pathname}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

