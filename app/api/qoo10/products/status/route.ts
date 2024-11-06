import { NextResponse } from 'next/server'

// EditGoodsStatus API 엔드포인트
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ItemCode, SellerCode, Status, SellerAuthKey } = body

    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsBasic.EditGoodsStatus',
      'key': SellerAuthKey,
      'ItemCode': ItemCode,
      'SellerCode': SellerCode,
      'Status': Status
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`QOO10 API 호출 실패: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json(
      { 
        ResultCode: -1,
        ResultMsg: error.message || '상태 변경에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 