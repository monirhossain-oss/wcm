import React from 'react';

const ModificationSection = () => {
    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 15
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    MODIFICATIONS TO THIS AGREEMENT
                </h2>

                <div className="relative">
                    {/* Glassmorphism Effect Card */}
                    <div className="p-8 bg-gradient-to-br from-[#FFF9F2] to-white rounded-[2rem] border border-orange-100 shadow-sm relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Update Icon Animated */}
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-inner border border-orange-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-8 h-8 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[18px] text-zinc-800 leading-relaxed font-medium">
                                    WCM may update these Creator Terms periodically to reflect platform growth or legal changes.
                                </p>
                                <div className="flex items-center gap-2 text-orange-600 font-bold text-[14px] uppercase tracking-tighter">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                                    Changes take effect immediately upon publication
                                </div>
                            </div>
                        </div>

                        {/* Footer Note inside card */}
                        <div className="mt-8 pt-6 border-t border-orange-100/50 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                            <p className="text-[14px] text-zinc-500">
                                Please review this page regularly for any revisions.
                            </p>
                            <div className="px-4 py-2 bg-white rounded-full border border-orange-100 text-[12px] font-bold text-gray-400">
                                LAST UPDATED: {new Date().toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-50 rounded-full blur-3xl opacity-50 -z-0" />
                </div>
            </div>
        </div>
    );
};

export default ModificationSection;