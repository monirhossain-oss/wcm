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
        <div className="relative overflow-hidden rounded-3xl transition-colors duration-300
            /* Light */ bg-white border-gray-100 shadow-sm 
            /* Dark */ dark:bg-[#1a1a18] dark:border-gray-800 p-8 md:p-10 border">
            
            <div className="relative">
                {/* Section Header */}
                <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-4">
                    Section 02
                </span>
                <h2 className="text-[26px] font-black mb-8 leading-tight tracking-tight uppercase
                    /* Light */ text-gray-900 
                    /* Dark */ dark:text-gray-50">
                    PURPOSE OF THESE TERMS
                </h2>

                <div className="space-y-8">
                    <p className="text-[13px] font-bold uppercase tracking-widest
                        /* Light */ text-gray-400 
                        /* Dark */ dark:text-gray-500">
                        The Creator Terms establish:
                    </p>

                    {/* Grid Layout for Purposes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {purposes.map((item) => (
                            <div key={item.id} className="flex items-center gap-5 group cursor-pointer">
                                <span className="text-[13px] font-black text-[#F57C00] w-6 h-6 flex items-center justify-center rounded-full bg-orange-50 dark:bg-orange-500/10 transition-colors">
                                    {item.id}
                                </span>
                                <span className="text-[15.5px] transition-colors duration-300
                                    /* Light */ text-gray-600 group-hover:text-[#F57C00]
                                    /* Dark */ dark:text-gray-300 dark:group-hover:text-orange-400">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer Quote Style */}
                    <div className="mt-10 pt-8 border-t 
                        /* Light */ border-gray-50 
                        /* Dark */ dark:border-gray-800">
                        <p className="text-[16px] leading-relaxed italic
                            /* Light */ text-gray-700 
                            /* Dark */ dark:text-gray-400">
                            "Creators are essential to <span className="font-bold /* Light */ text-gray-900 /* Dark */ dark:text-gray-100">WCM’s mission</span> of celebrating global culture respectfully and accurately."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurposeSection;