import TermsAndConditions from '../../terms-and-conditions/page';

export const metadata = {
  alternates: { canonical: '/fr/terms-and-conditions', languages: { en: '/terms-and-conditions', fr: '/fr/terms-and-conditions', 'x-default': '/terms-and-conditions' } },
  openGraph: { url: '/fr/terms-and-conditions', locale: 'fr_FR', type: 'website' },
  title: 'Conditions générales | World Culture Marketplace',
  description: 'Consultez les conditions générales de World Culture Marketplace.',
  keywords: ['Conditions', 'Juridique', 'WCM'],
};

export default function TermsAndConditionsFrPage() {
  return <TermsAndConditions locale="fr" />;
}
