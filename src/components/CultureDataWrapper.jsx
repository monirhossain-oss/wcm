import CultureSlider from './CultureSlider';
import { localePath, translate } from '@/lib/i18n';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const continentsSliderData = [
    { slug: "asia", image: "/asia.png" },
    { slug: "middle-east", image: "/Middle-East.png" },
    { slug: "europe", image: "/europe.png" },
    { slug: "africa", image: "/africa.png" },
    { slug: "north-america", image: "/North America.png" },
    { slug: "latin-america", image: "/Latin America.png" },
    { slug: "oceania", image: "/Oceania.png" }
];

export default async function CultureDataWrapper({ locale = 'en' }) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/listings/public?limit=250`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error('Failed to fetch listings');

        const data = await res.json();
        const allListings = data.listings || [];

        const finalData = continentsSliderData.map(continent => {
            // ✅ সরাসরি listing.continent === continent.slug দিয়ে match
            const count = allListings.filter(listing =>
                listing.continent === continent.slug
            ).length;

            return {
                _id: continent.slug,
                title: translate(locale, `homeDiscovery.regions.${continent.slug}`),
                image: continent.image,
                listingCount: count,
                link: localePath(locale, `/explore/${continent.slug}`)
            };
        });

        finalData.sort((a, b) => b.listingCount - a.listingCount);

        return <CultureSlider items={finalData} listingsLabel={translate(locale, 'homeDiscovery.listings')} />;

    } catch (error) {
        console.error("Culture Fetch Error:", error);

        const fallbackData = continentsSliderData.map(c => ({
            _id: c.slug,
            title: translate(locale, `homeDiscovery.regions.${c.slug}`),
            image: c.image,
            listingCount: 0,
            link: localePath(locale, `/explore/${c.slug}`)
        }));

        return <CultureSlider items={fallbackData} listingsLabel={translate(locale, 'homeDiscovery.listings')} />;
    }
}
