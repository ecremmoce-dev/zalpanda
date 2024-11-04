import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

// GET: 특정 회사의 플랫폼 목록 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const platforms = await prisma.zal_CompanyPlatform.findMany({
      where: {
        CompanyId: params.id,
        DeletedAt: null
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    })

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('플랫폼 정보 조회 실패:', error)
    return NextResponse.json(
      { error: '플랫폼 정보 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 플랫폼 정보 추가
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('새 플랫폼 정보 생성:', body)
    
    // 필수 필드 검증
    if (!body.Platform || !body.SellerId) {
      return NextResponse.json(
        { error: '플랫폼과 판매자 ID는 필수입니다.' },
        { status: 400 }
      )
    }

    const platform = await prisma.zal_CompanyPlatform.create({
      data: {
        Id: randomUUID(),
        CompanyId: params.id,
        Platform: body.Platform,
        SellerId: body.SellerId,
        Password: body.Password || null,
        ApiKey: body.ApiKey || null,
        SecretKey: body.SecretKey || null,
        AccessToken: body.AccessToken || null,
        RefreshToken: body.RefreshToken || null,
        TokenExpiryDate: body.TokenExpiryDate ? new Date(body.TokenExpiryDate) : null,
        IsActive: true,
        Memo: body.Memo || null,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    })

    console.log('플랫폼 정보가 성공적으로 생성되었습니다. ID:', platform.Id)
    return NextResponse.json(platform)
  } catch (error) {
    console.error('플랫폼 정보 생성 실패:', error)
    return NextResponse.json(
      { error: '플랫폼 정보 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 