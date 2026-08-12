import React from 'react';
import { privacyPolicy } from '@/content/legalPages';

export const metadata = {
  alternates: { canonical: '/fr/privacy-policy', languages: { en: '/privacy-policy', fr: '/fr/privacy-policy', 'x-default': '/privacy-policy' } },
  openGraph: { url: '/fr/privacy-policy', locale: 'fr_FR', type: 'website' },
  title: 'Politique de confidentialité | World Culture Marketplace',
  description:
    'Consultez la politique de confidentialité (version française) de World Culture Marketplace.',
  keywords: ['Confidentialité', 'Politique', 'WCM'],
};

const BulletList = ({ items }) => (
  <ul className="mt-2 space-y-2">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-[#F57C00] flex-shrink-0" />
        <span className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
          {item}
        </span>
      </li>
    ))}
  </ul>
);

export default function PrivacyPolicyFrPage() {
  const content = privacyPolicy.fr;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0C0C0B]">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F0F0E]">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
          <h1 className="text-[40px] md:text-[52px] leading-[1.05] font-black tracking-tight text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <p className="mt-3 text-[13px] text-gray-500 dark:text-gray-500">
            <span className="font-medium">Date d’entrée en vigueur :</span>{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {content.effectiveDate}
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="bg-orange-50 dark:bg-orange-500/[0.07] border border-orange-100 dark:border-orange-500/20 rounded-2xl p-6">
          <p className="text-[14.5px] leading-relaxed text-gray-700 dark:text-gray-300">
            {content.intro}
          </p>
        </div>

        {content.sections.map((section) => (
          <section
            key={section.heading}
            className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-[16px] font-black tracking-tight text-gray-900 dark:text-white">
              {section.heading}
            </h2>
            <BulletList items={section.bullets} />
          </section>
        ))}
      </div>
    </div>
  );
}
