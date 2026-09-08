import FaqContact from '@/components/faq/FaqContact';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import FaqSection from '@/components/faq/FaqSection';
import React from 'react';

export async function generateMetadata() {
  return buildPageMetadata({ pageId: 'faq', locale: 'fr' });
}

export default function FaqFrPage() {
  return (
    <main className="bg-white dark:bg-[#0a0a0a]">
      <div className="text-center my-4 space-y-4">
        <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">Centre d’assistance</span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Questions fréquentes</h1>
      </div>
      <FaqSection language="fr" />
      <FaqContact language="fr" />
    </main>
  );
}
