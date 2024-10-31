import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (err) {
    console.error('데이터 조회 오류:', err)
    return NextResponse.json(
      { error: '데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 