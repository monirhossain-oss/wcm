'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Users, Rocket, Zap, ShieldQuestion, Loader2 } from 'lucide-react';
import axios from 'axios';

// `initialFaqs` comes from the server so the questions and answers are in the served HTML. The
// browser fetch below is now only the fallback for a server read that returned nothing.
const FaqSection = ({ language = 'en', initialFaqs = null }) => {
    const [activeCategory, setActiveCategory] = useState('General');
    const [openId, setOpenId] = useState(null);
    const [faqs, setFaqs] = useState(initialFaqs || []);
    const [loading, setLoading] = useState(!initialFaqs);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // ক্যাটাগরি আইডি এবং লেবেল ফিক্স করা হয়েছে
    const copy = language === 'fr'
        ? { categories: ['Général', 'Pour les créateurs et artistes', 'Pour les visiteurs et acheteurs', 'Règles de la plateforme', 'Questions techniques'], loading: 'Chargement des questions…', empty: 'Aucune question dans cette catégorie.' }
        : { categories: ['General', 'For Creators and Artists', 'For Visitors and Buyers', 'Platform Policies', 'Technical Questions'], loading: 'Loading questions...', empty: 'No questions found for this category.' };

    // `match` is every stored category value a tab answers for. The creators tab answers for
    // "Artists" as well: that was the stored value before the two were merged, so a record that has
    // not been re-categorised yet still has a tab to appear under instead of vanishing.
    const categories = [
        { id: 'General', icon: <Globe size={16} />, label: copy.categories[0], match: ['General'] },
        { id: 'Creators', icon: <Users size={16} />, label: copy.categories[1], match: ['Creators', 'Artists'] },
        { id: 'Visitors', icon: <Rocket size={16} />, label: copy.categories[2], match: ['Visitors'] },
        { id: 'Platform', icon: <Zap size={16} />, label: copy.categories[3], match: ['Platform'] },
        { id: 'Technical', icon: <ShieldQuestion size={16} />, label: copy.categories[4], match: ['Technical'] },
    ];

    useEffect(() => {
        if (initialFaqs) return undefined;

        let active = true;
        const fetchFaqs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/faqs`, {
                    params: language === 'fr' ? { language: 'fr' } : undefined,
                });
                if (active) setFaqs(response.data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchFaqs();
        return () => { active = false; };
    }, [API_BASE_URL, language, initialFaqs]);

    // Every category is rendered and all but the active one is hidden, rather than filtering the
    // list down to one category. A tab interface behaves the same way to the reader, and it puts
    // the whole answer text in the served HTML instead of the four entries of the default tab.
    const faqsFor = (category) => faqs.filter((faq) => category.match.includes(faq.category));

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-12 px-6 min-h-[500px]">
            <div className="max-w-5xl mx-auto">
                {/* Category Filtering Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenId(null);
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

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                            <p className="text-gray-400 text-sm italic">{copy.loading}</p>
                        </div>
                    ) : categories.map((cat) => {
                        const items = faqsFor(cat);
                        return (
                            <div key={cat.id} className={activeCategory === cat.id ? 'space-y-4' : 'hidden'}>
                                {items.length > 0 ? items.map((faq) => (
                                    <div
                                        key={faq._id}
                                        className="border-b border-gray-100 dark:border-zinc-800 last:border-0"
                                    >
                                        <button
                                            onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                                            className="w-full flex justify-between items-center py-6 text-left group"
                                        >
                                            <span className={`text-lg font-medium transition-colors ${openId === faq._id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                {faq.question}
                                            </span>
                                            <ChevronDown
                                                className={`transition-transform duration-300 ${openId === faq._id ? 'rotate-180 text-gray-900 dark:text-white' : 'text-gray-400'
                                                    }`}
                                                size={20}
                                            />
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-500 ${openId === faq._id ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div
                                                className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm prose dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                                        <p className="text-gray-400">{copy.empty}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
