import React from 'react';

const ContactSection = () => {
    const locations = [
        { city: "Paris", country: "France", flag: "🇫🇷" },
        { city: "Washington", country: "USA", flag: "🇺🇸" }
    ];

    return (
        // আপনার দেওয়া ডার্ক গ্র্যাডিয়েন্ট ব্যাকগ্রাউন্ড বজায় রাখা হয়েছে
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1a1a18] dark:to-[#111110] border border-gray-700 dark:border-gray-800 py-12 px-6 md:px-12">
            
            {/* Signature Left Border Accent */}
            <div className="max-w-4xl mx-auto border-l-2 border-orange-400 pl-8 py-2">
                
                {/* Section Header */}
                <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#F57C00] mb-3">
                    Section 16
                </span>
                
                {/* Section Title with Dark Blue color - এটি ডার্ক মোডে ফুটে উঠছিল না */}
                {/* এটিকে আমরা টেক্সট বাটন স্টাইলে বা লাইট গ্রে কালার দিতে পারি */}
                <h2 className="text-[32px] font-black text-gray-50 mb-8 leading-tight uppercase">
                    CONTACT INFORMATION
                </h2>

                <div className="space-y-10">
                    {/* Paragraph Text এর মতো লাইট গ্রে করা হয়েছে */}
                    <p className="text-[17px] text-gray-300 leading-relaxed">
                        For questions, concerns, or removal requests regarding these terms, please reach out to the <span className="font-bold text-white">World Culture Marketplace (WCM)</span> team.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Card with light background */}
                        {/* এটিকে ডার্ক গ্রাউন্ডে ফুটে তোলার জন্য আমরা একটু ডার্ক/নিউট্রাল কালার ব্যবহার করতে পারি */}
                        <a 
                            href="mailto:contact@worldculturemarketplace.com"
                            className="p-6 bg-[#1a1a18] rounded-2xl border border-gray-700 hover:border-orange-500 transition-all group"
                        >
                            {/* Orange text with tracking */}
                            <span className="text-[12px] font-bold text-orange-500 uppercase tracking-widest block mb-2">
                                Official Email
                            </span>
                            {/* Dynamic text color on hover */}
                            <span className="text-[18px] font-bold text-gray-100 break-words group-hover:text-white">
                                contact@worldculturemarketplace.com
                            </span>
                        </a>

                        {/* Locations Card with neutral background */}
                        <div className="p-6 bg-[#1a1a18] rounded-2xl border border-gray-700">
                            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest block mb-4">
                                Business Locations
                            </span>
                            {/* Location tags resembling status */}
                            <div className="flex flex-wrap gap-4">
                                {locations.map((loc, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-[#2a2a26] px-4 py-2 rounded-full border border-gray-600 shadow-sm">
                                        <span>{loc.flag}</span>
                                        <span className="text-[14px] font-semibold text-gray-100">
                                            {loc.city}, {loc.country}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Final Footer Note with subtle colors */}
                    <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[13px] text-gray-500">
                            © {new Date().getFullYear()} World Culture Marketplace. All rights reserved.
                        </p>
                        {/* WCM Branding Subtitle */}
                        <p className="text-[13px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                            Global Heritage • Digital Discovery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;