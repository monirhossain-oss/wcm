import React from 'react';

const PromotionBudget = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E] rounded-2xl">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-8">
                    Can creators control their <br />
                    <span className="text-[#F57C00]">promotion budget?</span>
                </h2>

                {/* Main Answer with "Yes" Badge */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                    <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-orange-500 text-white font-bold text-xl shadow-[0_4px_20px_rgba(245,124,0,0.3)]">
                        Yes
                    </div>
                    <p className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                        Creators have <span className="text-[#F57C00]">full control</span> over their promotional features.
                    </p>
                </div>

                {/* Content Details */}
                <div className="space-y-6 max-w-3xl">
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                            Creators can choose whether or not to use promotional features and decide <span className="text-zinc-900 dark:text-zinc-200 font-medium">which listings they want to promote.</span>
                        </p>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                        This allows creators to manage their visibility strategy while showcasing their cultural work to a global audience.
                    </p>
                </div>

                {/* Control Icons/Indicators */}
                <div className="mt-12 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Flexible Strategy
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Full Sovereignty
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionBudget;