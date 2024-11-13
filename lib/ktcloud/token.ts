import { ktCloudConfig } from './config'

export interface AuthResponse {
  token: string;
  storageUrl: string;
}

export async function getKTCloudToken(): Promise<AuthResponse> {
  try {
    const storageUser = process.env.KT_CLOUD_ACCESS_KEY_ID;
    const storagePass = process.env.KT_CLOUD_SECRET_KEY;

    if (!storageUser || !storagePass) {
      throw new Error('KT Cloud 인증 정보가 없습니다.');
    }

    console.log('Auth request:', {
      user: storageUser
    });

    let response;
    
    try {
      response = await fetch('https://ssproxy.ucloudbiz.olleh.com/auth/v1.0', {
        method: 'GET',
        headers: {
          'x-storage-user': storageUser,
          'x-storage-pass': storagePass,
          'Content-Length': '0'
        }
      });

      console.log('Auth response raw:', response);
      console.log('Auth token:', response.headers.get('x-auth-token'));
      console.log('Storage URL:', response.headers.get('x-storage-url'));

    } catch (error) {
      console.error('KT Cloud API 요청 실패:', error);
      throw new Error('KT Cloud 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    }

    const headers = Object.fromEntries(response.headers.entries());
    console.log('Auth response headers:', headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('인증 실패:', {
        status: response.status,
        headers,
        body: errorText
      });
      throw new Error(`인증 실패: ${response.status} - ${errorText}`);
    }

    const token = response.headers.get('x-auth-token');
    const storageUrl = response.headers.get('x-storage-url');

    if (!token || !storageUrl) {
      console.error('토큰 또는 스토리지 URL 누락:', headers);
      throw new Error('인증 응답에서 필수 정보가 누락되었습니다.');
    }

    return { token, storageUrl };
  } catch (error) {
    console.error('KT Cloud 토큰 발급 오류:', error);
    throw error instanceof Error 
      ? error 
      : new Error('알 수 없는 인증 오류가 발생했습니다.');
  }
} 