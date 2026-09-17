import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow preview host
  allowedDevOrigins: ['*.e2b.app', '*.e2b.dev', '3000-ipzm2l9rom45mc5g0p1cr.e2b.app'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        // HLS manifests - no cache or short cache
        source: '/:path*.m3u8',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=10, stale-while-revalidate=30' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        // HLS segments - long cache
        source: '/:path*.ts',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
