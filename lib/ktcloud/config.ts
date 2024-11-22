export interface KTCloudConfig {
  accessKeyId: string
  secretKey: string
}

export const ktCloudConfig: KTCloudConfig = {
  accessKeyId: process.env.KT_CLOUD_ACCESS_KEY_ID!,  
  secretKey: process.env.KT_CLOUD_SECRET_KEY!,
} 