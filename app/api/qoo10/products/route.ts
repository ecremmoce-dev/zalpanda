import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const platformId = searchParams.get('platformId')

    if (!companyId || !platformId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 플랫폼 정보 확인
    const platform = await prisma.zal_CompanyPlatform.findFirst({
      where: {
        Id: platformId,
        CompanyId: companyId,
        DeletedAt: null
      }
    })

    if (!platform) {
      return NextResponse.json(
        { error: '플랫폼 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 상품 목록 조회 - CompanyId와 SellerId 조건 추가
    const products = await prisma.zal_Qoo10ItemDetails.findMany({
      where: {
        CompanyId: companyId,
        SellerId: platform.SellerId
      },
      select: {
        ItemCode: true,
        ItemTitle: true,
        ItemPrice: true,
        ItemQty: true,
        ItemStatus: true,
        Flag: true,
        SellerCode: true,
        CreatedAt: true,
        LastFetchDate: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch (error) {
    console.error('상품 목록 조회 실패:', error)
    return NextResponse.json(
      { error: '상품 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
} 