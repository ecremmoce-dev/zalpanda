import { NextResponse } from 'next/server'
import { getProgress, createProgressKey } from '@/lib/progress'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get('companyId')
  const platformId = searchParams.get('platformId')

  if (!companyId || !platformId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  const progressKey = createProgressKey(companyId, platformId)
  const progress = getProgress(progressKey)

  return NextResponse.json({ progress })
} 