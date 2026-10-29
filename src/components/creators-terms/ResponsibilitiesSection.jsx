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
        <div className="relative overflow-hidden transition-colors duration-300
           py-12 px-6 md:px-12">
            
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 06
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    CREATOR RESPONSIBILITIES
                </h2>

                <div className="space-y-8">
                    {/* Intro Text */}
                    <p className="text-[17px] font-medium transition-colors
                        /* Light */ text-zinc-700 
                        /* Dark */ dark:text-gray-300">
                        To maintain the integrity of our marketplace, Creators must:
                    </p>

                    {/* Responsibilities List with Icons */}
                    <ul className="space-y-5">
                        {responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-1 flex-shrink-0 transition-transform group-hover:scale-110">
                                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <span className="text-[16px] leading-relaxed transition-colors
                                    /* Light */ text-zinc-600 group-hover:text-black 
                                    /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Responsibility Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {/* Legal/Ethical Box */}
                        <div className="p-6 rounded-2xl border transition-all
                            /* Light */ bg-[#FFF9F2] border-orange-100/50 
                            /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                            <p className="text-[14px] leading-relaxed
                                /* Light */ text-zinc-700 
                                /* Dark */ dark:text-gray-300">
                                Creators are responsible for <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">legal, cultural, and ethical compliance</span>.
                            </p>
                        </div>
                        
                        {/* Account Box */}
                        <div className="p-6 rounded-2xl border transition-all
                            /* Light */ bg-zinc-50 border-gray-100 
                            /* Dark */ dark:bg-[#21211e] dark:border-gray-800">
                            <p className="text-[14px] leading-relaxed
                                /* Light */ text-zinc-700 
                                /* Dark */ dark:text-gray-300">
                                Responsibility includes maintaining <span className="font-bold /* Light */ text-black /* Dark */ dark:text-white">account confidentiality</span> and all activities under your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilitiesSection;