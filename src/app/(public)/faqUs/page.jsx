import FaqContact from '@/components/faq/FaqContact';
import FaqSection from '@/components/faq/FaqSection';
import React from 'react';

export async function generateMetadata() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/faq`, {
            // next: { revalidate: 3600 }
        });

        const data = await res.json();

        return {
            title: data?.title || 'Frequently Asked Questions | WCM',
            description: data?.description || 'Find answers to common questions about World Culture Marketplace.',
            keywords: data?.keywords || ['FAQ', 'WCM Help', 'Cultural Marketplace Questions'],
        };
    } catch (error) {
        return {
            title: 'FAQ | World Culture Marketplace',
            description: 'Find answers to common questions about our platform.',
        };
    }
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