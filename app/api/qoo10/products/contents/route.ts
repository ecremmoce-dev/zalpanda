import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ItemCode, SellerCode, Contents, SellerAuthKey } = body

    // 필수 파라미터 검증
    if (!ItemCode || !Contents || !SellerAuthKey) {
      return NextResponse.json(
        { 
          ResultCode: -1,
          ResultMsg: '필수 파라미터가 누락되었습니다.'
        },
        { status: 400 }
      )
    }

    // Quill 에디터의 HTML을 QOO10 형식으로 변환
    const convertedContents = Contents.replace(
      /<p class="ql-align-center"><img src="([^"]+)"[^>]*><\/p>/g, 
      '<div style="text-align: center;"><img src="$1"></div>'
    ).replace(
      /<p><img src="([^"]+)"[^>]*><\/p>/g,
      '<div><img style="display: block; margin-left: auto; margin-right: auto;" src="$1"></div>'
    ).replace(
      /<p class="ql-align-center"><br><\/p>/g,
      ''
    ).replace(/\n/g, '\\n')

    // QOO10 API 호출
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsContents.EditGoodsContents',
      'key': SellerAuthKey,
      'ItemCode': ItemCode,
      'SellerCode': SellerCode || '',
      'Contents': convertedContents
    })

    console.log('QOO10 API 요청:', `${baseUrl}?${params.toString()}`)
    console.log('변환된 Contents:', convertedContents)

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`QOO10 API 호출 실패: ${response.status}`)
    }

    const result = await response.json()
    console.log('QOO10 API 응답:', result)
    
    // API 응답 확인 및 에러 처리
    if (result.ResultCode !== 0) {
      const errorMessages: { [key: string]: string } = {
        '-10000': 'API 인증키를 확인해주세요.',
        '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
        '-10101': '처리 중 오류가 발생했습니다.',
        '-90001': 'API가 존재하지 않습니다.',
        '-90002': '권한이 없습니다.',
        '-90003': '권한이 없습니다.',
        '-90004': 'API 인증키가 만료되었습니다.',
        '-90005': 'API 인증키가 만료되었습니다.'
      }

      return NextResponse.json(
        { 
          ResultCode: result.ResultCode,
          ResultMsg: errorMessages[result.ResultCode] || result.ResultMsg
        },
        { status: 400 }
      )
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Failed to update contents:', error)
    return NextResponse.json(
      { 
        ResultCode: -1,
        ResultMsg: error.message || '상품 상세 내용 수정에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 