import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 특정 회사 정보 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching company with ID:', params.id)
    
    const company = await prisma.zal_CompanyInfo.findUnique({
      where: {
        Id: params.id,
        DeletedAt: null
      }
    })

    if (!company) {
      return NextResponse.json({ error: '업체를 찾을 수 없습니다.' }, { status: 404 })
    }

    console.log('회사 정보를 성공적으로 조회했습니다.')
    return NextResponse.json(company)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '업체 정보 조회에 실패했습니다.' }, 
      { status: 500 }
    )
  }
}

// PUT: 회사 정보 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('회사 정보 업데이트:', params.id)
    console.log('업데이트 데이터:', body)

    const updatedCompany = await prisma.zal_CompanyInfo.update({
      where: {
        Id: params.id,
      },
      data: {
        Name: body.Name,
        NameEn: body.NameEn,
        BizNum: body.BizNum,
        BizType: body.BizType,
        BizClass: body.BizClass,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        UpdatedAt: new Date()
      }
    })

    console.log('회사 정보가 성공적으로 업데이트되었습니다.')
    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 정보 업데이트에 실패했습니다.' }, 
      { status: 500 }
    )
  }
}

// DELETE: 회사 정보 삭제 (소프트 삭제)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('회사 정보 삭제:', params.id)

    await prisma.zal_CompanyInfo.update({
      where: {
        Id: params.id
      },
      data: {
        DeletedAt: new Date()
      }
    })

    console.log('회사 정보가 성공적으로 삭제되었습니다.')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '회사 정보 삭제에 실패했습니다.' }, 
      { status: 500 }
    )
  }
} 