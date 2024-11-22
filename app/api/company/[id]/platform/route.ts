import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { PlatformRow } from '@/types/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase
      .from('Zal_CompanyPlatform')
      .select('*')
      .eq('CompanyId', params.id)
      .is('DeletedAt', null)
      .order('CreatedAt', { ascending: false })

    if (error) throw error
    if (!data) return NextResponse.json([])

    const formattedData = data.map((platform: PlatformRow) => ({
      Id: platform.Id,
      CompanyId: platform.CompanyId,
      Platform: platform.Platform,
      SellerId: platform.SellerId || '',
      IsActive: platform.IsActive,
      LastSyncDate: platform.LastSyncDate,
      CreatedAt: platform.CreatedAt
    }))

    return NextResponse.json(formattedData)
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
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from('Zal_CompanyPlatform')
      .insert([{
        CompanyId: params.id,
        Platform: body.Platform,
        SellerId: body.SellerId,
        ApiKey: body.ApiKey,
        SecretKey: body.SecretKey,
        IsActive: body.IsActive || true,
        UpdatedAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create platform:', error)
    return NextResponse.json({ error: 'Failed to create platform' }, { status: 500 })
  }
} 