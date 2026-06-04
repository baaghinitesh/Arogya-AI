import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // ppr and clientSegmentCache are canary-only — keep disabled for stable Vercel builds
    // ppr: true,
    // clientSegmentCache: true,
    nodeMiddleware: true   // required for middleware.ts using Node.js runtime
  },
  // allowedDevOrigins is dev-only, not needed in production
  images: {
    dangerouslyAllowSVG: true,
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
