/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL,
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
