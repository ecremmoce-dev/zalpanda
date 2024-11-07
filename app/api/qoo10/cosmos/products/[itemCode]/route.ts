import { NextResponse } from 'next/server'
import { CosmosClient } from '@azure/cosmos'

// Cosmos DB 클라이언트 설정
const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
const moveContainer = database.container("Temp_qoo10jp_move_product")
const normalContainer = database.container("Temp_qoo10jp_nonemove_product")

export async function GET(
  request: Request,
  { params }: { params: { itemCode: string } }
) {
  try {
    const itemCode = params.itemCode
    let product = null

    // 먼저 일반 상품 컨테이너에서 검색
    try {
      const { resources: normalProducts } = await normalContainer.items
        .query({
          query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
          parameters: [{ name: "@itemCode", value: itemCode }]
        })
        .fetchAll()

      if (normalProducts && normalProducts.length > 0) {
        product = normalProducts[0]
      }
    } catch (error) {
      console.log('일반 상품 조회 실패:', error)
    }

    // 일반 상품에서 찾지 못한 경우 무브 상품 컨테이너에서 검색
    if (!product) {
      try {
        const { resources: moveProducts } = await moveContainer.items
          .query({
            query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
            parameters: [{ name: "@itemCode", value: itemCode }]
          })
          .fetchAll()

        if (moveProducts && moveProducts.length > 0) {
          product = moveProducts[0]
        }
      } catch (error) {
        console.log('무브 상품 조회 실패:', error)
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
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
    const itemCode = params.itemCode
    const body = await request.json()
    const container = body.Flag === 'MOVE' ? moveContainer : normalContainer

    // 기존 상품 조회
    const { resources: existingProducts } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
        parameters: [{ name: "@itemCode", value: itemCode }]
      })
      .fetchAll()

    if (!existingProducts || existingProducts.length === 0) {
      return NextResponse.json(
        { error: '수정할 상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 상품 정보 업데이트
    const existingProduct = existingProducts[0]
    const updatedProduct = {
      ...existingProduct,
      ...body,
      UpdatedAt: new Date().toISOString()
    }

    // upsert를 사용하여 업데이트
    const { resource } = await container.items.upsert(updatedProduct)

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: '상품 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
} 