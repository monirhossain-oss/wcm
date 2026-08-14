import ContactClient from "@/components/ContactClient";
import { getSeoByPage } from "@/lib/api";
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';
import { translate } from '@/lib/i18n';

// এসইও মেটাডাটা জেনারেটর — Admin panel (/api/seo/contact) theke title/description/keywords
export async function generateMetadata({ locale = 'en' } = {}) {
    const seoData = locale === 'en' ? await getSeoByPage('contact') : null;
    const title = seoData?.title || translate(locale, 'contact.metaTitle');
    const description = seoData?.description || translate(locale, 'contact.metaDescription');
    return {
        ...buildLocalizedMetadata({ locale, path: '/contact', title, description, languages: await getPublishedLanguageCodes() }),
        keywords: seoData?.keywords?.length ? seoData.keywords : translate(locale, 'contact.metaKeywords'),
    };
}

export default function Page() {
    return (
        <main>
            <ContactClient />
        </main>
    );
}
