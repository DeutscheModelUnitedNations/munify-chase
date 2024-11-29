/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    // Enable built-in module resolution
    serverComponentsExternalPackages: [],
  }
};

module.exports = nextConfig;
