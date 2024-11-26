import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string, supplyId: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('company_supply')
      .select('*')
      .eq('id', params.supplyId)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch supply:', error)
    return NextResponse.json({ error: 'Failed to fetch supply' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string, supplyId: string } }
) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('company_supply')
      .update({
        supplyname: body.supplyname,
        contact: body.contact || null,
        address: body.address || null,
        businessnumber: body.businessnumber || null,
        email: body.email || null,
        fax: body.fax || null,
        website: body.website || null,
        managername: body.managername || null,
        managertel: body.managertel || null,
        manageremail: body.manageremail || null,
        bankaccount: body.bankaccount || null,
        bankname: body.bankname || null,
        paymentterms: body.paymentterms || null,
        currency: body.currency || 'KRW',
        notes: body.notes || null,
        updated: new Date().toISOString()
      })
      .eq('id', params.supplyId)
      .eq('companyid', params.id)
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
        created,
        updated
      `)
      .single()

    if (error) {
      console.error('Error updating supply:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update supply:', error)
    return NextResponse.json({ error: 'Failed to update supply' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, supplyId: string } }
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('company_supply')
      .delete()
      .eq('id', params.supplyId)

    if (error) throw error
    return NextResponse.json({ message: 'Supply deleted successfully' })
  } catch (error) {
    console.error('Failed to delete supply:', error)
    return NextResponse.json({ error: 'Failed to delete supply' }, { status: 500 })
  }
} 