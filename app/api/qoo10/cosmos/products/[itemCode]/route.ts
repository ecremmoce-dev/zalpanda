import { NextResponse } from 'next/server'
import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
const container = database.container("Temp_qoo10jp_product")

export async function GET(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    const { resources: items } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
        parameters: [{ name: "@itemCode", value: params.itemCode }]
      })
      .fetchAll()

    if (items.length === 0) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(items[0])
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: '상품 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 상품 정보 수정
export async function PUT(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    const body = await request.json()
    
    // 기존 상품 조회
    const { resources: items } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
        parameters: [{ name: "@itemCode", value: params.itemCode }]
      })
      .fetchAll()

    if (items.length === 0) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const existingItem = items[0]

    // 수정할 필드들 업데이트
    const updatedItem = {
      ...existingItem,
      ItemTitle: body.ItemTitle,
      ItemPrice: parseFloat(body.ItemPrice),
      RetailPrice: parseFloat(body.RetailPrice),
      SettlePrice: parseFloat(body.SettlePrice),
      TaxRate: parseFloat(body.TaxRate),
      ItemQty: parseInt(body.ItemQty),
      ShippingNo: body.ShippingNo,
      BrandNo: body.BrandNo,
      Keyword: body.Keyword,
      SellerCode: body.SellerCode,
      ImageUrl: body.ImageUrl,
      ItemDetail: body.ItemDetail,
      ItemStatus: body.ItemStatus,
      ProductionPlaceType: body.ProductionPlaceType,
      ProductionPlace: body.ProductionPlace,
      Options: Array.isArray(body.Options) ? body.Options.map((opt: any) => ({
        ...opt,
        price: parseFloat(opt.price),
        qty: parseInt(opt.qty),
        updatedAt: new Date().toISOString()
      })) : existingItem.Options || [], // Options가 없으면 기존 값 또는 빈 배열 사용
      UpdatedAt: new Date().toISOString()
    }

    // Cosmos DB 업데이트
    const { resource: result } = await container.items.upsert(updatedItem)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: '상품 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
} 