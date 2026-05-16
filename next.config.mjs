/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
