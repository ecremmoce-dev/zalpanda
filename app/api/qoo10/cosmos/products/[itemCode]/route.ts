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