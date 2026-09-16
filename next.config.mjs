/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first, then WebP; the optimizer picks whichever the requesting browser accepts and
    // falls back to the original format for the rest. Same pixels, a fraction of the bytes.
    formats: ['image/avif', 'image/webp'],
    // Every host an <Image> may load from. A host that is missing here fails with HTTP 400 and no
    // visible error, so the list is the first place to look when a stored image does not render.
    // The two ibb.co.com entries that used to sit here were a typo for ImgBB's i.ibb.co and matched
    // a domain nobody here owns; no stored image used either, so they were removed rather than
    // corrected. tests/publicImagePerformance.test.mjs pins this list.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'i.postimg.cc' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wcm-server.onrender.com',
        pathname: '/uploads/**',
      },
      {
        // The API on its own domain serves the same /uploads tree as Render does.
        protocol: 'https',
        hostname: 'api.worldculturemarketplace.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  trailingSlash: false,
};

export default nextConfig;
