import FaqContact from '@/components/faq/FaqContact';
import FaqSection from '@/components/faq/FaqSection';
import React from 'react';

export const metadata = {
  title: 'Questions fréquentes | World Culture Marketplace',
  description: 'Retrouvez les réponses aux questions fréquentes sur World Culture Marketplace.',
  keywords: ['FAQ', 'aide WCM', 'questions marketplace culturel'],
};

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
