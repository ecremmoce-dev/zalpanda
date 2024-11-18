import { ktCloudConfig } from './config'
import type { AuthResponse } from './token'

export async function uploadImageToKTCloud({
  auth,
  imageBuffer,
  fileName,
  itemCode
}: {
  auth: AuthResponse;
  imageBuffer: Buffer;
  fileName: string;
  itemCode: string;
}): Promise<string> {
  const containerName = process.env.NEXT_PUBLIC_KT_CLOUD_STORAGE_NAME
  const objectPath = `${itemCode}/${fileName}`
  
  try {
    const uploadUrl = `${auth.storageUrl}/${containerName}/${objectPath}`
    console.log('Uploading to:', uploadUrl)

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'X-Auth-Token': auth.token,
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
        'X-Object-Meta-Width': 'auto',
        'X-Object-Meta-Height': 'auto'
      },
      body: imageBuffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      const responseHeaders = Object.fromEntries(response.headers.entries());
      console.error('업로드 실패:', {
        status: response.status,
        headers: responseHeaders,
        body: errorText,
        requestUrl: uploadUrl
      })
      throw new Error(`업로드 실패 (${response.status}): ${errorText}`)
    }

    return uploadUrl

  } catch (error) {
    console.error('Upload error:', error)
    throw error instanceof Error 
      ? error 
      : new Error('이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
  }
} 