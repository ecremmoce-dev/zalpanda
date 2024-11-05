import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

// GET: 모든 회사 정보 조회
export async function GET() {
  try {
    console.log('모든 회사 정보 조회 중...')
    
    const companies = await prisma.zal_CompanyInfo.findMany({
      where: {
        DeletedAt: null
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    })

    console.log(`${companies.length}개의 회사 정보를 찾았습니다.`)
    return NextResponse.json(companies)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 정보 조회에 실패했습니다.' }, 
      { status: 500 }
    )
  }
}

// POST: 새 회사 정보 추가
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('새 회사 정보 생성:', body)

    const newCompany = await prisma.zal_CompanyInfo.create({
      data: {
        Id: randomUUID(),
        Name: body.Name,
        NameEn: body.NameEn,
        BizNum: body.BizNum,
        BizType: body.BizType,
        BizClass: body.BizClass,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    })

    console.log('새 회사가 성공적으로 생성되었습니다. ID:', newCompany.Id)
    return NextResponse.json(newCompany)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 생성에 실패했습니다.' }, 
      { status: 500 }
    )
  }
}

