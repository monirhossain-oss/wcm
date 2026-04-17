import React from 'react';

export async function generateMetadata() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seo?page=how-it-works`, {
            // next: { revalidate: 3600 }
        });
        const seo = await res.json();

        return {
            title: seo?.title || "How It Works | World Cultural Marketplace",
            description: seo?.description || "Empowering Global Craftsmanship. Follow simple steps to start your journey with WCM.",
            keywords: seo?.keywords || "culture, marketplace, craftsmanship, artisan, global",
            openGraph: {
                title: seo?.title,
                description: seo?.description,
            }
        };
    } catch (error) {
        return {
            title: "How It Works | WCM",
            description: "World Cultural Marketplace (WCM) brings the world's finest artisans under one roof.",
        };
    }
}

const HowItWorksPage = () => {
    const steps = [
        {
            id: 1,
            title: "Create Your Profile",
            description: "Sign up as a creator and tell the world about your craft, culture, and story."
        },
        {
            id: 2,
            title: "Upload Listings",
            description: "Add your creations with photos, descriptions, and cultural tags that connect visitors to your traditions."
        },
        {
            id: 3,
            title: "Review & Approval",
            description: "Our team reviews listings for authenticity and cultural relevance before publishing."
        },
        {
            id: 4,
            title: "Get Discovered",
            description: "Your listings appear in our discovery feed. Boost visibility with optional featured placements."
        }
    ];

    return (
        <main className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] pt-28 pb-20 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-center">

                {/* Header Section */}
                <header className="mb-16">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Empowering Global <span className="text-[#F57C00]">Craftsmanship</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 md:text-xl max-w-3xl mx-auto leading-relaxed">
                        World Cultural Marketplace (WCM) brings the world's finest artisans under one roof.
                        Follow these simple steps to start your journey with us.
                    </p>
                </header>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-left">
                    {steps.map((step) => (
                        <article
                            key={step.id}
                            className="p-8 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0d0d0d] hover:shadow-xl transition-all duration-300 flex flex-col items-start h-full"
                        >
                            {/* Step Number Badge */}
                            <div className="w-10 h-10 bg-[#F57C00] text-white rounded-full flex items-center justify-center font-bold mb-8 text-sm shadow-lg shadow-orange-500/20">
                                {step.id}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default HowItWorksPage;