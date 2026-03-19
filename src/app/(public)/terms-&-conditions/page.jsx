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

              {/* 4. Eligibility */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 4. Eligibility
                    </h2>
                    <div className="space-y-6 ml-11">
                        <div className="space-y-3">
                            <p>You may use the Platform only if:</p>
                            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>You are at least 16 years old, or the minimum required age in your jurisdiction.</li>
                                <li>You have the legal capacity to accept these Terms.</li>
                                <li>You use the Platform in compliance with all applicable laws.</li>
                            </ul>
                        </div>

                        <p>
                            If creating a creator profile, you represent that all submitted information is accurate and lawful.
                        </p>
                    </div>
                </div>
                {/* 5. Account Registration */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 5. Account Registration
                    </h2>
                    <div className="space-y-6 ml-11">
                        <p>Users may create an account to access certain features. You agree to:</p>
                        
                        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
                            <li>Provide accurate and truthful information.</li>
                            <li>Keep login credentials confidential.</li>
                            <li>Notify WCM immediately of unauthorized access.</li>
                            <li>Not share or sell your account.</li>
                        </ul>

                        <p className="font-medium text-gray-900 dark:text-white border-l-2 border-[#F57C00] pl-4">
                            WCM may suspend or terminate accounts that violate these Terms.
                        </p>
                    </div>
                </div>

               {/* 6. Acceptable Use Policy */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 6. Acceptable Use Policy
                    </h2>
                    <div className="space-y-6 ml-11">
                        <p>Users agree <strong>NOT</strong> to:</p>
                        
                        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
                            <li>Use the Platform for illegal, harmful, fraudulent, or abusive purposes.</li>
                            <li>Upload malware, harmful scripts, or malicious files.</li>
                            <li>Harvest or collect personal data from other users.</li>
                            <li>Attempt to hack, disrupt, or reverse-engineer the Platform.</li>
                            <li>Upload culturally offensive or disrespectful content.</li>
                            <li>Impersonate any person, culture, community, or organization.</li>
                            <li>Scrape or copy Platform content for resale or reproduction.</li>
                        </ul>

                        <p className="font-bold text-red-600 dark:text-red-400 border-l-2 border-red-600 pl-4">
                            Violations may result in permanent account termination.
                        </p>
                    </div>
                </div>

                {/* 7. Platform Content */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 7. Platform Content
                    </h2>
                    
                    <div className="ml-11 space-y-8">
                        {/* 7.1 WCM Content */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">
                                7.1 WCM Content
                            </h3>
                            <p>
                                All content created by WCM—including articles, categories, stories, images, branding, and platform architecture—is protected by intellectual property laws.
                            </p>
                            <div className="space-y-3">
                                <p>You may <strong>NOT</strong>:</p>
                                <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-400 font-medium">
                                    <li>Copy</li>
                                    <li>Reproduce</li>
                                    <li>Redistribute</li>
                                    <li>Modify</li>
                                    <li>Publish</li>
                                </ul>
                                <p className="pt-2 border-t border-gray-100 dark:border-zinc-800 inline-block">
                                    WCM content without written approval.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 7.2 User-Generated Content */}
                        <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight ">
                                7.2 User-Generated Content
                            </h3>
                            <p>Creators retain ownership of their submitted content.</p>
                            
                            <div className="space-y-4">
                                <p>
                                    By submitting content, you grant WCM a <span className="font-bold">non-exclusive, worldwide, royalty-free, transferable license</span> to:
                                </p>
                                <ul className=" gap-2 ml-6 text-gray-600 dark:text-gray-400 font-medium list-disc">
                                    <li>Publish</li>
                                    <li>Display</li>
                                    <li>Host</li>
                                    <li>Distribute</li>
                                    <li>Adapt</li>
                                    <li>Promote</li>
                                </ul>
                                <p>your content as part of the Platform’s operations.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <p className="font-bold uppercase text-xs tracking-widest text-[#F57C00]">You represent that:</p>
                                <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>You own the rights to your content.</li>
                                    <li>Your content does not infringe third-party rights.</li>
                                    <li>Your content is culturally respectful and accurate to the best of your knowledge.</li>
                                </ul>
                            </div>

                            <p className="text-sm italic text-gray-500 dark:text-zinc-500">
                                WCM may remove content that violates guidelines or legal requirements.
                            </p>
                        </div>
                {/* 8. Intellectual Property Rights */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 8. Intellectual Property Rights
                    </h2>
                    <div className="space-y-6 ml-11">
                        <p>
                            All trademarks, logos, branding, design elements, and platform architecture are the exclusive property of WCM.
                        </p>
                        
                        <div className="space-y-3">
                            <p>Users may not:</p>
                            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>Use WCM trademarks without permission.</li>
                                <li>Reproduce WCM brand elements.</li>
                                <li>Claim ownership of WCM intellectual property.</li>
                            </ul>
                        </div>

                        <p className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-l-2 border-[#F57C00] text-sm">
                            Creators retain ownership of their content subject to the license granted in Section 7.
                        </p>
                    </div>
                </div>

               {/* 9. Third-Party Links */}
                <div>
                    <h2 className="text-xl font-black mb-6 text-[#F57C00] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F57C00]"></span> 9. Third-Party Links
                    </h2>
                    <div className="space-y-8 ml-11">
                        <div className="space-y-3">
                            <p>WCM may include links to:</p>
                            <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-400">
                                <li>External websites</li>
                                <li>Creator social media</li>
                                <li>Business sites</li>
                                <li>Educational resources</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <p>WCM is not responsible for:</p>
                            <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-400">
                                <li>Third-party privacy practices</li>
                                <li>Content accuracy</li>
                                <li>Transactions performed outside WCM</li>
                                <li>Harm arising from external websites</li>
                            </ul>
                        </div>

                        <p className="font-bold text-gray-900 dark:text-white underline decoration-[#F57C00] underline-offset-4">
                            Users navigate external links at their own risk.
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