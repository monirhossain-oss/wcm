import React from 'react';

const OwnershipSection = () => {
    const ownershipList = [
        "copyrights",
        "intellectual property rights",
        "authorship"
    ];

    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Minimalist Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 04
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    OWNERSHIP OF CONTENT
                </h2>

                <div className="space-y-8">
                    {/* Sub-heading 4.1 */}
                    <div>
                        <h3 className="text-[20px] font-bold text-gray-900 mb-4">
                            4.1 You Retain Ownership
                        </h3>
                        <p className="text-[17px] text-zinc-600 leading-relaxed mb-6">
                            Creators maintain full ownership of all their submitted content, including:
                        </p>

                        {/* Ownership List */}
                        <ul className="space-y-4">
                            {ownershipList.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                    <span className="text-[17px] text-zinc-700 capitalize group-hover:text-black transition-colors">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Final Statement Highlight */}
                    <div className="mt-8 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <p className="text-[16px] text-gray-800 font-semibold flex items-center gap-3">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            This Agreement does not transfer ownership to WCM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnershipSection;