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
        ManufactureDate: body.ManufactureDate || '',
        ModelNm: body.ModelNM || '',
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

    // Handle error codes
    if (data.ResultCode !== 0) {
      return NextResponse.json({
        success: false,
        error: data.ResultMsg,
        code: data.ResultCode,
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
    '-10000': 'Please check the Seller Authorization Key.',
    '-10001': 'Fail to find Item information with ItemCode,SellerCode.',
    '-10002': 'The product information does not exist.',
    '-10003': 'Failed to find about Seller\'s free delivery Info.',
    '-10004': 'Delivery information is wrong. please input another ShippingNo.',
    '-10005': 'Please check the AvailableDateValue.',
    '-10101': 'Processing Error',
    '-90001': 'The API does not exist',
    '-90002': 'You are not authorized for this.',
    '-90003': 'You are not authorized for this.',
    '-90004': 'Seller authorization key is expired. Use a new key.',
    '-90005': 'Seller authorization key is expired. Use a new key.'
  };

  return errorMessages[code] || 'Unknown error';
}