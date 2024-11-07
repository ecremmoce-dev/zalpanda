import { NextResponse } from 'next/server'
import { getProgress } from '@/lib/progress'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get('companyId')
  const platformId = searchParams.get('platformId')

  // SSE 헤더 설정
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  }

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // 진행 상황 업데이트를 위한 interval 설정
  const interval = setInterval(async () => {
    try {
      // Redis나 다른 저장소에서 진행 상황 조회
      const progress = await getProgress(companyId, platformId)
      
      const data = `data: ${JSON.stringify(progress)}\n\n`
      await writer.write(new TextEncoder().encode(data))

      if (progress.current === progress.total) {
        clearInterval(interval)
        await writer.close()
      }
    } catch (error) {
      console.error('Progress update failed:', error)
      clearInterval(interval)
      await writer.close()
    }
  }, 1000)

  return new NextResponse(stream.readable, { headers })
} 