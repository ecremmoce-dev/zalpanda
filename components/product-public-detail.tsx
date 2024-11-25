"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Sample image data - replace with actual image URLs
const thumbnailImages = [
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
  "/placeholder.svg?height=100&width=100",
]

const contentImages = [
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
  "/placeholder.svg?height=400&width=300",
]

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  return (
    <div className="container mx-auto py-6">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">상품 관리</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">돌아가기</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">공급사</h3>
                  <p className="text-sm text-muted-foreground">홀딩모</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">상품명</h3>
                  <p className="text-sm text-muted-foreground">이너수 질세정기 2개입(32ml스틱4개월분) 질내 보습 살균용 의료기기 질세정제 주치기관용 여성청결제</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">분류</h3>
                <p className="text-sm text-muted-foreground">화장품 &gt; 바디케어 &gt; 여성청결제</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">무게 / 크기</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">무게</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">가로(Length)</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">세로(Width)</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">높이(Height)</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">부피무게</h4>
                  <p className="text-sm text-muted-foreground">0kg</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">가격 / 재고</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium">소비자가</h4>
                  <p className="text-sm text-muted-foreground">13,440KRW</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">할인가</h4>
                  <p className="text-sm text-muted-foreground">13,440KRW</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">재고</h4>
                  <p className="text-sm text-muted-foreground">952개</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">안전재고</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">입점가</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">SKU</h4>
                  <p className="text-sm text-muted-foreground">5550235059</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">HSCode</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">고시정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">사이즈</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">색상</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">소재</h4>
                  <p className="text-sm text-muted-foreground">-</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">상품 이미지</h3>
              <div className="grid grid-cols-6 gap-4">
                {thumbnailImages.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer relative">
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="rounded-md object-cover w-full h-full"
                        />
                        <span className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {contentImages.map((contentImage, contentIndex) => (
                            <CarouselItem key={contentIndex}>
                              <div className="flex items-center justify-center p-1">
                                <Image
                                  src={contentImage}
                                  alt={`Product image ${contentIndex + 1}`}
                                  width={800}
                                  height={600}
                                  className="rounded-lg object-contain max-h-[70vh]"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">본문 이미지</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {contentImages.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer relative">
                        <Image
                          src={image}
                          alt={`Content image ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-md object-cover w-full h-full"
                        />
                        <span className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <Image
                        src={image}
                        alt={`Full content image ${index + 1}`}
                        width={800}
                        height={600}
                        className="rounded-lg object-contain max-h-[80vh]"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

