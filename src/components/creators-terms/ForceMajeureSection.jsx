import React from 'react';

const ForceMajeureSection = () => {
    return (
        <div className="relative overflow-hidden transition-colors duration-300
         py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-4 md:pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 14
                </span>
                
                <h2 className="text-[26px] md:text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    FORCE MAJEURE
                </h2>

                <div className="space-y-6">
                    {/* Main Content Box */}
                    <div className="p-6 rounded-2xl border transition-all
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        
                        <p className="text-[16px] md:text-[17px] leading-relaxed
                            /* Light */ text-zinc-700 
                            /* Dark */ dark:text-gray-300">
                            <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white italic">WCM</span> shall not be liable for any failure or delay resulting from events beyond its reasonable control, including:
                        </p>
                        
                        {/* Status Cards - Mobile Responsive Grid */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { title: "Technical Failures", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
                                { title: "System Outages", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                                { title: "External Events", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" }
                            ].map((item, index) => (
                                <div key={index} className="transition-all p-4 rounded-xl border flex flex-col items-center text-center gap-3
                                    /* Light */ bg-white shadow-sm border-orange-50/50 
                                    /* Dark */ dark:bg-[#1f1f1d] dark:border-gray-700/50 dark:shadow-none">
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] md:text-[14px] font-bold uppercase tracking-wider
                                        /* Light */ text-gray-900 
                                        /* Dark */ dark:text-gray-100">
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[14px] md:text-[15px] italic transition-colors
                        /* Light */ text-zinc-500 
                        /* Dark */ dark:text-gray-500">
                        * This includes any event beyond the reasonable control of the platform and its operators.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForceMajeureSection;