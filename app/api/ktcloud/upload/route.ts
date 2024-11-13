import { uploadImageToKTCloud } from '@/lib/ktcloud/upload';
import { NextRequest, NextResponse } from 'next/server';
import { getKTCloudToken } from '@/lib/ktcloud/token';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const itemCode = formData.get('itemCode') as string;
    
    if (!file || !itemCode) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let auth;
    
    try {
      console.log('토큰 발급 시작');
      auth = await getKTCloudToken();
      console.log('토큰 발급 성공:', auth);
    } catch (error) {
      console.error('KT Cloud 토큰 발급 실패:', error);
      return NextResponse.json(
        { error: 'KT Cloud 인증에 실패했습니다.' },
        { status: 401 }
      );
    }
    
    try {
      console.log('이미지 업로드 시작');
      const imageUrl = await uploadImageToKTCloud({
        auth,
        imageBuffer: buffer,
        fileName: `merged-${Date.now()}.png`,
        itemCode,
      });
      console.log('이미지 업로드 성공:', imageUrl);
      
      return NextResponse.json({ url: imageUrl });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      return NextResponse.json(
        { error: '이미지 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('요청 처리 중 오류:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : '이미지 업로드 중 알 수 없는 오류가 발생했습니다.';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 