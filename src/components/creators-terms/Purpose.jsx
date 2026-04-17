import React from 'react';

const PurposeSection = () => {
    const purposes = [
        { id: "01", text: "what Creators may submit" },
        { id: "02", text: "what rights Creators retain" },
        { id: "03", text: "what license WCM receives" },
        { id: "04", text: "cultural responsibility expectations" },
        { id: "05", text: "content restrictions" },
        { id: "06", text: "conditions for removal or suspension" },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
            <div className="relative">
                {/* Section Header */}
                <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-4">
                    Section 02
                </span>
                <h2 className="text-[26px] font-black text-gray-900 mb-8 leading-tight tracking-tight uppercase">
                    PURPOSE OF THESE TERMS
                </h2>

                <div className="space-y-8">
                    <p className="text-[15px] font-medium text-gray-500 uppercase tracking-wide">
                        The Creator Terms establish:
                    </p>

                    {/* Grid Layout for Purposes (Table of Contents Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {purposes.map((item) => (
                            <div key={item.id} className="flex items-center gap-5 group cursor-pointer">
                                <span className="text-[13px] font-bold text-[#F57C00] w-5">
                                    {item.id}
                                </span>
                                <span className="text-[15px] text-gray-600 group-hover:text-[#F57C00] transition-colors duration-300">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer Quote Style */}
                    <div className="mt-10 pt-8 border-t border-gray-50">
                        <p className="text-[16px] text-gray-700 leading-relaxed italic">
                            "Creators are essential to <span className="font-bold text-gray-900">WCM’s mission</span> of celebrating global culture respectfully and accurately."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurposeSection;