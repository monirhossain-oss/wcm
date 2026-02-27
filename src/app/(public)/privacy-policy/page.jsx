import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-2 uppercase">Privacy Policy</h1>
            <p className="text-[#F57C00] font-bold mb-1">World Culture Marketplace (WCM)</p>
            <p className="text-sm text-gray-500 mb-10 border-b pb-4">Last updated: 25 February 2026</p>

            <div className="space-y-10 text-[15px] leading-relaxed">
                {/* 1. GDPR Compliance Hook */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">1. COMPLIANCE & GOVERNANCE (GDPR)</h2>
                    <p className="mb-4">
                        We comply with the <strong>General Data Protection Regulation (GDPR)</strong> and the French Data Protection Act. 
                        We process your data based on Consent, Contract Performance, and Legitimate Interests.
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li><strong>Right to Erasure:</strong> Capability for user data deletion and anonymization is available.</li>
                        <li><strong>Consent:</strong> Placeholder implemented for cookie and analytics consent.</li>
                        <li><strong>Access:</strong> Users can request their full data profile at any time.</li>
                    </ul>
                </section>

                {/* 2. PPC & Monetization Data (Milestone 2) */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">2. PPC, BOOST & REVENUE TRACKING</h2>
                    <p className="mb-4">
                        For our marketplace and advertising services (PPC & Boost), we collect specific data to ensure revenue integrity:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li><strong>Click Tracking:</strong> Server-side tracking of outbound clicks and views before redirect.</li>
                        <li><strong>Immutable Records:</strong> Every purchase record includes fixed FX rates (EUR/USD) and VAT data.</li>
                        <li><strong>Fraud Suppression:</strong> We implement duplicate click suppression and rate limiting on tracking endpoints.</li>
                        <li><strong>Accounting:</strong> Internal accounting is enforced in EUR with deferred revenue logic.</li>
                    </ul>
                </section>

                {/* 3. Security & Infrastructure (Milestone 3) */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">3. DATA SECURITY & DISASTER RECOVERY</h2>
                    <p className="mb-4">
                        To ensure stability and recoverability (Milestone 3), we implement:
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li><strong>Backups:</strong> Automated Tier 1 backups (7–14 days) and Tier 2 critical dumps (30–90 days).</li>
                        <li><strong>Hardening:</strong> HTTPS enforcement, Redis caching, and CDN/WAF configuration.</li>
                        <li><strong>Access Control:</strong> Strict server-side role enforcement (Admin/Creator).</li>
                    </ul>
                </section>

                {/* 4. Data Sharing */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">4. HOW WE SHARE DATA</h2>
                    <p>
                        We share data with payment processors (Stripe/PayPal) and infrastructure providers. 
                        <strong> We do not sell your personal data to third parties.</strong>
                    </p>
                </section>

                {/* Contact Section */}
                <section className="pt-10 border-t border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-lg mb-1 underline">Contact Information</p>
                    <p>World Culture Marketplace (WCM)</p>
                    <p>Locations: Paris, France | Washington, USA</p>
                    <p className="mt-2">Email: <a href="mailto:contact@worldculturemarketplace.com" className="text-[#F57C00] font-semibold">contact@worldculturemarketplace.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;