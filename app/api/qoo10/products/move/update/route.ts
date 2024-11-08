import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = body.SellerAuthKey || process.env.QOO10_API_KEY || '';
    if (!apiKey) {
      throw new Error('SellerAuthKey is missing');
    }
    // URL 파라미터 구성
    const params = new URLSearchParams({
      v: '1.0',
      method: 'ItemsBasic.UpdateMoveGoods',
      key: apiKey,
      returnType: 'json',
      ItemCode: body.ItemCode,
      SellerCode: body.SellerCode || '',
      SecondSubCat: body.SecondSubCat,
      ItemSeriesName: body.ItemSeriesName || '',
      PromotionName: body.PromotionName || '',
      ItemPrice: body.ItemPrice?.toString() || '0',
      RetailPrice: body.RetailPrice?.toString() || '0',
      TaxRate: body.TaxRate || '',
      OptionType: body.OptionType || '',
      OptionMainimage: body.OptionMainimage || '',
      OptionSubimage: body.OptionSubimage || '',
      OptionQty: body.OptionQty || '',
      StyleNumber: body.StyleNumber || '',
      TpoNumber: body.TpoNumber || '',
      SeasonType: body.SeasonType || '',
      MaterialInfo: body.MaterialInfo || '',
      MaterialNumber: body.MaterialNumber || '',
      AttributeInfo: body.AttributeInfo || '',
      ItemDescription: body.ItemDescription || '',
      WashinginfoWashing: body.WashinginfoWashing || '',
      WashinginfoStretch: body.WashinginfoStretch || '',
      WashinginfoFit: body.WashinginfoFit || '',
      WashinginfoThickness: body.WashinginfoThickness || '',
      WashinginfoLining: body.WashinginfoLining || '',
      WashinginfoSeethrough: body.WashinginfoSeethrough || '',
      ImageOtherUrl: body.ImageOtherUrl || '',
      VideoNumber: body.VideoNumber || '',
      ShippingNo: body.ShippingNo?.toString() || '',
      AvailableDateValue: body.AvailableDateValue || '',
      DesiredShippingDate: body.DesiredShippingDate?.toString() || '',
      Keyword: body.Keyword || '',
      OriginType: body.OriginType || '',
      OriginCountryId: body.OriginCountryId || '',
      Weight: body.Weight?.toString() || '',
      ExpireDate: body.ExpireDate || ''
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