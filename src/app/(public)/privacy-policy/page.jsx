import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">
            <div className="space-y-12 text-[15px] leading-relaxed">

                {/* SECTION: HEADER */}
                <section>
                    <div className="font-sans text-black dark:text-white">
                        <h1 className="text-4xl font-bold mb-6">PRIVACY POLICY</h1>
                        <p className="font-bold mb-1">World Culture Marketplace (WCM)</p>
                        <p className="mb-6 opacity-80">Last updated: 25 February 2026</p>

                        <div className="space-y-4">
                            <p>
                                This Privacy Policy explains how World Culture Marketplace (“WCM”, “we”, “us”, “our”) 
                                collects, stores, processes, and protects your personal data when you visit or use 
                                <a href="https://worldculturemarketplace.com" className="text-blue-600 underline ml-1">
                                    https://worldculturemarketplace.com
                                </a> (the “Platform”).
                            </p>
                            <p>(the “Platform”).</p>

                            <div className="pt-2">
                                <p className="mb-3 font-medium">We comply with:</p>
                                <ul className="list-disc ml-10 space-y-2">
                                    <li>The General Data Protection Regulation (GDPR)</li>
                                    <li>The French Data Protection Act (Loi Informatique et Libertés) if operating in France</li>
                                    <li>Applicable global privacy laws</li>
                                </ul>
                            </div>

                            <p className="pt-4">
                                By using the Platform, you consent to the practices described in this Privacy Policy.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 1. DATA WE COLLECT */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">1. DATA WE COLLECT</h1>
                    <p className="mb-6">We collect several types of personal and non-personal data.</p>

                    <div className="space-y-10">
                        {/* 1.1 */}
                        <div>
                            <h2 className="text-xl font-bold mb-3 italic">1.1 Data You Provide Directly</h2>
                            <p className="mb-3">When you use WCM, you may provide:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Username</li>
                                <li>Password (securely hashed)</li>
                                <li>Cultural contributions and descriptions</li>
                                <li>Creator profile details</li>
                                <li>Communications sent to WCM</li>
                                <li>Advertising inquiries or submissions</li>
                                <li>Uploaded files (images, text, media)</li>
                            </ul>
                        </div>

                        {/* 1.2 */}
                        <div className="pt-6 border-t border-gray-50 dark:border-zinc-900">
                            <h2 className="text-xl font-bold mb-3 ">1.2 Data Collected Automatically</h2>
                            <p className="mb-3">Through analytics tools, cookies, and log files, we collect:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Device type</li>
                                <li>Operating system</li>
                                <li>Pages visited</li>
                                <li>Time spent on each page</li>
                                <li>Click behavior and interactions</li>
                                <li>Referring URLs</li>
                                <li>Approximate geolocation (non-precise)</li>
                            </ul>
                            <p className="mt-4  opacity-80">This data is pseudonymized when possible.</p>
                        </div>

                        {/* 1.3 */}
                        <div className="pt-6 border-t border-gray-50 dark:border-zinc-900">
                            <h2 className="text-xl font-bold mb-3 ">1.3 Data from Third Parties</h2>
                            <p className="mb-3">We may receive additional data from:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>Google Analytics</li>
                                <li>Meta (Facebook/Instagram) Pixel</li>
                                <li>Advertising networks</li>
                                <li>Social login tools (if enabled)</li>
                            </ul>
                            <p className="mt-4  opacity-80">This may include anonymized user behavior and ad performance data.</p>
                        </div>
                    </div>
                </section>

                {/* 2. WHY WE PROCESS YOUR DATA */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">2. WHY WE PROCESS YOUR DATA (GDPR LEGAL BASIS)</h1>
                    <p className="mb-6">Under GDPR, we process your data on the following legal bases:</p>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-bold mb-2">2.1 Consent</h2>
                            <p className="mb-2">Given when you:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>accept cookies</li>
                                <li>subscribe to a newsletter</li>
                                <li>submit content</li>
                                <li>request communication</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold mb-2">2.2 Contract Performance</h2>
                            <p className="mb-2">We process data necessary to:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>register and manage your account</li>
                                <li>allow you to submit content</li>
                                <li>enable creators to publish profiles</li>
                                <li>provide advertising services</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold mb-2">2.3 Legitimate Interests</h2>
                            <p className="mb-2">We process certain data to:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>secure and maintain the Platform</li>
                                <li>improve performance</li>
                                <li>analyze usage</li>
                                <li>detect fraud or abuse</li>
                                <li>protect cultural integrity</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold mb-2">2.4 Legal Obligations</h2>
                            <p className="mb-2">We may process data for:</p>
                            <ul className="list-disc ml-10 space-y-1">
                                <li>record-keeping</li>
                                <li>compliance with laws</li>
                                <li>responding to lawful requests</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. HOW WE USE YOUR DATA */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">3. HOW WE USE YOUR DATA</h1>
                    <ul className="list-disc ml-10 space-y-2 mb-4">
                        <li>operate the Platform</li>
                        <li>authenticate users</li>
                        <li>publish and display cultural content</li>
                        <li>provide creator tools and visibility</li>
                        <li>improve user experience</li>
                        <li>protect the Platform from misuse</li>
                        <li>comply with GDPR and other laws</li>
                        <li>communicate updates, alerts, or support messages</li>
                        <li>analyze site traffic and trends</li>
                        <li>support advertising and visibility features</li>
                    </ul>
                    <p>We do <strong>not</strong> sell personal data.</p>
                </section>

                {/* 4. COOKIES */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">4. COOKIES AND TRACKING TECHNOLOGIES</h1>
                    <p className="mb-4">We use cookies for:</p>
                    <ul className="list-disc ml-10 space-y-1 mb-6">
                        <li>essential site functionality</li>
                        <li>login sessions</li>
                        <li>user preferences</li>
                        <li>analytics and performance</li>
                        <li>advertising measurement</li>
                    </ul>
                    <p className="mb-4">You may:</p>
                    <ul className="list-disc ml-10 space-y-1 mb-6">
                        <li>accept or reject non-essential cookies</li>
                        <li>customize cookie preferences</li>
                        <li>revoke consent at any time</li>
                    </ul>
                    <p>See the <strong>Cookie Policy</strong> for full details.</p>
                </section>

                {/* 5. HOW WE SHARE YOUR DATA */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">5. HOW WE SHARE YOUR DATA</h1>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold mb-2">5.1 Service Providers</h2>
                            <p className="mb-4">Such as: hosting providers, analytics tools, advertising partners, backup systems, email service providers.</p>
                            <p className="">All service providers operate under strict confidentiality agreements.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">5.2 Legal Authorities</h2>
                            <p>If required by court order, law enforcement, or regulatory obligations.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">5.3 Other Users</h2>
                            <p>If you are a creator: your name, profile, and cultural content may be publicly visible.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">5.4 Business Transfers</h2>
                            <p>If WCM undergoes a merger, data may transfer under equal protection conditions.</p>
                        </div>
                    </div>
                </section>

                {/* 6, 7, 8 SECURITY & RETENTION */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white space-y-10">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">6. DATA SECURITY</h2>
                        <ul className="list-disc ml-10 space-y-1 mb-4">
                            <li>SSL encryption, Password hashing, limited access controls, firewall, regular backups.</li>
                        </ul>
                        <p className=" font-medium text-sm">No system is 100% secure, but we use industry standards.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">7. DATA RETENTION</h2>
                        <ul className="list-disc ml-10 space-y-1">
                            <li>User accounts → until deleted by user</li>
                            <li>Creator content → until user requests removal</li>
                            <li>Analytics data → per Google Analytics retention settings</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">8. INTERNATIONAL TRANSFERS</h2>
                        <p>If data is transferred outside the EU, we use SCCs and GDPR-compliant processors.</p>
                    </div>
                </section>

                {/* 9. GDPR RIGHTS */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white">
                    <h2 className="text-2xl font-bold mb-6 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-1">9. YOUR RIGHTS UNDER GDPR</h2>
                    <div className="space-y-4 pl-4">
                        <div><h3 className="font-bold underline">9.1 Right of Access:</h3><p>Request copies of your personal data.</p></div>
                        <div><h3 className="font-bold underline">9.2 Right to Rectification:</h3><p>Correct inaccurate data.</p></div>
                        <div><h3 className="font-bold underline">9.3 Right to Erasure:</h3><p>Request deletion ("right to be forgotten").</p></div>
                        <p><strong>9.4-9.8:</strong> Rights to restrict, object, portability, and withdraw consent.</p>
                    </div>
                </section>

                {/* 10, 11, 12, 16 ADDITIONAL & CONTACT */}
                <section className="pt-8 border-t border-gray-100 dark:border-zinc-800 font-sans text-black dark:text-white space-y-8">
                    <div><h2 className="text-xl font-bold">10. CHILDREN’S PRIVACY:</h2><p>Not intended for children under 16.</p></div>
                    <div><h2 className="text-xl font-bold">11. THIRD-PARTY LINKS:</h2><p>WCM is not responsible for external site policies.</p></div>
                    <div><h2 className="text-xl font-bold">12. CHANGES:</h2><p>We may update this Policy periodically.</p></div>
                    
                    <div className="pt-10 border-t-2 border-gray-200 dark:border-zinc-800">
                        <h2 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-black dark:bg-white"></span> 16. Contact Information
                        </h2>
                        <div className="ml-11 space-y-2">
                            <p className="text-lg font-bold">World Culture Marketplace (WCM)</p>
                            <p>contact@worldculturemarketplace.com</p>
                            <p><strong>Business Locations:</strong> Paris, France | Washington, USA</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default PrivacyPolicyPage;