import React from 'react';

/* ─── Reusable section wrapper ─── */
const Section = ({ number, title, children }) => (
    <section className="relative">
        {/* Side accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#F57C00] to-transparent rounded-full opacity-60" />

        <div className="pl-6">
            {number && (
                <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-2 opacity-90">
                    {number}
                </span>
            )}
            <h2 className="text-[22px] font-black tracking-tight text-gray-900 dark:text-white mb-5 leading-snug">
                {title}
            </h2>
            <div className="text-[14.5px] leading-[1.85] text-gray-600 dark:text-gray-400 space-y-4">
                {children}
            </div>
        </div>
    </section>
);

/* ─── Subsection ─── */
const Sub = ({ label, children }) => (
    <div className="mt-5">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-200 mb-2">
            {label}
        </h3>
        <div className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
        </div>
    </div>
);

/* ─── Styled list ─── */
const Ul = ({ items }) => (
    <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#F57C00] flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

/* ─── Inline badge ─── */
const Badge = ({ children }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-500/15 text-[#F57C00] tracking-wide uppercase">
        {children}
    </span>
);

/* ─── Divider ─── */
const Divider = () => (
    <div className="border-t border-dashed border-gray-200 dark:border-gray-800" />
);

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0C0C0B]">

            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F0F0E]">
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Orange glow blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#F57C00] opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />

                <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[3px] bg-[#F57C00] rounded-full" />
                        <Badge>Legal Document</Badge>
                    </div>

                    <h1 className="text-[52px] leading-[1.05] font-black tracking-tight text-gray-900 dark:text-white mb-5">
                        Privacy<br />
                        <span className="text-[#F57C00]">Policy</span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-[13px] text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>World Culture Marketplace (WCM)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-400 dark:text-gray-600">Last updated</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">25 February 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">

                {/* Intro block */}
                <div className="bg-orange-50 dark:bg-orange-500/[0.07] border border-orange-100 dark:border-orange-500/20 rounded-2xl p-6 text-[14.5px] leading-relaxed text-gray-700 dark:text-gray-300 space-y-3">
                    <p>
                        This Privacy Policy explains how <strong className="text-gray-900 dark:text-white">World Culture Marketplace ("WCM", "we", "us", "our")</strong> collects,
                        stores, processes, and protects your personal data when you visit or use{' '}
                        <a
                            href="https://worldculturemarketplace.com"
                            className="text-[#F57C00] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                        >
                            worldculturemarketplace.com
                        </a>{' '}
                        (the "Platform").
                    </p>
                    <div className="pt-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-[13px] mb-2">We comply with:</p>
                        <Ul items={[
                            'The General Data Protection Regulation (GDPR)',
                            'The French Data Protection Act (Loi Informatique et Libertés) if operating in France',
                            'Applicable global privacy laws',
                        ]} />
                    </div>
                    <p className="pt-1 text-[13.5px] text-gray-500 dark:text-gray-500 italic">
                        By using the Platform, you consent to the practices described in this Privacy Policy.
                    </p>
                </div>

                <Divider />

                {/* 1. DATA WE COLLECT */}
                <Section number="Section 01" title="Data We Collect">
                    <p>We collect several types of personal and non-personal data.</p>

                    <Sub label="1.1 — Data You Provide Directly">
                        <p className="mb-2">When you use WCM, you may provide:</p>
                        <Ul items={[
                            'Name', 'Email address', 'Username', 'Password (securely hashed)',
                            'Cultural contributions and descriptions', 'Creator profile details',
                            'Communications sent to WCM', 'Advertising inquiries or submissions',
                            'Uploaded files (images, text, media)',
                        ]} />
                    </Sub>

                    <Sub label="1.2 — Data Collected Automatically">
                        <p className="mb-2">Through analytics tools, cookies, and log files, we collect:</p>
                        <Ul items={[
                            'IP address', 'Browser type and version', 'Device type', 'Operating system',
                            'Pages visited', 'Time spent on each page', 'Click behavior and interactions',
                            'Referring URLs', 'Approximate geolocation (non-precise)',
                        ]} />
                        <p className="mt-3 text-[13px] text-gray-500 dark:text-gray-500 italic">
                            This data is pseudonymized when possible.
                        </p>
                    </Sub>

                    <Sub label="1.3 — Data from Third Parties">
                        <p className="mb-2">We may receive additional data from:</p>
                        <Ul items={[
                            'Google Analytics', 'Meta (Facebook/Instagram) Pixel',
                            'Advertising networks', 'Social login tools (if enabled)',
                        ]} />
                        <p className="mt-3 text-[13px] text-gray-500 dark:text-gray-500 italic">
                            This may include anonymized user behavior and ad performance data.
                        </p>
                    </Sub>
                </Section>

                <Divider />

                {/* 2. WHY WE PROCESS */}
                <Section number="Section 02" title="Why We Process Your Data (GDPR Legal Basis)">
                    <p>Under GDPR, we process your data on the following legal bases:</p>

                    {[
                        {
                            label: '2.1 — Consent',
                            intro: 'Given when you:',
                            items: ['accept cookies', 'subscribe to a newsletter', 'submit content', 'request communication'],
                        },
                        {
                            label: '2.2 — Contract Performance',
                            intro: 'We process data necessary to:',
                            items: ['register and manage your account', 'allow you to submit content', 'enable creators to publish profiles', 'provide advertising services'],
                        },
                        {
                            label: '2.3 — Legitimate Interests',
                            intro: 'We process certain data to:',
                            items: ['secure and maintain the Platform', 'improve performance', 'analyze usage', 'detect fraud or abuse', 'protect cultural integrity'],
                        },
                        {
                            label: '2.4 — Legal Obligations',
                            intro: 'We may process data for:',
                            items: ['record-keeping', 'compliance with laws', 'responding to lawful requests'],
                        },
                    ].map(({ label, intro, items }) => (
                        <Sub key={label} label={label}>
                            <p className="mb-2">{intro}</p>
                            <Ul items={items} />
                        </Sub>
                    ))}
                </Section>

                <Divider />

                {/* 3. HOW WE USE */}
                <Section number="Section 03" title="How We Use Your Data">
                    <Ul items={[
                        'Operate the Platform', 'Authenticate users',
                        'Publish and display cultural content', 'Provide creator tools and visibility',
                        'Improve user experience', 'Protect the Platform from misuse',
                        'Comply with GDPR and other laws', 'Communicate updates, alerts, or support messages',
                        'Analyze site traffic and trends', 'Support advertising and visibility features',
                    ]} />
                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl">
                        <span className="text-green-500 text-lg">✓</span>
                        <span className="text-[13.5px] font-semibold text-gray-700 dark:text-gray-300">
                            We do <em>not</em> sell personal data.
                        </span>
                    </div>
                </Section>

                <Divider />

                {/* 4. COOKIES */}
                <Section number="Section 04" title="Cookies and Tracking Technologies">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                            <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">We use cookies for</p>
                            <Ul items={[
                                'Essential site functionality', 'Login sessions',
                                'User preferences', 'Analytics and performance', 'Advertising measurement',
                            ]} />
                        </div>
                        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                            <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">You may</p>
                            <Ul items={[
                                'Accept or reject non-essential cookies',
                                'Customize cookie preferences',
                                'Revoke consent at any time',
                            ]} />
                        </div>
                    </div>
                    <p className="text-[13.5px] text-gray-500 dark:text-gray-500">
                        See the <strong className="text-gray-700 dark:text-gray-300">Cookie Policy</strong> for full details.
                    </p>
                </Section>

                <Divider />

                {/* 5. HOW WE SHARE */}
                <Section number="Section 05" title="How We Share Your Data">
                    {[
                        { label: '5.1 — Service Providers', text: 'Such as: hosting providers, analytics tools, advertising partners, backup systems, email service providers. All service providers operate under strict confidentiality agreements.' },
                        { label: '5.2 — Legal Authorities', text: 'If required by court order, law enforcement, or regulatory obligations.' },
                        { label: '5.3 — Other Users', text: 'If you are a creator: your name, profile, and cultural content may be publicly visible.' },
                        { label: '5.4 — Business Transfers', text: 'If WCM undergoes a merger, data may transfer under equal protection conditions.' },
                    ].map(({ label, text }) => (
                        <Sub key={label} label={label}>
                            <p>{text}</p>
                        </Sub>
                    ))}
                </Section>

                <Divider />

                {/* 6 + 7 + 8 — Cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            num: '06',
                            title: 'Data Security',
                            items: ['SSL encryption', 'Password hashing', 'Limited access controls', 'Firewall protection', 'Regular backups'],
                            note: 'No system is 100% secure, but we use industry standards.',
                        },
                        {
                            num: '07',
                            title: 'Data Retention',
                            items: ['User accounts → until deleted', 'Creator content → until removal requested', 'Analytics → per Google settings'],
                            note: null,
                        },
                        {
                            num: '08',
                            title: 'International Transfers',
                            items: ['Data transferred outside the EU uses SCCs and GDPR-compliant processors.'],
                            note: null,
                        },
                    ].map(({ num, title, items, note }) => (
                        <div
                            key={num}
                            className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black tracking-[0.2em] text-[#F57C00]">
                                    SECTION {num}
                                </span>
                            </div>
                            <h3 className="text-[15px] font-black text-gray-900 dark:text-white">{title}</h3>
                            <Ul items={items} />
                            {note && (
                                <p className="text-[12px] text-gray-400 dark:text-gray-600 italic border-t border-gray-100 dark:border-gray-800 pt-3 mt-1">
                                    {note}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <Divider />

                {/* 9. GDPR RIGHTS */}
                <Section number="Section 09" title="Your Rights Under GDPR">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        {[
                            { n: '9.1', right: 'Right of Access', desc: 'Request copies of your personal data.' },
                            { n: '9.2', right: 'Right to Rectification', desc: 'Correct inaccurate data.' },
                            { n: '9.3', right: 'Right to Erasure', desc: 'Request deletion ("right to be forgotten").' },
                            { n: '9.4', right: 'Right to Restriction', desc: 'Limit how we process your data.' },
                            { n: '9.5', right: 'Right to Object', desc: 'Object to certain processing activities.' },
                            { n: '9.6', right: 'Right to Portability', desc: 'Receive your data in a portable format.' },
                            { n: '9.7', right: 'Right to Withdraw Consent', desc: 'Revoke consent at any time.' },
                            { n: '9.8', right: 'Right to Complain', desc: 'Lodge a complaint with a supervisory authority.' },
                        ].map(({ n, right, desc }) => (
                            <div
                                key={n}
                                className="flex items-start gap-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3"
                            >
                                <span className="mt-0.5 text-[10px] font-black text-[#F57C00] bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                    {n}
                                </span>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900 dark:text-white">{right}</p>
                                    <p className="text-[12.5px] text-gray-500 dark:text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Divider />

                {/* 10 + 11 + 12 */}
                <div className="space-y-5">
                    {[
                        { num: '10', title: "Children's Privacy", text: 'Not intended for children under 16.' },
                        { num: '11', title: 'Third-Party Links', text: 'WCM is not responsible for external site policies.' },
                        { num: '12', title: 'Changes to This Policy', text: 'We may update this Policy periodically. Continued use of the Platform after changes constitutes acceptance.' },
                    ].map(({ num, title, text }) => (
                        <div key={num} className="flex items-start gap-4">
                            <span className="text-[11px] font-black text-[#F57C00] tracking-widest mt-[3px] w-8 flex-shrink-0">
                                {num}.
                            </span>
                            <div>
                                <span className="font-black text-[14px] text-gray-900 dark:text-white">{title}: </span>
                                <span className="text-[14px] text-gray-600 dark:text-gray-400">{text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <Divider />

                {/* 16. CONTACT */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1a1a18] dark:to-[#111110] border border-gray-700 dark:border-gray-800 p-8">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00] opacity-[0.07] blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />

                    <div className="relative">
                        <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                            Section 16
                        </span>
                        <h2 className="text-[22px] font-black text-white mb-6 leading-snug">
                            Contact Information
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#F57C00]/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-[15px] font-bold text-white">World Culture Marketplace (WCM)</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#F57C00]/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <a
                                    href="mailto:contact@worldculturemarketplace.com"
                                    className="text-[14.5px] text-gray-300 hover:text-[#F57C00] transition-colors"
                                >
                                    contact@worldculturemarketplace.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#F57C00]/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-[14px] text-gray-400">
                                    Paris, France &nbsp;·&nbsp; Washington, USA
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicyPage;