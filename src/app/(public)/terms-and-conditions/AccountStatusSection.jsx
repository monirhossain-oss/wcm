import React from 'react';

const AccountStatusSection = () => {
    const suspensionReasons = [
        "repeated violations",
        "harmful behavior",
        "cultural misappropriation",
        "copyright infringement",
        "harassment of users",
        "dangerous or abusive conduct"
    ];

    return (
        <div className="relative overflow-hidden transition-colors duration-300 rounded-2xl
            /* Light */ bg-white 
            /* Dark */ dark:bg-[#1a1a18] py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2 relative z-10">
                
                {/* Section Header */}
                <span className="block text-[12px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                    Section 11
                </span>
                
                <h2 className="text-[32px] font-black mb-8 leading-tight uppercase
                    /* Light */ text-[#0B1B33] 
                    /* Dark */ dark:text-gray-50">
                    CREATOR ACCOUNT SUSPENSION OR TERMINATION
                </h2>

                <div className="space-y-8">
                    {/* WCM Suspension Logic */}
                    <div className="space-y-6">
                        <p className="text-[17px] font-bold transition-colors
                            /* Light */ text-zinc-800 
                            /* Dark */ dark:text-gray-200">
                            WCM may suspend or terminate creator accounts for:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                            {suspensionReasons.map((reason, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(245,124,0,0.4)] transition-transform group-hover:scale-125" />
                                    <span className="text-[16px] transition-colors
                                        /* Light */ text-zinc-600 group-hover:text-black 
                                        /* Dark */ dark:text-gray-400 dark:group-hover:text-white">
                                        {reason}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Self-Deletion Box - Improved UI for Dark Mode */}
                    <div className="p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                        /* Light */ bg-[#FFF9F2] border-orange-100/50 
                        /* Dark */ dark:bg-[#2a2a26] dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <p className="text-[16px] font-bold transition-colors
                                /* Light */ text-zinc-800 
                                /* Dark */ dark:text-gray-200">
                                Creators may request account deletion at any time.
                            </p>
                        </div>
                        <button className="text-[13px] font-black text-[#F57C00] uppercase tracking-widest hover:text-[#fb8c00] transition-colors flex items-center gap-2 group">
                            Contact Support
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountStatusSection;