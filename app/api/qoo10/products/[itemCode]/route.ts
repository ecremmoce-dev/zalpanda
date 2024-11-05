import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// BigInt를 JSON으로 직렬화하기 위한 헬퍼 함수
function serializeData(data: any): any {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ))
}

export async function GET(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const flag = searchParams.get('flag')

    // 상품 상세 정보 조회
    const product = await prisma.zal_Qoo10ItemDetails.findUnique({
      where: {
        ItemCode: params.itemCode
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 상품 옵션 정보 조회
    const options = await prisma.zal_Qoo10ItemOptions.findMany({
      where: {
        ItemCode: params.itemCode
      }
    })

    // BigInt 직렬화 처리
    const serializedData = serializeData({
      ...product,
      options
    })

    return NextResponse.json(serializedData)

  } catch (error) {
    console.error('상품 상세 정보 조회 실패:', error)
    return NextResponse.json(
      { error: '상품 상세 정보 조회에 실패했습니다.' },
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