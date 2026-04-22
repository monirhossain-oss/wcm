import React from 'react';

const BoostPricing = () => {
    const pricingData = [
        {
            type: "Starter Boost",
            price: "€12",
            duration: "7 days",
            placement: "boosted search + category pages",
            highlight: false
        },
        {
            type: "Standard Boost",
            price: "€29",
            duration: "14 days",
            placement: "search + category + explore sections",
            highlight: true
        },
        {
            type: "Premium Boost",
            price: "€79",
            duration: "30 days",
            placement: "homepage + search + featured collections",
            highlight: false
        }
    ];

    return (
        <div className="relative overflow-hidden border-b rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E] rounded-2xl">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
                {/* Heading */}
                <div className="mb-12">
                    <h1 className="text-[40px] md:text-[45px] leading-[1.1] font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                        Boost <span className="text-[#F57C00]">Pricing Table</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Choose the right boost plan for your cultural creations.</p>
                </div>

                {/* Pricing Table (Desktop) */}
                <div className="hidden md:block overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                <th className="p-6 text-sm font-bold uppercase tracking-wider text-zinc-500">Boost Type</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-wider text-zinc-500">Price</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-wider text-zinc-500">Duration</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-wider text-zinc-500">Placement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {pricingData.map((plan, index) => (
                                <tr key={index} className={`hover:bg-orange-500/[0.02] transition-colors ${plan.highlight ? 'bg-orange-500/[0.03]' : ''}`}>
                                    <td className="p-6 font-bold text-zinc-900 dark:text-white">{plan.type}</td>
                                    <td className="p-6 font-black text-[#F57C00] text-xl">{plan.price}</td>
                                    <td className="p-6 text-zinc-600 dark:text-zinc-400 font-medium">{plan.duration}</td>
                                    <td className="p-6 text-zinc-600 dark:text-zinc-400 text-sm italic">{plan.placement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Pricing Cards */}
                <div className="grid grid-cols-1 gap-6 md:hidden">
                    {pricingData.map((plan, index) => (
                        <div key={index} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-xl text-zinc-900 dark:text-white">{plan.type}</h3>
                                <span className="text-2xl font-black text-[#F57C00]">{plan.price}</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Duration:</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 font-bold">{plan.duration}</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <span className="text-zinc-500 block mb-1">Placement:</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 italic">{plan.placement}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Meta */}
                <div className="mt-10 flex items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Official WCM Pricing • 2026
                </div>
            </div>
        </div>
    );
};

export default BoostPricing;