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
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 03
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    TYPES OF CONTENT COVERED
                </h2>

                <div className="space-y-6">
                    <p className="text-[16px] text-zinc-600 font-medium">
                        These Terms apply to:
                    </p>

                    {/* Content Types List with Custom Bullets */}
                    <ul className="space-y-4">
                        {contentTypes.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <span className="text-[17px] text-zinc-700 leading-relaxed group-hover:text-black transition-colors">
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