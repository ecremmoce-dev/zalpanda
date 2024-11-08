import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi/ItemsBasic.UpdateGoods';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure SellerAuthKey is included
    const apiKey = body.SellerAuthKey || process.env.QOO10_API_KEY || '';

    if (!apiKey) {
      throw new Error('SellerAuthKey is missing');
    }

    // 날짜 형식 변환 함수 추가
    const formatDate = (dateStr: string | undefined | null): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        // 날짜 형식이 올바르지 않을 경우, RangeError 예외가 발생합니다.
        // 이를 방지하기 위해, 날짜 형식이 올바르지 않으면 예외를 catch하여 빈 문자열을 반환합니다.
        if (isNaN(date.getTime())) {
          console.error('Invalid date format:', dateStr);
          return '';
        }
        return date.toISOString().split('T')[0].replace(/-/g, '/');
      } catch (error) {
        console.error('Date format error:', error);
        return '';
      }
    };

    // 발송 가능일 처리
    let availableDateValue = '3';  // 기본값
    let desiredShippingDate = '3'; // 기본값

    switch (body.AvailableDateType) {
      case '0': // 일반발송
        availableDateValue = '3';
        desiredShippingDate = '3';
        break;
      case '1': // 상품준비일
        availableDateValue = body.AvailableDateValue || '4';
        desiredShippingDate = availableDateValue;
        break;
      case '2': // 출시일
        availableDateValue = formatDate(body.AvailableDateValue);
        desiredShippingDate = '0';
        break;
      case '3': // 당일발송
        availableDateValue = body.AvailableDateValue || '14:30';
        desiredShippingDate = '0';
        break;
      default:
        availableDateValue = '3';
        desiredShippingDate = '3';
    }

    // POST request setup
    const response = await fetch(QOO10_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'QAPIVersion': '1.1',
        'GiosisCertificationKey': apiKey
      },
      body: new URLSearchParams({
        returnType: 'json',
        ItemCode: body.ItemCode,
        SecondSubCat: body.SecondSubCat,
        ItemTitle: body.ItemTitle,
        PromotionName: body.PromotionName || '',
        SellerCode: body.SellerCode || '',
        IndustrialCodeType: body.IndustrialCodeType || '',
        IndustrialCode: body.IndustrialCode || '',
        BrandNo: body.BrandNo || '',
        ManufactureDate: formatDate(body.ManufactureDate) || '',
        ModelNm: body.ModelNM || '',
        Material: body.Material || '',
        ProductionPlaceType: body.ProductionPlaceType || '',
        ProductionPlace: body.ProductionPlace || '',
        RetailPrice: body.RetailPrice?.toString() || '0',
        AdultYN: body.AdultYN || 'N',
        ContactInfo: body.ContactInfo || '',
        ShippingNo: body.ShippingNo?.toString() || '',
        Weight: body.Weight?.toString() || '',
        DesiredShippingDate: desiredShippingDate,
        AvailableDateType: body.AvailableDateType || '',
        AvailableDateValue: availableDateValue,
        Keyword: body.Keyword || ''
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('QOO10 UpdateGoods API Response:', {
      url: QOO10_API_URL,
      status: response.status,
      data: data
    });

    // Handle error codes
    if (data.ResultCode !== 0) {
      return NextResponse.json({
        success: false,
        ResultCode: data.ResultCode,
        ResultMsg: data.ResultMsg,
        error: data.ResultMsg,
        details: getErrorMessage(data.ResultCode)
      });
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Error message mapping
function getErrorMessage(code: number): string {
  const errorMessages: { [key: number]: string } = {
    0: 'SUCCESS',
    '-999': '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 형식으로 입력해주세요)',
    '-10000': 'API 인증키를 확인해주세요.',
    '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
    '-10002': '상품 정보가 존재하지 않습니다.',
    '-10003': '판매자의 무료배송 정보를 찾을 수 없습니다.',
    '-10004': '배송 정보가 잘못되었습니다. 다른 배송비코드를 입력해주세요.',
    '-10005': '발송가능일 값을 확인해주세요.',
    '-10101': '처리 중 오류가 발생했습니다.',
    '-90001': 'API가 존재하지 않습니다.',
    '-90002': '권한이 없습니다.',
    '-90003': '권한이 없습니다.',
    '-90004': 'API 인증키가 만료되었습니다.',
    '-90005': 'API 인증키가 만료되었습니다.'
  };

  return errorMessages[code] || `알 수 없는 오류가 발생했습니다. (오류 코드: ${code})`;
}