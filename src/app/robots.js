import { ROBOTS_DISALLOW } from '@/lib/seo/indexing';
import { SITE_URL } from '@/lib/seo/siteConfig';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...ROBOTS_DISALLOW],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
