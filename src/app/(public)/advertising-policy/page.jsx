import React from 'react';
import Hero from '@/components/Advertising/Hero';
import TableOfContents from '@/components/Advertising/TableOfContents';
import ContactSection from '@/components/Advertising/ContactSection';
import { PolicySection } from '@/components/Advertising/PolicySection';
import { PolicyCard } from '@/components/Advertising/PolicyCard';
import { Ul, Divider, Sub } from '@/components/Advertising/SharedComponents';

const AdvertisingPolicyPage = () => {
    const toc = [
        'Scope of Advertising Services', 'Advertiser Eligibility', 'Advertising Content Requirements',
        'Approval & Review Process', 'Fees, Payments & Billing', 'Ad Delivery, Performance & Limitations',
        'Ad Placement & Visibility Logic', 'Sponsored Content Rules', 'Intellectual Property Rights',
        'Prohibited Practices', 'Termination or Removal of Ads', 'Limitation of Liability',
        'No Exclusivity', 'Indemnification', 'Modifications', 'Contact Information', 'Governing Law'
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0C0C0B]">
            <Hero />

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">

                {/* ── INTRO ── */}
                <div className="bg-orange-50 dark:bg-orange-500/[0.07] border border-orange-100 dark:border-orange-500/20 rounded-2xl p-6 text-[14.5px] leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
                    <p>
                        These Advertising & Sponsored Content Rules <strong className="text-gray-900 dark:text-white">("Advertising Terms")</strong> govern
                        the purchase, submission, display, and management of advertising and paid promotional content{' '}
                        <strong className="text-gray-900 dark:text-white">("Ads")</strong> on the World Culture Marketplace platform{' '}
                        <strong className="text-gray-900 dark:text-white">("WCM", "we", "our")</strong>.
                    </p>
                    <p>
                        Advertisers <strong className="text-gray-900 dark:text-white">("You", "Advertiser", "Client")</strong> must comply with these Terms as well as:
                    </p>
                    <Ul items={[
                        'the WCM Terms & Conditions',
                        'the Privacy Policy',
                        'the Community Standards',
                    ]} />
                    <p className="pt-1 text-[13.5px] text-gray-500 dark:text-gray-500 italic">
                        By submitting or purchasing advertising on WCM, you agree to all terms below.
                    </p>
                </div>

                <TableOfContents toc={toc} />

                <Divider />

                {/* 1. Scope */}
                <PolicySection number="Section 01" title="Scope of Advertising Services">
                    <p>WCM offers several types of promotional services, including but not limited to:</p>
                    <Ul items={[
                        'Banner advertisements', 'Sponsored cultural articles',
                        'Featured placement blocks', 'Boosted visibility listings (“Boost”)',
                        'Pay-per-click (PPC) campaigns', 'Cultural brand visibility programs'
                    ]} />
                </PolicySection>

                {/* 2. Eligibility */}
                <PolicySection number="Section 02" title="Advertiser Eligibility">
                    <p>Advertisers must:</p>
                    <Ul items={[
                        'Be at least 18 years old',
                        'Legally represent the brand or content being advertised',
                        'Provide accurate billing and contact information',
                        'Comply with cultural respect, intellectual property, and applicable advertising laws'
                    ]} />
                    <p>
                        WCM reserves the right to accept or refuse any advertiser or campaign at its sole discretion.
                    </p>
                </PolicySection>

                <PolicySection number="Section 03" title="Advertising Content Requirements">
                    <div className="space-y-6">
                        {/* General Requirements */}
                        <div>
                            <p className="mb-3">Advertisers must ensure that all advertising materials:</p>
                            <Ul items={[
                                'Are accurate and not misleading',
                                'Respect cultural groups, traditions, and identities',
                                'Do not exploit, misrepresent, or distort cultural heritage',
                                'Comply with all applicable laws and regulations',
                                'Do not infringe copyright, trademark, or other intellectual property rights',
                                'Are technically safe and free from malicious elements'
                            ]} />
                        </div>

                        {/* Prohibited Content Sub-section */}
                        <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl p-5 mt-6">
                            <h4 className="text-[14px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Prohibited content includes (but is not limited to):
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <Ul items={[
                                    'Misleading health or financial claims',
                                    'Culturally disrespectful or appropriative imagery',
                                    'Counterfeit or illegal goods',
                                    'Explicit or adult content',
                                    'Unapproved political advertising',
                                    'Discriminatory or harmful content',
                                    'Unlicensed sale of culturally restricted artifacts'
                                ]} />
                            </div>
                        </div>

                        <p className="text-[13px] italic text-gray-500 dark:text-gray-500 mt-4 border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                            WCM reserves the right to reject, modify, or remove any content at its discretion.
                        </p>
                    </div>
                </PolicySection>

                <PolicySection number="Section 04" title="Approval & Review Process">
                    <div className="space-y-6">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                            All advertising content is subject to review and approval by the WCM team.
                        </p>

                        <div className="mt-4">
                            <h4 className="text-[13px] font-black uppercase tracking-widest text-[#F57C00] mb-3">
                                WCM may reject or remove advertisements that:
                            </h4>
                            <Ul items={[
                                'Violate these Advertising Terms',
                                'Violate cultural sensitivity principles',
                                'Contain misleading or harmful claims',
                                'Harm the reputation of WCM or represented communities',
                                'Contain broken links or unsafe technical elements'
                            ]} />
                        </div>

                        <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl p-5">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-[14px] text-blue-800 dark:text-blue-300 leading-relaxed">
                                    <strong>Note:</strong> WCM reserves the right to adjust formatting, layout, or placement of any approved advertisement for technical or design reasons to ensure a seamless user experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </PolicySection>

                <PolicySection number="Section 05" title="Fees, Payments & Billing">
                    <div className="space-y-10">

                        {/* 5.1 Payment Terms */}
                        <Sub label="5.1 — Payment Terms">
                            <p className="mb-3">Advertisers agree that:</p>
                            <Ul items={[
                                'Fees must be paid in advance unless otherwise agreed in writing',
                                'All payments for advertising services, including Boost and PPC, are final and non-refundable, except where required by applicable law',
                                'Invoices must be paid within the stated timeframe provided during the checkout process'
                            ]} />
                        </Sub>

                        {/* 5.2 PPC & Boosted Visibility */}
                        <Sub label="5.2 — PPC & Boosted Visibility">
                            <p className="mb-3">For exposure-based services such as Pay-Per-Click (PPC) and Boosted Listings:</p>
                            <Ul items={[
                                'Charges may apply per click, impression, or duration depending on the selected plan',
                                'Click tracking is based on WCM’s internal measurement systems',
                                'WCM implements reasonable measures to detect invalid or fraudulent activity but does not guarantee complete prevention',
                                'Reported metrics (clicks, impressions) may be subject to verification and adjustment',
                                'Unused credits may expire according to the applicable plan terms'
                            ]} />

                            {/* Warning/Disclaimer Box */}
                            <div className="mt-5 bg-orange-50 dark:bg-[#F57C00]/5 border-l-4 border-[#F57C00] p-5 rounded-r-xl">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 text-[#F57C00]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-[13.5px] leading-relaxed text-gray-700 dark:text-gray-300">
                                        <p className="font-bold text-gray-900 dark:text-white mb-1">Important Disclaimer:</p>
                                        Boosted visibility services provide increased exposure only and do not guarantee specific results, including views, clicks, or sales. Visibility, traffic, and performance are not guaranteed.
                                    </div>
                                </div>
                            </div>
                        </Sub>

                        {/* 5.3 Non-Payment */}
                        <Sub label="5.3 — Non-Payment">
                            <p className="mb-3">WCM may suspend or remove advertising services immediately in the event of:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-3 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[14px] font-medium text-red-700 dark:text-red-400">Late payments</span>
                                </div>
                                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-3 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[14px] font-medium text-red-700 dark:text-red-400">Failed transactions</span>
                                </div>
                            </div>
                        </Sub>
                    </div>
                </PolicySection>

                <div className="space-y-16">
                    {/* Section 06 — Full Content Cover */}
                    <PolicySection number="Section 06" title="Ad Delivery, Performance & Limitations">
                        <div className="space-y-5">
                            <p className="font-medium text-gray-800 dark:text-gray-200">Advertisers acknowledge that:</p>
                            <Ul items={[
                                'WCM does not guarantee traffic, sales, leads, or conversions',
                                'Visibility may vary depending on user behavior and platform dynamics',
                                'System maintenance, outages, or technical issues may impact delivery',
                                'WCM shall not be responsible for fluctuations in performance',
                                'WCM is a visibility and discovery platform, not a sales platform',
                                'Advertisers remain solely responsible for the performance and outcomes of their external websites or services'
                            ]} />
                        </div>
                    </PolicySection>

                    {/* Section 06B — Full Content Cover */}
                    <PolicySection number="Section 06B" title="Ad Placement & Visibility Logic">
                        <div className="space-y-6">
                            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                                WCM operates a hybrid visibility model combining organic curation and paid promotion.
                            </p>

                            <div className="space-y-4">
                                <p className="text-[14px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight">Advertisers acknowledge that:</p>
                                <Ul items={[
                                    'Paid placements (Boost, PPC, Featured listings) may appear alongside organic content',
                                    'WCM does not guarantee exclusive placement or category dominance',
                                    'Competing creators or advertisers may appear in the same sections'
                                ]} />
                            </div>

                            {/* Placement Factors Grid */}
                            <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl p-5">
                                <h4 className="text-[13px] font-black uppercase tracking-wider text-[#F57C00] mb-4">
                                    Placement is determined by multiple factors including:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {[
                                        { label: 'Paid promotion settings', desc: 'Your bid and campaign configuration' },
                                        { label: 'Editorial curation', desc: 'Hand-picked selections by WCM team' },
                                        { label: 'User engagement', desc: 'How the community interacts with content' },
                                        { label: 'Platform algorithms', desc: 'Automated relevancy and discovery logic' }
                                    ].map((factor, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#F57C00] mt-2 flex-shrink-0" />
                                            <div>
                                                <p className="text-[14px] font-bold text-gray-800 dark:text-gray-200">{factor.label}</p>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-500">{factor.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preserving Goals */}
                            <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-3 text-center sm:text-left">
                                    WCM reserves the right to organize, rank, and display content to preserve:
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    {['Platform balance', 'User experience', 'Cultural integrity'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-full text-[12px] font-bold text-gray-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PolicySection>
                </div>
                <PolicySection number="Section 07" title="Sponsored Content Rules">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                Sponsored content must:
                            </p>
                            <Ul items={[
                                'Be clearly labeled as “Sponsored”',
                                'Comply with Community Standards',
                                'Respect cultural sensitivities',
                                'Avoid misleading or false messaging'
                            ]} />
                        </div>

                        <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-2xl p-6 mt-6">
                            <h4 className="text-[13px] font-black uppercase tracking-widest text-[#D97706] mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Labeling & Formatting
                            </h4>

                            <p className="text-[14px] text-gray-700 dark:text-gray-300 mb-4">
                                WCM reserves the right to label content as:
                            </p>

                            <div className="flex flex-wrap gap-3 mb-6">
                                {['“Sponsored”', '“Promoted”', '“Featured”'].map((label) => (
                                    <span key={label} className="px-4 py-1.5 bg-white dark:bg-white/5 border border-amber-200 dark:border-amber-900/30 rounded-lg text-[13px] font-bold text-amber-700 dark:text-amber-500">
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <p className="text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400 border-t border-amber-100 dark:border-amber-900/20 pt-4 italic">
                                WCM may adjust layout or formatting for editorial consistency to ensure all sponsored content blends seamlessly with the platform's visual standards.
                            </p>
                        </div>
                    </div>
                </PolicySection>
                <PolicySection number="Section 08" title="Intellectual Property Rights">
                    <div className="space-y-8">
                        {/* Required Rights Section */}
                        <div>
                            <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200 mb-4">
                                Advertisers must hold all necessary rights or licenses for:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                                <Ul items={[
                                    'Images',
                                    'Logos',
                                    'Videos',
                                    'Text and copy',
                                    'Illustrations'
                                ]} />
                            </div>
                        </div>

                        {/* License Grant Section */}
                        <div className="relative overflow-hidden p-6 rounded-2xl bg-[#F57C00]/[0.03] border border-[#F57C00]/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F57C00] opacity-[0.05] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                            <h4 className="text-[14px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4">
                                License Grant to WCM
                            </h4>

                            <p className="text-[14.5px] leading-relaxed text-gray-600 dark:text-gray-400 mb-4">
                                By submitting content, advertisers grant WCM a non-exclusive, worldwide, royalty-free license to:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <Ul items={[
                                    'Publish',
                                    'Display',
                                    'Store',
                                    'Resize or reformat',
                                    'Distribute for advertising and platform purposes'
                                ]} />
                            </div>
                        </div>
                    </div>
                </PolicySection>
                {/* section 9 */}
                <PolicySection number="Section 09" title="Prohibited Practices">
                    <div className="space-y-6">
                        <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200">
                            To maintain the integrity of our marketplace, Advertisers may not:
                        </p>

                        <div className="bg-red-50/30 dark:bg-red-500/5 border border-red-100/50 dark:border-red-500/10 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Ul items={[
                                    'Submit fraudulent or misleading information',
                                    'Impersonate individuals or brands',
                                    'Artificially inflate clicks or impressions',
                                    'Use automated systems to manipulate visibility metrics',
                                    'Bypass platform controls or review systems',
                                    'Promote illegal or culturally harmful content'
                                ]} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400">
                                Any attempt to engage in these practices will result in immediate campaign suspension and potential account ban.
                            </p>
                        </div>
                    </div>
                </PolicySection>
                {/* section 10 */}
                <PolicySection number="Section 10" title="Termination or Removal of Ads">
                    <div className="space-y-6">
                        <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200">
                            WCM reserves the right to suspend or remove advertisements if:
                        </p>

                        <Ul items={[
                            'These Advertising Terms are violated',
                            'Credible cultural or legal complaints are received regarding the content',
                            'Safety or reputational risks arise for WCM or its community'
                        ]} />

                        <div className="mt-6 p-4 bg-gray-900 dark:bg-white/5 rounded-xl border border-gray-800">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <p className="text-[13.5px] font-bold text-white dark:text-gray-200 leading-relaxed">
                                    Removal may occur without prior notice in serious cases to protect platform integrity.
                                </p>
                            </div>
                        </div>
                    </div>
                </PolicySection>
                {/* section 11 */}<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section 11 — Limitation of Liability */}
                    <PolicyCard
                        num="11"
                        title="Limitation of Liability"
                        intro="To the maximum extent permitted by law, WCM shall not be liable for:"
                        items={[
                            'Loss of revenue or business opportunities',
                            'Reduced advertising performance',
                            'Cultural disputes or disagreements',
                            'Technical failures or downtime',
                            'Third-party misuse of content',
                            'Indirect or consequential damages'
                        ]}
                        note="Advertisers use WCM at their own risk."
                    />

                    {/* Section 11B — No Exclusivity */}
                    <PolicyCard
                        num="11B"
                        title="No Exclusivity"
                        intro="Unless explicitly agreed in writing:"
                        items={[
                            'Advertising placements on WCM are non-exclusive',
                            'Multiple advertisers may appear simultaneously',
                            'Competitors may be displayed in similar contexts',
                            'No guarantee of exclusive audience or category dominance'
                        ]}
                        note="WCM does not guarantee exclusivity of placement."
                    />
                </div>
                {/* section 12  */}

                <PolicySection number="Section 12" title="Indemnification">
                    <div className="space-y-6">
                        <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                            Advertisers agree to indemnify and hold harmless WCM from claims arising from:
                        </p>

                        <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                                <Ul items={[
                                    'Intellectual property violations',
                                    'Misleading or unlawful advertising',
                                    'Cultural misrepresentation or harm',
                                    'Regulatory or legal breaches'
                                ]} />
                            </div>
                        </div>

                        <p className="text-[13px] text-gray-500 dark:text-gray-500 italic border-l-2 border-orange-500 pl-4">
                            This protection extends to WCM’s directors, employees, and community representatives against any third-party claims.
                        </p>
                    </div>
                </PolicySection>
                <PolicySection number="Section 13" title="Modifications">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-xl">
                            <div className="mt-1 flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed">
                                    WCM may update these Terms at any time.
                                </p>
                                <p className="text-[14px] font-bold text-blue-700 dark:text-blue-400">
                                    Updates take effect upon publication on the platform.
                                </p>
                            </div>
                        </div>
                        <p className="text-[12px] text-gray-500 dark:text-gray-500 pl-1">
                            Advertisers are encouraged to review this page periodically for any changes.
                        </p>
                    </div>
                </PolicySection>


                <Divider />

                <ContactSection />
                {/* 15. Governing Law */}
                <PolicySection number="Section 15" title="Governing Law">
                    <p>These Advertising Terms shall be governed by the laws of **France**. Any disputes shall be subject to the jurisdiction of the courts of **50 avenue des Champs Élysées, 75008 Paris, France**.</p>
                </PolicySection>
            </div>
        </div>
    );
};

export default AdvertisingPolicyPage;