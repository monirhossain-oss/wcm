import ContactClient from "@/components/ContactClient";
import { getSeoByPage } from "@/lib/api";

// এসইও মেটাডাটা জেনারেটর — Admin panel (/api/seo/contact) theke title/description/keywords
export async function generateMetadata() {
    const seoData = await getSeoByPage('contact');
    // console.log(seoData)

    return {
        title: seoData?.title || 'Contact Us | World Culture Marketplace',
        description: seoData?.description || 'Get in touch with us.',
        keywords: seoData?.keywords?.length ? seoData.keywords : ['WCM', 'Contact', 'Support'],
    };
}

export default function Page() {
    return (
        <main>
            <ContactClient />
        </main>
    );
}