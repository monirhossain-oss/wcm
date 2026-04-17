import React from 'react';

const SponsoredContent = () => {
    const sponsorshipRules = [
        "sponsorship must be clearly disclosed",
        "the content must remain culturally respectful",
        "the promotional nature must be transparent"
    ];

    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 09
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    SPONSORED OR COMMERCIAL CONTENT
                </h2>

                <div className="space-y-8">
                    {/* Intro Statement */}
                    <p className="text-[17px] text-zinc-700 leading-relaxed">
                        If content is created in partnership with a brand or business:
                    </p>

                    {/* Rules List */}
                    <ul className="space-y-4">
                        {sponsorshipRules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <span className="text-[17px] text-zinc-600 group-hover:text-black transition-colors">
                                    {rule}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Violation Alert */}
                    <p className="text-[15px] font-bold text-red-600 italic">
                        * Failure to disclose sponsorship is a violation of these Terms.
                    </p>

                    {/* Promotional Services Highlight (Boost/PPC) */}
                    <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-3">
                            <svg className="w-5 h-5 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-bold text-gray-900 uppercase text-[14px] tracking-wide">Promotional Services</span>
                        </div>
                        <p className="text-[16px] text-zinc-700 leading-relaxed">
                            Creators who use paid promotional services (such as <span className="font-bold text-black">Boost</span> or <span className="font-bold text-black">PPC</span>) are also subject to the <span className="text-orange-600 font-bold cursor-pointer hover:underline">Advertising Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponsoredContent;