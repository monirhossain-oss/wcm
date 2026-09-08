import { NOINDEX } from '@/lib/seo/indexing';

// Signed-in account page, excluded from the index.
export const metadata = { robots: NOINDEX };

export default function NoIndexLayout({ children }) {
  return children;
}
