import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('company_platform')
      .select(`
        id,
        companyid,
        platform,
        sellerid,
        apikey,
        secretkey,
        accesstoken,
        refreshtoken,
        tokenexpirydate,
        isactive,
        lastsyncdate,
        memo,
        created,
        updated
      `)
      .eq('companyid', params.id)
      .is('deleted', null)
      .order('created', { ascending: false })

    if (error) throw error
    if (!data) return NextResponse.json([])

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch platforms:', error)
    return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // 플사 존재 여부 확인
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select('id')
      .eq('id', params.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: '해당 업체를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 플랫폼 중복 체크
    const { data: existingPlatform, error: checkError } = await supabase
      .from('company_platform')
      .select('id')
      .eq('companyid', params.id)
      .eq('platform', body.platform)
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
      .insert([{
        companyid: params.id,
        platform: body.platform,
        sellerid: body.sellerid,
        apikey: body.apikey || null,
        secretkey: body.secretkey || null,
        accesstoken: body.accesstoken || null,
        refreshtoken: body.refreshtoken || null,
        tokenexpirydate: body.tokenexpirydate || null,
        isactive: body.isactive ?? true,
        memo: body.memo || null,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create platform:', error)
    return NextResponse.json(
      { error: 'Failed to create platform', details: error.message },
      { status: 500 }
    )
  }
} 