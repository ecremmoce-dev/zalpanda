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
}

module.exports = nextConfig
