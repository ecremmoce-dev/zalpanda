import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const itemCode = formData.get('itemCode') as string

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      )
    }

    // 파일 확장자 체크
    const fileExtension = path.extname(file.name).toLowerCase()
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 저장할 경로 설정
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const fileName = `${itemCode}_${Date.now()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // 파일 저장
    await writeFile(filePath, buffer)

    // 이미지 URL 반환
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({ 
      success: true,
      imageUrl 
    })

  } catch (error) {
    console.error('Failed to upload image:', error)
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
} 