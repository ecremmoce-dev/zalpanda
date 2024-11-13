import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getProgress } from '@/lib/progress'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get('companyId')
  const platformId = searchParams.get('platformId')

  if (!companyId || !platformId) {
    return new Response('Missing required parameters', { status: 400 })
  }

  // SSE 헤더 설정
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // 진행 상황 모니터링 함수
  const monitorProgress = async () => {
    try {
      let lastProgress = null
      
      while (true) {
        const progress = await getProgress(`sync_${companyId}_${platformId}`)
        
        // 진행 상황이 변경되었거나 아직 전송되지 않은 경우에만 전송
        if (progress && (!lastProgress || JSON.stringify(progress) !== JSON.stringify(lastProgress))) {
          const data = `data: ${JSON.stringify({
            ...progress,
            percentage: Math.round((progress.current / progress.total) * 100)
          })}\n\n`
          await writer.write(encoder.encode(data))
          lastProgress = progress
        }

        // 동기화가 완료되었으면 스트림 종료
        if (progress?.isCompleted) {
          break
        }

        // 100ms 대기
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error('Progress monitoring error:', error)
    } finally {
      await writer.close()
    }
  }

  // 모니터링 시작
  monitorProgress()

  return new Response(stream.readable, {
    headers: responseHeaders,
  })
} 