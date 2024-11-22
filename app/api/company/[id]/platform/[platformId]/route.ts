import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string, platformId: string } }
) {
  try {
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from('Zal_CompanyPlatform')
      .update({
        Platform: body.Platform,
        SellerId: body.SellerId,
        ApiKey: body.ApiKey,
        SecretKey: body.SecretKey,
        IsActive: body.IsActive,
        UpdatedAt: new Date().toISOString()
      })
      .eq('Id', params.platformId)
      .eq('CompanyId', params.id)
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
    const supabase = createRouteHandlerClient({ cookies })
    
    const { error } = await supabase
      .from('Zal_CompanyPlatform')
      .update({
        DeletedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      })
      .eq('Id', params.platformId)
      .eq('CompanyId', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Platform deleted successfully' })
  } catch (error) {
    console.error('Failed to delete platform:', error)
    return NextResponse.json({ error: 'Failed to delete platform' }, { status: 500 })
  }
} 