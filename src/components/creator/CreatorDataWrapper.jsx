import CreatorSlider from "./CreatorSlider";
import { translate } from '@/lib/i18n';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default async function CreatorDataWrapper({ locale = 'en' }) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/users/famous-creators?limit=12&offset=0${locale === 'en' ? '' : `&language=${locale}`}`,
            { next: { revalidate: 30 } } 
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const creators = data?.data || [];

        if (creators.length === 0) return null;

        return <CreatorSlider creators={creators} locale={locale} labels={{
            unknown: translate(locale, 'homeDiscovery.unknown'),
            world: translate(locale, 'homeDiscovery.world'),
            listings: translate(locale, 'homeDiscovery.listings'),
            viewProfile: translate(locale, 'homeDiscovery.viewProfile'),
        }} />;
    } catch (error) {
        console.error("Error fetching creators:", error);
        return <div className="text-center text-xs text-gray-400 py-10">{translate(locale, 'homeDiscovery.popularCreators.failure')}</div>;
    }
}
