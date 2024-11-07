import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('UpdateMoveGoods API 요청 데이터:', body)

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

    // QOO10 API 호출
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.1',
      'method': 'ItemsBasic.UpdateMoveGoods',
      'key': body.SellerAuthKey,
      'ItemCode': body.ItemCode,
      'SecondSubCat': body.SecondSubCat,
      'ItemSeriesName': body.ItemSeriesName || '',
      'PromotionName': body.PromotionName || '',
      'ItemPrice': body.ItemPrice?.toString() || '0',
      'RetailPrice': body.RetailPrice?.toString() || '0',
      'TaxRate': body.TaxRate?.toString() || '',
      'OptionType': body.OptionType || '',
      'OptionMainimage': body.OptionMainimage || '',
      'OptionSubimage': body.OptionSubimage || '',
      'OptionQty': body.OptionQty || '',
      'StyleNumber': body.StyleNumber || '',
      'TpoNumber': body.TpoNumber || '',
      'SeasonType': body.SeasonType || '',
      'MaterialInfo': body.MaterialInfo || '',
      'MaterialNumber': body.MaterialNumber || '',
      'AttributeInfo': body.AttributeInfo || '',
      'ItemDescription': body.ItemDescription || '',
      'WashinginfoWashing': body.WashinginfoWashing || '',
      'WashinginfoStretch': body.WashinginfoStretch || '',
      'WashinginfoFit': body.WashinginfoFit || '',
      'WashinginfoThickness': body.WashinginfoThickness || '',
      'WashinginfoLining': body.WashinginfoLining || '',
      'WashinginfoSeethrough': body.WashinginfoSeethrough || '',
      'ImageOtherUrl': body.ImageOtherUrl || '',
      'VideoNumber': body.VideoNumber || '',
      'ShippingNo': body.ShippingNo || '',
      'AvailableDateValue': body.AvailableDateValue || '',
      'DesiredShippingDate': body.DesiredShippingDate?.toString() || '0',
      'Keyword': body.Keyword || '',
      'OriginType': body.OriginType || '',
      'OriginRegionId': body.OriginRegionId || '',
      'OriginCountryId': body.OriginCountryId || '',
      'OriginOthers': body.OriginOthers || '',
      'Weight': body.Weight?.toString() || '0.5'
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`QOO10 API 호출 실패: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('UpdateMoveGoods API 처리 실패:', error)
    return NextResponse.json(
      { 
        ResultCode: -1,
        ResultMsg: error.message || '상품 수정에 실패했습니다.'
      },
      { status: 500 }
    )
  }
} 