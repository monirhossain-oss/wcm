import FaqContact from '@/components/faq/FaqContact';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import FaqSection from '@/components/faq/FaqSection';
import { buildFaqPageSchema } from '@/lib/seo/structuredData';
import { getFaqs } from '@/lib/api';
import { SITE_URL } from '@/lib/seo/siteConfig';
import React from 'react';

export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'faq', locale: 'fr' });
}

// Static French route: Next's static segment wins over the [locale] catch-all, so this page reads
// its own questions exactly as the English one does.
export default async function FaqFrPage() {
  const faqs = await getFaqs('fr');
  const faqSchema = buildFaqPageSchema({ faqs, locale: 'fr', url: `${SITE_URL}/fr/faq` });

  return (
    <main className="bg-white dark:bg-[#0a0a0a]">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="text-center my-4 space-y-4">
        <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">Centre d’assistance</span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Questions fréquentes</h1>
      </div>
      <FaqSection language="fr" initialFaqs={faqs} />
      <FaqContact language="fr" />
    </main>
  );
}
