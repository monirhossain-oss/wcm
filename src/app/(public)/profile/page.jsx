import OwnProfileClient from './OwnProfileClient';
import { NOINDEX } from '@/lib/seo/indexing';

// The signed-in account page. A folder layout cannot carry this rule because /profile/[id] below it
// is the public creator profile and must stay indexable.
export const metadata = { robots: NOINDEX };

export default function OwnProfilePage() {
  return <OwnProfileClient />;
}
