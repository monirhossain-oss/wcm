import CookiePolicy from '../../cookie-policy/page';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'cookie-policy', locale: 'fr' });
}

export default function CookiePolicyFrPage() {
  return <CookiePolicy locale="fr" />;
}
