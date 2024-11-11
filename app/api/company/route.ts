import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

// GET: 회사 정보 조회 (parentCompanyId 파라미터 추가)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentCompanyId = searchParams.get('parentCompanyId')

    // 조회 조건 설정
    const where = {
      DeletedAt: null,
      ...(parentCompanyId ? { ParentCompanyId: parentCompanyId } : { ParentCompanyId: null })
    }

    const companies = await prisma.zal_CompanyInfo.findMany({
      where,
      select: {
        Id: true,
        ParentCompanyId: true,
        Name: true,
        BizNum: true,
        BizType: true,
        BizClass: true,
        OwnerName: true,
        Tel: true,
        Email: true,
        ManagerName: true,
        CreatedAt: true,
        UpdatedAt: true,
        DeletedAt: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    })

    await prisma.$disconnect()
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    await prisma.$disconnect()
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

    const newId = randomUUID().toUpperCase()
    const parentId = body.ParentCompanyId ? body.ParentCompanyId.toUpperCase() : null

    const company = await prisma.zal_CompanyInfo.create({
      data: {
        Id: newId,
        ParentCompanyId: parentId,
        Name: body.Name,
        BizNum: body.BizNum,
        BizType: body.BizType,
        BizClass: body.BizClass,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        ManagerTel: body.ManagerTel,
        ManagerPosition: body.ManagerPosition,
        ManagerEmail: body.ManagerEmail,
        CreatedAt: new Date(),
      },
    });

    console.log('새 회사가 성공적으로 생성되었습니다. ID:', company.Id)
    return NextResponse.json(company)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 생성에 실패했습니다.' }, 
      { status: 500 }
    )
  }
}

// PUT: 회사 정보 수정
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log('회사 정보 수정:', body)

    if (!body.Id) {
      return NextResponse.json(
        { error: '회사 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const company = await prisma.zal_CompanyInfo.update({
      where: {
        Id: body.Id
      },
      data: {
        Name: body.Name,
        BizNum: body.BizNum,
        BizType: body.BizType,
        BizClass: body.BizClass,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        ManagerTel: body.ManagerTel,
        ManagerPosition: body.ManagerPosition,
        ManagerEmail: body.ManagerEmail,
        UpdatedAt: new Date(),
      }
    })

    console.log('회사 정보가 성공적으로 수정되었습니다. ID:', company.Id)
    return NextResponse.json(company)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 정보 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

