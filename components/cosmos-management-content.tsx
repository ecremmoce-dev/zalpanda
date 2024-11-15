'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Edit, Globe, ExternalLink, Upload, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import MoveProductEditor from './MoveProductEditor'
import NormalProductEditor from './NormalProductEditor'
import { Console } from 'console'
import { createProgressKey, getProgress } from '../lib/progress';

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
  LastFetchDate: string
  ImageUrl?: string              // 이미지 URL 필드 추가
  OptionMainimage?: string       // 무브상품 이미지 필드 추가
  Keyword?: string              // 키워드 필드 추가
}

interface Option {
  Id: string;
  Name1: string | null;
  Value1: string | null;
  Name2: string | null;
  Value2: string | null;
  Name3: string | null;
  Value3: string | null;
  Name4: string | null;
  Value4: string | null;
  Name5: string | null;
  Value5: string | null;
  Price: number;
  Qty: number;
  ItemTypeCode: string | null;
  Flag: string;
}

interface DetailProduct {
  id: string;
  ItemCode: string;
  CompanyId: string;
  PlatformId: string;
  SellerId: string;
  SellerAuthKey: string;
  Flag: string;
  SellerCode: string;
  ItemStatus: string;
  ItemTitle: string;
  ItemPrice: number;
  ItemQty: number;
  ItemSeriesName: string;
  Weight: number;
  AttributeInfo: string;
  ItemDetail: string;
  ItemDescription: string;
  ImageUrl: string;
  OptionType: string;
  OptionMainimage: string;
  RetailPrice: number;
  TaxRate: number;
  SettlePrice: number;
  ExpireDate: string;
  OptionSubimage: string;
  OptionQty: string;
  Options?: Option[];
  OriginType?: string;
  OriginCountryId?: string;
  OriginRegionId?: string;
  OriginOthers?: string;
  SeasonType?: string;
  LastSyncDate?: string;
  LastFetchDate?: string;
  CreatedAt?: string;
  PromotionName?: string;
  MainCatCd: string;
  MainCatNm: string;
  FirstSubCatCd: string;
  FirstSubCatNm: string;
  SecondSubCatCd: string;
  SecondSubCatNm: string;
  DrugType?: string;
  ProductionPlaceType?: string;
  ProductionPlace?: string;
  IndustrialCodeType?: string;
  IndustrialCode?: string;
  DesiredShippingDate?: number;
  AvailableDateType?: string;
  AvailableDateValue?: string;
  ShippingNo?: string;
  ModelNM?: string;
  ManufacturerDate?: string;
  BrandNo?: string;
  Material?: string;
  AdultYN?: string;
  ContactInfo?: string;
  VideoURL?: string;
  Keyword?: string;
  ListedDate?: string;
  ChangedDate?: string;
  StyleNumber?: string;
  TpoNumber?: string;
  VideoNumber?: string;
  WashinginfoFit?: string;
  [key: string]: any;
}

// Quill 에디터 설정 수정
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': ['', 'center', 'right', 'justify'] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
    ['code'],
  ],
  clipboard: {
    matchVisual: false
  }
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'align',
  'list', 'bullet',
  'link', 'image',
  'code'
]

// React-Quill 동적 임포트 수정
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false }
)

// 헬퍼 함수들 추가
const getProductionPlaceType = (type: string | null | undefined) => {
  switch (type) {
    case '1': return '국내'
    case '2': return '해외'
    case '3': return '기타'
    default: return '-'
  }
}

const getAvailableDateType = (type: string | null | undefined) => {
  switch (type) {
    case '0': return '일반발송'
    case '1': return '상품준비일'
    case '2': return '출시일'
    case '3': return '당일발송'
    default: return '-'
  }
}

// formatDate 함수 수정
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    time: date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

// 산 드 타입 옵션 추가
const INDUSTRIAL_CODE_TYPES = [
  { value: 'J', label: 'JAN' },
  { value: 'K', label: 'KAN' },
  { value: 'I', label: 'ISBN' },
  { value: 'U', label: 'UPC' },
  { value: 'E', label: 'EAN' },
  { value: 'H', label: 'HS' }
]

// 원산지 유형 옵션
const PRODUCTION_PLACE_TYPES = [
  { value: '1', label: '국내' },
  { value: '2', label: '해외' },
  { value: '3', label: '타' }
]

// 일본 지역 옵션 수정
const JAPAN_REGIONS = [
  { value: '0', label: '선택안함' },
  { value: 'HOKKAIDO', label: '北海道(HOKKAIDO)' },
  { value: 'AOMORI', label: '青森県(AOMORI)' },
  { value: 'IWATE', label: '岩手県(IWATE)' },
  { value: 'MIYAGI', label: '宮城県(MIYAGI)' },
  { value: 'AKITA', label: '秋田県(AKITA)' },
  { value: 'YAMAGATA', label: '山形県(YAMAGATA)' },
  { value: 'FUKUSHIMA', label: '福島県(FUKUSHIMA)' },
  { value: 'IBARAKI', label: '茨城県(IBARAKI)' },
  { value: 'TOCHIGI', label: '栃木県(TOCHIGI)' },
  { value: 'GUMMA', label: '群馬県(GUMMA)' },
  { value: 'SAITAMA', label: '埼玉県(SAITAMA)' },
  { value: 'CHIBA', label: '千葉県(CHIBA)' },
  { value: 'TOKYO', label: '東京都(TOKYO)' },
  { value: 'KANAGAWA', label: '神奈川県(KANAGAWA)' },
  { value: 'NIIGATA', label: '新潟県(NIIGATA)' },
  { value: 'TOYAMA', label: '富山県(TOYAMA)' },
  { value: 'ISHIKAWA', label: '石川県(ISHIKAWA)' },
  { value: 'FUKUI', label: '福井県(FUKUI)' },
  { value: 'YAMANASHI', label: '山梨県(YAMANASHI)' },
  { value: 'NAGANO', label: '長野県(NAGANO)' },
  { value: 'GIFU', label: '岐阜県(GIFU)' },
  { value: 'SHIZUOKA', label: '静岡県(SHIZUOKA)' },
  { value: 'AICHI', label: '愛知県(AICHI)' },
  { value: 'MIE', label: '三重県(MIE)' },
  { value: 'SHIGA', label: '滋賀県(SHIGA)' },
  { value: 'KYOTO', label: '京都府(KYOTO)' },
  { value: 'OSAKA', label: '大阪府(OSAKA)' },
  { value: 'HYOGO', label: '兵庫県(HYOGO)' },
  { value: 'NARA', label: '良県(NARA)' },
  { value: 'WAKAYAMA', label: '和歌山県(WAKAYAMA)' },
  { value: 'TOTTORI', label: '鳥取県(TOTTORI)' },
  { value: 'SHIMANE', label: '島(SHIMANE)' },
  { value: 'OKAYAMA', label: '岡山県(OKAYAMA)' },
  { value: 'HIROSHIMA', label: '広島県(HIROSHIMA)' },
  { value: 'YAMAGUCHI', label: '山口県(YAMAGUCHI)' },
  { value: 'TOKUSHIMA', label: '徳島県(TOKUSHIMA)' },
  { value: 'KAGAWA', label: '香川県(KAGAWA)' },
  { value: 'EHIME', label: '愛媛県(EHIME)' },
  { value: 'KOCHI', label: '高知県(KOCHI)' },
  { value: 'FUKUOKA', label: '福岡県(FUKUOKA)' },
  { value: 'SAGA', label: '佐賀県(SAGA)' },
  { value: 'NAGASAKI', label: '長崎県(NAGASAKI)' },
  { value: 'KUMAMOTO', label: '熊本県(KUMAMOTO)' },
  { value: 'OITA', label: '大分県(OITA)' },
  { value: 'MIYAZAKI', label: '宮崎県(MIYAZAKI)' },
  { value: 'KAGOSHIMA', label: '鹿児島県(KAGOSHIMA)' },
  { value: 'OKINAWA', label: '沖縄県(OKINAWA)' }
]

// 국가 코드 옵션 추가
const COUNTRY_OPTIONS = [
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AI', label: 'ANGUILLA' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AE', label: 'Arab Emirates' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AW', label: 'Aruba' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'austria' },
  // ... 나머지 국가들 추가
  { value: 'ZW', label: 'Zimbabwe' }
]

// 상품 상태 옵션 수정
const ITEM_STATUS_OPTIONS = [
  { value: 'S0', label: '검수대기' },
  { value: 'S1', label: '거래대기' },
  { value: 'S2', label: '거래가능' },
  { value: 'S3', label: '거래중지(Qoo10)' },
  { value: 'S5', label: '래제한(Qoo10)' },
  { value: 'S8', label: '거부' }
]

// 상태  색상 함수 수정
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'S0':
      return 'bg-blue-100 text-blue-800'
    case 'S1':
      return 'bg-yellow-100 text-yellow-800'
    case 'S2':
      return 'bg-green-100 text-green-800'
    case 'S3':
      return 'bg-red-100 text-red-800'
    case 'S5':
      return 'bg-purple-100 text-purple-800'
    case 'S8':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 상태 레이블 가져오기 함수
const getStatusLabel = (status: string) => {
  return ITEM_STATUS_OPTIONS.find(opt => opt.value === status)?.label || status
}

// 발송 가능일 유형 옵션 수정
const AVAILABLE_DATE_TYPES = [
  { value: '0', label: '일반발송 (3영업일 내)' },
  { value: '1', label: '상품준비일 (4~14일)' },
  { value: '2', label: '출시일' },
  { value: '3', label: '당일발송' }
]

// 발송 가능일 값 placeholder 및 validation 함수
const getAvailableDatePlaceholder = (type: string) => {
  switch (type) {
    case '0':
      return '1~3일 입력 (예: 3)'
    case '1':
      return '4~14일 입력 (예: 5)'
    case '2':
      return '출시일 입 (예: 2024/03/20)'
    case '3':
      return '발 시간 입력 (예: 14:30)'
    default:
      return ''
  }
}

// 발송 가능일 값 유성 검사
const validateAvailableDateValue = (type: string, value: string): boolean => {
  switch (type) {
    case '0': // 일
      const normalDays = parseInt(value)
      return !isNaN(normalDays) && normalDays >= 1 && normalDays <= 3
    case '1': // 상품준비일
      const prepDays = parseInt(value)
      return !isNaN(prepDays) && prepDays >= 4 && prepDays <= 14
    case '2': // 출시일
      return /^\d{4}\/\d{2}\/\d{2}$/.test(value)
    case '3': // 당일발송
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
    default:
      return false
  }
}

// HTML 변환 함수 추가
const convertHtmlToQoo10Format = (html: string) => {
  return html
    // 이미지가 있는 p 태그 처리
    .replace(/<p([^>]*)><img([^>]*)><\/p>/g, (match, pAttr, imgAttr) => {
      const alignAttr = pAttr.match(/class="ql-align-([^"]*)"/)
      const align = alignAttr ? alignAttr[1] : ''
      
      if (align === 'center') {
        return `<div style="text-align: center;"><img${imgAttr}></div>`
      } else {
        return `<div><img style="display: block; margin-left: auto; margin-right: auto;"${imgAttr}></div>`
      }
    })
    // 중앙 정렬된 텍스트 처리
    .replace(/<p class="ql-align-center">(.*?)<\/p>/g, '<div style="text-align: center;">$1</div>')
    // 나머지 p 태를 div로 변환
    .replace(/<p>(.*?)<\/p>/g, '<div>$1</div>')
    // 빈 줄바꿈 제거
    .replace(/<p><br><\/p>/g, '')
    // 줄바꿈 문자 제거
    .replace(/\n/g, '')
}

// 상품 상태 옵션 추가
const SYNC_STATUS_OPTIONS = [
  { value: 'S1', label: '거래대기' },
  { value: 'S2', label: '거래가능' }
]

interface ProductPreviewProps {
  itemCode: string
  isMoveProduct: boolean
}

const ProductPreview = ({ itemCode, isMoveProduct }: ProductPreviewProps) => {
  const baseUrl = isMoveProduct 
    ? "https://www.qoo10.jp/gmkt.inc/goods/move/movegoods.aspx?goodscode="
    : "https://www.qoo10.jp/g/"

  return (
    <a
      href={`${baseUrl}${itemCode}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
    >
      <ExternalLink className="w-4 h-4 mr-1" />
      {isMoveProduct ? 'MOVE 상품 보기' : '상품 보기'}
    </a>
  )
}

// 테이블 컬럼 정의 부분 수정
const columns = [
  // 기존 컬들...
  {
    id: 'preview',
    header: '미리보기',
    cell: ({ row }: { row: any }) => (
      <ProductPreview 
        itemCode={row.original.itemCode} 
        isMoveProduct={row.original.productType === 'MOVE'}
      />
    )
  }
]

// 상단에 인터페이스 추가
interface Progress {
  current: number;
  total: number;
  normalCount: number;
  moveCount: number;
  successCount: number;
  failCount: number;
  isCompleted: boolean;
}

export function CosmosManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)
  // 상태 선택 상태를 단일 값으로 수정
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['S2']) // 기본값: 거래가능

  const [products, setProducts] = useState<CosmosProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [selectedProduct, setSelectedProduct] = useState<DetailProduct | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<DetailProduct | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('itemCode')

  const [imageUrl, setImageUrl] = useState('')

  // HTML 소스보기 모달 상태 추가
  const [isHtmlSourceOpen, setIsHtmlSourceOpen] = useState(false)
  const [htmlSource, setHtmlSource] = useState('')

  // 기화 진행 상태를 위한 state 추가
  const [syncProgress, setSyncProgress] = useState<Progress | null>(null);

  // 상단에 상태 추가
  const [directItemCode, setDirectItemCode] = useState('');

  const [totalNormalCount, setTotalNormalCount] = useState(0)
  const [totalMoveCount, setTotalMoveCount] = useState(0)

  // 정렬 관련 상태 추가
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 정렬 핸들러 함수
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬된 제품 목록 계산 로직 수정
  const sortedProducts = useMemo(() => {
    // 현재 탭에 해당하는 상품만 필터링
    const filteredProducts = products.filter(product => {
      if (selectedTab === 'all') return true;
      return product.Flag === selectedTab;
    });

    // 필터링된 상품들을 정렬
    return [...filteredProducts].sort((a, b) => {
      if (!sortField) return 0;
      
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'ItemCode':
          return (a.ItemCode || '').localeCompare(b.ItemCode || '') * direction;
        case 'ItemTitle':
          return (a.ItemTitle || '').localeCompare(b.ItemTitle || '') * direction;
        case 'ItemPrice':
          return ((a.ItemPrice || 0) - (b.ItemPrice || 0)) * direction;
        case 'ItemQty':
          return ((a.ItemQty || 0) - (b.ItemQty || 0)) * direction;
        case 'ItemStatus':
          return (a.ItemStatus || '').localeCompare(b.ItemStatus || '') * direction;
        case 'Flag':
          return (a.Flag || '').localeCompare(b.Flag || '') * direction;
        case 'LastSyncDate':
          const dateA = a.LastSyncDate ? new Date(a.LastSyncDate).getTime() : 0;
          const dateB = b.LastSyncDate ? new Date(b.LastSyncDate).getTime() : 0;
          return (dateA - dateB) * direction;
        case 'Keyword':
          return ((a.Keyword || '') as string).localeCompare((b.Keyword || '') as string) * direction;
        default:
          return 0;
      }
    });
  }, [products, selectedTab, sortField, sortDirection]);

  // 정렬 헤더 컴포넌트
  const SortableTableHeader = ({ 
    field, 
    children,
    className = "" 
  }: { 
    field: string, 
    children: React.ReactNode,
    className?: string 
  }) => {
    const isSorted = sortField === field;
    
    return (
      <TableHead 
        className={cn(
          "font-semibold cursor-pointer hover:bg-gray-100/50 text-center", // hover 효과 수정
          className
        )}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1 justify-center">
          <span>{children}</span>
          {isSorted && (
            <span className="text-xs ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </TableHead>
    );
  };

  // 상단에 state 추가
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldLoadData, setShouldLoadData] = useState(false);

  // useEffect 수정
  useEffect(() => {
    if (selectedCompany && selectedPlatform && shouldLoadData) {
      fetchProducts();
    }
  }, [selectedCompany, selectedPlatform, page, selectedTab, shouldLoadData]);

  // LOAD 버튼 클릭 핸들러 추가
  const handleLoadClick = () => {
    setIsInitialLoad(false);
    setShouldLoadData(true);
    fetchProducts();
  };

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
      const searchParams = new URLSearchParams({
        companyId: selectedCompany,
        platformId: selectedPlatform,
        page: page.toString(),
        flag,
        ...(searchTerm && { search: searchTerm, searchField })
      })

      const response = await fetch(`/api/qoo10/cosmos/products?${searchParams.toString()}`)
      const data = await response.json()
      console.log("response.ok", response.ok)
      if (response.ok) {
        setProducts(data.items)
        setTotalPages(data.totalPages)
        setTotalItems(data.totalItems)  // 전체 목 수 (두 컨테이의 합)
        setTotalNormalCount(data.normalCount)  // 일반상품 전체 수
        setTotalMoveCount(data.moveCount)      // 무브상품 전체 수

        // progress store 값 확인을 위한 로그 추가
        //console.log("Progress Store 상태:", progress);
        // console.log("data.total", data.total)
        // console.log("data.normalCount", data.normalCount )
        // console.log("data.moveCount", data.moveCount )
      } else {
        console.error('Failed to fetch products:', data.error)
        setProducts([])
        setTotalPages(1)
        setTotalItems(0)
        setTotalNormalCount(0)
        setTotalMoveCount(0)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
      setTotalPages(1)
      setTotalItems(0)
      setTotalNormalCount(0)
      setTotalMoveCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  // handleSyncToCosmos 함수 수정
  const handleSyncToCosmos = async () => {
    if (!selectedCompany || !selectedPlatform) {
      alert('업체와 플랫폼을 선택해주세요.');
      return;
    }

    if (selectedStatuses.length === 0) {
      alert('거래상태를 선택해주세요.');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(null);

    const progressKey = createProgressKey(selectedCompany, selectedPlatform);
    let eventSource: EventSource | null = null;

    try {
      console.log('EventSource 연결 시작...');

      const eventSourceUrl = `/api/qoo10/cosmos/sync/progress?companyId=${selectedCompany}&platformId=${selectedPlatform}`;
      console.log('EventSource URL:', eventSourceUrl);

      eventSource = new EventSource(eventSourceUrl);

      eventSource.onopen = () => {
        console.log('EventSource 연결 성공');
      };

      eventSource.onmessage = (event) => {
        try {
          console.log('Progress 이벤트 수신:', event.data);
          const progress = JSON.parse(event.data);
          
          setSyncProgress({
            current: progress.current,
            total: progress.total,
            normalCount: progress.normalCount,
            moveCount: progress.moveCount,
            successCount: progress.successCount,
            failCount: progress.failCount,
            isCompleted: progress.isCompleted
          });

          if (progress.isCompleted) {
            console.log('동기화 완료, EventSource 종료');
            eventSource?.close();
            setIsSyncing(false);
            fetchProducts();
          }
        } catch (error) {
          console.error('Progress 데이터 파싱 오류:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource 에러:', error);
        eventSource?.close();
      };

      console.log('동기화 API 호출 시작');
      const response = await fetch('/api/qoo10/cosmos/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          platformId: selectedPlatform,
          itemStatuses: selectedStatuses
        }),
      });

      if (!response.ok) {
        throw new Error('동기화 요청이 실패했습니다.');
      }

      const result = await response.json();
      eventSource.close();

      // 동기화 결과 상세 메시지 생성
      let resultMessage = '== QOO10 동기화 결과 ==\n\n';
      
      // 선택된 상태 표시
      resultMessage += '🔍 선택된 거래상태:\n';
      selectedStatuses.forEach(status => {
        resultMessage += `- ${SYNC_STATUS_OPTIONS.find(opt => opt.value === status)?.label}\n`;
      });
      resultMessage += '\n';
      
      // 전체 처리 현황
      resultMessage += '📊 전체 처리 현황\n';
      resultMessage += `- 총 상품 수: ${result.stats.total || 0}개\n`;
      resultMessage += `- 성공: ${result.stats.success || 0}개\n`;
      resultMessage += `- 실패: ${result.stats.fail || 0}개\n\n`;

      // 상품 유형별 현황
      resultMessage += '📦 상품 유형별 현황\n';
      resultMessage += `- 일반상품: ${result.stats.normal || 0}개\n`;
      resultMessage += `- 무브상품: ${result.stats.move || 0}개\n\n`;

      // 동기화 시간 정보
      if (result.syncDate) {
        resultMessage += `🕒 동기화 시간: ${new Date(result.syncDate).toLocaleString()}\n\n`;
      }

      // 최종 결과 표시
      if (result.stats.fail === 0) {
        resultMessage += '✅ 모든 상품이 성공적으로 동기화되었습니다.';
      } else {
        resultMessage += '⚠️ 일부 상품 동기화에 실패했습니다.\n';
        resultMessage += '실패한 상품을 확인하고 다시 시도해주세요.';
      }

      alert(resultMessage);
      console.log('동기화 API 호출 성공');

    } catch (error: any) {
      console.error('기화 실패:', error);
      alert(`동기화 중 류가 발생했습니다.\n\n${error.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      if (eventSource) {
        console.log('EventSource 정리');
        eventSource.close();
      }
      setIsSyncing(false);
    }
  };

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
      if (!response.ok) throw new Error('상품 조회 실패했습니다.')
      
      const product = await response.json()
      setSelectedProduct(product)
      setEditedProduct(product)
      setIsEditing(true)
      setIsDetailDialogOpen(true)
    } catch (error) {
      console.error('상품 조회 실패:', error)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 수정 모 전환
  const handleEditMode = () => {
    if (selectedProduct) {
      const editProduct = {
        ...selectedProduct,
        Options: selectedProduct.Options || [],
        // 원산지 유형 초기값 설정
        ProductionPlaceType: selectedProduct.ProductionPlaceType || '1',
        // 원산지 정보 초기값 설정
        ProductionPlace: selectedProduct.ProductionPlace || ''
      }
      setEditedProduct(editProduct)
      setIsEditing(true)
    }
  }

  // 원산지 형 변경 핸들
  const handleProductionPlaceTypeChange = (value: string) => {
    if (!editedProduct) return

    let productionPlace = ''
    
    // 유형에 따른 기본값 설정
    switch (value) {
      case '1': // 국내
        productionPlace = editedProduct.ProductionPlace || 'TOKYO' // 기본 일본 지역
        break
      case '2': // 해외
        productionPlace = editedProduct.ProductionPlace || 'KR' // 기본 국가
        break
      case '3': // 기타
        productionPlace = '테스트'
        break
    }

    setEditedProduct({
      ...editedProduct,
      ProductionPlaceType: value,
      ProductionPlace: productionPlace
    })
  }

  // 필 값 변경 핸들러
  const handleFieldChange = (field: string, value: any) => {
    if (!editedProduct) return;
    setEditedProduct({
      ...editedProduct,
      [field]: value
    });
  };

  // 저장 핸들러 수정
  const handleSave = async () => {
    if (!editedProduct) return

    try {
      // HTML 변환
      const convertedHtml = convertHtmlToQoo10Format(editedProduct.ItemDetail || '')

      // 변환 HTML로 데이트
      const updatedProduct = {
        ...editedProduct,
        ItemDetail: convertedHtml
      }

      const response = await fetch(`/api/qoo10/cosmos/products/${updatedProduct.ItemCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      })

      if (!response.ok) throw new Error('Failed to update product')

      const result = await response.json()
      setSelectedProduct(result)
      setIsEditing(false)
      setEditedProduct(null)
      fetchProducts() // 목 새고침

      // 저장 성공 메시지
      alert('상품 정보가 저장되었습니다.')

    } catch (error) {
      console.error('Failed to update product:', error)
      alert('상품 수정에 실패했습니다.')
    }
  }

  // 수정 소
  const handleCancel = () => {
    setEditedProduct(null)
    setIsEditing(false)
  }

  // 다이얼로그 닫기 시 상태 초기화
  const handleDialogClose = () => {
    setIsDetailDialogOpen(false)
    setIsEditing(false)
    setEditedProduct(null)
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProduct) return;
    setEditedProduct({
      ...editedProduct,
      ImageUrl: e.target.value
    });
  };

  const ImagePreview = ({ url }: { url: string }) => {
    if (!url) return null
    return (
      <div className="relative">
        <img 
          src={url} 
          alt="상품 이미지" 
          className="mt-2 max-h-[300px] object-contain mx-auto border rounded-lg"
        />
      </div>
    )
  }

  // 이미지 업로드 핸들러 추가
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProduct || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('itemCode', editedProduct.ItemCode)

    try {
      const response = await fetch('/api/qoo10/cosmos/products/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      setEditedProduct({
        ...editedProduct,
        ImageUrl: data.imageUrl
      })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('이미지 업로드에 실패습니다.')
    }
  }

  // 외부 URL 입력 핸들러
  const handleExternalUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProduct) return
    setEditedProduct({
      ...editedProduct,
      ImageUrl: e.target.value
    })
  }

  // 판매상태 옵션
  const itemStatusOptions = [
    { value: 'S1', label: '거래대기' },
    { value: 'S2', label: '거래가능' }
  ]

  // 판매상태 변경 핸들러
  const handleStatusChange = (value: string) => {
    if (!editedProduct) return
    setEditedProduct({
      ...editedProduct,
      ItemStatus: value
    })
  }

  // AI 처리 핸들러를 컴포넌트 내부로 이동
  const handleAIProcess = async () => {
    if (!editedProduct) return

    try {
      // AI 요청 데이터 준
      const requestData = {
        itemTitle: editedProduct.ItemTitle,
        itemDetail: editedProduct.ItemDetail,
        category: `${editedProduct.MainCatNm} > ${editedProduct.FirstSubCatNm} > ${editedProduct.SecondSubCatNm}`
      }

      // AI 서버 요청
      const response = await fetch('/api/qoo10/cosmos/products/ai-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) throw new Error('AI 처리에 실패했습니다.')

      const data = await response.json()
      
      // AI 결과 적용
      setEditedProduct({
        ...editedProduct,
        IndustrialCodeType: data.codeType,
        IndustrialCode: data.code
      })

      alert('산업 코드가 생성되었습니다.')
    } catch (error) {
      console.error('AI 처리 실패:', error)
      alert('산업 코드 생성에 실패했습니다.')
    }
  }

  // QOO10 적용 핸들러 수정
  const handleApplyToQoo10 = async () => {
    if (!selectedProduct) return

    const results = [] // API 호출 결과를 저장할 배열

    try {
      if (selectedProduct.Flag === 'MOVE') {
        // MOVE 상품인 경우
        // 1. ItemsBasic.UpdateMoveGoods API 호출
        console.log('[QOO10 적용] UpdateMoveGoods API 호출 작...')
        const updateMoveGoodsResponse = await fetch(`/api/qoo10/products/move/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            SecondSubCat: selectedProduct.SecondSubCatCd,
            ItemSeriesName: selectedProduct.ItemTitle,
            PromotionName: selectedProduct.PromotionName,
            ItemPrice: selectedProduct.ItemPrice,
            RetailPrice: selectedProduct.RetailPrice,
            TaxRate: selectedProduct.TaxRate,
            OptionType: selectedProduct.OptionType,
            OptionMainimage: selectedProduct.OptionMainimage,
            OptionSubimage: selectedProduct.OptionSubimage,
            OptionQty: selectedProduct.OptionQty,
            StyleNumber: selectedProduct.StyleNumber,
            TpoNumber: selectedProduct.TpoNumber,
            SeasonType: selectedProduct.SeasonType,
            MaterialInfo: selectedProduct.MaterialInfo,
            MaterialNumber: selectedProduct.MaterialNumber,
            AttributeInfo: selectedProduct.AttributeInfo,
            ItemDescription: selectedProduct.ItemDetail,
            WashinginfoWashing: selectedProduct.WashinginfoWashing,
            WashinginfoStretch: selectedProduct.WashinginfoStretch,
            WashinginfoFit: selectedProduct.WashinginfoFit,
            WashinginfoThickness: selectedProduct.WashinginfoThickness,
            WashinginfoLining: selectedProduct.WashinginfoLining,
            WashinginfoSeethrough: selectedProduct.WashinginfoSeethrough,
            ImageOtherUrl: selectedProduct.ImageOtherUrl,
            VideoNumber: selectedProduct.VideoNumber,
            ShippingNo: selectedProduct.ShippingNo,
            AvailableDateValue: selectedProduct.AvailableDateValue,
            DesiredShippingDate: selectedProduct.DesiredShippingDate,
            Keyword: selectedProduct.Keyword,
            OriginType: selectedProduct.ProductionPlaceType,
            OriginRegionId: selectedProduct.ProductionPlaceType === '1' ? selectedProduct.ProductionPlace : '',
            OriginCountryId: selectedProduct.ProductionPlaceType === '2' ? selectedProduct.ProductionPlace : '',
            OriginOthers: selectedProduct.ProductionPlaceType === '3' ? selectedProduct.ProductionPlace : '',
            Weight: selectedProduct.Weight,
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const updateMoveGoodsResult = await updateMoveGoodsResponse.json()
        results.push({
          api: 'UpdateMoveGoods (MOVE 상품 기본정보)',
          success: updateMoveGoodsResult.ResultCode === 0,
          message: updateMoveGoodsResult.ResultMsg,
          returnMessage: `상코드: ${updateMoveGoodsResult.ResultCode}, 메시지: ${updateMoveGoodsResult.ResultMsg}`
        })

        // 2. ItemsOrder.EditMoveGoodsPrice API 호출
        console.log('[QOO10 적용] EditMoveGoodsPrice API 호출 시작...')
        const editMovePriceResponse = await fetch(`/api/qoo10/products/move/price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            ItemPrice: selectedProduct.ItemPrice,
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const editMovePriceResult = await editMovePriceResponse.json()
        results.push({
          api: 'EditMoveGoodsPrice (MOVE 상품 가격)',
          success: editMovePriceResult.ResultCode === 0,
          message: editMovePriceResult.ResultMsg,
          returnMessage: `상태코드: ${editMovePriceResult.ResultCode}, 메시지: ${editMovePriceResult.ResultMsg}`
        })

        // 3. ItemsOptions.EditMoveGoodsInventory API 호출
        console.log('[QOO10 적용] EditMoveGoodsInventory API 호출 시작...')
        const editMoveInventoryResponse = await fetch(`/api/qoo10/products/move/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            OptionQty: selectedProduct.OptionQty,
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const editMoveInventoryResult = await editMoveInventoryResponse.json()
        results.push({
          api: 'EditMoveGoodsInventory (MOVE 상품 재고)',
          success: editMoveInventoryResult.ResultCode === 0,
          message: editMoveInventoryResult.ResultMsg,
          returnMessage: `상태코드: ${editMoveInventoryResult.ResultCode}, 메시지: ${editMoveInventoryResult.ResultMsg}`
        })

      } else {
        // 일반 상품인 경우
        console.log('[QOO10 적용] UpdateGoods API 호출 시작...')
        
        // 발송 가능일 처리
        let availableDateValue = '3'  // 기본값
        let desiredShippingDate = 3   // 기본값
        
        switch (selectedProduct.AvailableDateType) {
          case '0': // 일반발송
            availableDateValue = '3'
            desiredShippingDate = 3
            break
          case '1': // 상품준비일
            availableDateValue = selectedProduct.AvailableDateValue || '4'
            desiredShippingDate = parseInt(availableDateValue)
            break
          case '2': // 출시일
            availableDateValue = selectedProduct.AvailableDateValue || ''
            desiredShippingDate = 0
            break
          case '3': // 당일발송
            availableDateValue = selectedProduct.AvailableDateValue || '14:00'
            desiredShippingDate = 0
            break
          default:
            availableDateValue = '3'
            desiredShippingDate = 3
        }

        const updateGoodsResponse = await fetch(`/api/qoo10/products/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            SecondSubCat: selectedProduct.SecondSubCatCd,
            ItemTitle: selectedProduct.ItemTitle,
            PromotionName: selectedProduct.PromotionName,
            IndustrialCodeType: selectedProduct.IndustrialCodeType,
            IndustrialCode: selectedProduct.IndustrialCode,
            BrandNo: selectedProduct.BrandNo,
            ManufactureDate: selectedProduct.ManufacturerDate,
            ModelNm: selectedProduct.ModelNM,
            Material: selectedProduct.Material,
            ProductionPlaceType: selectedProduct.ProductionPlaceType,
            ProductionPlace: selectedProduct.ProductionPlace,
            RetailPrice: selectedProduct.RetailPrice,
            AdultYN: selectedProduct.AdultYN,
            ContactInfo: selectedProduct.ContactInfo,
            ShippingNo: selectedProduct.ShippingNo,
            Weight: selectedProduct.Weight,
            AvailableDateType: selectedProduct.AvailableDateType,
            AvailableDateValue: availableDateValue,
            DesiredShippingDate: desiredShippingDate,
            Keyword: selectedProduct.Keyword,
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const updateGoodsResult = await updateGoodsResponse.json()
        console.log('[QOO10 적용] UpdateGoods API 응답:', updateGoodsResult)
        
        results.push({
          api: 'UpdateGoods (상품 기본정보)',
          success: updateGoodsResult.ResultCode === 0,
          message: updateGoodsResult.ResultMsg,
          returnMessage: `상태코드: ${updateGoodsResult.ResultCode}, 메시지: ${updateGoodsResult.ResultMsg}`
        })

        // EditGoodsStatus API 호출
        console.log('[QOO10 적] EditGoodsStatus API 호출 시작...')
        const editStatusResponse = await fetch(`/api/qoo10/products/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            Status: selectedProduct.ItemStatus === 'S2' ? '2' : '1',
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const editStatusResult = await editStatusResponse.json()
        console.log('[QOO10 적용] EditGoodsStatus API 응답:', editStatusResult)

        // EditGoodsStatus 에러 메시지 매핑
        const statusErrorMessages: { [key: string]: string } = {
          '-10000': 'API 인증키를 확인해주세요.',
          '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
          '-10002': '검수 중인 상품은 수정할 수 없습다.',
          '-10003': '거래중지된 상품은 수정할 수 없습니다.',
          '-10004': '거래한된 상품은 수정할 수 없습니다.',
          '-10005': '인거부된 상품은 수할 수 없습니다.',
          '-10006': '올바른 상태값을 입력해주세요. (1: 거래대기, 2: 래가능, 3: 거래폐지)',
          '-10101': '처리 중 오류가 발생했습다.'
        }

        results.push({
          api: 'EditGoodsStatus (판매상태)',
          success: editStatusResult.ResultCode === 0,
          message: editStatusResult.ResultMsg,
          returnMessage: `상태코드: ${editStatusResult.ResultCode}, 메시지: ${statusErrorMessages[editStatusResult.ResultCode] || editStatusResult.ResultMsg}`
        })

        // SetGoodsPriceQty API 호출
        console.log('[QOO10 적용] SetGoodsPriceQty API 호출 시작...')
        const setPriceQtyResponse = await fetch(`/api/qoo10/products/price-qty`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ItemCode: selectedProduct.ItemCode,
            SellerCode: selectedProduct.SellerCode,
            Price: selectedProduct.ItemPrice,
            TaxRate: selectedProduct.TaxRate,
            Qty: selectedProduct.ItemQty,
            ExpireDate: selectedProduct.ExpireDate,
            SellerAuthKey: selectedProduct.SellerAuthKey
          })
        })

        const setPriceQtyResult = await setPriceQtyResponse.json()
        console.log('[QOO10 적용] SetGoodsPriceQty API 응답:', setPriceQtyResult)

        // SetGoodsPriceQty 에러 메시지 매핑
        const priceQtyErrorMessages: { [key: string]: string } = {
          '-10000': 'API 인증키를 확인해주세요.',
          '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
          '-10101': '처리 중 오류가 발생했습니다.',
          '-90001': 'API가 존재하지 않습니다.',
          '-90002': '권한이 없습니다.',
          '-90003': '권한이 없습니다.',
          '-90004': 'API 인증키가 만료되었습니다.',
          '-90005': 'API 인증키가 만료되었습니다.'
        }

        results.push({
          api: 'SetGoodsPriceQty (가격/수량)',
          success: setPriceQtyResult.ResultCode === 0,
          message: setPriceQtyResult.ResultMsg,
          returnMessage: `상태코드: ${setPriceQtyResult.ResultCode}, 메시지: ${priceQtyErrorMessages[setPriceQtyResult.ResultCode] || setPriceQtyResult.ResultMsg}`
        })

        // 4. ItemsContents.EditGoodsContents API
        if (selectedProduct.ItemDetail) {
          console.log('[QOO10 적용] EditGoodsContents API 호출 시작...')
          const editContentsResponse = await fetch(`/api/qoo10/products/contents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ItemCode: selectedProduct.ItemCode,
              SellerCode: selectedProduct.SellerCode,
              Contents: selectedProduct.ItemDetail,
              SellerAuthKey: selectedProduct.SellerAuthKey
            })
          })

          const editContentsResult = await editContentsResponse.json()
          console.log('[QOO10 적용] EditGoodsContents API 응답:', editContentsResult)
          results.push({
            api: 'EditGoodsContents (세설명)',
            success: editContentsResult.ResultCode === 0,
            message: editContentsResult.ResultMsg,
            returnMessage: `상태코드: ${editContentsResult.ResultCode}, 메시지: ${editContentsResult.ResultMsg}`
          })
        }

        // 5. ItemsContents.EditGoodsImage API
        if (selectedProduct.ImageUrl) {
          console.log('[QOO10 적] EditGoodsImage API 호출 시작...')
          const editImageResponse = await fetch(`/api/qoo10/products/image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ItemCode: selectedProduct.ItemCode,
              SellerCode: selectedProduct.SellerCode,
              StandardImage: selectedProduct.ImageUrl,
              VideoURL: selectedProduct.VideoURL,
              SellerAuthKey: selectedProduct.SellerAuthKey
            })
          })

          const editImageResult = await editImageResponse.json()
          console.log('[QOO10 적용] EditGoodsImage API 응답:', editImageResult)
          results.push({
            api: 'EditGoodsImage (이미지)',
            success: editImageResult.ResultCode === 0,
            message: editImageResult.ResultMsg,
            returnMessage: `상태코드: ${editImageResult.ResultCode}, 메시지: ${editImageResult.ResultMsg}`
          })
        }
      }

      // 결과 메시지 생성
      const successResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      let resultMessage = '== QOO10 적용 결과 ==\n\n'

      if (successResults.length > 0) {
        resultMessage += '✅ 성공한 API:\n'
        successResults.forEach(r => {
          resultMessage += `- ${r.api}\n  ${r.returnMessage}\n`
        })
        resultMessage += '\n'
      }

      if (failedResults.length > 0) {
        resultMessage += '❌ 실패한 API:\n'
        failedResults.forEach(r => {
          resultMessage += `- ${r.api}\n  ${r.returnMessage}\n`
        })
      }

      if (failedResults.length === 0) {
        resultMessage += '\n✨ 모든 API 호출이 성공적으로 완료되었습니다.'
      }

      alert(resultMessage)

    } catch (error: any) {
      console.error('[QOO10 적용] 실패:', error)
      alert(`QOO10 적용 실패: ${error.message || '알 수 없는 오류가 발생했습니다.'}`)
    }
  }

  // 프그레스바 컴포넌트 수정
  const SyncProgressBar = ({ progress }: { progress: Progress | null }) => {
    if (!progress) return null;

    const percentage = Math.round((progress.current / progress.total) * 100);

    return (
      <div className="fixed top-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg border z-50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">QOO10 상품 동기화 중...</h3>
            <span className="text-sm text-gray-500">
              {percentage}%
            </span>
          </div>
          
          {/* 프로그레스바 */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="flex justify-between">
                <span>처리:</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="flex justify-between">
                <span>일반:</span>
                <span>{progress.normalCount}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>성공:</span>
                <span className="text-green-600">{progress.successCount}</span>
              </div>
              <div className="flex justify-between">
                <span>실패:</span>
                <span className="text-red-600">{progress.failCount}</span>
              </div>
            </div>
          </div>

          {/* 남은 상품 수 */}
          <div className="text-sm text-gray-600 text-center">
            은 상품: {progress.total - progress.current}개
          </div>
        </div>
      </div>
    );
  };

  // 상품 저장 핸들러 추가
  const handleSaveProduct = async (updatedProduct: DetailProduct): Promise<void> => {
    try {
      const completeProduct: DetailProduct = {
        ...selectedProduct,
        ...updatedProduct,
        CompanyId: selectedCompany,
        PlatformId: selectedPlatform,
      };

      const response = await fetch(`/api/qoo10/cosmos/products/${completeProduct.ItemCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const savedProduct = await response.json();
      setSelectedProduct(savedProduct);
      fetchProducts();
      alert('상품이 성공적으로 저장되었습니다.');

    } catch (error) {
      console.error('Failed to save product:', error);
      alert('상품 저장에 실패했습니다.');
      throw error;
    }
  };

  // 직접 동기화 핸들러 추가
  const handleDirectSync = async () => {
    if (!selectedCompany || !selectedPlatform) {
      alert('업체와 플랫폼을 선택해주세요.');
      return;
    }

    if (!directItemCode.trim()) {
      alert('상품코드를 입력해주세요.');
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch('/api/qoo10/cosmos/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          platformId: selectedPlatform,
          itemCode: directItemCode.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('동기화에 실패했습니.');
      }

      const result = await response.json();
      alert('동기화가 완료되었습니다.');
      setDirectItemCode(''); // 입력 필드 기화
      fetchProducts(); // 목록 새로고침

    } catch (error) {
      console.error('Failed to sync specific item:', error);
      alert('동기화에 실패했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  // 복사 상태를 관리하기 위한 state 추가
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);

  // 복사 핸들러 함수 추가
  const handleCopyItemCode = async (itemCode: string) => {
    try {
      await navigator.clipboard.writeText(itemCode);
      setCopiedItemCode(itemCode);
      
      // 1초 후에 복사 상태 초기화
      setTimeout(() => {
        setCopiedItemCode(null);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy item code:', err);
    }
  };

  // 복사 상태 관리를 위한 state 수정 - 상품코드와 셀러코드 구분
  const [copiedCodes, setCopiedCodes] = useState<{
    itemCode: string | null;
    sellerCode: string | null;
  }>({
    itemCode: null,
    sellerCode: null
  });

  // 복사 핸들러 함수 수정
  const handleCopy = async (type: 'itemCode' | 'sellerCode', code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes(prev => ({
        ...prev,
        [type]: code
      }));
      
      // 1초 후에 복사 상태 초기화
      setTimeout(() => {
        setCopiedCodes(prev => ({
          ...prev,
          [type]: null
        }));
      }, 1000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 그리드 템플릿 상수 수정
  const GRID_TEMPLATE = [
    '120px',   // 이미지
    '220px',   // 상품코드
    '150px',   // 셀러코드
    '380px',   // 상품명
    '120px',   // 판매가
    '100px',   // 재고
    '100px',   // 판매상태
    '100px',   // 상품유형
    '120px',   // 최종 동기화
    '60px',    // 관리
  ].join(' ');

  return (
    <div className="p-6">
      <div className="flex justify-between gap-4 mb-6">
        {/* 좌측: 선택 필드들 */}
        <div className="flex gap-4">
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

          {/* LOAD 버튼 추가 */}
          <Button 
            variant="outline"
            onClick={handleLoadClick}
            disabled={!selectedCompany || !selectedPlatform}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            LOAD
          </Button>
        </div>

        {/* 우측: 동기화 버튼들 */}
        <div className="flex gap-2">
        <div className="w-[250px] relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left"
              >
                {selectedStatuses.length > 0 ? (
                  <span className="truncate">
                    {selectedStatuses.map(status => 
                      SYNC_STATUS_OPTIONS.find(opt => opt.value === status)?.label
                    ).join(', ')}
                  </span>
                ) : (
                  '거래상태 택'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2">
                {SYNC_STATUS_OPTIONS.map(status => (
                  <label
                    key={status.value}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStatuses([...selectedStatuses, status.value]);
                        } else {
                          setSelectedStatuses(selectedStatuses.filter(s => s !== status.value));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{status.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
          <div className="flex gap-2">
            <Input
              value={directItemCode}
              onChange={(e) => setDirectItemCode(e.target.value)}
              placeholder="상품코드 직접 입력"
              className="w-[200px]"
            />
            <Button
              onClick={handleDirectSync}
              disabled={!selectedCompany || !selectedPlatform || isSyncing || !directItemCode.trim()}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              직접 동기화
            </Button>
          </div>

          <Button
            onClick={handleSyncToCosmos}
            disabled={!selectedCompany || !selectedPlatform || isSyncing}
            className="min-w-[300px]"
          >
            {isSyncing ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center mb-1">
                  <span className="animate-spin mr-2">⟳</span>
                  QOO10 상품 동기화 중...
                </div>
                {syncProgress && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between gap-4">
                      <span>진행: {syncProgress.current}/{syncProgress.total}</span>
                      <span>남은 상품: {syncProgress.total - syncProgress.current}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>일반: {syncProgress.normalCount}</span>
                      <span>무브: {syncProgress.moveCount}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">↻</span>
                QOO10 상품 동기화
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* 프로그레스바 가 */}
      {isSyncing && <SyncProgressBar progress={syncProgress} />}

      {selectedCompany && selectedPlatform && !isInitialLoad ? (
        <>
          <div className="flex gap-4 mb-4">
            <Select
              value={searchField}
              onValueChange={setSearchField}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="검색 필드" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="itemCode">상품코드</SelectItem>
                <SelectItem value="itemTitle">상품명</SelectItem>
                <SelectItem value="sellerCode">셀러코드</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="검색어를 입력하요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch}>검색</Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="all">
              전체 ({totalMoveCount + totalNormalCount}) {/* totalItems 대신 totalMoveCount + totalNormalCount 사용 */}
            </TabsTrigger>
            <TabsTrigger value="NONE">
              일반 상품 ({totalNormalCount})
            </TabsTrigger>
            <TabsTrigger value="MOVE">
              무브 상품 ({totalMoveCount})
            </TabsTrigger>
          </TabsList>

            <div className="mt-4">
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                {/* 고정 헤더 */}
                <div className="sticky top-0 z-20 bg-gray-50">
                  <div className={`grid grid-cols-[${GRID_TEMPLATE}] border-b`}>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">이미지</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">상품코드</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">셀러코드</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">상품명</div>
                    <div className="font-semibold p-3 text-sm text-right border-r flex items-center justify-end">판매가(円)</div>
                    <div className="font-semibold p-3 text-sm text-right border-r flex items-center justify-end">재고(개)</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">판매상태</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">상품유형</div>
                    <div className="font-semibold p-3 text-sm text-center border-r flex items-center justify-center">최종 동기화</div>
                    <div className="font-semibold p-3 text-sm text-center flex items-center justify-center">관리</div>
                  </div>
                </div>

                {/* 스크롤 가능한 바디 */}
                <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="animate-spin mb-2">⟳</div>
                      <div>데이터를 불러오는 중...</div>
                    </div>
                  ) : !products || products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="mb-2">📭</div>
                      <div>등록된 상품이 없습니다.</div>
                    </div>
                  ) : (
                    sortedProducts.map((product) => (
                      <div 
                        key={product.id}
                        className={`grid grid-cols-[${GRID_TEMPLATE}] hover:bg-gray-50 transition-colors border-b`}
                      >
                        {/* 이미지 */}
                        <div className="p-2 border-r flex items-center justify-center min-h-[80px]">
                          <div className="relative w-[100px] h-[100px]">
                            <img
                              src={product.Flag === 'MOVE' 
                                ? (product.OptionMainimage?.split('$$')[0]?.split('||*')[1] || '/placeholder-image.png')
                                : (product.ImageUrl || '/placeholder-image.png')
                              }
                              alt="상품 이미지"
                              className="w-full h-full object-cover rounded-sm border hover:scale-150 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.png'
                              }}
                            />
                          </div>
                        </div>

                        {/* 상품코드 */}
                        <div className="p-2 border-r flex items-center justify-between min-h-[80px]">
                          <span className="text-sm">{product.ItemCode}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy('itemCode', product.ItemCode);
                              }}
                              title="상품코드 복사"
                            >
                              {copiedCodes.itemCode === product.ItemCode ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `${product.Flag === 'MOVE' 
                                    ? "https://www.qoo10.jp/gmkt.inc/goods/move/movegoods.aspx?goodscode="
                                    : "https://www.qoo10.jp/g/"
                                  }${product.ItemCode}`,
                                  '_blank'
                                );
                              }}
                              title="상품 미리보기"
                            >
                              <ExternalLink className="h-3 w-3 text-gray-500" />
                            </Button>
                          </div>
                        </div>

                        {/* 셀러코드 */}
                        <div className="p-2 border-r flex items-center justify-between min-h-[80px]">
                          <span className="text-sm">{product.SellerCode || '-'}</span>
                          {product.SellerCode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy('sellerCode', product.SellerCode);
                              }}
                              title="셀러코드 복사"
                            >
                              {copiedCodes.sellerCode === product.SellerCode ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-500" />
                              )}
                            </Button>
                          )}
                        </div>

                        {/* 상품명 */}
                        <div className="p-2 border-r flex items-center min-h-[80px]">
                          <div className="text-sm break-words line-clamp-2" title={product.ItemTitle}>
                            {product.ItemTitle}
                          </div>
                        </div>

                        {/* 판매가 */}
                        <div className="p-2 border-r flex items-center justify-end min-h-[80px]">
                          <span className="text-sm tabular-nums">{product.ItemPrice?.toLocaleString() || 0}</span>
                        </div>

                        {/* 재고 */}
                        <div className="p-2 border-r flex items-center justify-end min-h-[80px]">
                          <span className="text-sm tabular-nums">{product.ItemQty?.toLocaleString() || 0}</span>
                        </div>

                        {/* 판매상태 */}
                        <div className="p-2 border-r flex items-center justify-center min-h-[80px]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(product.ItemStatus)}`}>
                            {getStatusLabel(product.ItemStatus)}
                          </span>
                        </div>

                        {/* 상품유형 */}
                        <div className="p-2 border-r flex items-center justify-center min-h-[80px]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.Flag === 'MOVE' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {product.Flag === 'MOVE' ? '무브' : '일반'}
                          </span>
                        </div>

                        {/* 최종 동기화 */}
                        <div className="p-2 border-r flex items-center justify-center min-h-[80px]">
                          <div className="flex flex-col text-xs text-gray-600">
                            <span>{formatDate(product.LastFetchDate).date}</span>
                            <span>{formatDate(product.LastFetchDate).time}</span>
                          </div>
                        </div>

                        {/* 관리 */}
                        <div className="p-2 flex items-center justify-center min-h-[80px]">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(product.ItemCode)}
                            className="hover:bg-gray-100 h-7 w-7 p-0"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 페이지네션 선 */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                  >
                    처음
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                  >
                    ← 이전
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">페이지</span>
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={page}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= totalPages) {
                          setPage(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          setPage(1);
                        } else if (value > totalPages) {
                          setPage(totalPages);
                        }
                      }}
                      className="w-[80px] text-center"
                    />
                    <span className="text-sm text-gray-600">/ {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1"
                  >
                    다음 →
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1"
                  >
                    마지막
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </>
      ) : (
        <div className="mt-4 p-8 text-center text-gray-500 bg-white border rounded-lg">
          <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">데이터를 불러오려면 LOAD 버튼을 클릭하세요</p>
          <p className="text-sm text-gray-400">업체와 플랫폼을 선택한 후 LOAD 버튼을 클릭하면 상품 목록이 표시됩니다.</p>
        </div>
      )}

      {/* 상품 보 다이얼로그 */}
      {isDetailDialogOpen && selectedProduct && (
        <Dialog 
          open={isDetailDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsDetailDialogOpen(false)
              setIsEditing(false)
              setEditedProduct(null)
              setSelectedProduct(null)
            }
          }}
        >
          <DialogContent className="w-full max-w-[60vw] h-[80vh] p-0">
            <div className="h-full overflow-y-auto p-6">
              {selectedProduct.Flag === 'MOVE' ? (
                <MoveProductEditor
                  product={{
                    ...selectedProduct,
                    ItemDescription: selectedProduct.ItemDescription || '',
                    PromotionName: selectedProduct.PromotionName || '',
                    TaxRate: selectedProduct.TaxRate || 0,
                    SettlePrice: selectedProduct.SettlePrice || 0,
                    RetailPrice: selectedProduct.RetailPrice || 0,
                    Weight: selectedProduct.Weight || 0,
                    DesiredShippingDate: selectedProduct.DesiredShippingDate || 0,
                    ItemSeriesName: selectedProduct.ItemSeriesName || '',
                    AttributeInfo: selectedProduct.AttributeInfo || '',
                    ExpireDate: selectedProduct.ExpireDate || '',
                    OptionSubimage: selectedProduct.OptionSubimage || '',
                    OptionQty: selectedProduct.OptionQty || '',
                  }}
                  onSave={async (product) => {
                    await handleSaveProduct({
                      ...selectedProduct,
                      ...product,
                      ItemDetail: product.ItemDescription || '',
                      CompanyId: selectedCompany,
                      PlatformId: selectedPlatform,
                    });
                  }}
                  onCancel={() => setIsDetailDialogOpen(false)}
                />
              ) : (
                <NormalProductEditor
                  product={selectedProduct}
                  onSave={async (product) => {
                    await handleSaveProduct(product);
                  }}
                  onCancel={() => setIsDetailDialogOpen(false)}
                  onApplyToQoo10={handleApplyToQoo10}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* HTML 소스보기/편집 모달 */}
      <Dialog open={isHtmlSourceOpen} onOpenChange={setIsHtmlSourceOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>HTML 소스 보기/편집</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={htmlSource}
              onChange={(e) => setHtmlSource(e.target.value)}
              className="w-full h-[500px] font-mono text-sm p-4 border rounded-lg"
              spellCheck={false}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHtmlSourceOpen(false)}>
              취소
            </Button>
            <Button onClick={() => {
              handleFieldChange('ItemDetail', htmlSource)
              setIsHtmlSourceOpen(false)
            }}>
              적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 