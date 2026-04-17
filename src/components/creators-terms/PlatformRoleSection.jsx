import React from 'react';

const PlatformRoleSection = () => {
    return (
        <div className="relative overflow-hidden transition-colors duration-300
         py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 07
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light Mode */ text-[#0B1B33] 
                    /* Dark Mode */ dark:text-gray-50">
                    EXTERNAL LINKS & PLATFORM ROLE
                </h2>

                <div className="space-y-8">
                    {/* External Links Logic */}
                    <div className="space-y-4">
                        <p className="text-[17px] leading-relaxed 
                            /* Light Mode */ text-zinc-700 
                            /* Dark Mode */ dark:text-gray-300">
                            Creators are solely responsible for any external websites, products, services, or transactions linked through their content.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)]" />
                                <p className="text-[15px] transition-colors
                                    /* Light Mode */ text-zinc-600 
                                    /* Dark Mode */ dark:text-gray-400">
                                    WCM does not control, verify, or guarantee the accuracy, safety, or legality of external websites.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)]" />
                                <p className="text-[15px] transition-colors
                                    /* Light Mode */ text-zinc-600 
                                    /* Dark Mode */ dark:text-gray-400">
                                    Any interaction or engagement with third-party websites is at the user’s own risk.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Role Highlight */}
                    <div className="p-6 rounded-2xl border transition-all
                        /* Light Mode */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark Mode */ dark:bg-[#2a2a26] dark:border-gray-800 space-y-4">
                        <p className="text-[16px] leading-relaxed
                            /* Light Mode */ text-zinc-800 
                            /* Dark Mode */ dark:text-gray-200">
                            <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">Platform Role:</span> WCM operates as a discovery and visibility platform only and does not act as a seller, reseller, or intermediary in transactions.
                        </p>
                        <p className="text-[15px] italic border-t pt-4
                            /* Light Mode */ text-zinc-700 border-orange-100 
                            /* Dark Mode */ dark:text-gray-400 dark:border-gray-700">
                            Creators are solely responsible for complying with applicable tax, legal, and regulatory obligations related to their activities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformRoleSection;