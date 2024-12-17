import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface PromptData {
  id: string
  content: string
}

interface PromptsRequest {
  prompt: string
  data: PromptData[]
}

export async function POST(request: Request) {
  try {
    const body: PromptsRequest = await request.json()
    const promptResponses = []

    for (const prompt of body.data) {
      const messageHistory: ChatCompletionMessageParam[] = [
        { role: "system", content: "An assistant editor." },
        { role: "user", content: `[${prompt.content}]\n${body.prompt}` }
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messageHistory,
        temperature: 1,
        max_tokens: 1000
      })

      const replyContent = completion.choices[0].message.content?.trim()

      promptResponses.push({
        id: prompt.id,
        content: replyContent
      })
    }

    return NextResponse.json(promptResponses)

  } catch (error: any) {
    console.error('ChatGPT API error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        details: error.response?.data || error 
      }, 
      { status: error.status || 500 }
    )
  }
} 



// 사용 예시
// async function chatgptGenerate(prompt: string, text: string[], targetLanguage: string) {
//   try {
//     const response = await fetch('/api/chatgpt', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         prompt: `위 [] 안의 문자를 ${targetLanguage} 언어로 번역 해서 결과만 보여줘.`,
//         data: text.map((item, index) => ({ id: index.toString(), content: item })),
//       }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw error;
//   }
// }