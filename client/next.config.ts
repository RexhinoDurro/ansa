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
    return {
      // beforeFiles rewrites are checked before pages/public files
      // This allows API routes to handle /api/admin/* requests
      beforeFiles: [],
      // afterFiles rewrites are checked after pages/public files but before dynamic routes
      afterFiles: [
        {
          source: '/media/:path*',
          destination: 'https://mobileriansa.com/media/:path*',
        },
        {
          source: '/static/:path*',
          destination: 'https://mobileriansa.com/static/:path*',
        },
      ],
      // fallback rewrites are checked after both pages/public files and dynamic routes
      // Since API routes are checked BEFORE fallback rewrites, /api/admin/* will be
      // handled by the API route handler, and other /api/* paths will be rewritten here
      fallback: [
        {
          source: '/api/:path*',
          destination: 'https://mobileriansa.com/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
