import React from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { localePath } from '@/lib/i18n';

const FaqContact = ({ language = 'en' }) => {
    const copy = language === 'fr'
        ? { eyebrow: 'Contactez-nous', title: 'Vous avez encore des questions ?', description: 'Notre équipe d’assistance est disponible 24 h/24 et 7 j/7 pour vous aider sur les questions culturelles ou techniques.', contact: 'Contacter l’assistance', docs: 'Lire la documentation' }
        : { eyebrow: 'Connect With Us', title: 'Still have questions?', description: 'Our dedicated support team is available 24/7 to help you with any cultural or technical inquiries.', contact: 'Contact Support', docs: 'Read Documentation' };
    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">

                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[#F57C00] font-bold text-[10px] uppercase tracking-[0.2em]">
                            <MessageCircle size={16} strokeWidth={3} />
                            <span>{copy.eyebrow}</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {copy.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                            {copy.description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">

                        <Link href={localePath(language, '/contact')}>
                            <button className="bg-[#F57C00] dark:bg-transparent border border-[#F57C00] text-white dark:text-white dark:border-zinc-700 px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm">
                                {copy.contact}
                            </button>
                        </Link>

                        <button className="text-gray-600 dark:text-gray-400 text-sm font-bold hover:text-gray-900 dark:hover:text-white transition-colors">
                            {copy.docs}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FaqContact;
