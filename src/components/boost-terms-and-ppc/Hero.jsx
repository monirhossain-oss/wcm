import React from 'react';

const Hero = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h1 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-8">
                    What is a Boosted Listing<br />
                    <span className="text-[#F57C00]">on World Culture Marketplace?</span>
                </h1>

                {/* Subtitle & Core Definition */}
                <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl">
                    <p>
                        A Boosted Listing is an <span className="font-semibold text-zinc-900 dark:text-zinc-200">optional promotional feature</span> that allows creators to increase the visibility of their cultural artwork, handmade crafts, and creative products on World Culture Marketplace.
                    </p>
                    <p>
                        When a listing is boosted, it may appear in more prominent areas of the platform, helping it reach a <span className="text-zinc-900 dark:text-zinc-200 font-medium">larger audience</span> interested in cultural art and global craftsmanship.
                    </p>
                </div>

                {/* Visibility Locations */}
                <div className="mt-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-zinc-300 dark:bg-zinc-700"></span>
                        Boosted listings can appear in
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Featured sections of the homepage",
                            "Highlighted cultural collections",
                            "Prioritized search results",
                            "Explore pages across the marketplace"
                        ].map((item, idx) => (
                            <div key={idx} className="group flex items-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-[#F57C00] group-hover:scale-125 transition-transform" />
                                <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Craft Focus Section */}
                <div className="mt-12 p-6 rounded-2xl bg-orange-50/50 dark:bg-orange-500/[0.02] border border-orange-100 dark:border-orange-500/10">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[16px]">
                        This helps creators promote their 
                        <span className="text-zinc-900 dark:text-zinc-200 font-semibold"> African crafts, Asian handmade decor, traditional textiles, and cultural creations</span>, 
                        to more visitors.
                    </p>
                </div>

                {/* Footer Meta */}
                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-6 text-[12px]">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>WCM Promotional Feature</span>
                    </div>
                    <div className="text-zinc-400">
                        Last updated: <span className="text-zinc-600 dark:text-zinc-300 font-bold">22 April 2026</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;