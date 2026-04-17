import React from 'react';

const ModificationSection = () => {
    return (
        <div className="relative overflow-hidden transition-colors duration-300
          py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-4 md:pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 15
                </span>
                
                <h2 className="text-[26px] md:text-[32px] font-black mb-8 leading-tight uppercase
                 ">
                    MODIFICATIONS TO THIS AGREEMENT
                </h2>

                <div className="relative">
                    {/* Glassmorphism Effect Card */}
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border shadow-sm relative z-10 transition-all backdrop-blur-sm
                        /* Light */ bg-gradient-to-br from-[#FFF9F2] to-white border-orange-100 
                        /* Dark */ dark:bg-gradient-to-br dark:from-[#2a2a26] dark:to-[#1f1f1d] dark:border-gray-800">
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Update Icon Animated */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-inner border flex items-center justify-center flex-shrink-0 transition-colors
                                /* Light */ bg-white border-orange-50 
                                /* Dark */ dark:bg-[#1a1a18] dark:border-gray-700">
                                <svg className="w-7 h-7 md:w-8 md:h-8 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[17px] md:text-[18px] font-bold leading-relaxed
                                    /* Light */ text-zinc-800 
                                    /* Dark */ dark:text-gray-200">
                                    WCM may update these Creator Terms periodically to reflect platform growth or legal changes.
                                </p>
                                <div className="flex items-center gap-2 text-orange-600 font-black text-[13px] md:text-[14px] uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                                    Changes take effect immediately upon publication
                                </div>
                            </div>
                        </div>

                        {/* Footer Note inside card */}
                        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row sm:justify-between items-center gap-4 transition-colors
                            /* Light */ border-orange-100/50 
                            /* Dark */ dark:border-gray-700">
                            <p className="text-[14px] italic
                                /* Light */ text-zinc-500 
                                /* Dark */ dark:text-gray-500">
                                Please review this page regularly for any revisions.
                            </p>
                            <div className="px-4 py-2 rounded-full border text-[12px] font-black transition-all
                                /* Light */ bg-white border-orange-100 text-gray-400 
                                /* Dark */ dark:bg-[#1a1a18] dark:border-gray-700 dark:text-gray-500">
                                LAST UPDATED: {new Date().toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500 rounded-full blur-[80px] opacity-10 dark:opacity-5 -z-0" />
                </div>
            </div>
        </div>
    );
};

export default ModificationSection;