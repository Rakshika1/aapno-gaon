import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{
      source: '/track/:path*',
      headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Cache-Control', value: 'private, no-store' },
      ],
    }];
  },
};

export default config;
