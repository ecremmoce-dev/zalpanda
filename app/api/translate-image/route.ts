import { NextResponse } from 'next/server'

const NAVER_API_URL = "https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate"

export async function POST(request: Request) {
  try {
    const { image, source, target } = await request.json()

    const formData = new FormData()
    formData.append('source', source)
    formData.append('target', target)
    
    const imageBlob = await fetch(image).then(res => res.blob())
    formData.append('image', imageBlob, 'image.jpg')

    const response = await fetch(NAVER_API_URL, {
      method: 'POST',
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NCP_API_KEY_ID!,
        "X-NCP-APIGW-API-KEY": process.env.NCP_API_KEY!,
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if ('error' in data) {
      if (data.error.message === "Image No Text error") {
        return NextResponse.json({ originalImage: image })
      }
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    if ('data' in data && 'renderedImage' in data.data) {
      return NextResponse.json({ translatedImage: data.data.renderedImage })
    }

    return NextResponse.json(
      { error: 'Unexpected response format' }, 
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { 
        error: '이미지 번역 중 오류가 발생했습니다.',
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
} 