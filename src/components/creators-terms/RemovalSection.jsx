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
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 10
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    REMOVAL OF CONTENT
                </h2>

                <div className="space-y-8">
                    {/* Creator Request Box */}
                    <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                        <p className="text-[17px] text-zinc-700 leading-relaxed">
                            Creators may request content removal for any reason by emailing:
                            <a href="mailto:contact@worldculturemarketplace.com" className="block mt-2 font-bold text-[#F57C00] hover:underline">
                                contact@worldculturemarketplace.com
                            </a>
                        </p>
                    </div>

                    {/* WCM Removal Logic */}
                    <div className="space-y-6">
                        <p className="text-[17px] font-medium text-zinc-800">
                            WCM may also remove content if it:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {removalReasons.map((reason, index) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                    <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors">
                                        {reason}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Note */}
                    <p className="text-[14px] text-zinc-400 italic pt-4 border-t border-gray-100">
                        * Removed content may remain temporarily in system backups for legal and security compliance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RemovalSection;