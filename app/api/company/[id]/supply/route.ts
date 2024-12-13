import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('company_supply')
      .select(`
        id,
        companyid,
        supplyname,
        contact,
        address,
        businessnumber,
        email,
        fax,
        website,
        managername,
        managertel,
        manageremail,
        bankaccount,
        bankname,
        paymentterms,
        currency,
        notes,
        vendproductcd,
        created,
        updated
      `)
      .eq('companyid', params.id)
      .order('created', { ascending: false })

    if (error) throw error

    console.log('API response data:', data)  // API 응답 데이터 확인

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to fetch supplies:', error)
    return NextResponse.json({ error: 'Failed to fetch supplies' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = await createClient()

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

    const { data, error } = await supabase
      .from('company_supply')
      .insert([{
        companyid: params.id,
        ...body,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create supply:', error)
    return NextResponse.json(
      { error: 'Failed to create supply', details: error.message },
      { status: 500 }
    )
  }
} 