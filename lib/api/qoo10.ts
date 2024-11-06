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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }),
    // 가격 업데이트
    fetch('/api/qoo10/products/move/price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        ItemPrice: product.ItemPrice
      })
    }),
    // 재고 업데이트
    fetch('/api/qoo10/products/move/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ItemCode: product.ItemCode,
        OptionQty: product.OptionQty
      })
    })
  ])

  return responses.map(r => r.json())
} 