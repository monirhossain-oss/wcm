import CreatorSlider from "./CreatorSlider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default async function CreatorDataWrapper() {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/users/famous-creators?limit=12&offset=0`,
            { next: { revalidate: 3600 } } 
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const creators = data?.data || [];

        if (creators.length === 0) return null;

        return <CreatorSlider creators={creators} />;
    } catch (error) {
        console.error("Error fetching creators:", error);
        return <div className="text-center text-xs text-gray-400 py-10">Failed to load creators.</div>;
    }
}