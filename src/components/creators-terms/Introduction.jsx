import React from 'react';

const IntroductionSection = () => (
    <div className="relative overflow-hidden rounded-3xl transition-colors duration-300
        /* Light Mode */ bg-[#FFF9F2] border-orange-100 shadow-sm 
        /* Dark Mode */ dark:bg-[#1a1a18] dark:border-gray-800 p-8 md:p-10 border">
        
        {/* Subtle Decorative Glow - Optimized for Performance */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00] opacity-[0.04] dark:opacity-[0.08] blur-[70px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        
        <div className="relative">
            {/* Section Number Label */}
            <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-4">
                Section 01
            </span>
            
            {/* Title */}
            <h2 className="text-[26px] font-black mb-6 leading-tight tracking-tight
                /* Light */ text-gray-900 
                /* Dark */ dark:text-gray-50 uppercase">
                INTRODUCTION
            </h2>
            
            <div className="space-y-6">
                {/* Main Text Content */}
                <p className="text-[15.5px] leading-relaxed 
                    /* Light */ text-gray-700 
                    /* Dark */ dark:text-gray-300">
                    These Creator Terms (<span className="font-bold text-black dark:text-white">“Terms”</span>) govern the submission of cultural content, images, stories, descriptions, and other materials (<span className="font-bold text-black dark:text-white">“Content”</span>) by creators, researchers, contributors, and cultural organizations (<span className="font-bold text-black dark:text-white">“Creators”, “You”</span>) to <span className="text-[#F57C00] font-bold">World Culture Marketplace (“WCM”, “we”, “us”, “our”)</span>.
                </p>

                {/* Agreement Box */}
                <div className="flex items-start gap-4 p-5 rounded-2xl transition-all
                    /* Light */ bg-white/60 border-orange-100/50 
                    /* Dark */ dark:bg-[#2a2a26] dark:border-gray-700 border">
                    
                    <div className="mt-1 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <p className="text-[15px] font-medium 
                        /* Light */ text-gray-800 
                        /* Dark */ dark:text-gray-200">
                        By submitting or publishing content on the Platform, you accept and agree to these Terms.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default IntroductionSection;