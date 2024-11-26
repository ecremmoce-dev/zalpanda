import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string, platformId: string } }
) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // 플랫폼 타입 검증
    const allowedPlatforms = ['QOO10', 'SHOPEE', 'LAZADA', 'AMAZON', 'RAKUTEN', 'COUPANG']
    if (!allowedPlatforms.includes(body.platform)) {
      return NextResponse.json({ error: 'Invalid platform type' }, { status: 400 })
    }

    // 중복 체크 (다른 레코드에서 같은 플랫폼을 사용하고 있는지)
    const { data: existingPlatform, error: checkError } = await supabase
      .from('company_platform')
      .select('id')
      .eq('companyid', params.id)
      .eq('platform', body.platform)
      .neq('id', params.platformId)
      .is('deleted', null)
      .single()

    if (existingPlatform) {
      return NextResponse.json(
        { error: '이미 등록된 플랫폼입니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('company_platform')
      .update({
        platform: body.platform,
        sellerid: body.sellerid,
        apikey: body.apikey,
        secretkey: body.secretkey,
        accesstoken: body.accesstoken,
        refreshtoken: body.refreshtoken,
        tokenexpirydate: body.tokenexpirydate,
        isactive: body.isactive,
        lastsyncdate: body.lastsyncdate,
        memo: body.memo,
        updated: new Date().toISOString(),
      })
      .eq('id', params.platformId)
      .eq('companyid', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update platform:', error)
    return NextResponse.json({ error: 'Failed to update platform' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, platformId: string } }
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('company_platform')
      .update({
        deleted: new Date().toISOString(),
        updated: new Date().toISOString(),
      })
      .eq('id', params.platformId)
      .eq('companyid', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Platform deleted successfully' })
  } catch (error) {
    console.error('Failed to delete platform:', error)
    return NextResponse.json({ error: 'Failed to delete platform' }, { status: 500 })
  }
}