import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { categories } = await request.json()

    // 기존 카테고리 데이터 삭제
    await prisma.zal_Qoo10Category.deleteMany()

    // 새로운 카테고리 데이터 저장
    const savedCategories = await prisma.zal_Qoo10Category.createMany({
      data: categories.map((cat: any) => ({
        mainCategoryCode: cat.CATE_L_CD,
        mainCategoryName: cat.CATE_L_NM,
        midCategoryCode: cat.CATE_M_CD,
        midCategoryName: cat.CATE_M_NM,
        subCategoryCode: cat.CATE_S_CD,
        subCategoryName: cat.CATE_S_NM
      }))
    })

    return NextResponse.json(savedCategories)
  } catch (error) {
    console.error('Failed to save categories:', error)
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 })
  }
} 