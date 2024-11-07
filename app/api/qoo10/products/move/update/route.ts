import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const params = new URLSearchParams({
      v: '1.0',
      method: 'ItemsBasic.UpdateMoveGoods',
      key: process.env.QOO10_API_KEY || '',
      returnType: 'json',
      ...body
    });

    const response = await fetch(`${QOO10_API_URL}?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('QOO10 UpdateMoveGoods API Response:', {
      url: `${QOO10_API_URL}?${params.toString()}`,
      status: response.status,
      data: data
    });

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to update move product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update move product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 