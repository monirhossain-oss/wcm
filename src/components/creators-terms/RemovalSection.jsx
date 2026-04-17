import React from 'react';

const RemovalSection = () => {
    const removalReasons = [
        "violates these Terms",
        "receives credible cultural or legal complaints",
        "infringes intellectual property",
        "causes harm to communities or individuals",
        "is misleading, fraudulent, or inappropriate",
        "damages WCM’s reputation or mission"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
            py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 10
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    REMOVAL OF CONTENT
                </h2>

                <div className="space-y-8">
                    {/* Creator Request Box - Enhanced Styling */}
                    <div className="p-6 rounded-2xl border transition-all
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        <p className="text-[17px] leading-relaxed
                            /* Light */ text-zinc-700 
                            /* Dark */ dark:text-gray-300">
                            Creators may request content removal for any reason by emailing:
                            <a href="mailto:contact@worldculturemarketplace.com" 
                               className="block mt-3 font-bold text-[#F57C00] hover:text-[#fb8c00] transition-colors break-words underline decoration-orange-300 underline-offset-4">
                                contact@worldculturemarketplace.com
                            </a>
                        </p>
                    </div>

                    {/* WCM Removal Logic */}
                    <div className="space-y-6">
                        <p className="text-[17px] font-bold transition-colors
                            /* Light */ text-zinc-800 
                            /* Dark */ dark:text-gray-200">
                            WCM may also remove content if it:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                            {removalReasons.map((reason, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)] group-hover:scale-125 transition-transform" />
                                    <span className="text-[16px] transition-colors
                                        /* Light */ text-zinc-600 group-hover:text-black 
                                        /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                        {reason}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Note */}
                    <div className="pt-6 border-t transition-colors
                        /* Light */ border-gray-100 
                        /* Dark */ dark:border-gray-800">
                        <p className="text-[14px] italic
                            /* Light */ text-zinc-400 
                            /* Dark */ dark:text-gray-500">
                            * Removed content may remain temporarily in system backups for legal and security compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemovalSection;