import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('UpdateGoods API 요청 데이터:', body)

    // 필수 파라미터 검증
    const requiredFields = ['ItemCode', 'SecondSubCat', 'SellerAuthKey']
    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          ResultCode: -99,
          ResultMsg: `필수 파라미터가 누락되었습니다: ${missingFields.join(', ')}`
        },
        { status: 400 }
      )
    }

    // 국제 배송을 위한 Weight 값 검증
    if (!body.Weight || body.Weight <= 0) {
      body.Weight = '0.5' // 기본값 설정
    }

    // QOO10 API 호출
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.1',
      'method': 'ItemsBasic.UpdateGoods',
      'key': body.SellerAuthKey,
      'ItemCode': body.ItemCode,
      'SecondSubCat': body.SecondSubCat,
      'ItemTitle': body.ItemTitle || '',
      'PromotionName': body.PromotionName || '',
      'SellerCode': body.SellerCode || '',
      'IndustrialCodeType': body.IndustrialCodeType || '',
      'IndustrialCode': body.IndustrialCode || '',
      'BrandNo': body.BrandNo || '',
      'ManufactureDate': body.ManufactureDate || '',
      'ModelNm': body.ModelNM || '',
      'Material': body.Material || '',
      'ProductionPlaceType': body.ProductionPlaceType || '',
      'ProductionPlace': body.ProductionPlace || '',
      'RetailPrice': body.RetailPrice?.toString() || '0',
      'AdultYN': body.AdultYN || 'N',
      'ContactInfo': body.ContactInfo || '',
      'ShippingNo': body.ShippingNo || '',
      'Weight': body.Weight?.toString() || '0.5', // 기본값 0.5kg
      'DesiredShippingDate': body.DesiredShippingDate?.toString() || '0',
      'AvailableDateType': body.AvailableDateType || '',
      'AvailableDateValue': body.AvailableDateValue || '',
      'Keyword': body.Keyword || ''
    })

    console.log('QOO10 API 요청 URL:', `${baseUrl}?${params.toString()}`)

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    console.log('QOO10 API 응답 상태:', response.status)

    if (!response.ok) {
      throw new Error(`QOO10 API 호출 실패: ${response.status}`)
    }

    const result = await response.json()
    console.log('QOO10 API 응답 결과:', result)
    
    // API 응답 확인 및 에러 처리
    if (result.ResultCode !== 0) {
      const errorMessages: { [key: string]: string } = {
        '-10000': 'API 인증키를 확인해주세요.',
        '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
        '-10002': '상품 정보가 존재하지 않습니다.',
        '-10003': '판매자의 무료배송 정보를 찾을 수 없습니다.',
        '-10004': '배송 정보가 잘못되었습니다. 다른 배송번호를 입력해주세요.',
        '-10005': '발송가능일 값을 확인해주세요.',
        '-10101': '처리 중 오류가 발생했습니다.',
        '-90001': 'API가 존재하지 않습니다.',
        '-90002': '권한이 없습니다.',
        '-90003': '권한이 없습니다.',
        '-90004': 'API 인증키가 만료되었습니다.',
        '-90005': 'API 인증키가 만료되었습니다.',
        '-99': '필수 파라미터가 누락되었습니다.',
        '-100005': '국제 배송을 위한 무게 정보가 필요합니다.'
      }

      console.error('QOO10 API 오류:', result)
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
    console.error('UpdateGoods API 처리 실패:', error)
    return NextResponse.json(
      { 
        ResultCode: -1,
        ResultMsg: error.message || '상품 수정에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 