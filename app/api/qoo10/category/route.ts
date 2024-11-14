import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    console.log('key:', key)
    if (!key) {
      return NextResponse.json(
        { error: 'Authorization key is required' },
        { status: 400 }
      )
    }

    // 1. QOO10 API에서 카테고리 정보 조회
    const response = await fetch(
      'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'QAPIVersion': '1.0',
          'GiosisCertificationKey': key
        },
        body: new URLSearchParams({
          'method': 'CommonInfoLookup.GetCatagoryListAll',
          'lang_cd': 'ja'
        }).toString()
      }
    )

    const data = await response.json()
    console.log('QOO10 API 응답:', data)

    // 2. DB에서 번역된 카테고리 정보 조회 - 모델명 수정
    const dbCategories = await prisma.zal_Qoo10Category.findMany()
    console.log('DB 카테고리 수:', dbCategories.length)

    // 3. QOO10 카테고리와 DB 카테고리 매칭
    const categories = data.ResultObject.map((cat: any) => {
      const dbCategory = dbCategories.find(
        dbCat => 
          dbCat.mainCategoryCode === cat.CATE_L_CD &&
          dbCat.midCategoryCode === cat.CATE_M_CD &&
          dbCat.subCategoryCode === cat.CATE_S_CD
      )

      console.log('매칭된 카테고리:', dbCategory)

      if (dbCategory) {
        return {
          ...cat,
          CATE_L_NM: `${cat.CATE_L_NM} (${dbCategory.mainCategoryName})`,
          CATE_M_NM: `${cat.CATE_M_NM} (${dbCategory.midCategoryName})`,
          CATE_S_NM: `${cat.CATE_S_NM} (${dbCategory.subCategoryName})`
        }
      }

      return cat
    })

    return NextResponse.json({ ResultObject: categories })

  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 