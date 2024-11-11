import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${response.headers.get('content-type')};base64,${base64Image}`

    return NextResponse.json({ image: dataUrl })
  } catch (error) {
    console.error('Proxy image error:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}