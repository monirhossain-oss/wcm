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
            <FaqSection />
            <FaqContact />
        </main>
    );
};

export default Page;