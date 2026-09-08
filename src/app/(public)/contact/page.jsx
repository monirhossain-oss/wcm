import ContactClient from "@/components/ContactClient";
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

// এসইও মেটাডাটা জেনারেটর — current language er SEO record + oi language er catalog fallback
export async function generateMetadata({ locale = 'en' } = {}) {
    return buildPageMetadata({ pageId: 'contact', locale });
}

export default function Page() {
    return (
        <main>
            <ContactClient />
        </main>
    );
}
