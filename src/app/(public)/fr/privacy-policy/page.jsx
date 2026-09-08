import PrivacyPolicyPage from '../../privacy-policy/page';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'privacy-policy', locale: 'fr' });
}

export default function PrivacyPolicyFrPage() {
  return <PrivacyPolicyPage locale="fr" />;
}
