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

export const dynamic = 'force-dynamic';

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

    // 기본 쿼리 생성
    const baseQuery = {
      query: "SELECT * FROM c WHERE c.CompanyId = @companyId AND c.PlatformId = @platformId",
      parameters: [
        { name: "@companyId", value: companyId },
        { name: "@platformId", value: platformId }
      ]
    }

    // 검색 조건 추가
    if (searchTerm && searchField) {
      baseQuery.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`
      baseQuery.parameters.push({ name: "@searchTerm", value: searchTerm })
    }

    let items = []

    // flag에 따른 조회 처리
    if (!flag || flag === 'all') {
      // 두 컨테이너에서 모두 조회
      const [moveItems, normalItems] = await Promise.all([
        moveContainer.items.query(baseQuery).fetchAll(),
        normalContainer.items.query(baseQuery).fetchAll()
      ])

      items = [
        ...moveItems.resources.map(item => ({ ...item, flag: 'MOVE' })),
        ...normalItems.resources.map(item => ({ ...item, flag: 'NONE' }))
      ]
    } else if (flag === 'MOVE') {
      // 무브상품만 조회
      const { resources } = await moveContainer.items.query(baseQuery).fetchAll()
      items = resources.map(item => ({ ...item, flag: 'MOVE' }))
    } else {
      // 일반상품만 조회
      const { resources } = await normalContainer.items.query(baseQuery).fetchAll()
      items = resources.map(item => ({ ...item, flag: 'NONE' }))
    }

    // 최신 동기화 순으로 정렬
    items.sort((a, b) => {
      const dateA = new Date(b.LastFetchDate || b.UpdatedAt || 0).getTime()
      const dateB = new Date(a.LastFetchDate || a.UpdatedAt || 0).getTime()
      return dateA - dateB
    })

    // 페이지네이션 적용
    const startIndex = (page - 1) * pageSize
    const paginatedItems = items.slice(startIndex, startIndex + pageSize)
    
    return NextResponse.json({
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
      moveCount: items.filter(item => item.flag === 'MOVE').length,
      normalCount: items.filter(item => item.flag === 'NONE').length
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