import React from 'react';

/* ── Reusable Components ── */

const SectionBlock = ({ number, title, children }) => (
    <section className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#F57C00] to-transparent rounded-full opacity-60" />
        <div className="pl-6">
            <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-2 opacity-90">
                {number}
            </span>
            <h2 className="text-[20px] font-black tracking-tight text-gray-900 dark:text-white mb-5 leading-snug uppercase">
                {title}
            </h2>
            <div className="text-[14.5px] leading-[1.85] text-gray-600 dark:text-gray-400 space-y-4">
                {children}
            </div>
        </div>
    </section>
);

const SubHeading = ({ children }) => (
    <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 mt-5 mb-2">
        {children}
    </h3>
);

const Ul = ({ items }) => (
    <ul className="space-y-2 mt-1">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-[#F57C00] flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const NoteBox = ({ children, variant = 'default' }) => {
    const styles = {
        default: 'bg-gray-50 dark:bg-white/[0.03] border-l-4 border-[#F57C00] text-gray-700 dark:text-gray-300',
        warning: 'bg-red-50 dark:bg-red-500/5 border-l-4 border-red-400 text-red-700 dark:text-red-400',
        orange: 'bg-orange-50 dark:bg-orange-500/[0.07] border-l-4 border-[#F57C00] text-gray-700 dark:text-gray-300',
    };
    return (
        <div className={`px-4 py-3 rounded-r-xl text-[13.5px] leading-relaxed mt-3 ${styles[variant]}`}>
            {children}
        </div>
    );
};

const Divider = () => (
    <div className="border-t border-dashed border-gray-200 dark:border-gray-800" />
);

const TwoColList = ({ items }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F57C00] flex-shrink-0" />
                <span className="text-[13px] text-gray-600 dark:text-gray-400">{item}</span>
            </div>
        ))}
    </div>
);

const CookieTypeCard = ({ title, tag, tagColor, items, note }) => {
    const tagColors = {
        required: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400',
        analytics: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
        preference: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400',
        advertising: 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
    };
    return (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${tagColors[tagColor]}`}>
                    {tag}
                </span>
            </div>
            <Ul items={items} />
            {note && (
                <p className="text-[12.5px] italic text-gray-400 dark:text-gray-500 mt-3 border-t border-dashed border-gray-100 dark:border-gray-800 pt-3">
                    {note}
                </p>
            )}
        </div>
    );
};

/* ── Main Page ── */
const CookiePolicy = () => {
    const toc = [
        'What Are Cookies?',
        'Types of Cookies We Use',
        'How We Obtain Consent',
        'Third-Party Cookies',
        'How to Manage or Disable Cookies',
        'Data Stored by Cookies',
        'Changes to This Cookie Policy',
        'Contact Information',
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0C0C0B]">

            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F0F0E]">
                <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-[#F57C00] opacity-[0.05] blur-[80px] rounded-full -translate-x-1/4 -translate-y-1/4" />

                <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
                    <h1 className="text-[48px] md:text-[56px] leading-[1.0] font-black tracking-tight text-gray-900 dark:text-white mb-5">
                        Cookie<br />
                        <span className="text-[#F57C00]">Policy</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[13px] text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>World Culture Marketplace (WCM)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-400 dark:text-gray-600">Last updated</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">15 March 2025</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-14">

                {/* ── INTRO ── */}
                <div className="mb-10 bg-orange-50 dark:bg-orange-500/[0.07] border-l-4 border-[#F57C00] px-5 py-4 rounded-r-2xl text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
                    This Cookie Policy explains how World Culture Marketplace ("WCM", "we", "our") uses cookies and similar
                    tracking technologies on{' '}
                    <a href="https://worldculturemarketplace.com" className="text-[#F57C00] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
                        worldculturemarketplace.com
                    </a>.{' '}
                    By using the Platform, you agree to the storage and use of cookies as described in this Policy.
                </div>

                {/* ── TABLE OF CONTENTS ── */}
                <div className="mb-14 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F57C00] mb-4">Table of Contents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                        {toc.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-[13px] text-gray-500 dark:text-gray-500">
                                <span className="text-[10px] font-black text-[#F57C00] w-5 flex-shrink-0">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="hover:text-[#F57C00] transition-colors cursor-default">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTIONS ── */}
                <div className="space-y-12">

                    {/* 1 — What Are Cookies */}
                    <SectionBlock number="Section 01" title="What Are Cookies?">
                        <p>
                            Cookies are small text files stored on your device when visiting a website. They allow WCM to:
                        </p>
                        <Ul items={[
                            'Remember your preferences',
                            'Improve performance',
                            'Measure traffic',
                            'Display content correctly',
                            'Support advertising features',
                        ]} />

                        <SubHeading>Cookie Types by Lifespan</SubHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {[
                                { label: 'Session Cookies', desc: 'Deleted upon closing your browser' },
                                { label: 'Persistent Cookies', desc: 'Remain on your device for a set period' },
                                { label: 'First-Party Cookies', desc: 'Placed directly by WCM' },
                                { label: 'Third-Party Cookies', desc: 'Placed by analytics or advertising partners' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3">
                                    <p className="text-[12.5px] font-black text-gray-900 dark:text-white mb-0.5">{item.label}</p>
                                    <p className="text-[12.5px] text-gray-500 dark:text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </SectionBlock>

                    <Divider />

                    {/* 2 — Types of Cookies */}
                    <SectionBlock number="Section 02" title="Types of Cookies We Use">
                        <p>WCM uses four main categories of cookies.</p>

                        <div className="space-y-4 mt-2">

                            <CookieTypeCard
                                title="2.1 — Essential Cookies (Strictly Necessary)"
                                tag="Required"
                                tagColor="required"
                                items={[
                                    'Enabling basic site functionality',
                                    'Secure login and session management',
                                    'Load balancing',
                                    'Preventing fraud or abuse',
                                ]}
                                note="You cannot disable these cookies because the Platform cannot function without them. Examples include: authentication cookies, security and anti-bot cookies, and cookie consent preferences."
                            />

                            <CookieTypeCard
                                title="2.2 — Performance & Analytics Cookies"
                                tag="Analytics"
                                tagColor="analytics"
                                items={[
                                    'Page popularity and navigation patterns',
                                    'Session duration and device types',
                                    'Traffic sources',
                                ]}
                                note="We use tools such as Google Analytics, Meta Pixel, and server log analysis. Data is aggregated and anonymized wherever possible."
                            />

                            <CookieTypeCard
                                title="2.3 — Preference & Functionality Cookies"
                                tag="Optional"
                                tagColor="preference"
                                items={[
                                    'Preferred language and region',
                                    'Display choices',
                                    'Saved settings',
                                ]}
                                note="Disabling them may reduce usability but will not block site access."
                            />

                            <CookieTypeCard
                                title="2.4 — Advertising & Marketing Cookies"
                                tag="Advertising"
                                tagColor="advertising"
                                items={[
                                    'Track ad performance',
                                    'Support boosted listings',
                                    'Measure clicks and impressions',
                                    'Personalize visibility',
                                    'Enable retargeting',
                                ]}
                                note="Third-party advertising cookies may include: Google Ads, Meta Ads, TikTok Pixel, and other ad networks. These cookies operate only if WCM activates advertising tools."
                            />
                        </div>

                        <NoteBox>
                            You may disable Advertising & Marketing Cookies through our cookie banner or browser settings.
                        </NoteBox>
                    </SectionBlock>

                    <Divider />

                    {/* 3 — Consent */}
                    <SectionBlock number="Section 03" title="How We Obtain Consent">
                        <p>
                            WCM complies with GDPR cookie consent requirements. Upon your first visit, the Platform displays a{' '}
                            <strong className="text-gray-900 dark:text-white">Cookie Consent Banner</strong>, allowing you to:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                            {[
                                { icon: '✓', label: 'Accept all cookies', color: 'bg-green-50 dark:bg-green-500/[0.06] border-green-100 dark:border-green-500/15 text-green-700 dark:text-green-400' },
                                { icon: '✕', label: 'Reject non-essential cookies', color: 'bg-red-50 dark:bg-red-500/[0.06] border-red-100 dark:border-red-500/15 text-red-700 dark:text-red-400' },
                                { icon: '⚙', label: 'Customize cookie categories', color: 'bg-orange-50 dark:bg-orange-500/[0.06] border-orange-100 dark:border-orange-500/15 text-orange-700 dark:text-orange-400' },
                            ].map((item, i) => (
                                <div key={i} className={`border rounded-xl p-3 text-[12.5px] flex items-start gap-2 ${item.color}`}>
                                    <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[13px] italic text-gray-400 dark:text-gray-500">
                            Your preferences are stored and may be changed at any time.
                        </p>
                    </SectionBlock>

                    <Divider />

                    {/* 4 — Third-Party */}
                    <SectionBlock number="Section 04" title="Third-Party Cookies">
                        <p>Some cookies come from third parties integrated into the Platform, including:</p>
                        <TwoColList items={[
                            'Analytics providers',
                            'Embedded video platforms',
                            'Social media widgets',
                            'Advertising networks',
                        ]} />
                        <NoteBox variant="warning">
                            <strong>WCM does not control or govern third-party cookie behavior.</strong> These providers may use cookies independently. Users should review each provider's privacy policy for more details.
                        </NoteBox>
                    </SectionBlock>

                    <Divider />

                    {/* 5 — Manage */}
                    <SectionBlock number="Section 05" title="How to Manage or Disable Cookies">
                        <p>You can control cookies in three ways:</p>

                        <SubHeading>5.1 — Website Cookie Settings</SubHeading>
                        <p>Use the cookie banner or settings panel to enable, disable, or customize non-essential cookies.</p>

                        <SubHeading>5.2 — Browser Settings</SubHeading>
                        <p>Most browsers allow you to:</p>
                        <Ul items={[
                            'Block all cookies',
                            'Block third-party cookies',
                            'Delete cookies',
                            'Clear browsing data',
                        ]} />
                        <NoteBox>
                            Instructions vary across Chrome, Safari, Firefox, Edge, and mobile browsers.
                        </NoteBox>

                        <SubHeading>5.3 — Opt-Out Tools</SubHeading>
                        <p>For analytics and advertising, you may use:</p>
                        <Ul items={[
                            'Google Analytics Opt-Out Browser Add-On',
                            'Meta Ads Preference Center',
                            'Advertising industry opt-out pages',
                        ]} />
                        <NoteBox variant="warning">
                            Some features may become unavailable if you disable all cookies.
                        </NoteBox>
                    </SectionBlock>

                    <Divider />

                    {/* 6 — Data Stored */}
                    <SectionBlock number="Section 06" title="Data Stored by Cookies">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">Cookies may store</p>
                                <Ul items={[
                                    'Session identifiers',
                                    'Device type',
                                    'Browser type',
                                    'IP address (anonymized when possible)',
                                    'Navigation history',
                                    'Ad interaction data',
                                ]} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">Cookies do NOT store</p>
                                <Ul items={[
                                    'Passwords',
                                    'Payment information',
                                    'Sensitive personal data',
                                ]} />
                            </div>
                        </div>
                    </SectionBlock>

                    <Divider />

                    {/* 7 — Changes */}
                    <SectionBlock number="Section 07" title="Changes to This Cookie Policy">
                        <p>
                            WCM may update this Policy without prior notice. Updates will be reflected with a new "Last updated" date at the top of this page.
                        </p>
                        <NoteBox>
                            We encourage you to review this Policy periodically to stay informed about how we use cookies.
                        </NoteBox>
                    </SectionBlock>

                    <Divider />

                    {/* 8 — Contact */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1a1a18] dark:to-[#111110] border border-gray-700 dark:border-gray-800 p-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00] opacity-[0.07] blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="relative">
                            <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                                Section 08
                            </span>
                            <h2 className="text-[22px] font-black text-white mb-6 uppercase tracking-tight">Contact Information</h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        ),
                                        text: <span className="text-[15px] font-bold text-white">World Culture Marketplace (WCM)</span>,
                                    },
                                    {
                                        icon: (
                                            <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        ),
                                        text: (
                                            <a href="mailto:contact@worldculturemarketplace.com" className="text-[14.5px] text-gray-300 hover:text-[#F57C00] transition-colors">
                                                contact@worldculturemarketplace.com
                                            </a>
                                        ),
                                    },
                                    {
                                        icon: (
                                            <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ),
                                        text: <span className="text-[14px] text-gray-400">50 avenue des Champs Élysées, 75008 Paris, France. &nbsp;·&nbsp; Washington, USA</span>,
                                    },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#F57C00]/20 flex items-center justify-center flex-shrink-0">
                                            {row.icon}
                                        </div>
                                        {row.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;