import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemTitle, itemDetail, category } = body

    // AI에 전달할 프롬프트 생성
    const prompt = `
      상품명: ${itemTitle}
      카테고리: ${category}
      상품설명: ${itemDetail}

      위 상품에 대해 가장 적절한 산업 코드를 추천해주세요.
      산업 코드 타입은 다음 중 하나여야 합니다:
      - JAN (일본 상품 코드)
      - KAN (한국 상품 코드)
      - ISBN (도서 코드)
      - UPC (미국/캐나다 상품 코드)
      - EAN (유럽 상품 코드)
      - HS (국제 통일 상품 분류 코드)

      응답 형식:
      {
        "codeType": "선택된 코드 타입",
        "code": "생성된 코드 번호",
        "reason": "코드 타입과 번호를 선택한 이유"
      }
    `

    // AI 응답 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 상품 분류 전문가입니다. 상품 정보를 분석하여 가장 적절한 산업 코드를 추천해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    // AI 응답 파싱
    const response = completion.choices[0].message.content
    let result
    try {
      result = JSON.parse(response)
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      result = {
        codeType: 'HS',
        code: '0000000000',
        reason: '기본값 사용'
      }
    }

    return NextResponse.json({
      codeType: result.codeType,
      code: result.code,
      reason: result.reason
    })

  } catch (error) {
    console.error('AI processing failed:', error)
    return NextResponse.json(
      { error: 'AI 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
} 