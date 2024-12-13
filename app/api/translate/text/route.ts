import { TranslationServiceClient } from '@google-cloud/translate';
import { NextResponse } from 'next/server';

const translationClient = new TranslationServiceClient();

export async function POST(request: Request) {
  try {
    const { texts, targetLanguage } = await request.json();

    // 입력값 검증 로그
    console.log('Translation request:', {
      texts,
      targetLanguage,
      credentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const [translation] = await translationClient.translateText({
      parent: "projects/ecremmoce-public/locations/global",
      contents: texts,
      mimeType: 'text/plain',
      sourceLanguageCode: 'ko',
      targetLanguageCode: targetLanguage,
    });

    return NextResponse.json(translation);
  } catch (error: any) {
    // 자세한 에러 정보 로깅
    console.error('Translation API error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });

    return NextResponse.json({ 
      error: 'Translation failed', 
      details: error.message,
      code: error.code 
    }, { 
      status: 500 
    });
  }
}