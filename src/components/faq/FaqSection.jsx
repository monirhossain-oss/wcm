'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Users, Rocket, Zap, ShieldQuestion, Loader2 } from 'lucide-react';
import axios from 'axios';

const FaqSection = () => {
    const [activeCategory, setActiveCategory] = useState('General');
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const categories = [
        { id: 'General', icon: <Globe size={16} />, label: 'General' },
        { id: 'Artists', icon: <Users size={16} />, label: 'For Creators and Artists' },
        { id: 'Creators', icon: <Rocket size={16} />, label: 'For Visitors and Buyers' },
        { id: 'Platform', icon: <Zap size={16} />, label: 'Platform Policies' },
        { id: 'Technical', icon: <ShieldQuestion size={16} />, label: 'Technical Questions' },
    ];

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/faqs`);
                setFaqs(response.data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, [API_BASE_URL]);

    const currentFaqs = faqs.filter(faq => faq.category === activeCategory);
    console.log(currentFaqs)

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-12 px-6 min-h-[500px]">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="px-4 py-1 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                        Support Center
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* Category Filtering Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenIndex(null);
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${activeCategory === cat.id
                                ? 'bg-[#F57C00] border-[#F57C00] text-white shadow-lg'
                                : 'bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Content Area */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4 w-fit pr-20">
                        {activeCategory}
                    </h3>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                            <p className="text-gray-400 text-sm italic">Loading questions...</p>
                        </div>
                    ) : currentFaqs.length > 0 ? (
                        currentFaqs.map((faq, index) => (
                            <div
                                key={faq._id}
                                className="border-b border-gray-100 dark:border-zinc-800 last:border-0"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex justify-between items-center py-6 text-left group"
                                >
                                    <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gray-900 dark:text-white' : 'text-gray-400'}`}
                                        size={20}
                                    />
                                </button>

                                <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div
                                        className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm prose dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                            <p className="text-gray-400">No questions found for this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;