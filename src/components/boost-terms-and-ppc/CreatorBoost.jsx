import React from 'react';

const CreatorBoost = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-10">
                    When should <br />
                    <span className="text-[#F57C00]">creators use Boost?</span>
                </h2>

                {/* Main Content Section */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8 flex items-center gap-2">
                        <span className="w-8 h-px bg-zinc-300 dark:bg-zinc-700"></span>
                        Creators may benefit from boosting their listings when
                    </h3>

                    <div className="space-y-4">
                        {[
                            "Launching new creations",
                            "Promoting cultural collections",
                            "Participating in special events or seasonal promotions",
                            "Increasing exposure for high-value artwork"
                        ].map((text, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(245,124,0,0.5)]" />
                                <span className="text-zinc-700 dark:text-zinc-300 text-[17px] font-medium leading-tight">
                                    {text}
                                 Pancark
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highlighted Closing Statement */}
                <div className="mt-12 p-8 rounded-3xl bg-orange-50/50 dark:bg-orange-500/[0.02] border border-orange-100 dark:border-orange-500/10 backdrop-blur-sm">
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed text-center">
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold">Boosting</span> is a simple way to attract more attention to creations within the marketplace.
                    </p>
                </div>

                {/* Footer Section Meta */}
                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-[12px] text-zinc-400 font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span>Creator Strategy</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>WCM Growth Tools</span>
                </div>
            </div>
        </div>
    );
};

export default CreatorBoost;
