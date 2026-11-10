import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@signdesk/shared'],
  webpack: (config) => {
    // For pdfjs-dist canvas support
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
