import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { originalUrl, resizedUrl, width, height } = await request.json()

    const savedImage = await prisma.savedImage.create({
      data: {
        userId: 'test-user', // 실제 사용자 ID로 대체 필요
        originalUrl,
        resizedUrl,
        width,
        height,
      },
    })

    return NextResponse.json(savedImage)
  } catch (error) {
    console.error('이미지 저장 오류:', error)
    return NextResponse.json(
      { error: '이미지 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 