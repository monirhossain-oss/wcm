import ContactClient from "@/components/ContactClient";

export async function generateMetadata() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/contact`, {
            next: { revalidate: 60 }
        });

        const data = await res.json();

        return {
            title: data?.title || 'Contact Us | World Culture Marketplace',
            description: data?.description || 'Get in touch with us.',
            keywords: data?.keywords || ['WCM', 'Contact', 'Support'],
        };
    } catch (error) {
        return {
            title: 'Contact Us | World Culture Marketplace',
            description: 'Reach out to our support team.',
        };
    }
}

export default function Page() {
    return (
        <main>
            <ContactClient />
        </main>
    );
}