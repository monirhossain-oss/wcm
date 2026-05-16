import React from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// ===== SEO METADATA =====
export async function generateMetadata() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/how-it-works`, {
            next: { revalidate: 0 }, // No cache - always fresh
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const content = data?.data;

        return {
            title: `${content?.headerTitle || "How It Works"} | World Cultural Marketplace`,
            description:
                content?.headerDescription ||
                "World Cultural Marketplace (WCM) brings the world's finest artisans under one roof.",
            keywords: "culture, marketplace, craftsmanship, artisan, global, how it works",
            openGraph: {
                title: content?.headerTitle || "How It Works | WCM",
                description:
                    content?.headerDescription ||
                    "Discover how World Cultural Marketplace works.",
            },
        };
    } catch (error) {
        return {
            title: "How It Works | World Cultural Marketplace",
            description:
                "World Cultural Marketplace (WCM) brings the world's finest artisans under one roof.",
        };
    }
}

// ===== DYNAMIC GRID CLASS =====
const getGridClass = (count) => {
    if (count <= 1) return "grid-cols-1 max-w-md mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
    if (count === 3) return "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
};

// ===== FETCH DATA =====
const fetchHowItWorks = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/admin/how-it-works`, {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        return data?.data || null;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

// ===== MAIN PAGE =====
const HowItWorksPage = async () => {
    const content = await fetchHowItWorks();

    // Default fallback data
    const displayData = content || {
        headerTitle: "Empowering Global Craftsmanship",
        headerDescription:
            "World Cultural Marketplace (WCM) brings the world's finest artisans under one roof. Follow these simple steps to start your journey with us.",
        steps: [
            {
                id: 1,
                title: "Create Your Profile",
                description:
                    "Sign up as a creator and tell the world about your craft, culture, and story.",
            },
            {
                id: 2,
                title: "Upload Listings",
                description:
                    "Add your creations with photos, descriptions, and cultural tags that connect visitors to your traditions.",
            },
            {
                id: 3,
                title: "Review & Approval",
                description:
                    "Our team reviews listings for authenticity and cultural relevance before publishing.",
            },
            {
                id: 4,
                title: "Get Discovered",
                description:
                    "Your listings appear in our discovery feed. Boost visibility with optional featured placements.",
            },
        ],
    };

    const stepsCount = displayData.steps?.length || 0;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            {/* ===== HERO HEADER ===== */}
            <section className="relative overflow-hidden bg-gradient-to-b from-orange-900/20 to-transparent dark:from-orange-900/10 p-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Decorative element */}
                    <div className="flex justify-center">
                        <div className="w-16 h-1 bg-[#F57C00] rounded-full"></div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        {displayData.headerTitle}
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {displayData.headerDescription}
                    </p>

                    {/* Decorative dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-[#F57C00] rounded-full opacity-60"
                            ></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== STEPS SECTION ===== */}
            <section className="py-4 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section label */}
                    <div className="text-center mb-8">
                        <span className="inline-block px-4 py-1 bg-orange-100 dark:bg-orange-900/20 text-[#F57C00] text-sm font-semibold rounded-full uppercase tracking-wider">
                            Our Process
                        </span>
                    </div>

                    {/* Steps Grid */}
                    <div className={`grid gap-6 ${getGridClass(stepsCount)}`}>
                        {displayData.steps?.map((step, index) => (
                            <article
                                key={step.id}
                                className="group relative bg-gray-200 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Step Number - Large Background */}
                                <div className="absolute top-4 right-4 text-6xl font-black text-gray-100 dark:text-gray-800/50 select-none">
                                    {String(step.id).padStart(2, "0")}
                                </div>

                                {/* Step Number Badge */}
                                <div className="relative mb-6">
                                    <div className="w-14 h-14 bg-[#F57C00] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                        {step.id}
                                    </div>
                                </div>

                                {/* Connector Line (except last) */}
                                {index < stepsCount - 1 && (
                                    <div className="hidden lg:block absolute top-14 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#F57C00] to-transparent"></div>
                                )}

                                {/* Content */}
                                <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#F57C00] transition-colors">
                                    {step.title}
                                </h3>

                                <p className="relative text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F57C00] rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;