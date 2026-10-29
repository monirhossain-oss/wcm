import AboutHeader from "@/components/about/AboutHeader";
import AboutContent from "@/components/about/AboutContent";
import AboutShape from "@/components/about/AboutShape";
import AboutExplore from "@/components/about/AboutExplore";
import AboutPrincpals from "@/components/about/AboutPrincpals";
import AboutCulture from "@/components/about/AboutCulture";
import AboutVisibility from "@/components/about/AboutVisibility";

// ১. SEO Metadata জেনারেট করা
export async function generateMetadata() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/about`, {
            next: { revalidate: 60 }
        });
        const result = await res.json();

        // আপনার ডাটাবেজের 'aboutHeader' থেকে মেটাডাটা নেওয়া হচ্ছে
        const seo = result.data?.aboutHeader;

        return {
            title: seo?.title || 'About Us | World Culture Marketplace',
            description: seo?.subTitle || 'Discover global cultural heritage and master artisans.',
            keywords: ['WCM', 'Culture', 'Artisans', 'Global Heritage'],
        };
    } catch (error) {
        return {
            title: 'About Us | World Culture Marketplace',
        };
    }
}

// ২. মেইন পেজ কম্পোনেন্ট
export default async function AboutPage() {
    let aboutData = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/about`, {
            cache: 'no-store' // রিয়েল-টাইম ডেটার জন্য
        });
        const result = await res.json();

        if (result.success && result.data) {
            aboutData = result.data;
        }
    } catch (error) {
        console.error("Server-side data fetch error:", error);
    }
    // console.log(aboutData?.storySection)

    return (
        <main className="bg-white dark:bg-[#0a0a0a] overflow-hidden">

            {/* ১. হেডার সেকশন */}
            <AboutHeader data={aboutData?.aboutHeader} />

            {/* ২. ইন্ট্রো/কন্টেন্ট সেকশন (আপনার লগের 'introSection' এবং 'gridImages') */}
            <AboutContent
                data={aboutData?.introSection}
                images={aboutData?.gridImages}
                social={aboutData?.socialProof}
            />

            {/* ৩. স্টোরি/শেপ সেকশন (আপনার লগের 'storySection') */}
            <AboutShape data={aboutData?.storySection} />

            {/* ৪. এক্সপ্লোর জার্নি (আপনার লগের 'explorerJourney') */}
            <AboutExplore data={aboutData?.explorerJourney} />

            {/* ৫. প্রিন্সিপাল সেকশন (আপনার লগের 'principlesSection') */}
            <AboutPrincpals data={aboutData?.principlesSection} />

            {/* ৬. কালচার সেকশন (আপনার লগের 'visionSection' বা সংশ্লিষ্ট ফিল্ড) */}
            <AboutCulture data={aboutData?.visionSection} />

            {/* ৭. ভিজিবিলিটি সেকশন (আপনার লগের 'visibilitySection') */}
            <AboutVisibility data={aboutData?.visibilitySection} />

        </main>
    );
}