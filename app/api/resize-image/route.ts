import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    // base64 문자열을 버퍼로 변환
    const buffer = Buffer.from(image, 'base64')
    
    // 이미지 메타데이터를 가져와서 높이를 확인
    const metadata = await sharp(buffer).metadata()
    const height = metadata.height || 500
    
    // 높이를 기준으로 정사각형 생성
    const resizedImage = await sharp(buffer)
      .resize({
        width: height,
        height: height,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // 투명 배경
      })
      .png() // PNG 형식으로 변환
      .toBuffer()

    return NextResponse.json({ 
      image: resizedImage.toString('base64')
    })
  } catch (error) {
    console.error('Error resizing image:', error)
    return NextResponse.json(
      { error: 'Failed to resize image' },
      { status: 500 }
    )
  }
} 