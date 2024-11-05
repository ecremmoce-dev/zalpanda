import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, platformId } = body

    // 플랫폼 정보 조회
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

    // QOO10 API 호출 및 상품 동기화 로직 구현
    // TODO: 실제 QOO10 API 연동 구현 필요

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('상품 동기화 실패:', error)
    return NextResponse.json(
      { error: '상품 동기화에 실패했습니다.' },
      { status: 500 }
    )
  }
} 