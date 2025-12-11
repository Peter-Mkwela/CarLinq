/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' - it's incompatible with NextAuth
  // output: 'standalone', // Keep this for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Important: Disable static optimization for dynamic pages
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;