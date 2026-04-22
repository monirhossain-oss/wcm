import React from 'react';

const GuaranteeSection = () => {
    const noGuarantees = [
        "WCM does not pay Creators for submissions",
        "WCM does not guarantee visibility or engagement",
        "WCM does not guarantee featuring of content",
        "WCM does not guarantee commercial outcomes"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
             py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 12
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    NO GUARANTEE OF VISIBILITY OR COMPENSATION
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[17px] font-bold transition-colors
                        /* Light */ text-zinc-800 
                        /* Dark */ dark:text-gray-200">
                        Unless explicitly agreed in writing:
                    </p>

                    {/* Guarantees List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {noGuarantees.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)] group-hover:scale-125 transition-transform" />
                                <span className="text-[16px] transition-colors leading-relaxed
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Algorithm Highlight Box - Polished for MERN SaaS style */}
                    <div className="mt-8 p-6 rounded-2xl border transition-all flex items-start gap-5
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        <div className="mt-1 flex-shrink-0">
                            <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-[15px] leading-relaxed italic font-medium
                            /* Light */ text-zinc-800 
                            /* Dark */ dark:text-gray-300">
                            Visibility depends on platform algorithms and editorial decisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuaranteeSection;