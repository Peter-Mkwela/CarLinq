/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable static generation
  output: 'export',
  // Skip all checks
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Disable image optimization if causing issues
  images: { unoptimized: true },
};

export default nextConfig;