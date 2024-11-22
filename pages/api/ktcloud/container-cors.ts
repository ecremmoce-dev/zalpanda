import type { NextApiRequest, NextApiResponse } from 'next';
import { getKTCloudToken } from '@/lib/ktcloud/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { origin } = req.body;

    if (!origin) {
      throw new Error('Origin is required');
    }

    // 1. 토큰 발급 - 공통 함수 사용
    const { token, storageUrl } = await getKTCloudToken();

    // 2. 컨테이너 CORS 설정
    const containerName = process.env.NEXT_PUBLIC_KT_CLOUD_STORAGE_NAME;
    const corsResponse = await fetch(`${storageUrl}/${containerName}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Auth-Token': token,
        'X-Container-Meta-Access-Control-Allow-Origin': origin,
        'X-Container-Meta-Access-Control-Max-Age': '3000',
        'X-Container-Meta-Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'X-Container-Meta-Access-Control-Allow-Headers': [
          'Content-Type',
          'X-Auth-Token',
          'Origin',
          'Content-Length',
          'X-Object-Meta-Width',
          'X-Object-Meta-Height'
        ].join(', '),
        'X-Container-Meta-Access-Control-Expose-Headers': '*'
      }
    });

    if (!corsResponse.ok) {
      const errorText = await corsResponse.text();
      console.error('CORS 설정 실패:', {
        status: corsResponse.status,
        headers: Object.fromEntries(corsResponse.headers.entries()),
        body: errorText
      });
      throw new Error(`CORS 설정 실패: ${corsResponse.status} - ${errorText}`);
    }

    // 3. 응답 헤더에 CORS 허용 설정 추가
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 토큰 정보를 포함하여 응답
    res.status(200).json({ 
      message: 'CORS settings updated successfully',
      containerName,
      storageUrl,
      origin,
      token  // 토큰 정보 추가
    });

  } catch (error) {
    console.error('CORS 설정 실패:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to update CORS settings'
    });
  }
} 