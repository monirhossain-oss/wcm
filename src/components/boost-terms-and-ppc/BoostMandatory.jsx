import React from 'react';

const BoostMandatory = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-8">
                    Is Boost mandatory to sell on <br />
                    <span className="text-[#F57C00]">World Culture Marketplace?</span>
                </h2>

                {/* Primary Answer Block */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                        <span className="text-xl font-bold text-zinc-900 dark:text-white font-mono">No.</span>
                    </div>
                    <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                        Boosting listings is <span className="text-[#F57C00]">completely optional.</span>
                    </p>
                </div>

                {/* Detailed Explanation */}
                <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl">
                    <p>
                        Creators can publish and showcase their cultural creations on the platform <span className="font-semibold text-zinc-900 dark:text-zinc-200">without using promotional tools.</span>
                    </p>
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
                        <p>
                            Boost simply provides an <span className="italic">additional option</span> for creators who want to increase visibility.
                        </p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-12 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Free to list
                    </div>
                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Optional Boost
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-10 text-[11px] uppercase tracking-tighter text-zinc-400 font-bold">
                    WCM Creator Terms • 2026 Edition
                </div>
            </div>
        </div>
    );
};

export default BoostMandatory;