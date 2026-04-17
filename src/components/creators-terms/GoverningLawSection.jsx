import React from 'react';

const GoverningLawSection = () => {
    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 17
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    GOVERNING LAW
                </h2>

                <div className="space-y-8">
                    {/* Law Highlight Card */}
                    <div className="p-8 bg-[#FFF9F2] rounded-[2rem] border border-orange-100 flex flex-col md:flex-row items-start gap-6">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-50 flex-shrink-0">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-[18px] text-zinc-800 leading-relaxed font-medium">
                                These Terms shall be governed by and construed in accordance with the <span className="text-black font-bold">laws of France</span>.
                            </p>
                            <p className="text-[16px] text-zinc-600 leading-relaxed border-l-2 border-orange-200 pl-4">
                                Any disputes shall be subject to the exclusive jurisdiction of the <span className="font-semibold text-zinc-900">courts of Paris, France</span>, unless otherwise required by applicable law.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Aesthetic Line */}
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-zinc-100 flex-grow" />
                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em]">End of Agreement</span>
                        <div className="h-px bg-zinc-100 flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoverningLawSection;