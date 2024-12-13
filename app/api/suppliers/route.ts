import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('suppliers') // 공급사 테이블 이름
      .select('*')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
} 