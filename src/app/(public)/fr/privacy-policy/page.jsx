import PrivacyPolicyPage from '../../privacy-policy/page';

export const metadata = {
  alternates: { canonical: '/fr/privacy-policy', languages: { en: '/privacy-policy', fr: '/fr/privacy-policy', 'x-default': '/privacy-policy' } },
  openGraph: { url: '/fr/privacy-policy', locale: 'fr_FR', type: 'website' },
  title: 'Politique de confidentialité | World Culture Marketplace',
  description: 'Consultez la politique de confidentialité de World Culture Marketplace.',
  keywords: ['Confidentialité', 'Politique', 'WCM'],
};

export default function PrivacyPolicyFrPage() {
  return <PrivacyPolicyPage locale="fr" />;
}
