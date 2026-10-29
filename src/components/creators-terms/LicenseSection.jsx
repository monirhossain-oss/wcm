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
        <div className="relative overflow-hidden transition-colors duration-300 rounded-2xl
            /* Light */ bg-white 
            /* Dark */ dark:bg-[#1a1a18] py-12 px-6 md:px-12">
            
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 05
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    LICENSE GRANTED TO WCM
                </h2>

                <div className="space-y-8">
                    {/* Grant Statement */}
                    <p className="text-[17px] leading-relaxed 
                        /* Light */ text-zinc-700 
                        /* Dark */ dark:text-gray-300">
                        By submitting content, you grant <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">WCM</span> a non-exclusive, worldwide, royalty-free, transferable, and sub-licensable license to:
                    </p>

                    {/* License Grid List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {licenseActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(245,124,0,0.3)]" />
                                <span className="text-[16px] transition-colors
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {action}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Important Notes */}
                    <div className="space-y-4 pt-6">
                        <div className="p-5 rounded-2xl border transition-all
                            /* Light */ bg-[#FFF9F2] border-orange-100/50 
                            /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                            <p className="text-[15px] leading-relaxed
                                /* Light */ text-zinc-800 
                                /* Dark */ dark:text-gray-200">
                                <span className="font-bold text-[#F57C00]">Purpose:</span> This license exists solely to allow WCM to operate the Platform and celebrate cultural heritage.
                            </p>
                        </div>
                        
                        <p className="text-[14px] italic
                            /* Light */ text-zinc-500 
                            /* Dark */ dark:text-gray-500">
                            Creators may request removal of their content at any time (see <span className="text-orange-600 font-bold cursor-pointer hover:underline transition-all">Section 9</span>).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicenseSection;