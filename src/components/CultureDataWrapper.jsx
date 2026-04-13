import CultureSlider from './CultureSlider';
import { continentMapping } from '@/constants/continentData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const continentsSliderData = [
    { title: "Asia", slug: "asia", image: "/asia.png" },
    { title: "Middle East", slug: "middle-east", image: "/Middle-East.png" },
    { title: "Europe", slug: "europe", image: "/europe.png" },
    { title: "Africa", slug: "africa", image: "/africa.png" },
    { title: "North America", slug: "north-america", image: "/North America.png" },
    { title: "Latin America", slug: "latin-america", image: "/Latin America.png" },
    { title: "Oceania", slug: "oceania", image: "/Oceania.png" }
];

export default async function CultureDataWrapper() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/listings/public?limit=250`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error('Failed to fetch listings');

        const data = await res.json();
        const allListings = data.listings || [];

        const finalData = continentsSliderData.map(continent => {
            // ১. এখানে continent.title এর বদলে continent.slug ব্যবহার করতে হবে 
            // কারণ mapping ফাইলে কিগুলো ড্যাশসহ (middle-east) আছে।
            const associatedCountries = continentMapping[continent.slug] || [];

            // ২. লিস্টিং ফিল্টার (সরাসরি country চেক)
            const count = allListings.filter(listing =>
                associatedCountries.includes(listing.country)
            ).length;

            return {
                _id: continent.slug, // স্লাগ ব্যবহার করা ভালো রাউটিং এর জন্য
                title: continent.title, // ডিসপ্লে করার জন্য সুন্দর নাম
                image: continent.image,
                listingCount: count,
                link: `/explore/${continent.slug}` // স্লাইডারে ক্লিক করলে ডিরেক্ট লিংকে যাওয়ার জন্য
            };
        });

        // ৩. লিস্টিং সংখ্যা অনুযায়ী সর্ট করা (বড় থেকে ছোট)
        finalData.sort((a, b) => b.listingCount - a.listingCount);

        return <CultureSlider items={finalData} />;

    } catch (error) {
        console.error("Culture Fetch Error:", error);

        const fallbackData = continentsSliderData.map(c => ({
            _id: c.slug,
            title: c.title,
            image: c.image,
            listingCount: 0
        }));

        return <CultureSlider items={fallbackData} />;
    }
}