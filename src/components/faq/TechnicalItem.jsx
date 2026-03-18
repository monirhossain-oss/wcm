"use client";
import React, { useState } from 'react';

const TechnicalItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left focus:outline-none group"
      >
        <span className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        <span className={`ml-4 transition-transform duration-500 font-mono text-xl ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`}>
          ↓
        </span>
      </button>
      <div 
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-white/5 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

const TechnicalFaq = () => {
  const technicalData = [
    {
      question: "What currencies are supported for promotional features?",
      answer: "Creators can pay for optional promotional tools such as Boosted Listings using USD (U.S. dollars) or EUR (euros)."
    },
    {
      question: "Do I need special software to use the platform?",
      answer: "No. The platform is accessible through any modern web browser on desktop or mobile devices."
    },
    {
      question: "Can I edit my listings after publishing?",
      answer: "Yes. Creators can update descriptions, images, pricing, and other details from their creator dashboard."
    },
    {
      question: "Is my data safe on WCM?",
      answer: "WCM is committed to protecting user information and follows modern security practices to safeguard personal and platform data. More details can be found in our Privacy Policy."
    },
    {
      question: "How can I report a problem or request support?",
      answer: "If you encounter a technical issue or have questions about the platform, you can contact the WCM team through the contact page or by email at: contact@worldculturemarketplace.com"
    },
    {
      question: "Is World Culture Marketplace mobile friendly?",
      answer: "Yes. The platform is designed to work smoothly on smartphones, tablets, and desktop devices."
    },
    {
      question: "Is it safe to use the platform?",
      answer: "The platform uses secure technologies to protect user data and provide safe browsing experiences."
    },
    {
      question: "How can I stay informed about new cultural creations?",
      answer: "Visitors can follow creators, browse curated collections, and explore new listings regularly added to the marketplace."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.3em] uppercase bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full">
            Technical Support
          </h2>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">
            Technical <span className="text-blue-600">Questions</span>
          </h3>
        </div>

        {/* FAQ Grid Layout */}
        <div className="grid grid-cols-1 gap-1">
          {technicalData.map((item, index) => (
            <TechnicalItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
            />
          ))}
        </div>

        {/* Support Link */}
        <p className="mt-12 text-center text-gray-500 dark:text-gray-500 text-sm">
          Having other technical issues? <a href="mailto:contact@worldculturemarketplace.com" className="text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors">Email our support team</a>
        </p>

      </div>
    </section>
  );
};

export default TechnicalFaq;