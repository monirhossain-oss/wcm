import React from 'react';

const TermsAndConditionsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-2 uppercase">Terms & Conditions</h1>
            <p className="text-[#F57C00] font-bold mb-1">World Culture Marketplace (WCM)</p>
            <p className="text-sm text-gray-500 mb-10 border-b pb-4">Last updated: 25 February 2026</p>

            <section className="space-y-10 text-[15px] leading-relaxed">
                {/* 1. Introduction & Eligibility */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">1. INTRODUCTION & ELIGIBILITY</h2>
                    <p>
                        By accessing World Culture Marketplace (WCM), you agree to these terms. Users must be at least 16 years old. 
                        Creators are responsible for ensuring all submitted cultural content is accurate and lawful. 
                        We enforce strict server-side role management (Admin/Creator) to maintain platform integrity.
                    </p>
                </div>

                {/* 2. Monetization, PPC & Money Logic (Milestone 2) */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">2. MONETIZATION, PPC & MONEY LOGIC</h2>
                    <p className="mb-4">Creators purchasing "Boost" or "PPC" services are bound by the following financial protocols:</p>
                    <ul className="list-disc ml-6 space-y-3">
                        <li><strong>Payment & Activation:</strong> Services activate only after confirmed payment via Stripe or PayPal. All transactions generate digital invoices in the payment currency.</li>
                        <li><strong>Currency & Accounting:</strong> We support EUR and USD. However, all internal accounting and revenue recognition are enforced in <strong>EUR</strong> using immutable FX rates stored at the time of purchase.</li>
                        <li><strong>VAT & Tax:</strong> VAT rates are determined by the user's country and stored at the point of purchase.</li>
                        <li><strong>Revenue Logic:</strong> WCM applies deferred revenue logic, where revenue is recognized over the duration of the boost or based on actual click usage.</li>
                    </ul>
                </div>

                {/* 3. Analytics & Fraud Control (Milestone 2) */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">3. ANALYTICS & FRAUD PREVENTION</h2>
                    <p>
                        We track clicks and impressions to provide transparent reporting in Creator and Admin dashboards. 
                        To protect advertising spend, we implement <strong>duplicate click suppression</strong> and <strong>rate limiting</strong>. 
                        Any attempt to manipulate clicks will result in account suspension without refund.
                    </p>
                </div>

                {/* 4. Infrastructure & Liability (Milestone 3) */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">4. STABILITY & LIABILITY</h2>
                    <p>
                        WCM is deployed on secure cloud infrastructure with HTTPS enforcement and CDN/WAF protection. 
                        While we maintain rigorous <strong>automated database backups (7–14 days)</strong> and <strong>restore procedures</strong>, 
                        WCM is not liable for data loss or service interruptions beyond our disaster recovery protocols.
                    </p>
                </div>

                {/* 5. Ownership & Handover */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-[#F57C00]">5. CONTENT OWNERSHIP & DATA RIGHTS</h2>
                    <p>
                        Creators retain full ownership of their cultural craftsmanship. WCM is granted a non-exclusive license to host and display this content. 
                        Users have the right to request data deletion or anonymization as part of our GDPR compliance hooks.
                    </p>
                </div>

                {/* Footer/Contact */}
                <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-lg mb-1 underline text-[#F57C00]">Contact & Compliance Office</p>
                    <p>World Culture Marketplace (WCM)</p>
                    <p>Paris, France | Washington, USA</p>
                    <p className="mt-2">Email: <a href="mailto:contact@worldculturemarketplace.com" className="hover:underline">contact@worldculturemarketplace.com</a></p>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditionsPage;