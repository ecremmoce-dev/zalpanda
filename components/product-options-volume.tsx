'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'

export default function ProductOptionsVolume() {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [supplierProducts, setSupplierProducts] = React.useState<typeof products>([])

  const suppliers = [
    { id: 1, code: 'ecommnoce', company: 'ecommnoce', shipping: 'ecommnoce', status: '마스터몰', registered: '2023-07-20 14:10:32' },
    { id: 2, code: 'ultimo', company: '울티모', shipping: 'ultimo', status: '건강상품', registered: '2023-08-05 09:25:42' },
    { id: 3, code: 'jolly', company: '졸리영상사', shipping: 'jolly and color', status: '패션', registered: '2023-08-05 09:29:56' },
    { id: 4, code: 'banilaco', company: '바닐라코', shipping: 'banilaco', status: 'banilaco', registered: '2023-08-10 11:35:01' },
    { id: 5, code: 'ROCKCAKE', company: 'ROCKCAKE', shipping: 'ROCKCAKE', status: '락케이크', registered: '2023-08-10 13:57:57' },
  ]

  const products = [
    { id: '1', sku: 'st11111', name: '청상추, 로즈마드 RC 팜채 녹황색 청상추, 야채 자루형 청상추, 신선한 수삼 6년', category: '식품', weight: '1 kg', packageWeight: '1.38 kg', length: '25 cm', width: '15 cm', height: '22 cm' },
    { id: '2', sku: '707202249', name: '전자레인지 UA 프로젝스 제습히트 & 숨쉬트롤 - 온동물 먹이서비스', category: '가전', weight: '미등록', packageWeight: '제산 불가', length: '미등록', width: '미등록', height: '미등록' },
    { id: '3', sku: '123456789', name: '고급 면 티셔츠', category: '의류', weight: '0.2 kg', packageWeight: '0.3 kg', length: '30 cm', width: '20 cm', height: '5 cm' },
    { id: '4', sku: '987654321', name: '스마트폰 케이스', category: '전자기기', weight: '0.05 kg', packageWeight: '0.1 kg', length: '15 cm', width: '8 cm', height: '1 cm' },
    { id: '5', sku: '456789123', name: '유기농 사과 주스', category: '식품', weight: '1.2 kg', packageWeight: '1.5 kg', length: '20 cm', width: '10 cm', height: '10 cm' },
  ]

  const categories = Array.from(new Set(products.map(product => product.category)))

  const handleSupplierSelect = (id: number) => {
    setSelectedSupplier(String(id))
    // Filter products based on the selected supplier
    const supplierProducts = products.filter(product => product.id.startsWith(String(id)))
    setSupplierProducts(supplierProducts)
  }

  const handleProductSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  }

  const filteredProducts = supplierProducts.filter(product => 
    (selectedCategory === "all" || product.category === selectedCategory) &&
    (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Supplier Selection Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>공급사</CardTitle>
          <Button
            variant="ghost"
            size="sm"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="공급사명을 검색하세요"
                className="max-w-sm"
              />
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>번호</TableHead>
                  <TableHead>코드</TableHead>
                  <TableHead>회사명</TableHead>
                  <TableHead>발송명</TableHead>
                  <TableHead>발송명</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>선택</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.id}</TableCell>
                    <TableCell>{supplier.code}</TableCell>
                    <TableCell>{supplier.company}</TableCell>
                    <TableCell>{supplier.shipping}</TableCell>
                    <TableCell>{supplier.status}</TableCell>
                    <TableCell>{supplier.registered}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleSupplierSelect(supplier.id)}
                        variant={selectedSupplier === String(supplier.id) ? "default" : "outline"}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
      </Card>

      {/* Weight and Size Edit Card */}
      <Card>
        <CardHeader>
          <CardTitle>무게 / 크기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-6">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-medium">무게</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="무게"
                  className="w-24"
                  disabled={selectedProducts.length === 0}
                />
                <span>kg</span>
                <Button disabled={selectedProducts.length === 0}>무게 적용</Button>
                <Button variant="outline" disabled={selectedProducts.length === 0}>무게 저장</Button>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-medium">크기</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="가로"
                  className="w-20"
                  disabled={selectedProducts.length === 0}
                />
                <Input
                  type="number"
                  placeholder="세로"
                  className="w-20"
                  disabled={selectedProducts.length === 0}
                />
                <Input
                  type="number"
                  placeholder="높이"
                  className="w-20"
                  disabled={selectedProducts.length === 0}
                />
                <span>cm</span>
                <Button disabled={selectedProducts.length === 0}>크기 적용</Button>
                <Button variant="outline" disabled={selectedProducts.length === 0}>크기 저장</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product List Card */}
      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="상품명으로 검색"
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id))
                      } else {
                        setSelectedProducts([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>무게</TableHead>
                <TableHead>박스 무게</TableHead>
                <TableHead>가로</TableHead>
                <TableHead>세로</TableHead>
                <TableHead>높이</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">공급사를 선택해주세요.</TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">표시할 상품이 없습니다.</TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.weight}</TableCell>
                    <TableCell>{product.packageWeight}</TableCell>
                    <TableCell>{product.length}</TableCell>
                    <TableCell>{product.width}</TableCell>
                    <TableCell>{product.height}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

