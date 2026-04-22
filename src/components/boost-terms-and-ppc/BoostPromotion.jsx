import React from 'react';

const BoostPromotion = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-8">
                    How does <br />
                    <span className="text-[#F57C00]">Boost promotion work?</span>
                </h2>

                {/* Core Concept */}
                <div className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
                    <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-medium">
                        Boost promotion works through a <span className="text-[#F57C00]">fixed promotional placement</span> rather than a pay-per-click model.
                    </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                        <span className="w-8 h-px bg-zinc-300 dark:bg-zinc-700"></span>
                        The process typically works as follows
                    </h3>

                    <div className="grid gap-6">
                        {[
                            "A creator selects a listing they want to promote.",
                            "The creator activates the Boost option.",
                            "The listing receives increased visibility on the platform.",
                            "The promotion remains active for a defined period or campaign duration."
                        ].map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center text-[#F57C00] font-bold text-sm border border-orange-500/20">
                                    {idx + 1}
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-400 text-[17px] pt-1 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conclusion/Summary */}
                <div className="mt-16 p-8 rounded-3xl border border-orange-100 dark:border-orange-500/10 bg-orange-50/30 dark:bg-orange-500/[0.01]">
                    <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed text-center italic">
                        "Boosted listings are clearly designed to help creators gain more exposure within the marketplace environment."
                    </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-10 flex items-center gap-3 text-[12px] font-medium text-zinc-400">
                    <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">Fixed Placement Model</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <span>WCM Creator Tools</span>
                </div>
            </div>
        </div>
    );
};

export default BoostPromotion;