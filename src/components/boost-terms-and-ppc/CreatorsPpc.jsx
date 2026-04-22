import React from 'react';

const CreatorsPpc = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E] rounded-2xl">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                    Should creators use <br />
                    <span className="text-[#F57C00]">Boosted Listings or PPC?</span>
                </h2>

                <p className="text-zinc-700 dark:text-zinc-300 text-xl font-medium mb-12">
                    The best option depends on the creator’s promotional strategy.
                </p>

                {/* Strategy Options */}
                <div className="space-y-6">
                    {/* Option 1: Boosted Listings */}
                    <div className="p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                        <p className="text-zinc-600 dark:text-zinc-400 text-[17px] leading-relaxed">
                            Creators who want <span className="text-zinc-900 dark:text-zinc-200 font-bold">simple promotion with predictable cost</span> often prefer Boosted Listings.
                        </p>
                    </div>

                    {/* Option 2: PPC */}
                    <div className="p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                        <p className="text-zinc-600 dark:text-zinc-400 text-[17px] leading-relaxed">
                            Creators who want <span className="text-zinc-900 dark:text-zinc-200 font-bold">performance-based promotion and flexible budgets</span> may prefer PPC campaigns.
                        </p>
                    </div>
                </div>

                {/* Hybrid Approach Section */}
                <div className="mt-10 p-8 rounded-3xl bg-orange-50/50 dark:bg-orange-500/[0.02] border border-orange-100 dark:border-orange-500/10">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
                            Some creators use <span className="text-[#F57C00] font-bold">both methods together</span> to maximize visibility on the platform.
                        </p>
                    </div>
                </div>

                {/* Meta Tag */}
                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Strategy Guide • WCM</span>
                    <span className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         Active Strategy
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CreatorsPpc;
