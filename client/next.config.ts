import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'mobileriansa.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mobileriansa.com/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://mobileriansa.com/media/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://mobileriansa.com/static/:path*',
      },
    ];
  },
};

export default nextConfig;
