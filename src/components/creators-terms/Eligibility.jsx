import React from 'react';

const EligibilitySection = () => {
    const eligibilityCriteria = [
        "be at least 18 years old",
        "have the legal right to submit the content",
        "accept these Terms and the Community Standards",
        "provide accurate, non-misleading cultural information",
        "comply with all applicable laws"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
            py-12 px-6 md:px-12">
            
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 02
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    Eligibility to Submit Content
                </h2>

                <div className="space-y-6">
                    <p className="text-[16px] font-medium
                        /* Light */ text-zinc-600 
                        /* Dark */ dark:text-gray-400">
                        To publish content on WCM, you must:
                    </p>

                    {/* Eligibility List with Custom Bullets */}
                    <ul className="space-y-4">
                        {eligibilityCriteria.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)]" />
                                <span className="text-[17px] leading-relaxed transition-colors
                                    /* Light */ text-zinc-700 group-hover:text-black 
                                    /* Dark */ dark:text-gray-300 dark:group-hover:text-white">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Organization Note */}
                    <div className="mt-8 pt-6 border-t 
                        /* Light */ border-gray-100 
                        /* Dark */ dark:border-gray-800">
                        <p className="text-[16px] italic leading-relaxed
                            /* Light */ text-zinc-500 
                            /* Dark */ dark:text-gray-500">
                            Organizations may contribute through authorized representatives.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilitySection;