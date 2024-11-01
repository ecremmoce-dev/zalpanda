export interface KTCloudConfig {
  host: string
  accessKeyId: string
  domainId: string
  projectName: string
  secretKey: string
  account: string
  storageName: string
  cdn: string
}

export const ktCloudConfig: KTCloudConfig = {
  host: process.env.KT_CLOUD_HOST!,
  accessKeyId: process.env.KT_CLOUD_ACCESS_KEY_ID!,
  domainId: process.env.KT_CLOUD_DOMAIN_ID!,
  projectName: process.env.KT_CLOUD_PROJECT_NAME!,
  secretKey: process.env.KT_CLOUD_SECRET_KEY!,
  account: process.env.KT_CLOUD_ACCOUNT!,
  storageName: process.env.KT_CLOUD_STORAGE_NAME!,
  cdn: process.env.KT_CLOUD_CDN!
} 