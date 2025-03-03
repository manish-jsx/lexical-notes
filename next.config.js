/** @type {import('next').NextConfig} */
const moduleResolution = require('./module-resolution');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Only apply these settings on client-side builds
    if (!isServer) {
      // Apply the fallbacks for Node.js built-ins
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...moduleResolution.fallback,
      };
      
      // Apply custom module aliases
      config.resolve.alias = {
        ...config.resolve.alias,
        ...moduleResolution.alias,
      };
    }

    return config;
  },
  // Exclude problematic dependencies from server-side rendering
  experimental: {
    serverComponentsExternalPackages: ['lexical-editor-easy'],
  },
};

module.exports = nextConfig;
