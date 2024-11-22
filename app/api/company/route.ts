import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CompanyRow } from '@/types/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentCompanyId = searchParams.get('parentCompanyId')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    let query = supabase
      .from('Zal_CompanyInfo')
      .select('*')
      .is('DeletedAt', null)
      .order('CreatedAt', { ascending: false })
    
    if (parentCompanyId) {
      query = query.eq('ParentCompanyId', parentCompanyId)
    } else {
      query = query.is('ParentCompanyId', null)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data) return NextResponse.json([])

    const formattedData = data.map((company: CompanyRow) => ({
      Id: company.Id,
      Name: company.Name || '',
      BizNum: company.BizNum || '',
      OwnerName: company.OwnerName || '',
      Tel: company.Tel || '',
      Email: company.Email || '',
      ManagerName: company.ManagerName || '',
      CreatedAt: company.CreatedAt,
      ParentCompanyId: company.ParentCompanyId
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Failed to fetch companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from('Zal_CompanyInfo')
      .insert([{
        Name: body.Name,
        BizNum: body.BizNum,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        ParentCompanyId: body.ParentCompanyId || null,
        UpdatedAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}

