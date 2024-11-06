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
import { Edit, Globe } from 'lucide-react'
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
  { value: 'S8', label: '승인거부' }
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
      return '발송 시간 입력 (예: 14:30)'
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
  { value: 'S0', label: '검수대기' },
  { value: 'S1', label: '거래대기' },
  { value: 'S2', label: '거래가능' },
  { value: 'S3', label: '거래중지(Qoo10)' },
  { value: 'S5', label: '거래제한(Qoo10)' },
  { value: 'S8', label: '승인거부' }
]

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
          platformId: selectedPlatform,
          itemStatus: selectedStatus // 단일 상태값만 전달
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync with Cosmos DB')
      }

      const result = await response.json()
      alert(`Cosmos DB 동기화가 완료되었습니다.\n총 ${result.totalProducts}개의 상품이 동기화되었습니다.\n선택된 상태: ${
        SYNC_STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label
      }`)
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
      fetchProducts() // 목록 새로고침

      // 저장 성공 메시지
      alert('상품 정보가 저장되었습니다.')

    } catch (error) {
      console.error('Failed to update product:', error)
      alert('상품 수정에 실패했습니다.')
    }
  }

  // 수정 취소
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
      // AI 요청 데이터 준비
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
        // 일반 상품인 경우 기존 API 호출 유지
        // 1. ItemsBasic.UpdateGoods API
        console.log('[QOO10 적용] UpdateGoods API 호출 시작...')
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
            DesiredShippingDate: selectedProduct.DesiredShippingDate,
            AvailableDateType: selectedProduct.AvailableDateType,
            AvailableDateValue: selectedProduct.AvailableDateValue,
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
          console.log('[QOO10 적용] EditGoodsImage API 호출 시작...')
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
          className="ml-2"
        >
          {isSyncing ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              QOO10 상품 동기화 중...
            </>
          ) : (
            <>
              <span className="mr-2">↻</span>
              QOO10 상품 동기화
            </>
          )}
        </Button>
      </div>

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
                    <TableHead>상</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>최종 동기화</TableHead>
                    <TableHead>리</TableHead>
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
        </>
      )}

      {/* 상품 보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>
                상품 상세 정보 ({selectedProduct?.Flag === 'MOVE' ? '무브 상품' : '일반 상품'})
              </DialogTitle>
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <Button onClick={handleEditMode}>
                      <Edit className="w-4 h-4 mr-2" />
                      수정하기
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
                      onClick={handleApplyToQoo10}
                      disabled={!selectedProduct}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      QOO10 적용
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상품코드</Label>
                  <Input value={selectedProduct?.ItemCode} disabled />
                </div>
                <div>
                  <Label>판매상품코드</Label>
                  <Input 
                    value={isEditing ? editedProduct?.SellerCode : selectedProduct?.SellerCode || '-'}
                    onChange={e => handleFieldChange('SellerCode', e.target.value)}
                    readOnly={!isEditing}
                    placeholder="판매상품코드 입력"
                  />
                </div>
                <div>
                  <Label>상품의 상태정보</Label>
                  {isEditing ? (
                    <Select
                      value={editedProduct?.ItemStatus || 'S2'}
                      onValueChange={(value) => handleFieldChange('ItemStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상품의 상태정보 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`px-3 py-2 rounded-md ${getStatusBadgeColor(selectedProduct?.ItemStatus || 'S2')}`}>
                      {ITEM_STATUS_OPTIONS.find(s => s.value === selectedProduct?.ItemStatus)?.label || '-'}
                    </div>
                  )}
                </div>
                <div>
                  <Label>상품명</Label>
                  <Input 
                    value={isEditing ? editedProduct?.ItemTitle : selectedProduct?.ItemTitle}
                    onChange={e => handleFieldChange('ItemTitle', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* 카테고리 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>메인 테고리</Label>
                  <div className="flex gap-2">
                    <Input value={selectedProduct.MainCatCd || '-'} readOnly />
                    <Input value={selectedProduct.MainCatNm || '-'} readOnly />
                  </div>
                </div>
                <div>
                  <Label>서 카테고리</Label>
                  <div className="flex gap-2">
                    <Input value={selectedProduct.FirstSubCatCd || '-'} readOnly />
                    <Input value={selectedProduct.FirstSubCatNm || '-'} readOnly />
                  </div>
                </div>
                <div>
                  <Label>세컨 카테고리</Label>
                  <div className="flex gap-2">
                    <Input value={selectedProduct.SecondSubCatCd || '-'} readOnly />
                    <Input value={selectedProduct.SecondSubCatNm || '-'} readOnly />
                  </div>
                </div>
              </div>

              {/* 원산지 및 산업 코드 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>원산지 유형</Label>
                  {isEditing ? (
                    <Select
                      value={editedProduct?.ProductionPlaceType || '1'}
                      onValueChange={handleProductionPlaceTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="원산지 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCTION_PLACE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={PRODUCTION_PLACE_TYPES.find(t => t.value === selectedProduct?.ProductionPlaceType)?.label || '-'} 
                      readOnly 
                    />
                  )}
                </div>

                {/* 원산지 유형에 따른 조건부 렌더링 */}
                {(isEditing ? editedProduct?.ProductionPlaceType : selectedProduct?.ProductionPlaceType) === '1' && (
                  // 국내(일본)인 경우 지역 선택
                  <div>
                    <Label>지역</Label>
                    {isEditing ? (
                      <Select
                        value={editedProduct?.ProductionPlace || ''}
                        onValueChange={(value) => handleFieldChange('ProductionPlace', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="지역 선택" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {JAPAN_REGIONS.map(region => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        value={JAPAN_REGIONS.find(r => r.value === selectedProduct?.ProductionPlace)?.label || '-'} 
                        readOnly 
                      />
                    )}
                  </div>
                )}

                {(isEditing ? editedProduct?.ProductionPlaceType : selectedProduct?.ProductionPlaceType) === '2' && (
                  // 해외인 경우 국가 선택
                  <div>
                    <Label>원산지 국가</Label>
                    {isEditing ? (
                      <Select
                        value={editedProduct?.ProductionPlace || ''}
                        onValueChange={(value) => handleFieldChange('ProductionPlace', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {COUNTRY_OPTIONS.map(country => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        value={COUNTRY_OPTIONS.find(c => c.value === selectedProduct?.ProductionPlace)?.label || '-'} 
                        readOnly 
                      />
                    )}
                  </div>
                )}

                {(isEditing ? editedProduct?.ProductionPlaceType : selectedProduct?.ProductionPlaceType) === '3' && (
                  // 기타인 경우 직접 입력
                  <div>
                    <Label>기타 정보</Label>
                    {isEditing ? (
                      <Input
                        value={editedProduct?.ProductionPlace || ''}
                        onChange={(e) => handleFieldChange('ProductionPlace', e.target.value)}
                        placeholder="기타 원산지 정보 입력"
                      />
                    ) : (
                      <Input 
                        value={selectedProduct?.ProductionPlace || '-'} 
                        readOnly 
                      />
                    )}
                  </div>
                )}
              </div>

              {/* 배송 관련 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>배송비 코드</Label>
                  <Input 
                    value={isEditing ? editedProduct?.ShippingNo : selectedProduct?.ShippingNo || '-'}
                    onChange={e => handleFieldChange('ShippingNo', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <Label>무게 (kg)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={isEditing ? editedProduct?.Weight : selectedProduct?.Weight || '0'}
                    onChange={e => handleFieldChange('Weight', parseFloat(e.target.value))}
                    readOnly={!isEditing}
                    placeholder="예: 0.5"
                  />
                </div>
                <div>
                  <Label>발송 가능일 유형</Label>
                  {isEditing ? (
                    <Select
                      value={editedProduct?.AvailableDateType || '0'}
                      onValueChange={(value) => {
                        handleFieldChange('AvailableDateType', value)
                        handleFieldChange('AvailableDateValue', '')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="발송 가능일 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_DATE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={AVAILABLE_DATE_TYPES.find(t => t.value === selectedProduct?.AvailableDateType)?.label || '-'} 
                      readOnly 
                    />
                  )}
                </div>
                <div>
                  <Label>발송 가능일 값</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedProduct?.AvailableDateValue || ''}
                        onChange={e => {
                          const newValue = e.target.value
                          if (validateAvailableDateValue(editedProduct?.AvailableDateType || '0', newValue)) {
                            handleFieldChange('AvailableDateValue', newValue)
                          }
                        }}
                        placeholder={getAvailableDatePlaceholder(editedProduct?.AvailableDateType || '0')}
                      />
                      <p className="text-xs text-gray-500">
                        {getAvailableDatePlaceholder(editedProduct?.AvailableDateType || '0')}
                      </p>
                    </div>
                  ) : (
                    <Input 
                      value={selectedProduct?.AvailableDateValue || '-'} 
                      readOnly 
                    />
                  )}
                </div>
              </div>

              {/* 상품 상태 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>재고수량</Label>
                  <Input 
                    type="number"
                    value={isEditing ? editedProduct?.ItemQty : selectedProduct?.ItemQty}
                    onChange={e => handleFieldChange('ItemQty', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <Label>판매종료일</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedProduct?.ExpireDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedProduct?.ExpireDate ? 
                            format(new Date(editedProduct.ExpireDate), 'yyyy-MM-dd') : 
                            "날짜 선택"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editedProduct?.ExpireDate ? new Date(editedProduct.ExpireDate) : undefined}
                          onSelect={(date) => handleFieldChange('ExpireDate', date?.toISOString())}
                          initialFocus
                          disabled={(date) => date < new Date()} // 오늘 전 날짜 선택 불가
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input 
                      value={selectedProduct?.ExpireDate ? 
                        format(new Date(selectedProduct.ExpireDate), 'yyyy-MM-dd') : 
                        '-'
                      } 
                      readOnly 
                    />
                  )}
                </div>
                <div>
                  <Label>성인상품 여부</Label>
                  <Input value={selectedProduct?.AdultYN === 'Y' ? '성인상품' : '일반상품'} readOnly />
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>제품번호</Label>
                  <Input value={selectedProduct.ModelNM || '-'} readOnly />
                </div>
                <div>
                  <Label>제조사</Label>
                  <Input value={selectedProduct.ManufacturerDate || '-'} readOnly />
                </div>
                <div>
                  <Label>소재</Label>
                  <Input value={selectedProduct.Material || '-'} readOnly />
                </div>
                <div>
                  <Label>연락처</Label>
                  <Input value={selectedProduct.ContactInfo || '-'} readOnly />
                </div>
              </div>

              {/* 키워드 및 날짜 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>검색 키워드</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.Keyword?.split(',').map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>등록/수정일</Label>
                  <div className="flex gap-2">
                    <Input value={formatDate(selectedProduct.ListedDate)} readOnly />
                    <Input value={formatDate(selectedProduct.ChangedDate)} readOnly />
                  </div>
                </div>
              </div>

              {/* 이미지 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">대표 이미지</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>메인 이미지</Label>
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* 이미지 업로드 */}
                        <div className="space-y-2">
                          <Label>로컬 이미지 업로드</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                          />
                        </div>

                        {/* 외부 URL 입력 */}
                        <div className="space-y-2">
                          <Label>또는 이미지 URL 입력</Label>
                          <Input
                            type="text"
                            placeholder="https://"
                            value={editedProduct?.ImageUrl || ''}
                            onChange={handleExternalUrlInput}
                          />
                        </div>

                        {/* 이미지 미리보기 */}
                        {editedProduct?.ImageUrl && (
                          <div className="relative">
                            <img
                              src={editedProduct.ImageUrl}
                              alt="상품 이미지"
                              className="mt-2 max-h-[300px] object-contain mx-auto border rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setEditedProduct({
                                ...editedProduct,
                                ImageUrl: ''
                              })}
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      selectedProduct?.ImageUrl && (
                        <div className="relative">
                          <img
                            src={selectedProduct.ImageUrl}
                            alt="상품 이미지"
                            className="mt-2 max-h-[300px] object-contain mx-auto border rounded-lg"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <Label>옵션 이미지</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-[400px] overflow-y-auto">
                      {selectedProduct?.OptionMainimage?.split('$$').map((img: string, index: number) => {
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
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <p>텍스트 사용량: {editedProduct?.ItemDetail?.length || 0}B/1024KB (1MB)</p>
                    <p>이미지 사용량: 0% 177KB/40960KB (40MB)</p>
                    <p className="text-xs mt-1">
                      [권장 이미지] 사이즈: 가로 최대 820px / 용량: 한 장당 1MB / 형식: JPG, JPEG, PNG, GIF
                    </p>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="border rounded-lg">
                        <CKEditor
                          editor={ClassicEditor}
                          data={editedProduct?.ItemDetail || ''}
                          config={{
                            toolbar: [
                              'heading',
                              '|',
                              'bold',
                              'italic',
                              'link',
                              'bulletedList',
                              'numberedList',
                              '|',
                              'outdent',
                              'indent',
                              '|',
                              'imageUpload',
                              'blockQuote',
                              'insertTable',
                              'mediaEmbed',
                              'undo',
                              'redo',
                              '|',
                              'alignment',
                              'sourceEditing'
                            ],
                            language: 'ko',
                            image: {
                              toolbar: [
                                'imageTextAlternative',
                                'imageStyle:inline',
                                'imageStyle:block',
                                'imageStyle:side'
                              ]
                            }
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData()
                            handleFieldChange('ItemDetail', data)
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!editedProduct?.ItemDetail) return
                            const convertedHtml = convertHtmlToQoo10Format(editedProduct.ItemDetail)
                            handleFieldChange('ItemDetail', convertedHtml)
                          }}
                        >
                          QOO10 형식으로 변환
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!editedProduct?.ItemDetail) return
                            const formattedHtml = editedProduct.ItemDetail
                              .replace(/></g, '>\n<')
                              .replace(/^[ \t]+/gm, '')
                              .replace(/\n{2,}/g, '\n')
                            setHtmlSource(formattedHtml)
                            setIsHtmlSourceOpen(true)
                          }}
                        >
                          HTML 소스 보기/편집
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border rounded-lg p-4 min-h-[200px] bg-white"
                      dangerouslySetInnerHTML={{ __html: selectedProduct?.ItemDetail || '' }}
                    />
                  )}
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
                      {(isEditing ? editedProduct : selectedProduct)?.Options?.map((option, index) => (
                        <tr key={option.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{option.name1 || '-'}</td>
                          <td className="px-4 py-2">{option.value1 || '-'}</td>
                          <td className="px-4 py-2">{option.name2 || '-'}</td>
                          <td className="px-4 py-2">{option.value2 || '-'}</td>
                          <td className="px-4 py-2 text-right">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={option.price}
                                onChange={e => handleOptionChange(option.id, 'price', e.target.value)}
                                className="w-24 text-right"
                              />
                            ) : (
                              <span>{option.price?.toLocaleString() || 0}원</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={option.qty}
                                onChange={e => handleOptionChange(option.id, 'qty', e.target.value)}
                                className="w-24 text-right"
                              />
                            ) : (
                              <span>{option.qty?.toLocaleString() || 0}</span>
                            )}
                          </td>
                          <td className="px-4 py-2">{option.itemTypeCode || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 옵션 요약 정보 */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">총 옵션 수</h4>
                    <p className="text-2xl">{selectedProduct.Options?.length || 0}개</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">옵션 유형</h4>
                    <p className="text-2xl">{selectedProduct.Flag === 'MOVE' ? '무브' : '일반'}</p>
                  </div>
                </div>
              </div>

              {/* 수정 모드일 때만 표시되는 버튼 */}
              {isEditing && (
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>
                    취소
                  </Button>
                  <Button onClick={handleSave}>
                    저장
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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