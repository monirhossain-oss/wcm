import React from 'react';

const LicenseSection = () => {
    const licenseActions = [
        "display", "reproduce", "publish",
        "distribute", "archive", "translate (if needed)",
        "adapt for formatting or accessibility",
        "promote on WCM-operated channels",
        "feature in cultural or educational initiatives"
    ];

    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 05
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    LICENSE GRANTED TO WCM
                </h2>

                <div className="space-y-8">
                    {/* Grant Statement */}
                    <p className="text-[17px] leading-relaxed text-zinc-700">
                        By submitting content, you grant <span className="font-bold text-black">WCM</span> a non-exclusive, worldwide, royalty-free, transferable, and sub-licensable license to:
                    </p>

                    {/* License Grid List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {licenseActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors">
                                    {action}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Important Notes */}
                    <div className="space-y-4 pt-6">
                        <div className="p-5 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                            <p className="text-[15px] text-zinc-800 leading-relaxed">
                                <span className="font-bold">Purpose:</span> This license exists solely to allow WCM to operate the Platform and celebrate cultural heritage.
                            </p>
                        </div>
                        
                        <p className="text-[14px] text-zinc-500 italic">
                            Creators may request removal of their content at any time (see <span className="text-orange-600 font-bold cursor-pointer hover:underline">Section 9</span>).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicenseSection;