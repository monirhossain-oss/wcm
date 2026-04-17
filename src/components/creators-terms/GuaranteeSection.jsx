import React from 'react';

const GuaranteeSection = () => {
    const noGuarantees = [
        "WCM does not pay Creators for submissions",
        "WCM does not guarantee visibility or engagement",
        "WCM does not guarantee featuring of content",
        "WCM does not guarantee commercial outcomes"
    ];

    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 12
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    NO GUARANTEE OF VISIBILITY OR COMPENSATION
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[17px] font-bold text-zinc-800">
                        Unless explicitly agreed in writing:
                    </p>

                    {/* Guarantees List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {noGuarantees.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors leading-relaxed">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Algorithm Highlight Box */}
                    <div className="mt-8 p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50 flex items-start gap-4">
                        <div className="mt-1">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[15px] text-zinc-800 leading-relaxed italic font-medium">
                            Visibility depends on platform algorithms and editorial decisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuaranteeSection;