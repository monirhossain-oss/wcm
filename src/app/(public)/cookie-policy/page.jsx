import React from 'react';
import {
    Cookie,
    ShieldCheck,
    BarChart3,
    Settings2,
    Mail,
    MapPin,
    History,
    Info,
    Globe,
    Lock
} from 'lucide-react';

const CookiePolicy = () => {
    const lastUpdated = "March 15, 2025";

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] text-gray-700 dark:text-gray-300 selection:bg-blue-500/30 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 py-4 md:py-6">

                {/* --- HEADER SECTION --- */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-lg dark:shadow-blue-500/5 transition-all">
                        <Cookie className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm">
                        World Culture Marketplace (WCM)
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        <History className="w-3.5 h-3.5" />
                        Last updated: {lastUpdated}
                    </div>
                </header>

                {/* --- INTRO SECTION --- */}
                <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 mb-12 backdrop-blur-md transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Globe className="w-24 h-24 text-blue-500" />
                    </div>
                    <p className="leading-relaxed relative z-10 text-lg">
                        This Cookie Policy explains how World Culture Marketplace (“WCM”, “we”, “our”) uses
                        cookies and similar tracking technologies on
                        <a href="https://worldculturemarketplace.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors underline underline-offset-4 ml-1">
                            https://worldculturemarketplace.com
                        </a>.
                        By using the , you agree to the storage and use of cookies as described in this Policy.
                    </p>
                </section>

                {/* --- 1. WHAT ARE COOKIES --- */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 transition-colors">
                            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">1. WHAT ARE COOKIES?</h2>
                    </div>
                    <p className="mb-6 text-gray-500 dark:text-gray-400 italic">Cookies are small text files stored on your device when visiting a website. They allow WCM to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-medium">
                        {[
                            "Remember your preferences", "Improve performance",
                            "Measure traffic", "Display content correctly", "Support advertising features"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)] dark:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/5 border-l-4 border-blue-500/40 p-5 rounded-r-xl transition-colors">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cookies may be:</p>
                        <ul className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            <li>• Session cookies</li>
                            <li>• Persistent cookies</li>
                            <li>• First-party cookies</li>
                            <li>• Third-party cookies</li>
                        </ul>
                    </div>
                </section>

                {/* --- 2. TYPES OF COOKIES --- */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 transition-colors">
                            <Settings2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">2. TYPES OF COOKIES WE USE</h2>
                    </div>

                    <div className="space-y-8">
                        {/* 2.1 Essential */}
                        <div className="group p-8 rounded-2xl bg-white dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400 shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide">2.1 Essential Cookies (Strictly Necessary)</h3>
                                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-medium md:font-normal">These cookies are required for enabling basic site functionality, secure login, session management, load balancing, and preventing fraud or abuse.</p>
                                    <p className="text-sm font-bold text-amber-600 dark:text-amber-500/80 mb-4 tracking-tighter uppercase underline decoration-amber-500/20 underline-offset-4">You cannot disable these cookies because the Platform cannot function without them.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["authentication cookies", "security and anti-bot cookies", "cookie consent preferences"].map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-gray-700 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2.2 Performance */}
                        <div className="group p-8 rounded-2xl bg-white dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2.2 Performance & Analytics Cookies</h3>
                                    <p className="mb-4 text-gray-600 dark:text-gray-400">These cookies help us understand how visitors use the Platform. They measure page popularity, navigation patterns, session duration, device types, and traffic sources.</p>
                                    <div className="p-4 bg-gray-100 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Tools we use:</p>
                                        <p className="text-sm font-medium dark:font-normal text-gray-700 dark:text-gray-300">Google Analytics, Meta Pixel, and server log analysis.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2.3 & 2.4 - Preference & Advertising */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 transition-colors">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">2.3 Preference & Functionality</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">Remembering preferred language, region, display choices, and saved settings. Disabling them may reduce usability but will not block site access.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 transition-colors">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">2.4 Advertising & Marketing</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Operate only if WCM activates advertising tools. They track ad performance, support boosted listings, measure clicks, and enable retargeting via Google Ads, Meta Ads, TikTok Pixel, etc.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3, 4, 6, 7 COMBINED SECTIONS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            3. HOW WE OBTAIN CONSENT
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            WCM complies with GDPR cookie consent requirements. Upon your first visit, the Platform displays a Cookie Consent Banner, allowing you to Accept all, Reject non-essential, or Customize cookie categories.
                        </p>
                    </section>

                    <section className="space-y-4 text-sm leading-relaxed">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                            4. THIRD-PARTY COOKIES
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Some cookies come from analytics providers, embedded video platforms, social media widgets, and advertising networks. WCM does not control or govern third-party cookie behavior.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 underline decoration-red-500/20 dark:decoration-red-500/40 decoration-2 underline-offset-8">
                            6. DATA STORED BY COOKIES
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Stores session identifiers, device/browser type, IP address (anonymized), and history.</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase bg-red-50 dark:bg-red-500/5 p-2 border border-red-100 dark:border-red-500/10 rounded transition-colors">
                            <Lock className="w-3 h-3" />
                            We do NOT store passwords or payment info in cookies.
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            7. CHANGES TO THIS POLICY
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">WCM may update this Policy without prior notice. Updates will be reflected with a new “Last updated” date at the top of this page.</p>
                    </section>
                </div>

                {/* --- 5. HOW TO MANAGE --- */}
                <section className="mb-16 p-8 rounded-3xl bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 relative transition-all">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">5. HOW TO MANAGE OR DISABLE COOKIES</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">5.1</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Website Cookie Settings</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Use the cookie banner or settings panel to enable, disable, or customize non-essential cookies.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">5.2</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Browser Settings</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Block all cookies, block third-party cookies, or clear browsing data through Chrome, Safari, Firefox, or Edge settings.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">5.3</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Opt-Out Tools</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Use the Google Analytics Opt-Out Add-On, Meta Ads Preference Center, or industry opt-out pages.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 8. CONTACT INFORMATION --- */}
                <footer className="pt-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
                    <div className="grid grid-cols-1 md:flex justify-between items-center gap-8 bg-gray-50 dark:bg-gray-900/40 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 transition-all">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">For any questions or requests regarding this policy.</p>
                        </div>
                        <div className="space-y-4">
                            <a href="mailto:contact@worldculturemarketplace.com" className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-blue-500/5 border border-gray-200 dark:border-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-500/10 transition-all font-semibold">
                                <Mail className="w-5 h-5" />
                                <span>contact@worldculturemarketplace.com</span>
                            </a>
                            <div className="flex items-center gap-3 p-3 text-gray-500 dark:text-gray-400">
                                <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium uppercase tracking-tight">Paris, France | Washington, USA</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CookiePolicy;