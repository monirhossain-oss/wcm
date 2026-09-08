import { NOINDEX_NOFOLLOW } from '@/lib/seo/indexing';

// Carries a single-use recovery token in the path: never indexed and never followed onward.
export const metadata = { robots: NOINDEX_NOFOLLOW };

export default function NoIndexLayout({ children }) {
  return children;
}
