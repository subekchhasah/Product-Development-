/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 300, // Increase timeout for slow page generation
  typescript: {
    // Skip type checks during build for faster compilation
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting checks during build for faster compilation
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;


