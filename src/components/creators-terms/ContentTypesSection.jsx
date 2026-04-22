import React from 'react';

const ContentTypesSection = () => {
    const contentTypes = [
        "cultural descriptions",
        "stories, traditions, and historical information",
        "images, photos, artwork, illustrations",
        "videos or audio (if enabled)",
        "creator bios and external links",
        "written educational content",
        "any materials uploaded to WCM"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300
            py-12 px-6 md:px-12">
            
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 03
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    TYPES OF CONTENT COVERED
                </h2>

                <div className="space-y-6">
                    <p className="text-[16px] font-medium
                        /* Light */ text-zinc-600 
                        /* Dark */ dark:text-gray-400">
                        These Terms apply to:
                    </p>

                    {/* Content Types List with Custom Bullets */}
                    <ul className="space-y-4">
                        {contentTypes.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                {/* Performance optimized dot with subtle glow in dark mode */}
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 dark:shadow-[0_0_8px_rgba(245,124,0,0.5)]" />
                                <span className="text-[17px] leading-relaxed transition-colors
                                    /* Light */ text-zinc-700 group-hover:text-black 
                                    /* Dark */ dark:text-gray-300 dark:group-hover:text-white capitalize">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ContentTypesSection;