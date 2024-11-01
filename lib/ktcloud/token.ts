import { ktCloudConfig } from './config'

export async function getKTCloudToken(): Promise<string> {
  try {
    const reqObj = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: process.env.KT_CLOUD_ACCESS_KEY_ID,
              password: process.env.KT_CLOUD_SECRET_KEY,
              domain: {
                id: process.env.KT_CLOUD_DOMAIN_ID
              }
            }
          }
        },
        scope: {
          project: {
            id: process.env.KT_CLOUD_PROJECT_NAME,
            domain: {
              id: process.env.KT_CLOUD_DOMAIN_ID
            }
          }
        }
      }
    };

    console.log('KT Cloud 인증 요청:', JSON.stringify(reqObj, null, 2));

    const response = await fetch('https://ssproxy2.ucloudbiz.olleh.com:5000/v3/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'User-Agent': 'EcremmoceClientSDK/1.0',
        'Host': process.env.KT_CLOUD_HOST
      },
      body: JSON.stringify(reqObj)
    });

    const responseText = await response.text();
    console.log('KT Cloud 응답:', response.status, responseText);

    if (response.status !== 201) {
      throw new Error(`Authentication failed: ${response.status} ${responseText}`);
    }

    const token = response.headers.get('X-Subject-Token');
    if (!token) {
      throw new Error('Token not found in response headers');
    }

    return token;
  } catch (error) {
    console.error('KT Cloud 토큰 발급 오류:', error);
    throw error;
  }
} 