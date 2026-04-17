import React from 'react';

const ForceMajeureSection = () => {
    return (
        <div className="relative overflow-hidden bg-white py-12 px-6 md:px-12">
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 14
                </span>
                
                <h2 className="text-[32px] font-black text-[#0B1B33] mb-8 leading-tight uppercase">
                    FORCE MAJEURE
                </h2>

                <div className="space-y-6">
                    {/* Main Content Box */}
                    <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-orange-100/50">
                        <p className="text-[17px] text-zinc-700 leading-relaxed">
                            <span className="font-bold text-black italic">WCM</span> shall not be liable for any failure or delay resulting from events beyond its reasonable control, including:
                        </p>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-50/50 flex flex-col items-center text-center">
                                <span className="text-[14px] font-bold text-gray-900 uppercase tracking-wider mb-1">Technical Failures</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-50/50 flex flex-col items-center text-center">
                                <span className="text-[14px] font-bold text-gray-900 uppercase tracking-wider mb-1">System Outages</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-50/50 flex flex-col items-center text-center">
                                <span className="text-[14px] font-bold text-gray-900 uppercase tracking-wider mb-1">External Events</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[15px] text-zinc-500 italic">
                        * This includes any event beyond the reasonable control of the platform and its operators.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForceMajeureSection;