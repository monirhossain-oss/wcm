import TermsAndConditions from '../../terms-and-conditions/page';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'terms-and-conditions', locale: 'fr' });
}

export default function TermsAndConditionsFrPage() {
  return <TermsAndConditions locale="fr" />;
}
