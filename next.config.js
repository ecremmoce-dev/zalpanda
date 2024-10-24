/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lgcxydabfbch3774324.cdn.ntruss.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer-core')
    }
    return config
  },
}

module.exports = nextConfig
