import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.SellerCode) {
      return NextResponse.json(
        { 
          error: 'SellerCode is required',
          ResultCode: -1,
          ResultMsg: '판매자 코드가 없습니다.'
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.QOO10_API_KEY || '';
    if (!apiKey) {
      throw new Error('API key is missing');
    }

    // 옵션 정보 문자열 형식 검증
    const inventoryInfoArray = body.InventoryInfo.split('$$');
    const validInventoryInfo = inventoryInfoArray.map(info => {
      const [color, size, price, qty, code] = info.split('||*');
      return `${color}||*${size}||*${price}||*${qty}||*${code}`;
    }).join('$$');

    // URL 파라미터 구성
    const params = new URLSearchParams({
      v: '1.0',
      method: 'ItemsOptions.EditCommonGoodsInventory',
      key: apiKey,
      returnType: 'json',
      SellerCode: body.SellerCode,
      InventoryInfo: validInventoryInfo
    });

    console.log('Request Parameters:', {
      SellerCode: body.SellerCode,
      InventoryInfo: validInventoryInfo
    });

    const response = await fetch(`${QOO10_API_URL}?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('QOO10 EditCommonGoodsInventory API Response:', {
      url: `${QOO10_API_URL}?${params.toString()}`,
      status: response.status,
      data: data
    });

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to update inventory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update inventory',
        details: error instanceof Error ? error.message : 'Unknown error',
        ResultCode: -1,
        ResultMsg: '옵션 정보 업데이트 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
} 