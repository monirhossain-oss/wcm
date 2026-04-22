import React from 'react';

const BoostListing = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Background Glow Effect */}
            {/* <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" /> */}

            <div className="relative max-w-4xl mx-auto px-6 py-12">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-10">
                    Why use <br />
                    <span className="text-[#F57C00]">Boosted Listings?</span>
                </h2>

                {/* Section 1: Help Creators */}
                <div className="mb-14">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-zinc-300 dark:bg-zinc-700"></span>
                        Boosted Listings help creators
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Increase visibility for new products",
                            "Reach more potential buyers",
                            "Highlight seasonal or featured creations",
                            "Promote unique cultural artwork"
                        ].map((text, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                                <div className="p-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Often used for */}
                <div className="p-8 rounded-3xl bg-zinc-900/[0.02] dark:bg-zinc-100/[0.01] border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                        Creators often use boosts to promote:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {[
                            "New cultural collections",
                            "Limited edition crafts",
                            "Traditional textile creations",
                            "Signature artwork pieces"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                <span className="text-[#F57C00]">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer Meta */}
                <div className="mt-12 flex items-center gap-4 text-[12px] text-zinc-400">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Marketplace Growth
                    </span>
                    <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-800" />
                    <span>WCM Creator Success</span>
                </div>
            </div>
        </div>
    );
};

export default BoostListing;
