import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    // 상품 상세 정보와 옵션 정보를 함께 조회
    const product = await prisma.zal_Qoo10ItemDetails.findUnique({
      where: {
        ItemCode: params.itemCode,
      },
      include: {
        // 옵션 정보 조인
        Options: {
          select: {
            Id: true,
            Name1: true,
            Value1: true,
            Name2: true,
            Value2: true,
            Name3: true,
            Value3: true,
            Name4: true,
            Value4: true,
            Name5: true,
            Value5: true,
            Price: true,
            Qty: true,
            ItemTypeCode: true,
            Flag: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('상품 조회 실패:', error)
    return NextResponse.json(
      { error: '상품 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 상품 정보 수정
export async function PUT(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    const body = await request.json()

    const updatedProduct = await prisma.zal_Qoo10ItemDetails.update({
      where: {
        ItemCode: params.itemCode
      },
      data: {
        ItemTitle: body.ItemTitle,
        ItemPrice: body.ItemPrice ? parseFloat(body.ItemPrice) : null,
        ItemQty: body.ItemQty ? parseInt(body.ItemQty) : null,
        ItemStatus: body.ItemStatus,
        AdultYN: body.AdultYN,
        Keyword: body.Keyword,
        BrandNo: body.BrandNo,
        ProductionPlace: body.ProductionPlace,
        ShippingNo: body.ShippingNo,
        ItemDetail: body.ItemDetail,
        UpdatedAt: new Date()
      }
    })

    return NextResponse.json(updatedProduct)

  } catch (error) {
    console.error('상품 정보 수정 실패:', error)
    return NextResponse.json(
      { error: '상품 정보 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
} 