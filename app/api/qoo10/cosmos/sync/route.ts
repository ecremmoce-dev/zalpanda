import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CosmosClient } from '@azure/cosmos'

// Cosmos DB 클라이언트 설정
const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
const container = database.container("Temp_qoo10jp_product")

// 전체 상품 목록 조회
async function fetchQoo10Products(authKey: string, page: number = 1) {
  try {
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsLookup.GetAllGoodsInfo',
      'key': authKey,
      'ItemStatus': 'S2',
      'Page': page.toString()
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)

    const data = await response.json()
    console.log(`페이지 ${page} 조회 결과:`, {
      총상품수: data.ResultObject.TotalItems,
      총페이지수: data.ResultObject.TotalPages,
      현재페이지: data.ResultObject.PresentPage,
      조회된상품수: data.ResultObject.Items.length
    })

    return data
  } catch (error) {
    console.error('Failed to fetch Qoo10 products:', error)
    throw error
  }
}

// 상품 상세 정보 조회
async function fetchItemDetail(authKey: string, itemCode: string) {
  try {
    const detail = await fetchDetailWithMethod(authKey, itemCode, false)
    if (detail) {
      return { ...detail, Flag: 'NONE' }
    }

    const moveDetail = await fetchDetailWithMethod(authKey, itemCode, true)
    if (moveDetail) {
      return { ...moveDetail, Flag: 'MOVE' }
    }

    return null
  } catch (error) {
    console.error(`Failed to fetch item detail (${itemCode}):`, error)
    return null
  }
}

// API 호출 메서드
async function fetchDetailWithMethod(authKey: string, itemCode: string, isMoveItem: boolean) {
  const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
  const method = isMoveItem ? 'ItemsLookup.GetMoveItemDetailInfo' : 'ItemsLookup.GetItemDetailInfo'
  
  const params = new URLSearchParams({
    'v': '1.2',
    'method': method,
    'key': authKey,
    'ItemCode': itemCode
  })

  const response = await fetch(`${baseUrl}?${params.toString()}`)
  if (!response.ok) return null

  const data = await response.json()
  if (!data.ResultObject) return null

  const item = isMoveItem ? data.ResultObject : data.ResultObject[0]
  if (!item) return null

  return item
}

// 상품 옵션 정보 조회 함수 추가
async function fetchItemInventoryInfo(authKey: string, itemCode: string) {
  try {
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsLookup.GetGoodsInventoryInfo',
      'key': authKey,
      'ItemCode': itemCode
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) return null

    const data = await response.json()
    return data.ResultObject || []
  } catch (error) {
    console.error(`Failed to fetch inventory info (${itemCode}):`, error)
    return null
  }
}

// Cosmos DB에 상품 데이터 저장 함수 수정
async function saveToCosmosDB(item: any, companyId: string, platformId: string, flag: string, sellerId: string, sellerAuthKey: string, options: any[] = []) {
  try {
    // 기존 상품 정보 조회
    const { resources: existingItems } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.ItemCode = @itemCode",
        parameters: [{ name: "@itemCode", value: item.ItemCode }]
      })
      .fetchAll()

    const existingItem = existingItems[0]
    const existingId = existingItem?._id

    const cosmosItem = {
      id: existingId || item.ItemCode,
      ItemCode: item.ItemCode,
      CompanyId: companyId,
      PlatformId: platformId,
      SellerId: sellerId,
      SellerAuthKey: sellerAuthKey,
      Flag: flag,
      OptionShippingNo1: item.OptionShippingNo1 || "",
      OptionShippingNo2: item.OptionShippingNo2 || "",
      TaxRate: item.TaxRate || "",
      PromotionName: item.PromotionName || "",
      Drugtype: item.Drugtype || "",
      ProductionPlaceType: item.ProductionPlaceType || "",
      ProductionPlace: item.ProductionPlace || "",
      IndustrialCodeType: item.IndustrialCodeType || "",
      ItemPrice: parseFloat(item.ItemPrice) || 0,
      ModelNM: item.ModelNM || "",
      ManufacturerDate: item.ManufactureDate || "",
      BrandNo: item.BrandNo || "",
      Material: item.Material || "",
      DesiredShippingDate: parseInt(item.DesiredShippingDate) || 0,
      AvailableDateType: item.AvailableDateType || "",
      AvailableDateValue: item.AvailableDateValue || "",
      ContactInfo: item.ContactInfo || "",
      VideoURL: item.VideoURL || "",
      Keyword: item.Keyword || "",
      ItemStatus: item.ItemStatus || "S2",
      ItemTitle: item.ItemTitle || item.ItemSeriesName || "",
      SellerCode: item.SellerCode || "",
      IndustrialCode: item.IndustrialCode || "",
      RetailPrice: parseFloat(item.RetailPrice) || 0,
      ItemQty: parseInt(item.ItemQty) || 0,
      ExpireDate: item.ExpireDate || null,
      AdultYN: item.AdultYN || "N",
      ShippingNo: item.ShippingNo || "",
      ItemDetail: item.ItemDetail || item.ItemDescription || "",
      ImageUrl: item.ImageUrl || "",
      OptionType: item.OptionType || "",
      OptionMainimage: item.OptionMainimage || "",
      OptionSubimage: item.OptionSubimage || "",
      OptionQty: item.OptionQty || "",
      OriginCountryId: item.OriginCountryId || "",
      OriginRegionId: item.OriginRegionId || "",
      OriginOthers: item.OriginOthers || "",
      SeasonType: item.SeasonType || "",
      StyleNumber: item.StyleNumber || "",
      TpoNumber: item.TpoNumber || "",
      VideoNumber: item.VideoNumber || "",
      WashinginfoFit: item.WashinginfoFit || "",
      WashinginfoLining: item.WashinginfoLining || "",
      WashinginfoSeethrough: item.WashinginfoSeethrough || "",
      WashinginfoStretch: item.WashinginfoStretch || "",
      WashinginfoThickness: item.WashinginfoThickness || "",
      WashinginfoWashing: item.washinginfoWashing || "",
      Weight: parseFloat(item.Weight) || 0,
      options: options.map(opt => ({
        id: `${item.ItemCode}_${opt.Name1}_${opt.Value1}_${opt.Name2}_${opt.Value2}`.replace(/\s+/g, '_'),
        name1: opt.Name1,
        value1: opt.Value1,
        name2: opt.Name2,
        value2: opt.Value2,
        name3: opt.Name3,
        value3: opt.Value3,
        name4: opt.Name4,
        value4: opt.Value4,
        name5: opt.Name5,
        value5: opt.Value5,
        price: parseFloat(opt.Price) || 0,
        qty: parseInt(opt.Qty) || 0,
        itemTypeCode: opt.ItemTypeCode,
        flag: flag,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      LastSyncDate: new Date().toISOString()
    }

    await container.items.upsert(cosmosItem)
    console.log(`상품 저장 완료: ${item.ItemCode} (${flag}) - 옵션 ${options.length}개`)
  } catch (error) {
    console.error(`Failed to save item to Cosmos DB (${item.ItemCode}):`, error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, platformId } = body

    // API Key 조회
    const platform = await prisma.zal_CompanyPlatform.findFirst({
      where: {
        Id: platformId,
        CompanyId: companyId,
        DeletedAt: null
      }
    })

    if (!platform?.ApiKey) {
      return NextResponse.json(
        { error: 'API Key가 설정되지 않았습니다.' },
        { status: 400 }
      )
    }

    // 전체 상품 목록 조회
    console.log('Qoo10 상품 목록 조회 시작...')
    const firstPageResult = await fetchQoo10Products(platform.ApiKey)
    const allItemCodes = firstPageResult.ResultObject.Items.map((item: any) => item.ItemCode)
    const totalPages = firstPageResult.ResultObject.TotalPages

    // 나머지 페이지 조회
    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await fetchQoo10Products(platform.ApiKey, page)
      allItemCodes.push(...pageResult.ResultObject.Items.map((item: any) => item.ItemCode))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`전체 ${allItemCodes.length}개 상품 코드 조회 완료`)

    // 상품 상세 정보 조회 및 Cosmos DB 저장
    let successCount = 0
    let failCount = 0

    for (const itemCode of allItemCodes) {
      try {
        const detail = await fetchItemDetail(platform.ApiKey, itemCode)
        if (detail) {
          let options = []
          
          if (detail.Flag === 'NONE') {
            // 일반 상품인 경우 GetGoodsInventoryInfo API 호출
            const inventoryInfo = await fetchItemInventoryInfo(platform.ApiKey, itemCode)
            if (inventoryInfo) {
              options = inventoryInfo
            }
          } else if (detail.Flag === 'MOVE' && detail.OptionQty) {
            // 무브 상품인 경우 OptionQty 파싱
            options = detail.OptionQty.split('$$').map((option: string) => {
              const [color, size, qty, code] = option.split('||*')
              return {
                Name1: 'Color',
                Value1: color,
                Name2: 'Size',
                Value2: size,
                Qty: parseInt(qty) || 0,
                ItemTypeCode: code,
                Price: 0
              }
            })
          }

          await saveToCosmosDB(
            detail, 
            companyId,
            platformId,
            detail.Flag,
            platform.SellerId,
            platform.ApiKey,
            options
          )
          successCount++
        } else {
          failCount++
        }
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`상품 처리 실패 (${itemCode}):`, error)
        failCount++
      }

      if ((successCount + failCount) % 10 === 0) {
        console.log(`진행 상황: ${successCount + failCount}/${allItemCodes.length} (성공: ${successCount}, 실패: ${failCount})`)
      }
    }

    return NextResponse.json({
      success: true,
      totalProducts: allItemCodes.length,
      successCount,
      failCount,
      syncDate: new Date()
    })

  } catch (error) {
    console.error('Cosmos DB 동기화 실패:', error)
    return NextResponse.json(
      { error: 'Cosmos DB 동기화에 실패했습니다.' },
      { status: 500 }
    )
  }
} 