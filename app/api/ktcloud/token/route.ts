import { getKTCloudToken } from '@/lib/ktcloud/token';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = await getKTCloudToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('KT Cloud 토큰 발급 오류:', error);
    return NextResponse.json(
      { error: '토큰 발급 실패' },
      { status: 500 }
    );
  }
} 