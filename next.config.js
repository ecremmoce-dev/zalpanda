/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['shop-phinf.pstatic.net', 'gi.esmplus.com'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })
    return config
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  unstable_runtimeJS: true,
  output: 'standalone',
  api: {
    bodyParser: {
      sizeLimit: '100mb' // 기본값은 '1mb'
    },
    responseLimit: '100mb' // 응답 크기 제한
  }
}

module.exports = nextConfig 