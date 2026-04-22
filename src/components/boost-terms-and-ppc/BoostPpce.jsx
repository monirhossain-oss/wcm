import React from 'react';

const BoostPpce = () => {
    return (
        <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E] rounded-2xl">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Main Heading */}
                <h2 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                    How is Boost different from <br />
                    <span className="text-[#F57C00]">Pay-Per-Click (PPC)?</span>
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12">
                    Both promotional tools help increase visibility, but they work differently.
                </p>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Boosted Listings Column */}
                    <div className="flex flex-col p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-[#F57C00] mb-6 flex items-center gap-2">
                            Boosted Listings
                        </h3>
                        <ul className="space-y-4 flex-grow">
                            {[
                                "fixed promotion fee",
                                "increased visibility for a defined period",
                                "no charge based on clicks",
                                "simple and predictable promotion"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* PPC Column */}
                    <div className="flex flex-col p-8 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                            Pay-Per-Click (PPC)
                        </h3>
                        <ul className="space-y-4 flex-grow">
                            {[
                                "creators pay only when a visitor clicks their listing",
                                "promotion cost depends on engagement",
                                "flexible budget control"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Conclusion Paragraph */}
                <div className="mt-12 p-6 border-l-4 border-orange-500 bg-orange-50/30 dark:bg-orange-500/[0.02]">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        These options give creators different ways to promote their <span className="text-zinc-900 dark:text-zinc-200 font-semibold">cultural art, handmade crafts, and creative works.</span>
                    </p>
                </div>

                {/* Footer Meta */}
                <div className="mt-10 flex items-center gap-4 text-[12px] text-zinc-400 uppercase tracking-widest font-bold">
                    <span>Model Comparison</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <span>WCM Advertising</span>
                </div>
            </div>
        </div>
    );
};

export default BoostPpce;