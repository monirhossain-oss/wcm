import React from 'react';

const GoverningLawSection = () => {
    return (
        <div className="relative overflow-hidden transition-colors duration-300
       py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-4 md:pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 17
                </span>
                
                <h2 className="text-[26px] md:text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    GOVERNING LAW
                </h2>

                <div className="space-y-12">
                    {/* Law Highlight Card */}
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-300 transition-all flex flex-col md:flex-row items-start gap-6
                        ">
                        
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm border flex-shrink-0 transition-colors
                            /* Light */ bg-white border-orange-50 
                            /* Dark */ dark:bg-[#1a1a18] dark:border-gray-300">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-[17px] md:text-[18px] font-bold leading-relaxed
                                /* Light */ text-zinc-800 
                                /* Dark */ dark:text-gray-200">
                                These Terms shall be governed by and construed in accordance with the <span className="text-[#F57C00]">laws of France</span>.
                            </p>
                            <p className="text-[15px] md:text-[16px] leading-relaxed border-l-2 border-orange-200 pl-4
                                /* Light */ text-zinc-600 
                                /* Dark */ dark:text-gray-400 dark:border-orange-500/30">
                                Any disputes shall be subject to the exclusive jurisdiction of the <span className="font-bold /* Light */ text-zinc-900 /* Dark */ dark:text-white">courts of Paris, France</span>, unless otherwise required by applicable law.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Aesthetic Line - The Conclusion */}
                    <div className="flex items-center gap-4 py-8">
                        <div className="h-px flex-grow transition-colors
                            /* Light */ bg-zinc-100 
                            /* Dark */ dark:bg-gray-800" />
                        
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1 h-1 rounded-full bg-orange-400" />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-zinc-300 dark:text-gray-600 uppercase tracking-[0.4em] text-center">
                                End of Agreement
                            </span>
                        </div>

                        <div className="h-px flex-grow transition-colors
                            /* Light */ bg-zinc-100 
                            /* Dark */ dark:bg-gray-800" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoverningLawSection;