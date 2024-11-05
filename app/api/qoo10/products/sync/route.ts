import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Redis } from 'ioredis'
import sql from 'mssql'

// Redis 클라이언트 설정
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6380'),
  password: process.env.REDIS_PASSWORD,
  tls: {
    servername: process.env.REDIS_HOST
  }
})

// MSSQL 연결 설정
const sqlConfig = {
  user: 'sa',
  password: 'akfkclzls99!',
  database: 'awesomesqag_cafe',
  server: '192.168.0.135',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

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

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch Qoo10 products:', error)
    throw error
  }
}

// 상품 상세 정보 조회 함수 수정
async function fetchItemDetail(authKey: string, itemCode: string) {
  try {
    // 먼저 GetItemDetailInfo로 시도
    const detail = await fetchDetailWithMethod(authKey, itemCode, false)
    if (detail) {
      return { ...detail, Flag: 'NONE' }
    }

    // 실패하면 GetMoveItemDetailInfo로 시도
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

// 실제 API 호출을 담당하는 내부 함수
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

  return {
    ItemCode: item.ItemCode,
    Flag: isMoveItem ? 'MOVE' : 'NONE',
    ItemStatus: 'S2',
    ItemTitle: item.ItemTitle || item.ItemSeriesName,
    PromotionName: item.PromotionName || '',
    RetailPrice: item.RetailPrice ? parseFloat(item.RetailPrice) : null,
    ItemPrice: item.ItemPrice ? parseFloat(item.ItemPrice) : null,
    TaxRate: item.TaxRate ? parseFloat(item.TaxRate) : null,
    ItemQty: item.ItemQty ? parseInt(item.ItemQty) : null,
    ExpireDate: item.ExpireDate ? new Date(item.ExpireDate) : null,
    DesiredShippingDate: item.DesiredShippingDate ? parseInt(item.DesiredShippingDate) : null,
    AvailableDateValue: item.AvailableDateValue,
    ShippingNo: item.ShippingNo,
    ModelNM: item.ModelNM,
    ManufacturerDate: item.ManufacturerDate,
    BrandNo: item.BrandNo,
    AdultYN: item.AdultYN,
    ContactInfo: item.ContactInfo,
    ItemDetail: item.ItemDetail || item.ItemDescription,
    ImageUrl: item.ImageUrl,
    Keyword: item.Keyword,
    AttributeInfo: item.AttributeInfo,
    BuyLimitType: item.BuyLimitType,
    BuyLimitDate: item.BuyLimitDate ? new Date(item.BuyLimitDate) : null,
    BuyLimitQty: item.BuyLimitQty ? parseInt(item.BuyLimitQty) : null,
    ExpirationDateType: item.ExpirationDateType,
    ExpirationDateMFD: item.ExpirationDateMFD ? new Date(item.ExpirationDateMFD) : null,
    ExpirationDatePAO: item.ExpirationDatePAO ? new Date(item.ExpirationDatePAO) : null,
    ExpirationDateEXP: item.ExpirationDateEXP ? new Date(item.ExpirationDateEXP) : null,
    ImageOtherUrl: item.ImageOtherUrl,
    MaterialInfo: item.MaterialInfo,
    MaterialNumber: item.MaterialNumber,
    OptionMainimage: item.OptionMainimage,
    OptionQty: item.OptionQty,
    OptionSubimage: item.OptionSubimage,
    OptionType: item.OptionType,
    OriginCountryId: item.OriginCountryId,
    OriginRegionId: item.OriginRegionId,
    OriginOthers: item.OriginOthers,
    SeasonType: item.SeasonType,
    StyleNumber: item.StyleNumber,
    TpoNumber: item.TpoNumber,
    VideoNumber: item.VideoNumber,
    WashinginfoFit: item.WashinginfoFit,
    WashinginfoLining: item.WashinginfoLining,
    WashinginfoSeethrough: item.WashinginfoSeethrough,
    WashinginfoStretch: item.WashinginfoStretch,
    WashinginfoThickness: item.WashinginfoThickness,
    WashinginfoWashing: item.WashinginfoWashing,
    Weight: item.Weight ? parseFloat(item.Weight) : null,
    LastFetchDate: new Date(),
    CreatedAt: new Date(),
    UpdatedAt: new Date()
  }
}

// MS SQL 벌크 삽입
async function bulkInsertToSQL(items: any[], companyId: string) {
  try {
    // 기존 데이터 삭제 대신 새 데이터 직접 삽입/업데이트
    for (const item of items) {
      await prisma.zal_Qoo10ItemDetails.upsert({
        where: {
          ItemCode: item.ItemCode
        },
        create: {
          ItemCode: item.ItemCode,
          CompanyId: companyId,
          Flag: item.Flag || 'NONE',
          SellerCode: item.SellerCode,
          ItemStatus: item.ItemStatus,
          ItemTitle: item.ItemTitle,
          PromotionName: item.PromotionName,
          MainCatCd: item.MainCatCd,
          MainCatNm: item.MainCatNm,
          FirstSubCatCd: item.FirstSubCatCd,
          FirstSubCatNm: item.FirstSubCatNm,
          SecondSubCatCd: item.SecondSubCatCd,
          SecondSubCatNm: item.SecondSubCatNm,
          DrugType: item.DrugType,
          ProductionPlaceType: item.ProductionPlaceType,
          ProductionPlace: item.ProductionPlace,
          IndustrialCodeType: item.IndustrialCodeType,
          IndustrialCode: item.IndustrialCode,
          RetailPrice: item.RetailPrice ? parseFloat(item.RetailPrice) : null,
          ItemPrice: item.ItemPrice ? parseFloat(item.ItemPrice) : null,
          TaxRate: item.TaxRate ? parseFloat(item.TaxRate) : null,
          SettlePrice: item.SettlePrice ? parseFloat(item.SettlePrice) : null,
          ItemQty: item.ItemQty ? parseInt(item.ItemQty) : null,
          ExpireDate: item.ExpireDate ? new Date(item.ExpireDate) : null,
          DesiredShippingDate: item.DesiredShippingDate ? parseInt(item.DesiredShippingDate) : null,
          AvailableDateType: item.AvailableDateType,
          AvailableDateValue: item.AvailableDateValue,
          ShippingNo: item.ShippingNo,
          ModelNM: item.ModelNM,
          ManufacturerDate: item.ManufacturerDate,
          BrandNo: item.BrandNo,
          Material: item.Material,
          AdultYN: item.AdultYN,
          ContactInfo: item.ContactInfo,
          ItemDetail: item.ItemDetail,
          ImageUrl: item.ImageUrl,
          VideoURL: item.VideoURL,
          Keyword: item.Keyword,
          ListedDate: item.ListedDate ? new Date(item.ListedDate) : null,
          ChangedDate: item.ChangedDate ? new Date(item.ChangedDate) : null,
          LastFetchDate: new Date(),
          CreatedAt: new Date(),
          UpdatedAt: new Date()
        },
        update: {
          Flag: item.Flag || 'NONE',
          SellerCode: item.SellerCode,
          ItemStatus: item.ItemStatus,
          ItemTitle: item.ItemTitle,
          PromotionName: item.PromotionName,
          MainCatCd: item.MainCatCd,
          MainCatNm: item.MainCatNm,
          FirstSubCatCd: item.FirstSubCatCd,
          FirstSubCatNm: item.FirstSubCatNm,
          SecondSubCatCd: item.SecondSubCatCd,
          SecondSubCatNm: item.SecondSubCatNm,
          DrugType: item.DrugType,
          ProductionPlaceType: item.ProductionPlaceType,
          ProductionPlace: item.ProductionPlace,
          IndustrialCodeType: item.IndustrialCodeType,
          IndustrialCode: item.IndustrialCode,
          RetailPrice: item.RetailPrice ? parseFloat(item.RetailPrice) : null,
          ItemPrice: item.ItemPrice ? parseFloat(item.ItemPrice) : null,
          TaxRate: item.TaxRate ? parseFloat(item.TaxRate) : null,
          SettlePrice: item.SettlePrice ? parseFloat(item.SettlePrice) : null,
          ItemQty: item.ItemQty ? parseInt(item.ItemQty) : null,
          ExpireDate: item.ExpireDate ? new Date(item.ExpireDate) : null,
          DesiredShippingDate: item.DesiredShippingDate ? parseInt(item.DesiredShippingDate) : null,
          AvailableDateType: item.AvailableDateType,
          AvailableDateValue: item.AvailableDateValue,
          ShippingNo: item.ShippingNo,
          ModelNM: item.ModelNM,
          ManufacturerDate: item.ManufacturerDate,
          BrandNo: item.BrandNo,
          Material: item.Material,
          AdultYN: item.AdultYN,
          ContactInfo: item.ContactInfo,
          ItemDetail: item.ItemDetail,
          ImageUrl: item.ImageUrl,
          VideoURL: item.VideoURL,
          Keyword: item.Keyword,
          ListedDate: item.ListedDate ? new Date(item.ListedDate) : null,
          ChangedDate: item.ChangedDate ? new Date(item.ChangedDate) : null,
          LastFetchDate: new Date(),
          UpdatedAt: new Date()
        }
      })
    }

    console.log(`${items.length}개의 상품이 성공적으로 저장되었습니다.`)
  } catch (error) {
    console.error('Bulk insert failed:', error)
    throw error
  }
}

// 상품 옵션 정보 조회 (일반 상품)
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
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)

    const data = await response.json()
    return data.ResultObject || []
  } catch (error) {
    console.error(`Failed to fetch item inventory info (${itemCode}):`, error)
    return []
  }
}

// 옵션 데이터 저장
async function saveItemOptions(itemCode: string, companyId: string, options: any[], flag: string) {
  try {
    // 먼저 상품이 존재하는지 확인
    const product = await prisma.zal_Qoo10ItemDetails.findUnique({
      where: {
        ItemCode: itemCode
      }
    })

    if (!product) {
      console.error(`Product not found for ItemCode: ${itemCode}`)
      return
    }

    // 기존 옵션 데이터 삭제
    await prisma.zal_Qoo10ItemOptions.deleteMany({
      where: {
        ItemCode: itemCode,
        CompanyId: companyId
      }
    })

    // 새 옵션 데이터를 하나씩 삽입
    for (const option of options) {
      await prisma.zal_Qoo10ItemOptions.create({
        data: {
          ItemCode: itemCode,
          CompanyId: companyId,
          Flag: flag,
          SellerCode: option.SellerCode || null,
          Name1: option.Name1 || null,
          Value1: option.Value1 || null,
          Name2: option.Name2 || null,
          Value2: option.Value2 || null,
          Name3: option.Name3 || null,
          Value3: option.Value3 || null,
          Name4: option.Name4 || null,
          Value4: option.Value4 || null,
          Name5: option.Name5 || null,
          Value5: option.Value5 || null,
          Price: option.Price ? parseFloat(option.Price) : 0,
          Qty: option.Qty || 0,
          ItemTypeCode: option.ItemTypeCode || null,
          LastFetchDate: new Date(),
          CreatedAt: new Date(),
          UpdatedAt: new Date()
        }
      })
    }

    console.log(`${options.length}개의 옵션이 저장되었습니다. (ItemCode: ${itemCode})`)
  } catch (error) {
    console.error(`Failed to save item options (${itemCode}):`, error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, platformId } = body

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

    // 1. 기존 상품 코드 조회
    const existingItems = await prisma.zal_Qoo10ItemDetails.findMany({
      where: { CompanyId: companyId },
      select: { ItemCode: true }
    })
    const existingItemCodes = new Set(existingItems.map(item => item.ItemCode))

    // 2. 전체 상품 목록 조회
    const firstPageResult = await fetchQoo10Products(platform.ApiKey)
    const allItemCodes = firstPageResult.ResultObject.Items.map((item: any) => item.ItemCode)
    const totalPages = firstPageResult.ResultObject.TotalPages

    // 나머지 페이지 조회
    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await fetchQoo10Products(platform.ApiKey, page)
      allItemCodes.push(...pageResult.ResultObject.Items.map((item: any) => item.ItemCode))
    }

    // 3. 상품 상세 정보 조회 및 벌크 처리
    const batchSize = 50
    for (let i = 0; i < allItemCodes.length; i += batchSize) {
      const batch = allItemCodes.slice(i, i + batchSize)
      const itemDetails = []

      for (const itemCode of batch) {
        const detail = await fetchItemDetail(platform.ApiKey, itemCode)
        
        if (detail) {
          detail.CompanyId = companyId
          itemDetails.push(detail)

          // 상품 정보 저장
          await prisma.zal_Qoo10ItemDetails.upsert({
            where: { ItemCode: itemCode },
            create: {
              ...detail,
              CompanyId: companyId,
              SellerAuthKey: platform.ApiKey,
              SellerId: platform.SellerId
            },
            update: {
              ...detail,
              CompanyId: companyId,
              SellerAuthKey: platform.ApiKey,
              SellerId: platform.SellerId
            }
          })

          // Flag에 따라 옵션 정보 저장 로직 분기
          if (detail.Flag === 'NONE') {
            const inventoryInfo = await fetchItemInventoryInfo(platform.ApiKey, itemCode)
            if (inventoryInfo.length > 0) {
              await saveItemOptions(itemCode, companyId, inventoryInfo, 'NONE')
            }
          } else if (detail.Flag === 'MOVE' && detail.OptionQty) {
            const moveOptions = detail.OptionQty.split('$$').map((option: string) => {
              const [color, size, qty, code] = option.split('||*')
              return {
                Name1: 'Color',
                Value1: color,
                Name2: 'Size',
                Value2: size,
                Qty: parseInt(qty) || 0,
                ItemTypeCode: code || null
              }
            })
            await saveItemOptions(itemCode, companyId, moveOptions, 'MOVE')
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log(`${i + batch.length}/${allItemCodes.length} 상품 처리 완료`)
    }

    // 4. 동기화 시간 업데이트
    await prisma.zal_CompanyPlatform.update({
      where: { Id: platformId },
      data: { LastSyncDate: new Date() }
    })

    return NextResponse.json({
      success: true,
      totalProducts: allItemCodes.length,
      syncDate: new Date()
    })

  } catch (error) {
    console.error('상품 동기화 실패:', error)
    return NextResponse.json(
      { error: '상품 동기화에 실패했습니다.' },
      { status: 500 }
    )
  }
} 