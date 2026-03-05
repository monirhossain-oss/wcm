import Link from "next/link";
import { Suspense } from "react";
import CreatorSlider from "./creator/CreatorSlider";
import CreatorSkeleton from "./creator/CreatorSkeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function GetCreatorsData() {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/users/famous-creators?limit=12&offset=0`,
            { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const creators = data?.data || [];

        if (creators.length === 0) return null;

        return <CreatorSlider creators={creators} />;
    } catch (error) {
        console.error("Error fetching creators:", error);
        return <div className="text-center text-gray-500 py-10">Failed to load creators.</div>;
    }
}

export default function PopularCreators() {
    return (
        <section className="py-4 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6 relative">

                <div className="mb-2 flex items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-4">
                    <div className="max-w-[70%]">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Popular Creators
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-normal">
                            Verified artists & craftsmen
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/creators"
                            className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 group"
                        >
                            View All
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Slider Content */}
                <Suspense fallback={<CreatorSkeleton />}>
                    <GetCreatorsData />
                </Suspense>
            </div>
        </section>
    );
}