import FaqPage from '../../faqUs/page';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

// Next's static segment wins over the [locale] catch-all for this URL, so the route has to exist.
// It renders the English page component in French, the way the other three hand-written /fr routes
// do: this file used to carry its own copy of the header, the FAQ read and the JSON-LD, which is
// how its H1 drifted apart from the one every other path to the same page rendered.
export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'faq', locale: 'fr' });
}

export default function FaqFrPage() {
  return <FaqPage locale="fr" />;
}
