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
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 13
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    LIMITATION OF LIABILITY
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[17px] font-medium text-zinc-800 leading-relaxed">
                        To the maximum extent allowed by law, <span className="text-[#F57C00] font-bold">WCM</span> is not liable for:
                    </p>

                   {/* Liability Points List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
    {liabilityPoints.map((point, index) => ( // এখানে point ব্যবহার করা হয়েছে
        <div key={index} className="flex items-start gap-4 group">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors leading-relaxed">
                {point} {/* এখানেও point হবে, item না */}
            </span>
        </div>
    ))}
</div>

                    {/* Final Risk Statement */}
                    <div className="mt-10 p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                        <p className="text-[18px] text-gray-900 font-bold text-center tracking-wide uppercase">
                            Creators publish on WCM at their own risk.
                        </p>
                    </div>

                    {/* Footer Divider Line */}
                    <div className="w-full h-px bg-gray-100 mt-12" />
                </div>
            </div>
        </div>
    );
};

export default LimitationSection;