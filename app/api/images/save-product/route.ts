import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const savedProduct = await prisma.squareProduct.create({
      data: {
        ProductName: data.ProductName,
        ThumbnailURL: data.ThumbnailURL,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    })

    return NextResponse.json({
      id: savedProduct.Id.toString(),
      productName: savedProduct.ProductName,
      thumbnailURL: savedProduct.ThumbnailURL,
      createdAt: savedProduct.CreatedAt,
      updatedAt: savedProduct.UpdatedAt
    })
  } catch (error) {
    console.error('상품 정보 저장 오류:', error)
    return NextResponse.json(
      { error: '상품 정보 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 