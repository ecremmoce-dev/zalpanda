import { NextRequest, NextResponse } from 'next/server';

const QOO10_API_URL = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi/ItemsBasic.UpdateGoods';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // POST 요청 설정
    const response = await fetch(QOO10_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'QAPIVersion': '1.1',
        'GiosisCertificationKey': process.env.QOO10_API_KEY || ''
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
        ManufactureDate: body.ManufactureDate || '',
        ModelNm: body.ModelNm || '',
        Material: body.Material || '',
        ProductionPlaceType: body.ProductionPlaceType || '',
        ProductionPlace: body.ProductionPlace || '',
        RetailPrice: body.RetailPrice?.toString() || '0',
        AdultYN: body.AdultYN || 'N',
        ContactInfo: body.ContactInfo || '',
        ShippingNo: body.ShippingNo?.toString() || '',
        Weight: body.Weight?.toString() || '',
        DesiredShippingDate: body.DesiredShippingDate?.toString() || '',
        AvailableDateType: body.AvailableDateType || '',
        AvailableDateValue: body.AvailableDateValue || '',
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