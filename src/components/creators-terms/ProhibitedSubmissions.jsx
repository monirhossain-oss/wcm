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
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 08
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    PROHIBITED SUBMISSIONS
                </h2>

                <div className="space-y-8">
                    <p className="text-[17px] font-medium text-red-600/80">
                        Creators may NOT submit content that:
                    </p>

                    {/* Prohibited List with Warning Dots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {prohibitedItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 group-hover:bg-red-600 transition-colors" />
                                <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors leading-relaxed">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Immediate Action Notice */}
                    <div className="mt-8 p-5 bg-red-50 rounded-2xl border border-red-100/50 flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-[15px] text-red-800 font-semibold italic">
                            Such content may be removed immediately without warning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProhibitedSubmissions;