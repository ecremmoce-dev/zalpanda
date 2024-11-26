'use client'

import { useState } from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Supplier {
  id: number
  code: string
  company: string
  website: string
  brand: string
  registrationDate: string
}

interface Product {
  id: number
  sku: string
  image: string
  originalName: string
  correctedName: string
  originalDescription: string
  correctedDescription: string
  lastModified: string
  category: string
}

const categories = ['전체', '의류', '식품', '전자제품', '가구']

export default function ProductRevision() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [supplierSearch, setSupplierSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const itemsPerPage = 5

  // 임시 데이터
  const suppliers: Supplier[] = [
    {
      id: 1,
      code: 'ecommerce',
      company: 'ecommerce',
      website: 'ecommerce',
      brand: '마켓이즈',
      registrationDate: '2023-07-20 14:10:32',
    },
    {
      id: 2,
      code: 'ulitmo',
      company: '울티모',
      website: 'ulitmo',
      brand: '건강상품',
      registrationDate: '2023-08-05 09:23:42',
    },
    {
      id: 3,
      code: 'jufly',
      company: '줄리앤달리',
      website: 'jufly and color',
      brand: '목걸',
      registrationDate: '2023-08-05 09:29:58',
    },
    {
      id: 4,
      code: 'banisko',
      company: '바니스코',
      website: 'banisko',
      brand: 'banisko',
      registrationDate: '2023-08-10 11:35:01',
    },
    {
      id: 5,
      code: 'ROCKCAKE',
      company: 'ROCKCAKE',
      website: 'ROCKCAKE',
      brand: '락케이크',
      registrationDate: '2023-08-10 13:57:57',
    },
  ]

  const handleSupplierSelect = async (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    // 실제 API 호출로 대체해야 함
    setProducts([
      {
        id: 1,
        sku: '550530059',
        image: '/placeholder.svg',
        originalName: '이너뷰 울샴푸71.2개입x2박스(142개입) 반려견 강아지 의류케어기 울샴푸제 수선가리개 덮개',
        correctedName: '이너뷰 울샴푸 142개입 (71.2개입 x 2박스) - 반려견 의류 케어용',
        originalDescription: '반려견을 위한 울샴푸입니다. 2박스 세트로 총 142개입이 들어있습니다.',
        correctedDescription: '이너뷰의 프리미엄 울샴푸로, 반려견의 섬세한 모직 의류를 위해 특별히 제작되었습니다. 각 박스당 71.2개입으로, 2박스 세트(총 142개입)로 구성되어 있어 장기간 사용이 가능합니다. 부드러운 거품이 반려견의 의류를 손상 없이 깨끗하게 세정하며, 특수 포뮬러가 정전기를 방지하고 털을 부드럽게 유지합니다.',
        lastModified: '2023-11-25 10:30:00',
        category: '의류',
      },
      {
        id: 2,
        sku: '687793442',
        image: '/placeholder.svg',
        originalName: '이너뷰 비건 여성 향수티슈 10P X 24박스 차가격 여신보 페미닌 티슈',
        correctedName: '이너뷰 비건 여성용 향수 티슈 (10매입 x 24박스)',
        originalDescription: '여성용 향수 티슈입니다. 24박스 세트입니다.',
        correctedDescription: '이너뷰의 비건 인증 여성용 향수 티슈입니다. 각 박스에 10매가 들어있으며, 총 24박스로 구성된 대용량 세트입니다. 은은한 플로럴 향이 하루 종일 지속되며, 100% 식물성 원료로 만들어져 피부 자극이 적습니다. 휴대가 간편하여 외출 시 상쾌함을 유지하기에 완벽합니다.',
        lastModified: '2023-11-24 15:45:00',
        category: '화장품',
      },
      {
        id: 3,
        sku: '708472469',
        image: '/placeholder.svg',
        originalName: '이너뷰 화장 미사장갑 150매 x 24박스 자극없 부드러운',
        correctedName: '이너뷰 화장용 미사장갑 (150매 x 24박스)',
        originalDescription: '부드러운 화장용 미사장갑입니다. 24박스 세트입니다.',
        correctedDescription: '이너뷰의 부드러운 화장용 미사장갑입니다. 150매가 24박스로 구성되어 있습니다. 피부에 자극이 적고 부드러운 촉감으로 편안한 사용감을 제공합니다.',
        lastModified: '2023-11-23 12:00:00',
        category: '화장품',
      },
      {
        id: 4,
        sku: '722236475',
        image: '/placeholder.svg',
        originalName: '이너뷰 스틱 샴푸 미스트로 4주효과적 건성두피관리 건성두피샴푸 약산성',
        correctedName: '이너뷰 스틱 샴푸 미스트 - 4주 건성 두피 관리',
        originalDescription: '건성 두피 관리에 효과적인 스틱 샴푸 미스트입니다.',
        correctedDescription: '이너뷰의 스틱 샴푸 미스트는 건성 두피 관리에 효과적인 제품입니다. 4주 사용으로 두피의 건강을 개선하는 데 도움을 줍니다. 약산성 포뮬러로 두피 자극을 최소화했습니다.',
        lastModified: '2023-11-22 09:15:00',
        category: '화장품',
      },
      {
        id: 5,
        sku: '767274032',
        image: '/placeholder.svg',
        originalName: '홈크리에이터 워셔블 매수수증 75mmX30m 국산 100%',
        correctedName: '홈크리에이터 워셔블 매수 수증 (75mm x 30m)',
        originalDescription: '워셔블 매수 수증입니다. 국산 100% 제품입니다.',
        correctedDescription: '홈크리에이터의 워셔블 매수 수증은 75mm x 30m 크기의 국산 제품입니다. 100% 국내산 원료를 사용하여 제작되었으며, 재사용이 가능한 친환경 제품입니다.',
        lastModified: '2023-11-21 16:30:00',
        category: '사무용품',
      },
      {
        id: 6,
        sku: '767276260',
        image: '/placeholder.svg',
        originalName: '이너뷰 비건 여성 향수티슈 50P X 24박스 차가격 여신보 페미닌 티슈',
        correctedName: '이너뷰 비건 여성용 향수 티슈 (50매입 x 24박스)',
        originalDescription: '여성용 향수 티슈입니다. 24박스 세트입니다.',
        correctedDescription: '이너뷰의 비건 인증 여성용 향수 티슈입니다. 각 박스에 50매가 들어있으며, 총 24박스로 구성된 대용량 세트입니다. 은은한 플로럴 향이 하루 종일 지속되며, 100% 식물성 원료로 만들어져 피부 자극이 적습니다. 휴대가 간편하여 외출 시 상쾌함을 유지하기에 완벽합니다.',
        lastModified: '2023-11-20 11:00:00',
        category: '화장품',
      },
    ])
    setCurrentPage(1)
    setSelectedProducts([])
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.code.toLowerCase().includes(supplierSearch.toLowerCase())
  )

  const filteredProducts = products.filter(product =>
    (product.originalName.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearch.toLowerCase())) &&
    (selectedCategory === '전체' || product.category === selectedCategory)
  )

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map(product => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">공급사</h1>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="공급사명을 검색해주세요"
            className="max-w-sm"
            type="search"
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">번호</TableHead>
                <TableHead>코드</TableHead>
                <TableHead>상사명</TableHead>
                <TableHead>웹사이트</TableHead>
                <TableHead>브랜드</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead className="w-[100px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>{supplier.company}</TableCell>
                  <TableCell>{supplier.website}</TableCell>
                  <TableCell>{supplier.brand}</TableCell>
                  <TableCell>{supplier.registrationDate}</TableCell>
                  <TableCell>
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
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">상품 목록</h2>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="상품명 또는 SKU를 검색해주세요"
            className="max-w-sm"
            type="search"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Tabs defaultValue="product-name-correction" className="w-full">
              <div className="flex justify-between items-center">
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="product-name-correction">상품명 보정</TabsTrigger>
                  <TabsTrigger value="product-description-correction">상품 본문 보정</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={selectedProducts.length === 0}>
                        Options
                        <MoreHorizontal className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>원문 {`>`} 보정 옮기기</DropdownMenuItem>
                      <DropdownMenuItem>정리하기</DropdownMenuItem>
                      <DropdownMenuItem>되돌리기</DropdownMenuItem>
                      <DropdownMenuItem>Replace</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="default">저장</Button>
                </div>
              </div>

              <TabsContent value="product-name-correction">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedProducts.length === paginatedProducts.length}
                            onCheckedChange={handleSelectAllProducts}
                          />
                        </TableHead>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead className="w-[150px]">SKU</TableHead>
                        <TableHead>이미지</TableHead>
                        <TableHead>원본 상품명</TableHead>
                        <TableHead>보정 상품명</TableHead>
                        <TableHead>마지막 수정일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => handleProductSelect(product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.originalName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>{product.originalName}</TableCell>
                          <TableCell>{product.correctedName || '-'}</TableCell>
                          <TableCell>{product.lastModified || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="product-description-correction">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedProducts.length === paginatedProducts.length}
                            onCheckedChange={handleSelectAllProducts}
                          />
                        </TableHead>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead className="w-[150px]">SKU</TableHead>
                        <TableHead>이미지</TableHead>
                        <TableHead>원본 본문</TableHead>
                        <TableHead>보정 본문</TableHead>
                        <TableHead>마지막 수정일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => handleProductSelect(product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.originalName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>{product.originalDescription}</TableCell>
                          <TableCell>{product.correctedDescription || '-'}</TableCell>
                          <TableCell>{product.lastModified || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              총 {filteredProducts.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}개 표시
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

