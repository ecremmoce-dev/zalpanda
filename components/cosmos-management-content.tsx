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
import { Edit, Globe, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
  PromotionName: string;
  MainCatCd: string;
  MainCatNm: string;
  FirstSubCatCd: string;
  FirstSubCatNm: string;
  SecondSubCatCd: string;
  SecondSubCatNm: string;
  DrugType: string;
  ProductionPlaceType: string;
  ProductionPlace: string;
  IndustrialCodeType: string;
  IndustrialCode: string;
  RetailPrice: number;
  ItemPrice: number;
  TaxRate: number;
  SettlePrice: number;
  ItemQty: number;
  ExpireDate: string;
  DesiredShippingDate: number;
  AvailableDateType: string;
  AvailableDateValue: string;
  ShippingNo: string;
  ModelNM: string;
  ManufacturerDate: string;
  BrandNo: string;
  Material: string;
  AdultYN: string;
  ContactInfo: string;
  ItemDetail: string;
  ImageUrl: string;
  VideoURL: string;
  Keyword: string;
  ListedDate: string;
  ChangedDate: string;
  LastFetchDate: string;
  OptionType: string;
  OptionMainimage: string;
  OptionSubimage: string;
  OptionQty: string;
  OriginCountryId: string;
  OriginRegionId: string;
  OriginOthers: string;
  SeasonType: string;
  StyleNumber: string;
  TpoNumber: string;
  VideoNumber: string;
  WashinginfoFit: string;
  WashinginfoLining: string;
  WashinginfoSeethrough: string;
  WashinginfoStretch: string;
  WashinginfoThickness: string;
  WashinginfoWashing: string;
  Weight: number;
  Options: Option[];
  CreatedAt: string;
  UpdatedAt: string;
  LastSyncDate: string;
  MaterialInfo: string;
  MaterialNumber: string;
  AttributeInfo: string;
  ImageOtherUrl: string;
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

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '-'
  }
}

// 산 코드 타입 옵션 추가
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

// 일본 지역 옵션
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
  // ... 나머지 일본 지역들
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
  { value: 'S5', label: '거래제한(Qoo10)' },
  { value: 'S8', label: '���거부' }
]

// 상태별 배지 색상 함수 수정
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
      return '출시일 입력 (예: 2024/03/20)'
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
    // 나머지 p 태그를 div로 변환
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
  // 기존 컬럼들...
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
interface SyncProgress {
  total: number;
  current: number;
  normalCount: number;
  moveCount: number;
  successCount: number;
  failCount: number;
}

export function CosmosManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)
  // 상태 선택 상태를 단일 값으로 수정
  const [selectedStatus, setSelectedStatus] = useState<string>('S2') // 기본값: 거래가능

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

  // 동기화 진행 상태를 위한 state 추가
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);

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

  // handleSyncToCosmos 함수 수정
  const handleSyncToCosmos = async () => {
    if (!selectedCompany || !selectedPlatform) {
      alert('업체 플랫폼을 택주세요.')
      return
    }

    setIsSyncing(true)
    setSyncProgress(null)

    try {
      const response = await fetch('/api/qoo10/cosmos/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          platformId: selectedPlatform,
          itemStatus: selectedStatus
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync with Cosmos DB')
      }

      // EventSource를 사용하여 실시간 진행 상황 수신
      const eventSource = new EventSource(`/api/qoo10/cosmos/sync/progress?companyId=${selectedCompany}&platformId=${selectedPlatform}`);
      
      eventSource.onmessage = (event) => {
        const progress = JSON.parse(event.data);
        setSyncProgress(progress);
        
        // 동기화가 완료되면 EventSource 종료
        if (progress.current === progress.total) {
          eventSource.close();
          setIsSyncing(false);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsSyncing(false);
      };

    } catch (error) {
      console.error('Failed to sync with Cosmos DB:', error)
      alert('Cosmos DB 동기화에 실패했습니다.')
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
      if (!response.ok) throw new Error('상품 조회 실패했습니다.')
      
      const product = await response.json()
      setSelectedProduct(product)
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

  // 수정 모드 전환
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

  // 원산지 형 변경 핸들러
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
    if (!editedProduct) return
    setEditedProduct({
      ...editedProduct,
      [field]: value
    })
  }

  // 저장 핸들러 수정
  const handleSave = async () => {
    if (!editedProduct) return

    try {
      // HTML 변환
      const convertedHtml = convertHtmlToQoo10Format(editedProduct.ItemDetail || '')

      // 변환 HTML로 업데이트
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
      fetchProducts() // 목록 새고침

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
    if (!editedProduct) return
    setEditedProduct({
      ...editedProduct,
      ImageUrl: e.target.value
    })
  }

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

      // AI 서버에 요청
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
        console.log('[QOO10 적용] UpdateMoveGoods API 호출 시작...')
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
          returnMessage: `상태코드: ${updateMoveGoodsResult.ResultCode}, 메시지: ${updateMoveGoodsResult.ResultMsg}`
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
        console.log('[QOO10 적용] EditGoodsStatus API 호출 시작...')
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
          '-10002': '검수 중인 상품은 수정할 수 없습니다.',
          '-10003': '거래중지된 상품은 수정할 수 없습니다.',
          '-10004': '거래한된 상품은 수정할 수 없습니다.',
          '-10005': '승인거부된 상품은 수정할 수 없습니다.',
          '-10006': '올바른 상태값을 입력해주세요. (1: 거래대기, 2: 거래가능, 3: 거래폐지)',
          '-10101': '처리 중 오류가 발생했습니다.'
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
            api: 'EditGoodsContents (상세설명)',
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

  // 프로그레스바 컴포넌트 추가
  const SyncProgressBar = () => {
    if (!syncProgress) return null;

    const percentage = (syncProgress.current / syncProgress.total) * 100;
    const remaining = syncProgress.total - syncProgress.current;

    return (
      <div className="fixed top-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">QOO10 상품 동기화 중...</h3>
            <span className="text-sm text-gray-500">
              {syncProgress.current}/{syncProgress.total}
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
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>일반상품:</span>
                <span className="font-medium">{syncProgress.normalCount}</span>
              </div>
              <div className="flex justify-between">
                <span>무브상품:</span>
                <span className="font-medium">{syncProgress.moveCount}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>성공:</span>
                <span className="text-green-600 font-medium">{syncProgress.successCount}</span>
              </div>
              <div className="flex justify-between">
                <span>실패:</span>
                <span className="text-red-600 font-medium">{syncProgress.failCount}</span>
              </div>
            </div>
          </div>

          {/* 남은 상품 수 */}
          <div className="text-sm text-gray-600 text-center">
            남은 상품: {remaining}개
          </div>
        </div>
      </div>
    );
  };

  // 테이블 내의 날짜 포맷팅 함수 추가
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 상품 저장 핸들러 추가
  const handleSaveProduct = async (updatedProduct: DetailProduct) => {
    try {
      const response = await fetch(`/api/qoo10/cosmos/products/${updatedProduct.ItemCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedProduct,
          CompanyId: selectedCompany,
          PlatformId: selectedPlatform,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const savedProduct = await response.json();
      
      // 저장된 상품으로 상태 업데이트
      setSelectedProduct(savedProduct);
      
      // 목록 새로고침
      fetchProducts();
      
      // 성공 메시지 표시
      alert('상품이 성공적으로 저장되었습니다.');

    } catch (error) {
      console.error('Failed to save product:', error);
      alert('상품 저장에 실패했습니다.');
    }
  };

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

        <div className="w-[300px]">
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="거래상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {SYNC_STATUS_OPTIONS.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSyncToCosmos}
          disabled={!selectedCompany || !selectedPlatform || isSyncing}
          className="ml-2 min-w-[300px]" // 버튼 너비 조정
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
              QOO10 상 동기화
            </div>
          )}
        </Button>
      </div>

      {/* 프로그레스바 추가 */}
      {isSyncing && <SyncProgressBar />}

      {selectedCompany && selectedPlatform && (
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
                placeholder="검색어를 입력하세요"
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
                    <TableHead>판매상태</TableHead>
                    <TableHead>분</TableHead>
                    <TableHead>최종 동기화</TableHead>
                    <TableHead>관리</TableHead>
                    <TableHead>미리보기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        <div className="flex justify-center items-center">
                          <span className="animate-spin mr-2">⟳</span>
                          데이터를 불러오 중...
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
                            {getStatusLabel(product.ItemStatus)}
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
                          {formatDate(product.LastFetchDate)}
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
                        <TableCell>
                          <ProductPreview 
                            itemCode={product.ItemCode} 
                            isMoveProduct={product.Flag === 'MOVE'}
                          />
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
        </>
      )}

      {/* 상품 보 다이얼로그 */}
      {isDetailDialogOpen && selectedProduct && (
        <Dialog 
          open={isDetailDialogOpen} 
          onOpenChange={(open) => {
            if (!open) setIsDetailDialogOpen(false)
          }}
        >
          <DialogContent className="w-full max-w-[95vw] h-[95vh] p-0">
            <div className="h-full overflow-y-auto p-6">
              {selectedProduct.Flag === 'MOVE' ? (
                <MoveProductEditor
                  product={selectedProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => setIsDetailDialogOpen(false)}
                />
              ) : (
                <NormalProductEditor
                  product={selectedProduct}
                  onSave={handleSaveProduct}  // 저장 핸들러 연결
                  onCancel={() => setIsDetailDialogOpen(false)}
                  onApplyToQoo10={() => handleApplyToQoo10()}
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