/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ssc461886-ssc461886.ktcdn.co.kr'],
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
}

module.exports = nextConfig 