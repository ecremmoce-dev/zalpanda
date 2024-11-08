import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi/ItemsOptions.EditGoodsInventory';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure SellerAuthKey is included
    const apiKey = body.SellerAuthKey || process.env.QOO10_API_KEY || '';

    if (!apiKey) {
      throw new Error('SellerAuthKey is missing');
    }

    // 옵션 정보 포맷팅
    const inventoryInfo = body.Options.map((option: any) => 
      `${option.name1 || ''}||*${option.value1 || ''}||*${option.price || 0}||*${option.qty || 0}||*${option.itemTypeCode || ''}`
    ).join('$$');

    // POST request setup
    const response = await fetch(QOO10_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'QAPIVersion': '1.0',
        'GiosisCertificationKey': apiKey
      },
      body: new URLSearchParams({
        returnType: 'json',
        ItemCode: body.ItemCode,
        SellerCode: body.SellerCode,
        InventoryInfo: inventoryInfo
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
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
    console.error('Failed to update inventory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update inventory',
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
    '-10000': 'API 인증키를 확인해주세요.',
    '-10001': '상품코드 또는 판매자코드를 찾을 수 없습니다.',
    '-10002': '옵션 데이터 형식을 확인해주세요. (Name||*Value||*Price||*Qty||*OptioCode$$)',
    '-10101': '처리 중 오류가 발생했습니다.',
    '-90001': 'API가 존재하지 않습니다.',
    '-90002': '권한이 없습니다.',
    '-90003': '권한이 없습니다.',
    '-90004': 'API 인증키가 만료되었습니다.',
    '-90005': 'API 인증키가 만료되었습니다.'
  };

  return errorMessages[code] || `알 수 없는 오류가 발생했습니다. (오류 코드: ${code})`;
} 