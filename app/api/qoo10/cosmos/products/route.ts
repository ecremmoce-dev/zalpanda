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

// 정렬 함수 추가
const sortItems = (items: any[], flag: string | null) => {
  if (!flag || flag === 'all') {
    // 전체탭: UpdatedAt desc
    return items.sort((a, b) => {
      const dateA = new Date(b.UpdatedAt || 0).getTime()
      const dateB = new Date(a.UpdatedAt || 0).getTime()
      return dateA - dateB
    })
  } else if (flag === 'NONE') {
    // 일반상품: ListedDate asc
    return items.sort((a, b) => {
      const dateA = new Date(a.ListedDate || 0).getTime()
      const dateB = new Date(b.ListedDate || 0).getTime()
      return dateA - dateB
    })
  } else {
    // 무브상품: UpdatedAt desc
    return items.sort((a, b) => {
      const dateA = new Date(b.UpdatedAt || 0).getTime()
      const dateB = new Date(a.UpdatedAt || 0).getTime()
      return dateA - dateB
    })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const platformId = searchParams.get('platformId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const flag = searchParams.get('flag')
    const searchTerm = searchParams.get('searchTerm')
    const searchField = searchParams.get('searchField')

    if (!companyId || !platformId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
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
      baseQuery.query += ` AND CONTAINS(LOWER(c.${searchField}), LOWER(@searchTerm))`
      baseQuery.parameters.push({ name: "@searchTerm", value: searchTerm.toLowerCase() })

      // 디버깅을 위한 로그 추가
      console.log('Search Query:', baseQuery.query)
      console.log('Search Parameters:', baseQuery.parameters)
    }

    // 항상 두 컨테이너의 전체 개수를 조회
    const [totalMoveItems, totalNormalItems] = await Promise.all([
      moveContainer.items.query(baseQuery).fetchAll(),
      normalContainer.items.query(baseQuery).fetchAll()
    ])

    const totalMoveCount = totalMoveItems.resources.length
    const totalNormalCount = totalNormalItems.resources.length

    let items = []
    
    // flag에 따른 데이터 필터링
    if (!flag || flag === 'all') {
      items = [
        ...totalMoveItems.resources.map(item => ({ ...item, Flag: 'MOVE' })),
        ...totalNormalItems.resources.map(item => ({ ...item, Flag: 'NONE' }))
      ]
    } else if (flag === 'MOVE') {
      items = totalMoveItems.resources.map(item => ({ ...item, Flag: 'MOVE' }))
    } else {
      items = totalNormalItems.resources.map(item => ({ ...item, Flag: 'NONE' }))
    }

    // 탭별 정렬 적용
    items = sortItems(items, flag)

    // 페이지네이션 적용
    const startIndex = (page - 1) * pageSize
    const paginatedItems = items.slice(startIndex, startIndex + pageSize)
    
    // 응답에 전체 개수와 현재 필터링된 개수를 모두 포함
    return NextResponse.json({
      items: paginatedItems,
      total: items.length,            // 현재 필터링된 항목 수
      totalItems: totalMoveCount + totalNormalCount,  // 전체 항목 수
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
      moveCount: totalMoveCount,      // 전체 무브상품 수
      normalCount: totalNormalCount   // 전체 일반상품 수
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