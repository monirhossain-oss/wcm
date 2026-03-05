import Link from "next/link";
import { Suspense } from "react";
import CreatorSkeleton from "./creator/CreatorSkeleton";
import CreatorDataWrapper from "./creator/CreatorDataWrapper";

export default function PopularCreators() {
    return (
        <section className="py-10 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="mb-8 flex items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-4">
                    <div className="max-w-[70%]">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Popular Creators
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-normal">
                            Verified artists & craftsmen.
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

                <Suspense fallback={<CreatorSkeleton />}>
                    <CreatorDataWrapper />
                </Suspense>
            </div>
        </section>
    );
}