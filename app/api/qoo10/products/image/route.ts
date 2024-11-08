import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ItemCode, SellerCode, StandardImage, VideoURL, SellerAuthKey } = body

    // QOO10 API 호출
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.1',
      'method': 'ItemsContents.EditGoodsImage',
      'key': SellerAuthKey,
      'ItemCode': ItemCode,
      'SellerCode': SellerCode,
      'StandardImage': StandardImage || '',
      'VideoURL': VideoURL || ''
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`QOO10 API 호출 실패: ${response.status}`)
    }

    const result = await response.json()
    
    // API 응답 확인 및 에러 처리
    if (result.ResultCode !== 0) {
      throw new Error(result.ResultMsg || 'QOO10 API 호출 실패')
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Failed to update image:', error)
    return NextResponse.json(
      { 
        ResultCode: -1,
        ResultMsg: error.message || '이미지 수정에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 