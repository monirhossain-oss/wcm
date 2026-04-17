import React from 'react';

const ResponsibilitiesSection = () => {
    const responsibilities = [
        "ensure they own or control the rights to submit content",
        "represent cultural information truthfully",
        "respect cultural sensitivities, especially sacred traditions",
        "avoid misappropriation or exploitation",
        "avoid defamatory or harmful material",
        "ensure individuals shown in images have granted consent",
        "properly reference sources when possible"
    ];

    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 06
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    CREATOR RESPONSIBILITIES
                </h2>

                <div className="space-y-8">
                    {/* Intro Text */}
                    <p className="text-[17px] font-medium text-zinc-700">
                        To maintain the integrity of our marketplace, Creators must:
                    </p>

                    {/* Responsibilities List with Icons */}
                    <ul className="space-y-4">
                        {responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-1.5 flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <span className="text-[16px] text-zinc-600 leading-relaxed group-hover:text-black transition-colors">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Responsibility Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                            <p className="text-[14px] leading-relaxed text-zinc-700">
                                Creators are responsible for <span className="font-bold text-black">legal, cultural, and ethical compliance</span>.
                            </p>
                        </div>
                        <div className="p-6 bg-zinc-50 rounded-2xl border border-gray-100">
                            <p className="text-[14px] leading-relaxed text-zinc-700">
                                Responsibility includes maintaining <span className="font-bold text-black">account confidentiality</span> and all activities under your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilitiesSection;