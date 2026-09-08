import { NOINDEX } from '@/lib/seo/indexing';

// English-only placeholder page with no French counterpart.
export const metadata = { robots: NOINDEX };

export default function NoIndexLayout({ children }) {
  return children;
}
