import CookiePolicy from '../../cookie-policy/page';

export const metadata = {
  alternates: { canonical: '/fr/cookie-policy', languages: { en: '/cookie-policy', fr: '/fr/cookie-policy', 'x-default': '/cookie-policy' } },
  openGraph: { url: '/fr/cookie-policy', locale: 'fr_FR', type: 'website' },
  title: 'Politique relative aux cookies | World Culture Marketplace',
  description: 'Consultez la politique relative aux cookies de World Culture Marketplace.',
  keywords: ['Cookies', 'Politique', 'WCM'],
};

export default function CookiePolicyFrPage() {
  return <CookiePolicy locale="fr" />;
}
