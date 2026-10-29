import React from 'react';
import { ContactRow } from './SharedComponents';

const ContactSection = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1a1a18] dark:to-[#111110] border border-gray-700 dark:border-gray-800 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00] opacity-[0.07] blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
            <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-3">
                Section 14
            </span>
            <h2 className="text-[22px] font-black text-white mb-6 leading-snug">
                Contact Information
            </h2>
            <p className="text-[13.5px] text-gray-400 mb-5">For advertising inquiries:</p>
            <div className="space-y-3">
                <ContactRow icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}>
                    <span className="text-[15px] font-bold text-white">World Culture Marketplace (WCM)</span>
                </ContactRow>
                <ContactRow icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}>
                    <a href="mailto:contact@worldculturemarketplace.com" className="text-[14.5px] text-gray-300 hover:text-[#F57C00] transition-colors">
                        contact@worldculturemarketplace.com
                    </a>
                </ContactRow>
            </div>
        </div>
    </div>
);

export default ContactSection;