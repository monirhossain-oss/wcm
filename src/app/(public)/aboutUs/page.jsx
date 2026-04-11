import AboutContent from "@/components/about/AboutContent";
import AboutShape from "@/components/about/AboutShape";
import AboutExplore from "@/components/about/AboutExplore";
import AboutPresting from "@/components/about/AboutPresting";
import AboutCulture from "@/components/about/AboutCulture";
import AboutHeader from "@/components/about/AboutHeader";
import AboutVisibility from "@/components/about/AboutVisibility";
import AboutPrincpals from "@/components/about/AboutPrincpals";

// ডাইনামিক মেটাডাটা ফাংশন
export async function generateMetadata() {
    try {
        // আপনার ব্যাকএন্ড এপিআই কল (pageName: about)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/about`, {
            next: { revalidate: 60 } // প্রতি ৬০ সেকেন্ড পর পর আপডেট চেক করবে
        });

        const data = await res.json();

        // যদি ডাটাবেজে ডাটা থাকে তবে সেটি দেখাবে, না থাকলে ডিফল্ট একটা দেখাবে
        return {
            title: data?.title || 'About Us',
            description: data?.description || 'Learn about World Culture Marketplace (WCM).',
            keywords: data?.keywords || ['WCM', 'Culture'],
        };
    } catch (error) {
        // এপিআই কাজ না করলে এই ব্যাকআপ মেটাডাটা দেখাবে
        return {
            title: 'About Us | World Culture Marketplace',
            description: 'Discover our mission and global cultural heritage.',
        };
    }
}

export default function Page() {
    return (
        <main className="bg-white dark:bg-[#0a0a0a]">
            <AboutHeader />
            <AboutContent />
            <AboutShape />
            <AboutExplore />
            <AboutPresting />
            <AboutPrincpals />
            <AboutCulture />
            <AboutVisibility />
        </main>
    );
}