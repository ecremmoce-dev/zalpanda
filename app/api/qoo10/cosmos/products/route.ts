import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
const moveContainer = database.container("Temp_qoo10jp_move_product")
const normalContainer = database.container("Temp_qoo10jp_nonemove_product")

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const platformId = searchParams.get('platformId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const flag = searchParams.get('flag')
    const searchTerm = searchParams.get('search')
    const searchField = searchParams.get('searchField')

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

    let items = []
    if (!flag || flag === 'all') {
      // 두 컨테이너에서 모두 조회
      const moveQuery = {
        query: "SELECT * FROM c WHERE c.CompanyId = @companyId AND c.SellerId = @sellerId",
        parameters: [
          { name: "@companyId", value: companyId },
          { name: "@sellerId", value: platform.SellerId }
        ]
      }
      const normalQuery = { ...moveQuery }

      // 검색 조건 추가
      if (searchTerm && searchField) {
        moveQuery.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`
        normalQuery.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`
        moveQuery.parameters.push({ name: "@searchTerm", value: searchTerm })
        normalQuery.parameters.push({ name: "@searchTerm", value: searchTerm })
      }

      const [moveItems, normalItems] = await Promise.all([
        moveContainer.items.query(moveQuery).fetchAll(),
        normalContainer.items.query(normalQuery).fetchAll()
      ])

      items = [...moveItems.resources, ...normalItems.resources]
    } else {
      // flag에 따라 해당 컨테이너만 조회
      const container = flag === 'MOVE' ? moveContainer : normalContainer
      const query = {
        query: "SELECT * FROM c WHERE c.CompanyId = @companyId AND c.SellerId = @sellerId",
        parameters: [
          { name: "@companyId", value: companyId },
          { name: "@sellerId", value: platform.SellerId }
        ]
      }

      if (searchTerm && searchField) {
        query.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`
        query.parameters.push({ name: "@searchTerm", value: searchTerm })
      }

      const { resources } = await container.items.query(query).fetchAll()
      items = resources
    }

    // 최신 동기화 순으로 정렬
    items.sort((a, b) => new Date(b.LastSyncDate).getTime() - new Date(a.LastSyncDate).getTime())

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