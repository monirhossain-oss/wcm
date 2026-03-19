import React from 'react';

const TermsAndConditionsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-15 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            {/* Header Section */}
            <div className="mb-16 border-b border-gray-100 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-gray-900 dark:text-white">
                    Terms & <span className="text-[#F57C00]">Conditions</span>
                </h1>
                <p className="text-[#F57C00] font-bold text-lg mb-1 tracking-wide">World Culture Marketplace (WCM)</p>
                <p className="text-sm text-gray-400 dark:text-zinc-500">Last updated: 25 February 2026</p>
            </div>

            <section className="space-y-10 text-[15px] md:text-base leading-relaxed">
                
               {/* 1. INTRODUCTION */}
<div>
    <h2 className="text-xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
        1. INTRODUCTION
    </h2>
    <div className="space-y-2 ml-0"> 
        <p className="text-gray-800 dark:text-gray-200">
            Welcome to World Culture Marketplace (“WCM”, “we”, “us”, “our”). These Terms & 
            Conditions (“Terms”) govern your access to and use of the website 
            <br />
            <a 
                href="https://worldculturemarketplace.com" 
                className="text-blue-600 underline decoration-2 underline-offset-4 font-medium"
            >
                https://worldculturemarketplace.com
            </a>
        </p>

        <p className="text-gray-800 dark:text-gray-200 italic">
            (the “Platform”).
        </p>

        <p className="text-gray-800 dark:text-gray-200">
            By accessing or using the Platform, you agree to be bound by these Terms. 
            If you do not agree, please do not use the Platform.
        </p>

        <p className="text-gray-800 dark:text-gray-200">
            WCM is a cultural discovery and visibility platform intended to share, celebrate, and promote 
            global cultural knowledge, creators, and traditions.
        </p>
    </div>
</div>

{/* 2. Definitions */}
                <div>
                    <h2 className="text-xl font-black mb-2 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 2. Definitions
                    </h2>
                    <div className="space-y-4 ml-11">
                        <p className="italic text-gray-500 dark:text-zinc-500 mb-4">For clarity in this document:</p>
                        <ul className="space-y-3">
                            <li><strong>"Platform"</strong> means the WCM website and all related digital services.</li>
                            <li><strong>"User"</strong> means any person accessing or using the Platform.</li>
                            <li><strong>"Creator"</strong> refers to users who submit cultural content, profiles, or media.</li>
                            <li><strong>"Content"</strong> includes text, images, audio, video, descriptions, links, and any materials uploaded or displayed on the Platform.</li>
                            <li><strong>"Advertiser"</strong> means any user or organization purchasing promotional or visibility services.</li>
                            <li><strong>"Services"</strong> refers to all features provided by WCM, including browsing, cultural content, creator profiles, advertising tools, and platform functionality.</li>
                        </ul>
                    </div>
                </div>

                {/* 3. About WCM */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 3. About WCM
                    </h2>
                    <div className="space-y-6 ml-11">
                        <div className="space-y-3">
                            <p>WCM is a platform designed to:</p>
                            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>Promote cultural diversity and visibility.</li>
                                <li>Share educational, historical, and artistic content.</li>
                                <li>Support creators, storytellers, and cultural advocates.</li>
                                <li>Enable promotional and advertising opportunities.</li>
                            </ul>
                        </div>

                        <p>
                            WCM does not currently provide e-commerce transaction services. The Platform focuses on cultural content, visibility, and external redirection to third-party websites. E-commerce features may be introduced in future versions of the Platform.
                        </p>

                        <p className="text-sm italic text-gray-500 dark:text-zinc-500">
                            WCM does not verify the academic or historical accuracy of every cultural contribution and is not responsible for interpretative differences.
                        </p>
                    </div>
                </div>

                {/* 3. Eligibility & Accounts */}
                <div>
                    <h2 className="text-xl font-black mb-2 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 3. Eligibility & Accounts
                    </h2>
                    <div className="space-y-4 ml-11">
                        <p>
                            You must be at least <strong>16 years old</strong> to use the Platform. You agree to provide accurate information and keep your credentials confidential.
                        </p>
                        <p>
                            WCM enforces strict server-side role management to maintain platform integrity. We may suspend accounts that violate these Terms or engage in cultural misrepresentation.
                        </p>
                    </div>
                </div>

                {/* 3. Monetization & PPC */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 3. Monetization & PPC Logic
                    </h2>
                    <div className="space-y-4 ml-11">
                        <p>Creators purchasing "Boost" or "PPC" services are bound by specific financial protocols:</p>
                        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
                            <li><strong>Currency:</strong> We support EUR and USD. All internal accounting is enforced in <strong>EUR</strong> using immutable FX rates.</li>
                            <li><strong>Revenue:</strong> WCM applies deferred revenue logic based on the duration of the boost or actual click usage.</li>
                            <li><strong>Fraud Control:</strong> We implement duplicate click suppression and rate limiting. Manipulation of clicks results in immediate suspension.</li>
                        </ul>
                    </div>
                </div>

                {/* 4. Intellectual Property */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 4. Intellectual Property
                    </h2>
                    <div className="space-y-4 ml-11">
                        <p>
                            <strong>WCM Rights:</strong> All platform architecture, branding, and original content are the exclusive property of WCM.
                        </p>
                        <p>
                            <strong>User Rights:</strong> Creators retain full ownership of their cultural craftsmanship. By submitting content, you grant WCM a non-exclusive license to host, display, and promote your work.
                        </p>
                    </div>
                </div>

                {/* 5. Liability & Infrastructure */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 5. Stability & Liability
                    </h2>
                    <div className="space-y-4 ml-11">
                        <p>
                            WCM is provided "as is". While we maintain <strong>automated database backups (7–14 days)</strong> and secure HTTPS enforcement, we are not liable for data loss or service interruptions beyond our disaster recovery protocols.
                        </p>
                        <p>
                            Navigation to external third-party links or transactions performed outside WCM is at the user's own risk.
                        </p>
                    </div>
                </div>

                {/* Footer/Contact Info */}
                <div className="pt-16 border-t border-gray-100 dark:border-zinc-800 mt-20">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 ml-11">
                        <div className="space-y-2">
                            <p className="font-black text-xl text-[#F57C00] uppercase tracking-tighter">Contact & Compliance</p>
                            <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs">World Culture Marketplace (WCM)</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">Paris, France | Washington, USA</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Official Email</p>
                            <a 
                                href="mailto:contact@worldculturemarketplace.com" 
                                className="text-gray-900 dark:text-white font-black text-lg hover:text-[#F57C00] transition-colors underline decoration-[#F57C00] decoration-2 underline-offset-8"
                            >
                                contact@worldculturemarketplace.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditionsPage;