import { ktCloudConfig } from './config'

export async function uploadImageToKTCloud({
  token,
  imageBuffer,
  fileName,
  vendorPath
}: {
  token: string;
  imageBuffer: Buffer;
  fileName: string;
  vendorPath: string;
}): Promise<string> {
  const storageUrl = `https://${ktCloudConfig.host}/v1/${ktCloudConfig.account}`
  const containerName = ktCloudConfig.storageName
  const objectPath = `${vendorPath}/${fileName}`
  
  const uploadUrl = `${storageUrl}/${containerName}/${objectPath}`
  console.log('Uploading to:', uploadUrl)

  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'X-Auth-Token': token,
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString()
      },
      body: imageBuffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload failed:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    const cdnUrl = `https://${ktCloudConfig.cdn}/${objectPath}`
    console.log('Upload successful:', cdnUrl)
    return cdnUrl

  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
} 