// 일반상품 API 호출
export async function updateNormalProduct(product: any) {
  const responses = await Promise.all([
    // 기본 정보 업데이트
    fetch('/api/qoo10/products/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }),
    // 가격/수량 업데이트
    fetch('/api/qoo10/products/price-qty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        Price: product.ItemPrice,
        Qty: product.ItemQty
      })
    }),
    // 상세 설명 업데이트
    fetch('/api/qoo10/products/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        Contents: product.ItemDetail
      })
    })
  ])

  return responses.map(r => r.json())
}

// 무브상품 API 호출
export async function updateMoveProduct(product: any) {
  const responses = await Promise.all([
    // 기본 정보 업데이트
    fetch('/api/qoo10/products/move/update', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        SellerCode: product.SellerCode || '',
        SecondSubCat: product.SecondSubCat,
        ItemSeriesName: product.ItemSeriesName || '',
        PromotionName: product.PromotionName || '',
        ItemPrice: product.ItemPrice?.toString() || '0',
        RetailPrice: product.RetailPrice?.toString() || '0',
        TaxRate: product.TaxRate || '',
        OptionType: product.OptionType || '',
        OptionMainimage: product.OptionMainimage || '',
        OptionSubimage: product.OptionSubimage || '',
        OptionQty: product.OptionQty || '',
        StyleNumber: product.StyleNumber || '',
        TpoNumber: product.TpoNumber || '',
        SeasonType: product.SeasonType || '',
        MaterialInfo: product.MaterialInfo || '',
        MaterialNumber: product.MaterialNumber || '',
        AttributeInfo: product.AttributeInfo || '',
        ItemDescription: product.ItemDescription || '',
        WashinginfoWashing: product.WashinginfoWashing || '',
        WashinginfoStretch: product.WashinginfoStretch || '',
        WashinginfoFit: product.WashinginfoFit || '',
        WashinginfoThickness: product.WashinginfoThickness || '',
        WashinginfoLining: product.WashinginfoLining || '',
        WashinginfoSeethrough: product.WashinginfoSeethrough || '',
        ImageOtherUrl: product.ImageOtherUrl || '',
        VideoNumber: product.VideoNumber || '',
        ShippingNo: product.ShippingNo?.toString() || '',
        AvailableDateValue: product.AvailableDateValue || '',
        DesiredShippingDate: product.DesiredShippingDate?.toString() || '',
        Keyword: product.Keyword || '',
        OriginType: product.OriginType || '',
        OriginRegionId: product.OriginType === '1' ? product.ProductionPlace : '',
        OriginCountryId: product.OriginType === '2' ? product.ProductionPlace : '',
        OriginOthers: product.OriginType === '3' ? product.ProductionPlace : '',
        Weight: product.Weight?.toString() || '',
        ExpireDate: product.ExpireDate || '',
        SellerAuthKey: product.SellerAuthKey
      })
    }),

    // 가격 업데이트
    fetch('/api/qoo10/products/move/price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        ItemPrice: product.ItemPrice,
        SellerAuthKey: product.SellerAuthKey
      })
    }),

    // 재고 업데이트
    fetch('/api/qoo10/products/move/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        OptionQty: product.OptionQty,
        SellerAuthKey: product.SellerAuthKey
      })
    })
  ]);

  return Promise.all(responses.map(r => r.json()));
} 