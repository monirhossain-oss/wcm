import React from 'react';

const ProhibitedSubmissions = () => {
    const prohibitedItems = [
        "misrepresents cultural origins or meanings",
        "depicts secret or sacred practices without authorization",
        "infringes copyrights or trademarks",
        "exploits communities or identities",
        "promotes discrimination or hate",
        "includes explicit or violent imagery",
        "contains malware or harmful code",
        "is commercial advertising disguised as culture"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300 rounded-2xl
            /* Light */ bg-white 
            /* Dark */ dark:bg-[#1a1a18] py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 08
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    PROHIBITED SUBMISSIONS
                </h2>

                <div className="space-y-8">
                    <p className="text-[17px] font-bold transition-colors
                        /* Light */ text-red-800 
                        /* Dark */ dark:text-red-500/90">
                        Creators may NOT submit content that:
                    </p>

                    {/* Prohibited List with Warning Dots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {prohibitedItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-700 flex-shrink-0 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                <span className="text-[16px] leading-relaxed transition-colors
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Immediate Action Notice - Enhanced for Dark Mode */}
                    <div className="mt-8 p-5 rounded-2xl border transition-all flex items-center gap-5
                        /* Light */ bg-red-50/50 border-red-100 
                        /* Dark */ dark:bg-red-950/20 dark:border-red-900/30">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                            /* Light */ bg-white shadow-sm 
                            /* Dark */ dark:bg-red-900/20">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-[15px] font-bold italic
                            /* Light */ text-red-800 
                            /* Dark */ dark:text-red-500">
                            Such content may be removed immediately without warning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProhibitedSubmissions;