import React from 'react';

const PlatformRoleSection = () => {
    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 07
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    EXTERNAL LINKS & PLATFORM ROLE
                </h2>

                <div className="space-y-8">
                    {/* External Links Logic */}
                    <div className="space-y-4">
                        <p className="text-[17px] text-zinc-700 leading-relaxed">
                            Creators are solely responsible for any external websites, products, services, or transactions linked through their content.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <p className="text-[15px] text-zinc-600">
                                    WCM does not control, verify, or guarantee the accuracy, safety, or legality of external websites.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <p className="text-[15px] text-zinc-600">
                                    Any interaction or engagement with third-party websites is at the user’s own risk.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Role Highlight */}
                    <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50 space-y-4">
                        <p className="text-[16px] text-zinc-800 leading-relaxed">
                            <span className="font-bold text-black">Platform Role:</span> WCM operates as a discovery and visibility platform only and does not act as a seller, reseller, or intermediary in transactions.
                        </p>
                        <p className="text-[15px] text-zinc-700 italic border-t border-orange-100 pt-4">
                            Creators are solely responsible for complying with applicable tax, legal, and regulatory obligations related to their activities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformRoleSection;