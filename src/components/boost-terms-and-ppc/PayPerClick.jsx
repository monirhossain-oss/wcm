import React from 'react';

const PayPerClick = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E] rounded-2xl">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[35px] md:text-[40px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-8">
                    What is Py-Per-Click (PPC)a <br />
                    <span className="text-[#F57C00]">Py-Per-Click (PPC)a promotion on World Culture Marketplace?</span>
                </h2>

                {/* Core Concept Description */}
                <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl mb-12">
                    <p>
                        Pay-Per-Click (PPC) is an <span className="font-semibold text-zinc-900 dark:text-zinc-200">optional promotional feature</span> that allows creators to increase the visibility of their cultural artwork, handmade crafts, or creative products on World Culture Marketplace.
                    </p>
                    <p>
                        With PPC promotion, creators <span className="text-zinc-900 dark:text-zinc-200 font-medium border-b-2 border-orange-500/30">only pay when a visitor clicks</span> on their promoted listing. This model allows creators to promote their creations while controlling their promotional budget.
                    </p>
                </div>

                {/* Placement Areas */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-zinc-300 dark:bg-zinc-700"></span>
                        PPC listings may appear in areas such as
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            "Promoted search results",
                            "Featured sections of the marketplace",
                            "Curated pages"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm text-center">
                                <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Engagement Note */}
                <div className="mt-12 p-6 rounded-2xl bg-orange-50/50 dark:bg-orange-500/[0.02] border border-orange-100 dark:border-orange-500/10">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[16px]">
                        This system helps creators gain more exposure for their cultural products while 
                        <span className="text-zinc-900 dark:text-zinc-200 font-semibold italic"> ensuring that promotional costs are tied to actual user engagement.</span>
                    </p>
                </div>

                {/* Meta Info */}
                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>WCM Advertising Model</span>
                    <span className="text-zinc-300 dark:text-zinc-700">Effective: 2026</span>
                </div>
            </div>
        </div>
    );
};

export default PayPerClick;