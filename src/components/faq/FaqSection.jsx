'use client';
import React, { useState } from 'react';
import { ChevronDown, Globe, Users, Rocket, Zap, Wallet, Lock, ShieldQuestion } from 'lucide-react';

const FaqSection = () => {
    const [activeCategory, setActiveCategory] = useState('General');
    const [openIndex, setOpenIndex] = useState(null);

    const categories = [
        { id: 'General', icon: <Globe size={16} />, label: 'General' },
        { id: 'Artists', icon: <Users size={16} />, label: 'For Creators and Artists' },
        { id: 'Creators', icon: <Rocket size={16} />, label: 'For Visitors and Buyers' },
        { id: 'Boost', icon: <Zap size={16} />, label: 'Boost & PPC' },
        { id: 'Payments', icon: <Wallet size={16} />, label: 'Payments & Wallet' },
        { id: 'Privacy', icon: <Lock size={16} />, label: 'Privacy & GDPR' },
        { id: 'Technical', icon: <ShieldQuestion size={16} />, label: 'Technical & Support' },
    ];

    const faqData = {
        General: [
            { 
                question: "What is World Culture Marketplace?", 
                answer: `World Culture Marketplace (WCM) is an online cultural art marketplace dedicated to showcasing and promoting creative works inspired by cultures from around the world. The platform connects creators, artists and artisans with a global audience interested in cultural art, handmade crafts, traditional textiles, fashion, and many more traditional objects.` 
            },
            { 
                question: "Who can join the platform?", 
                answer: `Creators, artists, artisans, designers, and cultural entrepreneurs from anywhere in the world can join the platform and showcase their work, provided their content complies with our quality and cultural integrity guidelines.` 
            },
            { 
                question: "What types of products or content can be listed?", 
                answer: `Creators may showcase a wide range of cultural and creative works, including:
                <ul class="list-disc ml-6 mt-2 space-y-1">
                    <li>Paintings and illustrations</li>
                    <li>Sculptures and carvings</li>
                    <li>Handmade crafts</li>
                    <li>Cultural fashion and textiles</li>
                    <li>Decorative objects and home decor</li>
                    <li>Digital creative works inspired by cultural traditions</li>
                </ul>
                <p class="mt-3 font-medium">All listings must respect cultural heritage and intellectual property rights.</p>` 
            }
        ],
        Artists: [
            { question: "How do I create a creator account?", answer: `You can register by creating
a creator profile on the platform. Once registered, you can
upload your creations, build your profile, and begin promoting your work to a global
audience`},
            { question: "Who can join WCM as a creator?", answer: `Artists, artisans, designers, and creators interested in sharing c
ultural creativity can join the
platform. The marketplace welcomes creators working with
traditional crafts
manship
,
cultural art, handmade decor, and heritage
-
inspired designs
.` },
            { question: "Is World Culture Marketplace free to join?", answer: `Creating a basic creator account i
s free. Creators may optionally purchase promotional
services such as boosted listings
or Pay
-
Per
-
Click (PPC)
to increase the visibility of their
creations.
For more details, see
Boost & PPC
.` },
            { question: "What are boosted listings?", answer: `Boosted listings are optional promot
ional features that allow creators to increase the visibility
of their creations on the platform. Boosted listings may appear in featured sections, search
results, or curated collections.
Boosting helps creators reach a wider audience while keeping partici
pation optional
.` },
            { question: "What is Pay-Per-click (PPC) Promotion", answer: `Pay
-
Per
-
Click (PPC) is an optional promotional feature that allows creators to increase the
visibility of their cultural artwork, handmade crafts, or creative products on World Culture
Marketplace.
With PPC promotion, creators only pay when a visitor
clicks on their promoted listing
. This
model allows creators to promote their creations while controlling their promotional budget
.` },
            { question: "How much does it cost to boost a listing?", answer: `Boost pricing varies
depending on the selected promotion package and duration. Pricing is
displayed before a creator activates a boost, and creators can choose whether or not to use
this feature.
Payments may be made in
USD or EUR
, depending on the creator’s preference
.` },
            { question: "Do you take a commission on sels", answer: `No. Visitors are redirected to Seller/ Creator website to complete their purchase. WCM does
not take any commission on sales.
World Culture Marketplace acts as an intermediary platform connecting creators with buyers.
Creato
rs remain responsible for the sale, fulfillment, and tax obligations related to their
products
.` },
           { 
  question: "What types of creators are featured on WCM?", 
  answer: `WCM features a wide range of cultural creators, including:
  <ul class="list-disc ml-6 mt-2 space-y-1">
    <li>Artisans and craftspeople</li>
    <li>Textile artists and clothing designers</li>
    <li>Jewelry makers</li>
    <li>Sculptors and wood carvers</li>
    <li>Potters and ceramic artists</li>
    <li>Cultural storytellers and heritage creators</li>
  </ul>
  <p class="mt-3">The platform focuses on creators whose work reflects cultural traditions, heritage, and craftsmanship.</p>` 
},
{

  question:"Can I sell digital products?",
  answer:`Yes. Creators may offer digital products such as downloadable artwork, design files, or
cultural creative content, provided they compl
y with platform policies.`
},
        ],
        Creators: [
         { 
  question: "How can I discover creators on WCM?", 
  answer: `Visitors can explore the platform through several pathways, including:
  <ul class="list-disc ml-6 mt-2 space-y-1">
    <li>Cultural regions (Africa, Asia, Europe, Americas, Middle East, Oceania)</li>
    <li>Creator profiles</li>
    <li>Featured works</li>
    <li>Cultural topics and stories</li>
  </ul>
  <p class="mt-3">These sections help visitors discover creators and learn about the cultural traditions behind their work.</p>` 
},
            { question: "Can I find authentic handmade crafts online on WCM?", answer: `Yes. The platform promotes
authentic handmade crafts and cult
ural creations
from artists
and artisans worldwide` }
        ],
        Boost: [
            { question: "Does WCM verify creators?", answer: `WCM aims to promote authentic cultural creators and heritage
-
based work. While the
platform may review profiles and submissions, creators remain responsible for the content
and
information they share"` }
        ],
        Payments: [
            { question: "Are there hidden fees?", answer: "No, we ensure fair representation with no hidden fees or aggressive algorithms." }
        ],
        Privacy: [
            { question: "Is my data secure?", answer: "We follow strict privacy and GDPR protocols to protect our community." }
        ],
        Technical: [
            { question: "Where is the support center?", answer: "Our support center is available for any technical assistance you may need." }
        ]
    };

    const currentFaqs = faqData[activeCategory] || [];

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
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                                activeCategory === cat.id
                                    ? 'bg-[#F57C00] border-[#F57C00] text-white shadow-lg' 
                                    : 'bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Dynamic FAQ List */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4 w-fit pr-20">
                        {activeCategory}
                    </h3>
                    
                    {currentFaqs.map((faq, index) => (
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
                            
                            {/* এখানে dangerouslySetInnerHTML*/}
                            <div className={`overflow-hidden transition-all duration-300 ${
                                openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                                <div 
                                    className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;