import FaqContact from '@/components/faq/FaqContact';
import FaqSection from '@/components/faq/FaqSection';
import React from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { buildFaqPageSchema } from '@/lib/seo/structuredData';
import { getFaqs } from '@/lib/api';
import { SITE_URL } from '@/lib/seo/siteConfig';
import { localePath } from '@/lib/i18n';

// এসইও মেটাডাটা জেনারেটর — English /faqUs; French counterpart is /fr/faq (registry-mapped)
export async function generateMetadata({ locale = 'en' } = {}) {
    return buildPageMetadata({ pageId: 'faq', locale });
}

// The questions are read here rather than in the browser: the answers are the whole content of this
// page, and fetching them client-side left the served HTML with five buttons and a spinner.
const Page = async ({ locale = 'en' }) => {
    const isFrench = locale === 'fr';
    const faqs = await getFaqs(locale);
    const faqSchema = buildFaqPageSchema({
        faqs,
        locale,
        url: `${SITE_URL}${localePath(locale, '/faqUs')}`,
    });

    return (
        <main className="bg-white dark:bg-[#0a0a0a]">
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {/* Header */}
            <div className="text-center my-4 space-y-4">
                <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                    {isFrench ? 'Centre d’assistance' : 'Support Center'}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {isFrench ? 'Questions fréquemment posées' : 'Frequently Asked Questions'}
                </h1>
            </div>
            <FaqSection language={locale} initialFaqs={faqs} />
            <FaqContact language={locale} />
        </main>
    );
};

export default Page;
