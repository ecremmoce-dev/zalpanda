'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, ExternalLink, Image as ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ProductInformation {
  [key: string]: string | object
}

interface Product {
  url: string
  item_code: string
  thumbnail_image: string
  item_name: string
  item_price: string
  detail_images: string[]
  "Product Information": ProductInformation
  "Product Information Disclosure": ProductInformation
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          setProducts(json)
          setCurrentPage(1) // 파일 업로드시 첫 페이지로 이동
        } catch (error) {
          console.error('JSON 파싱 에러:', error)
          alert('올바른 JSON 파일을 업로드해주세요.')
        }
      }
      reader.readAsText(file)
    }
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 페이지 번호 배열 생성 함수
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // 한 번에 보여줄 최대 페이지 번호 수

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 maxVisiblePages 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // 현재 페이지 주변의 페이지들을 표시
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      // endPage가 최대값에 도달하지 않았다면 startPage 조정
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) pageNumbers.push('ellipsis')
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('ellipsis')
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상품 목록</h2>
        <div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload">
            <Button asChild>
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                불러오기
              </span>
            </Button>
          </label>
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="h-[calc(100vh-300px)] flex items-center justify-center text-muted-foreground">
            JSON 파일을 업로드하여 상품 목록을 불러와주세요
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6">
            {currentProducts.map((product, index) => (
              <Card key={product.item_code || index}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-40 h-40 flex-shrink-0">
                      <img
                        src={product.thumbnail_image}
                        alt={product.item_name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{product.item_name}</h3>
                          <p className="text-lg text-muted-foreground">
                            {product.item_price}원
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={!product.detail_images?.length}
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                {product.detail_images?.length ? '상세정보' : '상세정보 없음'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>상세 이미지</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4">
                                {product.detail_images?.map((image, idx) => (
                                  <img
                                    key={idx}
                                    src={image}
                                    alt={`상세이미지 ${idx + 1}`}
                                    className="w-full rounded-lg"
                                  />
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(product.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            상품링크
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">상품 정보</h4>
                          <div className="space-y-1">
                            {Object.entries(product["Product Information"]).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}: </span>
                                <span className="text-muted-foreground">
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">상품 상세 정보</h4>
                          <div className="space-y-1">
                            {Object.entries(product["Product Information Disclosure"]).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}: </span>
                                <span className="text-muted-foreground">
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) handlePageChange(currentPage - 1)
                    }}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(pageNumber as number)
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) handlePageChange(currentPage + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
} 