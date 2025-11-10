import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3123',
        pathname: '/images/**',
      },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      /antd.*compatible.*React/,
    ];
    return config;
  },
};

export default nextConfig;
