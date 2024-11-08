import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Naver API URL 상수 추가
const NAVER_API_URL = 'https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image')
    const source = formData.get('source')
    const target = formData.get('target')

    // image가 없는 경우 처리
    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    // API 키 확인
    if (!process.env.NCP_API_KEY_ID || !process.env.NCP_API_KEY) {
      console.error('Missing Naver API credentials')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    try {
      const imageBlob = await fetch(image.toString()).then(res => res.blob())
      formData.append('image', imageBlob, 'image.jpg')
    } catch (error) {
      console.error('Failed to fetch image:', error)
      return NextResponse.json(
        { error: 'Failed to process image', originalImage: image },
        { status: 400 }
      )
    }

    console.log('Sending request to Naver API...')
    const response = await fetch(NAVER_API_URL, {
      method: 'POST',
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NCP_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": process.env.NCP_API_KEY,
      },
      body: formData
    })

    if (!response.ok) {
      console.error('Naver API error:', {
        status: response.status,
        statusText: response.statusText
      })
      // 오류 발생 시 원본 이미지 반환
      return NextResponse.json({ originalImage: image })
    }

    const data = await response.json()
    console.log('Naver API response received')

    if ('error' in data) {
      if (data.error.message === "Image No Text error") {
        console.log('No text found in image')
        return NextResponse.json({ originalImage: image })
      }
      console.error('Naver API error response:', data.error)
      return NextResponse.json({ originalImage: image })
    }

    if ('data' in data && 'renderedImage' in data.data) {
      console.log('Translation successful')
      return NextResponse.json({ translatedImage: data.data.renderedImage })
    }

    console.error('Unexpected API response format:', data)
    return NextResponse.json({ originalImage: image })
  } catch (error: any) {
    console.error('Translation error:', {
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { originalImage: Image },
      { status: 500 }
    )
  }
}