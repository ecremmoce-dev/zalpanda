import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase
      .from('Zal_CompanyInfo')
      .select('*')
      .eq('Id', params.id)
      .is('DeletedAt', null)
      .single()

    if (error) throw error

    const formattedData = {
      Id: data.Id.toString(),
      Name: data.Name || '',
      BizNum: data.BizNum || '',
      OwnerName: data.OwnerName || '',
      Tel: data.Tel || '',
      Email: data.Email || '',
      ManagerName: data.ManagerName || '',
      CreatedAt: data.CreatedAt
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Failed to fetch company:', error)
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from('Zal_CompanyInfo')
      .update({
        Name: body.Name,
        BizNum: body.BizNum,
        OwnerName: body.OwnerName,
        Tel: body.Tel,
        Email: body.Email,
        ManagerName: body.ManagerName,
        UpdatedAt: new Date().toISOString()
      })
      .eq('Id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { error } = await supabase
      .from('Zal_CompanyInfo')
      .update({
        DeletedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      })
      .eq('Id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Company deleted successfully' })
  } catch (error) {
    console.error('Failed to delete company:', error)
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
  }
} 