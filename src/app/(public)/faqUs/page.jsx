import FaqContact from '@/components/faq/FaqContact';
import FaqSection from '@/components/faq/FaqSection';
import React from 'react';
import { getSeoByPage } from '@/lib/api';

// এসইও মেটাডাটা জেনারেটর — Admin panel (/api/seo/faq) theke title/description/keywords
export async function generateMetadata() {
    const seoData = await getSeoByPage('faq');

    return {
        title: seoData?.title || 'Frequently Asked Questions | WCM',
        description: seoData?.description || 'Find answers to common questions about World Culture Marketplace.',
        keywords: seoData?.keywords?.length ? seoData.keywords : ['FAQ', 'WCM Help', 'Cultural Marketplace Questions'],
    };
}

const Page = () => {
    return (
        <main className="bg-white dark:bg-[#0a0a0a]">
            {/* Header */}
            <div className="text-center my-4 space-y-4">
                <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                    Support Center
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                </h1>
            </div>
            <FaqSection />
            <FaqContact />
        </main>
    );
};

export default Page;