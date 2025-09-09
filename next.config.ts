import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true
  },
  allowedDevOrigins: [
    '*.clackypaas.com',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wa.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.whatsapp.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
