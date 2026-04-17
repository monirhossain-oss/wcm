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
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 11
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    CREATOR ACCOUNT SUSPENSION OR TERMINATION
                </h2>

                <div className="space-y-8">
                    {/* WCM Suspension Logic */}
                    <div className="space-y-6">
                        <p className="text-[17px] font-medium text-zinc-800">
                            WCM may suspend or terminate creator accounts for:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {suspensionReasons.map((reason, index) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                    <span className="text-[16px] text-zinc-600 group-hover:text-black transition-colors">
                                        {reason}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Self-Deletion Box */}
                    <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50 flex items-center justify-between">
                        <p className="text-[16px] text-zinc-800 font-medium">
                            Creators may request account deletion at any time.
                        </p>
                        <button className="text-[13px] font-bold text-[#F57C00] uppercase tracking-wider hover:underline">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountStatusSection;