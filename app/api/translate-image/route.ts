import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Naver API URL 상수 추가
const NAVER_API_URL = 'https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate'

export async function POST(request: Request) {
  try {
    // JSON 요청을 처리하도록 수정
    const { image, source, target } = await request.json()
    
    // Base64 이미지 데이터를 Blob으로 변환
    const base64Data = image.split(',')[1]
    const binaryData = Buffer.from(base64Data, 'base64')
    const blob = new Blob([binaryData], { type: 'image/png' })
    
    const formData = new FormData()
    formData.append('image', blob, 'image.png')
    formData.append('source', source)
    formData.append('target', target)

    // 나머지 코드는 동일...
    const response = await fetch(NAVER_API_URL, {
      method: 'POST',
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NCP_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": process.env.NCP_API_KEY,
      },
      body: formData
    })

    // 응답 처리 개선
    if (!response.ok) {
      console.error('Naver API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      return NextResponse.json({ error: 'Translation failed', originalImage: image })
    }

    const data = await response.json()
    
    if (data.data?.renderedImage) {
      return NextResponse.json({ translatedImage: data.data.renderedImage })
    }

    return NextResponse.json({ error: 'No translation result', originalImage: image })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}