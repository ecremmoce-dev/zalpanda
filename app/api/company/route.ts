import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentCompanyId = searchParams.get('parentcompanyid')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('company')
      .select('*')
      .is('deleted', null)
      .order('created', { ascending: false })
    
    if (parentCompanyId) {
      query = query.eq('parentcompanyid', parentCompanyId)
    } else {
      query = query.is('parentcompanyid', null)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('company')
      .insert([{
        ...body,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}

