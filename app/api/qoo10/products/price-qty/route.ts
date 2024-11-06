import { NextResponse } from 'next/server'

// SetGoodsPriceQty API 엔드포인트
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ItemCode, SellerCode, Price, TaxRate, Qty, ExpireDate, SellerAuthKey } = body

    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsOrder.SetGoodsPriceQty',
      'key': SellerAuthKey,
      'ItemCode': ItemCode,
      'SellerCode': SellerCode,
      'Price': Price?.toString() || '0',
      'TaxRate': TaxRate?.toString() || '0',
      'Qty': Qty?.toString() || '0',
      'ExpireDate': ExpireDate || ''
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
        ResultMsg: error.message || '가격/수량 변경에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 