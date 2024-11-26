import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('company')
      .select(`
        *,
        company_platform (*),
        supplies:company_supply (*)
      `)
      .eq('id', params.id)
      .is('deleted', null)
      .single()

    if (error) throw error
    return NextResponse.json(data)
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
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('company')
      .update({
        ...body,
        updated: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()

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
    const supabase = await createClient()

    const { error } = await supabase
      .from('company')
      .update({
        deletedate: new Date().toISOString(),
        updatedate: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) throw error
    return NextResponse.json({ message: 'Company deleted successfully' })
  } catch (error) {
    console.error('Failed to delete company:', error)
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
  }
} 