import React from 'react';

const SponsoredContent = () => {
    const sponsorshipRules = [
        "sponsorship must be clearly disclosed",
        "the content must remain culturally respectful",
        "the promotional nature must be transparent"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
           py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 09
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    SPONSORED OR COMMERCIAL CONTENT
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[17px] leading-relaxed 
                        /* Light */ text-zinc-700 
                        /* Dark */ dark:text-gray-300">
                        If content is created in partnership with a brand or business:
                    </p>

                    {/* Rules List */}
                    <ul className="space-y-4">
                        {sponsorshipRules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)]" />
                                <span className="text-[17px] transition-colors
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {rule}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Violation Alert */}
                    <p className="text-[15px] font-bold italic transition-colors
                        /* Light */ text-red-700 
                        /* Dark */ dark:text-red-500">
                        * Failure to disclose sponsorship is a violation of these Terms.
                    </p>

                    {/* Promotional Services Highlight (Boost/PPC) */}
                    <div className="p-6 rounded-2xl border transition-all
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg /* Light */ bg-orange-100 /* Dark */ dark:bg-orange-900/30">
                                <svg className="w-5 h-5 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="font-black uppercase text-[14px] tracking-widest
                                /* Light */ text-gray-900 
                                /* Dark */ dark:text-gray-100">
                                Promotional Services
                            </span>
                        </div>

                        <p className="text-[16px] leading-relaxed
                            /* Light */ text-zinc-700 
                            /* Dark */ dark:text-gray-300">
                            Creators who use paid promotional services (such as <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">Boost</span> or <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">PPC</span>) are also subject to the <span className="text-orange-600 font-bold cursor-pointer hover:underline transition-all">Advertising Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponsoredContent;