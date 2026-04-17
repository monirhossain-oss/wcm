import React from 'react';

const LimitationSection = () => {
    const liabilityPoints = [
        "disputes involving creator-submitted content",
        "third-party use or misuse of published content",
        "cultural disagreements or misinterpretation",
        "reputational impact on Creators",
        "damages arising from publication or removal"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
            py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-4 md:pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 13
                </span>
                
                <h2 className="text-[26px] md:text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    LIMITATION OF LIABILITY
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[16px] md:text-[17px] font-medium leading-relaxed 
                        /* Light */ text-zinc-800 
                        /* Dark */ dark:text-gray-300">
                        To the maximum extent allowed by law, <span className="text-[#F57C00] font-bold">WCM</span> is not liable for:
                    </p>

                    {/* Liability Points List - Mobile Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {liabilityPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)] group-hover:scale-125 transition-transform" />
                                <span className="text-[15px] md:text-[16px] leading-relaxed transition-colors
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {point}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Final Risk Statement Box - Mobile Enhanced */}
                    <div className="mt-10 p-6 md:p-8 rounded-2xl border transition-all text-center
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        <p className="text-[16px] md:text-[18px] font-black tracking-widest uppercase
                            /* Light */ text-gray-900 
                            /* Dark */ dark:text-white">
                            Creators publish on WCM at their own risk.
                        </p>
                    </div>

                    {/* Footer Divider Line */}
                    <div className="w-full h-px mt-12 transition-colors
                        /* Light */ bg-gray-100 
                        /* Dark */ dark:bg-gray-800" />
                </div>
            </div>
        </div>
    );
};

export default LimitationSection;