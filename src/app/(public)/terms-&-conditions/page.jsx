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

/* ── Main Page ── */
const TermsAndConditions = () => {
  const toc = [
    'Introduction', 'Definitions', 'About WCM', 'Eligibility',
    'Account Registration', 'Acceptable Use Policy', 'Platform Content',
    'Intellectual Property Rights', 'Third-Party Links', 'Advertising Services',
    'Disclaimers', 'Limitation of Liability', 'Privacy & GDPR',
    'Termination', 'Governing Law', 'Contact Information',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0C0C0B]">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F0F0E]">
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-[#F57C00] opacity-[0.05] blur-[80px] rounded-full -translate-x-1/4 -translate-y-1/4" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
          <h1 className="text-[48px] md:text-[56px] leading-[1.0] font-black tracking-tight text-gray-900 dark:text-white mb-5">
            Terms &<br />
            <span className="text-[#F57C00]">Conditions</span>
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

      <div className="max-w-4xl mx-auto px-6 py-14">

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

          {/* 1 */}
          <SectionBlock number="Section 01" title="Introduction">
            <p>
              Welcome to World Culture Marketplace ("WCM", "we", "us", "our"). These Terms & Conditions ("Terms")
              govern your access to and use of the website{' '}
              <a href="https://worldculturemarketplace.com" className="text-[#F57C00] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
                worldculturemarketplace.com
              </a>{' '}
              (the "Platform").
            </p>
            <p>
              By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
            </p>
            <NoteBox variant="orange">
              WCM is a cultural discovery and visibility platform intended to share, celebrate, and promote global cultural knowledge, creators, and traditions.
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 2 */}
          <SectionBlock number="Section 02" title="Definitions">
            <p className="italic text-gray-500 dark:text-gray-500">For clarity in this document:</p>
            <div className="space-y-2.5 mt-2">
              {[
                ['"Platform"', 'The WCM website and all related digital services.'],
                ['"User"', 'Any person accessing or using the Platform.'],
                ['"Creator"', 'Users who submit cultural content, profiles, or media.'],
                ['"Content"', 'Text, images, audio, video, descriptions, links, and any materials uploaded or displayed on the Platform.'],
                ['"Advertiser"', 'Any user or organization purchasing promotional or visibility services.'],
                ['"Services"', 'All features provided by WCM, including browsing, cultural content, creator profiles, advertising tools, and platform functionality.'],
              ].map(([term, def]) => (
                <div key={term} className="flex gap-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3">
                  <span className="font-black text-gray-900 dark:text-white text-[13px] flex-shrink-0 w-28">{term}</span>
                  <span className="text-[13.5px] text-gray-600 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800 pl-3">{def}</span>
                </div>
              ))}
            </div>
          </SectionBlock>

          <Divider />

          {/* 3 */}
          <SectionBlock number="Section 03" title="About WCM">
            <p>WCM is a platform designed to:</p>
            <Ul items={[
              'Promote cultural diversity and visibility.',
              'Share educational, historical, and artistic content.',
              'Support creators, storytellers, and cultural advocates.',
              'Enable promotional and advertising opportunities.',
            ]} />
            <p className="mt-2">
              WCM does not currently provide e-commerce transaction services. The Platform focuses on cultural content, visibility, and external redirection to third-party websites. E-commerce features may be introduced in future versions.
            </p>
            <p className="text-[13px] italic text-gray-400 dark:text-gray-500">
              WCM does not verify the academic or historical accuracy of every cultural contribution and is not responsible for interpretative differences.
            </p>
          </SectionBlock>

          <Divider />

          {/* 4 */}
          <SectionBlock number="Section 04" title="Eligibility">
            <p>You may use the Platform only if:</p>
            <Ul items={[
              'You are at least 16 years old, or the minimum required age in your jurisdiction.',
              'You have the legal capacity to accept these Terms.',
              'You use the Platform in compliance with all applicable laws.',
            ]} />
            <p>If creating a creator profile, you represent that all submitted information is accurate and lawful.</p>
          </SectionBlock>

          <Divider />

          {/* 5 */}
          <SectionBlock number="Section 05" title="Account Registration">
            <p>Users may create an account to access certain features. You agree to:</p>
            <Ul items={[
              'Provide accurate and truthful information.',
              'Keep login credentials confidential.',
              'Notify WCM immediately of unauthorized access.',
              'Not share or sell your account.',
            ]} />
            <NoteBox>
              <strong>WCM may suspend or terminate accounts that violate these Terms.</strong>
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 6 */}
          <SectionBlock number="Section 06" title="Acceptable Use Policy">
            <p>Users agree <strong className="text-gray-900 dark:text-white">NOT</strong> to:</p>
            <Ul items={[
              'Use the Platform for illegal, harmful, fraudulent, or abusive purposes.',
              'Upload malware, harmful scripts, or malicious files.',
              'Harvest or collect personal data from other users.',
              'Attempt to hack, disrupt, or reverse-engineer the Platform.',
              'Upload culturally offensive or disrespectful content.',
              'Impersonate any person, culture, community, or organization.',
              'Scrape or copy Platform content for resale or reproduction.',
            ]} />
            <NoteBox variant="warning">
              <strong>Violations may result in permanent account termination.</strong>
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 7 */}
          <SectionBlock number="Section 07" title="Platform Content">
            <SubHeading>7.1 — WCM Content</SubHeading>
            <p>
              All content created by WCM — including articles, categories, stories, images, branding, and platform architecture — is protected by intellectual property laws.
            </p>
            <p>You may <strong className="text-gray-900 dark:text-white">NOT</strong> copy, reproduce, redistribute, modify, or publish WCM content without written approval.</p>

            <SubHeading>7.2 — User-Generated Content</SubHeading>
            <p>Creators retain ownership of their submitted content.</p>
            <p>By submitting content, you grant WCM a <strong className="text-gray-900 dark:text-white">non-exclusive, worldwide, royalty-free, transferable license</strong> to publish, display, host, distribute, adapt, and promote your content as part of the Platform's operations.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                'You own the rights to your content.',
                'Your content does not infringe third-party rights.',
                'Your content is culturally respectful and accurate to the best of your knowledge.',
              ].map((item, i) => (
                <div key={i} className="bg-orange-50 dark:bg-orange-500/[0.06] border border-orange-100 dark:border-orange-500/15 rounded-xl p-3 text-[12.5px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-[#F57C00] mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] italic text-gray-400 dark:text-gray-500">
              WCM may remove content that violates guidelines or legal requirements.
            </p>
          </SectionBlock>

          <Divider />

          {/* 8 */}
          <SectionBlock number="Section 08" title="Intellectual Property Rights">
            <p>All trademarks, logos, branding, design elements, and platform architecture are the exclusive property of WCM.</p>
            <p>Users may not:</p>
            <Ul items={[
              'Use WCM trademarks without permission.',
              'Reproduce WCM brand elements.',
              'Claim ownership of WCM intellectual property.',
            ]} />
            <NoteBox>
              Creators retain ownership of their content subject to the license granted in Section 7.
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 9 */}
          <SectionBlock number="Section 09" title="Third-Party Links">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">WCM may include links to</p>
                <Ul items={['External websites', 'Creator social media', 'Business sites', 'Educational resources']} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">WCM is not responsible for</p>
                <Ul items={['Third-party privacy practices', 'Content accuracy', 'Transactions performed outside WCM', 'Harm arising from external websites']} />
              </div>
            </div>
            <NoteBox variant="warning">
              <strong>Users navigate external links at their own risk.</strong>
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 10 */}
          <SectionBlock number="Section 10" title="Advertising Services">
            <p>WCM may offer:</p>
            <TwoColList items={['Banner ads', 'Sponsored cultural content', 'Boosted visibility', 'PPC-based advertising']} />
            <NoteBox>
              All advertising activities are governed by the{' '}
              <span className="font-bold text-[#F57C00] underline underline-offset-2 cursor-pointer">Advertising Terms</span>,
              which form part of this legal suite.
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 11 */}
          <SectionBlock number="Section 11" title="Disclaimers">
            <p>WCM provides the Platform <em>"as is"</em> without guarantees of:</p>
            <TwoColList items={[
              'Uninterrupted operation', 'Accuracy of cultural information',
              'Error-free performance', 'Continuous availability',
              'Completeness of user-submitted content', 'Academic certification',
            ]} />
            <div className="mt-4 bg-orange-50 dark:bg-orange-500/[0.06] border border-orange-100 dark:border-orange-500/15 rounded-xl p-4 text-right">
              <p className="text-[13.5px] italic text-gray-600 dark:text-gray-400 border-r-4 border-[#F57C00] pr-4">
                "WCM does not provide academic or anthropological certification of cultural content."
              </p>
            </div>
          </SectionBlock>

          <Divider />

          {/* 12 */}
          <SectionBlock number="Section 12" title="Limitation of Liability">
            <p>To the maximum extent permitted by law, WCM is <strong className="text-gray-900 dark:text-white uppercase">not liable</strong> for:</p>
            <TwoColList items={[
              'Loss of data', 'Loss of revenue',
              'Indirect or consequential damages', 'Cultural interpretation disputes',
              'Reliance on user-generated content', 'Unauthorized access to user accounts',
            ]} />
            <NoteBox variant="warning">
              <strong>Your use of the Platform is at your own risk.</strong>
            </NoteBox>
          </SectionBlock>

          <Divider />

          {/* 13 */}
          <SectionBlock number="Section 13" title="Privacy & GDPR">
            <p>
              Your data is governed by the{' '}
              <strong className="text-gray-900 dark:text-white">WCM Privacy Policy</strong>,
              which is incorporated into these Terms.
            </p>
            <p>This includes information on:</p>
            <TwoColList items={['Data collection', 'Cookies', 'GDPR rights', 'Data retention', 'Security measures']} />
          </SectionBlock>

          <Divider />

          {/* 14 */}
          <SectionBlock number="Section 14" title="Termination">
            <p>WCM may suspend or terminate accounts for:</p>
            <Ul items={[
              'Violating these Terms',
              'Harmful or abusive behavior',
              'Cultural misrepresentation',
              'Copyright infringement',
              'Security risks',
            ]} />
            <p className="text-[13px] italic text-gray-400 dark:text-gray-500">
              Users may request account deletion at any time.
            </p>
          </SectionBlock>

          <Divider />

          {/* 15 */}
          <SectionBlock number="Section 15" title="Governing Law">
            <p>
              These Terms are governed by the laws of the jurisdiction in which WCM operates.
              Any disputes shall be resolved in the competent courts of that jurisdiction.
            </p>
          </SectionBlock>

          <Divider />

          {/* 16 — Contact */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1a1a18] dark:to-[#111110] border border-gray-700 dark:border-gray-800 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00] opacity-[0.07] blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="relative">
              <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                Section 16
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
                    text: <span className="text-[14px] text-gray-400">Paris, France &nbsp;·&nbsp; Washington, USA</span>,
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

export default TermsAndConditions;