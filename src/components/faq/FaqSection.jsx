'use client';
import React, { useState } from 'react';
import { ChevronDown, Globe, Users, Rocket, Zap, Wallet, Lock, ShieldQuestion } from 'lucide-react';

const FaqSection = () => {
    const [activeCategory, setActiveCategory] = useState('General');
    const [openIndex, setOpenIndex] = useState(0); // প্রথম প্রশ্নটি ডিফল্টভাবে খোলা থাকবে

    const categories = [
        { id: 'General', icon: <Globe size={16} />, label: 'General' },
        { id: 'Explorers', icon: <Users size={16} />, label: 'For Cultural Explorers' },
        { id: 'Creators', icon: <Rocket size={16} />, label: 'For Creators' },
        { id: 'Boost', icon: <Zap size={16} />, label: 'Boost & PPC' },
        { id: 'Payments', icon: <Wallet size={16} />, label: 'Payments & Wallet' },
        { id: 'Privacy', icon: <Lock size={16} />, label: 'Privacy & GDPR' },
        { id: 'Technical', icon: <ShieldQuestion size={16} />, label: 'Technical & Support' },
    ];

    const faqs = [
        {
            question: "What is WCM?",
            answer: "WCM (World Culture Museum) is a digital platform dedicated to preserving and promoting global heritage by connecting master creators directly with cultural explorers."
        },
        {
            question: "How do I create an account?",
            answer: "You can create an account by clicking the 'Sign Up' button in the top right corner. Choose between a Creator or Explorer account to get started."
        },
        {
            question: "Is WCM available globally?",
            answer: "Yes, WCM is designed for a global audience, allowing creators from any region to share their traditions with people everywhere."
        }
    ];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-24 px-6">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                        Support Center
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Everything you need to know about discovering and sharing culture on <br className="hidden md:block" />
                        the World Culture Museum.
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                                activeCategory === cat.id
                                    ? 'bg-[#7A1F1F] border-[#7A1F1F] text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4 w-fit pr-20">
                        {activeCategory}
                    </h3>
                    
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className="border-b border-gray-100 dark:border-zinc-800 last:border-0"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center py-6 text-left group"
                            >
                                <span className={`text-lg font-medium transition-colors ${
                                    openIndex === index ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900'
                                }`}>
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gray-900' : 'text-gray-400'}`} 
                                    size={20} 
                                />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${
                                openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FaqSection;