import BecomeCreatorClient from './BecomeCreatorClient';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata({ locale = 'en' } = {}) {
  return buildPageMetadata({ pageId: 'become-creator', locale });
}

export default function BecomeCreatorPage() {
  return <BecomeCreatorClient />;
}
