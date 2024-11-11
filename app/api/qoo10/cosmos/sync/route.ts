import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CosmosClient } from '@azure/cosmos'
import { createProgressKey, initProgress, updateProgress, getProgress, clearProgress } from '@/lib/progress'

// Cosmos DB 클라이언트 설정
const client = new CosmosClient({
  endpoint: "https://ecshopee-cosmos.documents.azure.com:443",
  key: "fm4Y8n2xJ9dPoOJP6SuJtOPiTtVdYFMYhWX1gR9zFSksqw490aPuBoo7uK46jpv2qeRZN4n9H0ef9OfaslKYYA=="
})

const database = client.database("Zalpanda")
// 컨테이너 구분
const moveContainer = database.container("Temp_qoo10jp_move_product")
const normalContainer = database.container("Temp_qoo10jp_nonemove_product")

// 전체 상품 목록 조회
async function fetchQoo10Products(authKey: string, itemStatus: string = 'S2', page: number = 1) {
  try {
    const baseUrl = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi'
    const params = new URLSearchParams({
      'v': '1.0',
      'method': 'ItemsLookup.GetAllGoodsInfo',
      'key': authKey,
      'ItemStatus': itemStatus,
      'Page': page.toString()
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)

    const data = await response.json()
    console.log(`페이지 ${page} 조회 결과:`, {
      총상품수: data.ResultObject.TotalItems,
      총페이지수: data.ResultObject.TotalPages,
      현재페이지: data.ResultObject.PresentPage,
      조회된상품수: data.ResultObject.Items.length,
      상태값: itemStatus
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
    // 일반 상품 조회 시도
    const detail = await fetchDetailWithMethod(authKey, itemCode, false)
    if (detail) {
      console.log(`[상품 타입 확인] ${itemCode}: 일반상품(NONE)`)
      return { ...detail, Flag: 'NONE' }
    }

    // 무브 상품 조회 시도
    const moveDetail = await fetchDetailWithMethod(authKey, itemCode, true)
    if (moveDetail) {
      console.log(`[상품 타입 확인] ${itemCode}: 무브상품(MOVE)`)
      return { ...moveDetail, Flag: 'MOVE' }
    }

    console.log(`[상품 타입 확인] ${itemCode}: 상품 정보 없음`)
    return null
  } catch (error) {
    console.error(`[상품 타입 확인] ${itemCode}: 조회 실패`, error)
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

// 무브상품 데이터 변환 함수 수정
async function convertMoveItemData(item: any, companyId: string, platformId: string, sellerId: string, sellerAuthKey: string) {
  try {
    console.log('[무브상품 변환 시작]', item.ItemCode);
    
    // 기본 데이터 구조 생성
    const moveData = {
      Id: item.ItemCode,
      CompanyId: companyId,
      PlatformId: platformId,
      SellerId: sellerId,
      SellerAuthKey: sellerAuthKey,
      Flag: 'MOVE',
      AdultYN: item.AdultYN || 'N',
      AttributeInfo: item.AttributeInfo || '',
      AvailableDateValue: item.AvailableDateValue || '',
      BrandNo: item.BrandNo || '',
      BuyLimitType: item.BuyLimitType || '',
      BuyLimitDate: item.BuyLimitDate || '',
      BuyLimitQty: parseInt(item.BuyLimitQty) || 0,
      ContactInfo: item.ContactInfo || '',
      DesiredShippingDate: parseInt(item.DesiredShippingDate) || 0,
      ExpirationDateType: item.ExpirationDateType || '',
      ExpirationDateMFD: item.ExpirationDateMFD || '',
      ExpirationDatePAO: item.ExpirationDatePAO || '',
      ExpirationDateEXP: item.ExpirationDateEXP || '',
      ExpireDate: item.ExpireDate || '',
      ImageOtherUrl: item.ImageOtherUrl || '',
      IndustrialCode: item.IndustrialCode || '',
      IndustrialCodeType: item.IndustrialCodeType || '',
      ItemCode: item.ItemCode,
      ItemDescription: item.ItemDescription || '',
      ItemPrice: parseFloat(item.ItemPrice) || 0,
      ItemSeriesName: item.ItemSeriesName || '',
      Keyword: item.Keyword || '',
      ManufactureDate: item.ManufactureDate || '',
      MaterialInfo: item.MaterialInfo || '',
      MaterialNumber: item.MaterialNumber || '',
      ModelNM: item.ModelNM || '',
      OptionMainimage: item.OptionMainimage || '',
      OptionQty: item.OptionQty || '',
      OptionSubimage: item.OptionSubimage || '',
      OptionType: item.OptionType || '',
      OriginCountryId: item.OriginCountryId || '',
      OriginRegionId: item.OriginRegionId || '',
      OriginOthers: item.OriginOthers || '',
      OriginType: item.OriginType || '',
      PromotionName: item.PromotionName || '',
      RetailPrice: parseFloat(item.RetailPrice) || 0,
      SeasonType: item.SeasonType || '',
      SecondSubCat: item.SecondSubCat || '',
      SellerCode: item.SellerCode || '',
      ShippingNo: item.ShippingNo || '',
      SizetableType1: item.SizetableType1 || '',
      SizetableType1Value: item.SizetableType1Value || '',
      SizetableType2: item.SizetableType2 || '',
      SizetableType2Value: item.SizetableType2Value || '',
      SizetableType3: item.SizetableType3 || '',
      SizetableType3Value: item.SizetableType3Value || '',
      StyleNumber: item.StyleNumber || '',
      TpoNumber: item.TpoNumber || '',
      VideoNumber: item.VideoNumber || '',
      WashinginfoFit: item.WashinginfoFit || '',
      WashinginfoLining: item.WashinginfoLining || '',
      WashinginfoSeethrough: item.WashinginfoSeethrough || '',
      WashinginfoStretch: item.WashinginfoStretch || '',
      WashinginfoThickness: item.WashinginfoThickness || '',
      WashinginfoWashing: item.WashinginfoWashing || '',
      Weight: parseFloat(item.Weight) || 0,
      TaxRate: item.TaxRate || '10',
      LastFetchDate: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };

    console.log('[무브상품 변환 완료]', {
      ItemCode: item.ItemCode,
      Flag: 'MOVE',
      OptionQty: moveData.OptionQty ? moveData.OptionQty.substring(0, 50) + '...' : '없음'
    });

    return moveData;
  } catch (error) {
    console.error('[무브상품 변환 실패]', item.ItemCode, error);
    throw error;
  }
}

// 일반상품 데이터 변환 함수 수정
async function convertNormalItemData(item: any, companyId: string, platformId: string, sellerId: string, sellerAuthKey: string, inventoryInfo: any[] = []) {
  // 발송 가능일 관련 기본값 설정
  const availableDateType = item.AvailableDateType || '0'
  const availableDateValue = item.AvailableDateValue || '3'
  const desiredShippingDate = item.DesiredShippingDate || '0'

  // 일반상품 옵션 변환
  const options = inventoryInfo.map((opt: any) => ({
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
    flag: 'NONE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  return {
    id: item.ItemCode,
    ItemCode: item.ItemCode,
    CompanyId: companyId,
    PlatformId: platformId,
    SellerId: sellerId,
    SellerAuthKey: sellerAuthKey,
    Flag: 'NONE',
    SellerCode: item.SellerCode || '',
    ItemStatus: item.ItemStatus || 'S2',
    ItemTitle: item.ItemTitle || '',
    PromotionName: item.PromotionName || '',
    MainCatCd: item.MainCatCd || '',
    MainCatNm: item.MainCatNm || '',
    FirstSubCatCd: item.FirstSubCatCd || '',
    FirstSubCatNm: item.FirstSubCatNm || '',
    SecondSubCatCd: item.SecondSubCatCd || '',
    SecondSubCatNm: item.SecondSubCatNm || '',
    DrugType: item.Drugtype || '',
    ProductionPlaceType: item.ProductionPlaceType || '',
    ProductionPlace: item.ProductionPlace || '',
    IndustrialCodeType: item.IndustrialCodeType || '',
    IndustrialCode: item.IndustrialCode || '',
    RetailPrice: parseFloat(item.RetailPrice) || 0,
    ItemPrice: parseFloat(item.ItemPrice) || 0,
    TaxRate: item.TaxRate ? parseFloat(item.TaxRate) : null,
    SettlePrice: parseFloat(item.SettlePrice) || 0,
    ItemQty: parseInt(item.ItemQty) || 0,
    ExpireDate: item.ExpireDate || null,
    // 발송 관련 필드 추가
    AvailableDateType: availableDateType,
    AvailableDateValue: availableDateValue,
    DesiredShippingDate: desiredShippingDate,
    ShippingNo: item.ShippingNo || '',
    OptionShippingNo1: item.OptionShippingNo1 || '',
    OptionShippingNo2: item.OptionShippingNo2 || '',
    ModelNM: item.ModelNM || '',
    ManufacturerDate: item.ManufacturerDate || '',
    BrandNo: item.BrandNo || '',
    Material: item.Material || '',
    AdultYN: item.AdultYN || 'N',
    ContactInfo: item.ContactInfo || '',
    ItemDetail: item.ItemDetail || '',
    ImageUrl: item.ImageUrl || '',
    VideoURL: item.VideoURL || '',
    Keyword: item.Keyword || '',
    ListedDate: item.ListedDate || null,
    ChangedDate: item.ChangedDate || null,
    Options: options,
    LastFetchDate: new Date().toISOString(),
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  }
}

// 상품 저장 함수 수정
async function saveToCosmosDB(item: any, companyId: string, platformId: string, flag: string, sellerId: string, sellerAuthKey: string, options: any[] = []) {
  try {
    console.log(`[상품 저장 시작] ${item.ItemCode} (타입: ${flag})`);
    const convertedItem = flag === 'MOVE' 
      ? await convertMoveItemData(item, companyId, platformId, sellerId, sellerAuthKey)
      : await convertNormalItemData(item, companyId, platformId, sellerId, sellerAuthKey, options);

    try {
      const timestamp = new Date().getTime();
      const documentId = `${item.ItemCode}_${timestamp}`;

      const newItem = {
        ...convertedItem,
        id: documentId,
        itemCode: item.ItemCode,
        companyId: companyId,
        // flag: flag,
        // lastFetchDate: new Date().toISOString(),
        // updatedAt: new Date().toISOString()
      };

      // flag에 따라 컨테이너 선택
      const container = flag === 'MOVE' ? moveContainer : normalContainer;

      // 기존 문서 찾기
      const querySpec = {
        query: "SELECT * FROM c WHERE c.itemCode = @itemCode AND c.companyId = @companyId",
        parameters: [
          { name: "@itemCode", value: item.ItemCode },
          { name: "@companyId", value: companyId }
        ]
      };

      const { resources: existingItems } = await container.items.query(querySpec).fetchAll();

      if (existingItems && existingItems.length > 0) {
        // 기존 문서 삭제 - 파티션 키를 문자열로 전달
        for (const existingItem of existingItems) {
          try {
            await container.item(existingItem.id, existingItem.itemCode).delete(); // itemCode를 파티션 키로 사용
          } catch (deleteError) {
            console.error(`[문서 삭제 실패] ${existingItem.id}:`, deleteError);
          }
        }
      }

      // 새 문서 생성 - 파티션 키를 문자열로 전달
      console.log(`[상품 생성] ${item.ItemCode} (flag: ${flag}, id: ${documentId})`);
      const { resource } = await container.items.create(newItem);
      console.log(`[상품 생성 성공] ${item.ItemCode} (flag: ${flag}, id: ${resource?.id})`);
      
      return true;

    } catch (error: any) {
      if (error.code === 409) {
        console.log(`[409 충돌 발생] ${item.ItemCode} - 잠시 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return await saveToCosmosDB(item, companyId, platformId, flag, sellerId, sellerAuthKey, options);
      }
      throw error;
    }
  } catch (error) {
    console.error(`[상품 저장 실패] ${item.ItemCode} (flag: ${flag}):`, error);
    return false;
  }
}

// GET 엔드포인트 수정
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

    // 복합 파티션 키를 고려한 쿼리
    const baseQuery = {
      query: "SELECT * FROM c WHERE c.companyId = @companyId",
      parameters: [
        { name: "@companyId", value: companyId }
      ]
    };

    if (searchTerm && searchField) {
      baseQuery.query += ` AND CONTAINS(c.${searchField}, @searchTerm, true)`;
      baseQuery.parameters.push({ name: "@searchTerm", value: searchTerm });
    }

    let items = [];

    if (!flag || flag === 'all') {
      const [moveItems, normalItems] = await Promise.all([
        moveContainer.items.query(baseQuery).fetchAll(),
        normalContainer.items.query(baseQuery).fetchAll()
      ]);
      items = [...moveItems.resources, ...normalItems.resources];
    } else if (flag === 'MOVE') {
      const { resources } = await moveContainer.items.query(baseQuery).fetchAll();
      items = resources;
    } else {
      const { resources } = await normalContainer.items.query(baseQuery).fetchAll();
      items = resources;
    }

    items.sort((a, b) => {
      const dateA = new Date(b.lastFetchDate || b.updatedAt || 0).getTime();
      const dateB = new Date(a.lastFetchDate || a.updatedAt || 0).getTime();
      return dateA - dateB;
    });

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);
    
    return NextResponse.json({
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
      moveCount: items.filter(item => item.flag === 'MOVE').length,
      normalCount: items.filter(item => item.flag === 'NONE').length
    });

  } catch (error) {
    console.error('Failed to fetch Cosmos products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST 핸들러 수정
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, platformId, itemStatus, itemCode } = body

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

    // 단일 상품 동기화
    if (itemCode) {
      try {
        const detail = await fetchItemDetail(platform.ApiKey, itemCode)
        if (!detail) {
          throw new Error('상품 정보를 찾을 수 없습니다.')
        }

        let options = []
        if (detail.Flag === 'NONE') {
          const inventoryInfo = await fetchItemInventoryInfo(platform.ApiKey, itemCode)
          if (inventoryInfo) {
            options = inventoryInfo
          }
        }

        await saveToCosmosDB(
          detail,
          companyId,
          platformId,
          detail.Flag,
          platform.SellerId || '',
          platform.ApiKey,
          options
        )

        return NextResponse.json({
          success: true,
          message: '상품이 성공적으로 동기화되었습니다.'
        })
      } catch (error) {
        console.error('Failed to sync specific item:', error)
        return NextResponse.json(
          { error: '상품 동기화에 실패했습니다.' },
          { status: 500 }
        )
      }
    }

    // 일괄 동기화 로직
    console.log('상품 동기화 시작...', {
      companyId,
      platformId,
      itemStatus
    })

    // 전체 상품 목록 조회
    const firstPageResult = await fetchQoo10Products(platform.ApiKey, itemStatus)
    const allItemCodes = firstPageResult.ResultObject.Items.map((item: any) => item.ItemCode)
    const totalPages = firstPageResult.ResultObject.TotalPages

    // 나머지 페이지 조회
    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await fetchQoo10Products(platform.ApiKey, itemStatus, page)
      allItemCodes.push(...pageResult.ResultObject.Items.map((item: any) => item.ItemCode))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`전체 ${allItemCodes.length}개 상품 코드 조회 완료`)

    // 상품 상세 정보 조회 및 Cosmos DB 저장
    const progressKey = createProgressKey(companyId, platformId);
    initProgress(progressKey, allItemCodes.length);

    for (const itemCode of allItemCodes) {
      try {
        const detail = await fetchItemDetail(platform.ApiKey, itemCode);
        if (detail) {
          let options = [];
          
          if (detail.Flag === 'NONE') {
            updateProgress(progressKey, { normalCount: getProgress(progressKey)!.normalCount + 1 });
            const inventoryInfo = await fetchItemInventoryInfo(platform.ApiKey, itemCode);
            if (inventoryInfo) {
              options = inventoryInfo;
            }
          } else if (detail.Flag === 'MOVE') {
            updateProgress(progressKey, { moveCount: getProgress(progressKey)!.moveCount + 1 });
          }

          const saved = await saveToCosmosDB(
            detail,
            companyId,
            platformId,
            detail.Flag,
            platform.SellerId || '',
            platform.ApiKey,
            options
          );

          if (saved) {
            updateProgress(progressKey, { successCount: getProgress(progressKey)!.successCount + 1 });
          } else {
            updateProgress(progressKey, { failCount: getProgress(progressKey)!.failCount + 1 });
          }
        } else {
          updateProgress(progressKey, { failCount: getProgress(progressKey)!.failCount + 1 });
        }

        updateProgress(progressKey, { current: getProgress(progressKey)!.current + 1 });
        
      } catch (error) {
        console.error(`상품 처리 실패 (${itemCode}):`, error);
        updateProgress(progressKey, { 
          failCount: getProgress(progressKey)!.failCount + 1,
          current: getProgress(progressKey)!.current + 1 
        });
      }
    }

    // 작업 완료 후 진행 상태 정리
    const finalProgress = getProgress(progressKey);
    clearProgress(progressKey);

    // 동기화 결과 반환
    return NextResponse.json({
      success: true,
      totalProducts: allItemCodes.length,
      syncDate: new Date(),
      stats: {
        total: allItemCodes.length,
        success: finalProgress?.successCount || 0,
        fail: finalProgress?.failCount || 0,
        normal: finalProgress?.normalCount || 0,
        move: finalProgress?.moveCount || 0
      }
    })

  } catch (error) {
    console.error('상품 동기화 실패:', error)
    return NextResponse.json(
      { error: '상품 동기화에 실패했습니다.' },
      { status: 500 }
    )
  }
} 