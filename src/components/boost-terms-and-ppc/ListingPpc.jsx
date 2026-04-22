import React from 'react';

const ListingPpc = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                    What is the difference between <br />
                    <span className="text-[#F57C00]">Boosted Listings and PPC?</span>
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12">
                    Both options help creators increase visibility, but they work differently.
                </p>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Boosted Listings Card */}
                    <div className="p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-[#F57C00] mb-6">Boosted Listings</h3>
                        <ul className="space-y-4">
                            {[
                                "Fixed promotional fee",
                                "Increased visibility for a defined period",
                                "No charge per click"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* PPC Card */}
                    <div className="p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Pay-Per-Click (PPC)</h3>
                        <ul className="space-y-4">
                            {[
                                "No upfront fee required",
                                "Creators pay only when users click their listing",
                                "Budget and promotion can be adjusted at any time"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Statement */}
                <div className="mt-12 p-8 rounded-2xl bg-orange-50/50 dark:bg-orange-500/[0.02] border border-orange-100 dark:border-orange-500/10">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-center font-medium">
                        Both tools allow creators to promote <span className="text-zinc-900 dark:text-zinc-200">African crafts, Asian handmade decor, cultural fashion,</span> and other creative works to a global audience.
                    </p>
                </div>

                {/* Meta Tag */}
                <div className="mt-10 flex items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    WCM Advertising Comparison
                </div>
            </div>
        </div>
    );
};

export default ListingPpc;