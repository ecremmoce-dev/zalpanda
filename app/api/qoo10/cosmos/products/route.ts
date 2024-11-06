import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
const container = database.container("Temp_qoo10jp_product")

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const platformId = searchParams.get('platformId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const flag = searchParams.get('flag')
    const searchTerm = searchParams.get('search')
    const searchField = searchParams.get('searchField') // itemCode, itemTitle, sellerCode

    if (!companyId || !platformId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 플랫폼 정보 조회
    const platform = await prisma.zal_CompanyPlatform.findFirst({
      where: {
        CompanyId: companyId,
        DeletedAt: null,
        Id: platformId
      }
    })

    if (!platform?.SellerId) {
      return NextResponse.json(
        { error: '플랫폼 정보를 찾을 수 없습니다.' },
        { status: 400 }
      )
    }

    let querySpec = {
      query: "SELECT * FROM c WHERE c.CompanyId = @companyId AND c.SellerId = @sellerId",
      parameters: [
        {
          name: "@companyId",
          value: companyId
        },
        {
          name: "@sellerId",
          value: platform.SellerId
        }
      ]
    }

    if (flag) {
      querySpec.query += " AND c.Flag = @flag"
      querySpec.parameters.push({
        name: "@flag",
        value: flag
      })
    }

    // 검색 조건 추가
    if (searchTerm && searchField) {
      querySpec.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`
      querySpec.parameters.push({
        name: "@searchTerm",
        value: searchTerm
      })
    }

    // 최신 동기화 순으로 정렬
    querySpec.query += " ORDER BY c.LastSyncDate DESC"

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll()

    // 페이지네이션 적용
    const startIndex = (page - 1) * pageSize
    const paginatedItems = items.slice(startIndex, startIndex + pageSize)
    
    return NextResponse.json({
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize)
    })

  } catch (error) {
    console.error('Failed to fetch Cosmos products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 