"use client";
import React, { useState } from 'react';

const AccordionItem = ({ question, answer, list }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-white/10 mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        <span className={`ml-4 text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-500' : 'text-gray-400'}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] pb-5' : 'max-h-0'}`}>
        <div className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
          <p>{answer}</p>
          {list && (
            <ul className="mt-3 space-y-2 list-disc ml-5">
              {list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const VisitorsAndPolicies = () => {
  const visitorFaqs = [
    {
      question: "How can I discover creators on WCM?",
      answer: "Visitors can explore the platform through several pathways, including:",
      list: [
        "Cultural regions (Africa, Asia, Europe, Americas, Middle East, Oceania)",
        "Creator profiles",
        "Featured works",
        "Cultural topics and stories"
      ]
    },
    {
      question: "Can I find authentic handmade crafts online on WCM?",
      answer: "Yes. The platform promotes authentic handmade crafts and cultural creations from artists and artisans worldwide."
    },
    {
      question: "Does the marketplace ship products?",
      answer: "No. WCM does not conduct any sell. Creators manage their own fulfillment and shipping."
    },
    {
      question: "Can I contact creators directly?",
      answer: "Yes .Many creators provide links to their website, social media pages, or other  contact metods on their profile pages. Visitors can use these links to reach directly."
    },
    {
      question: "How do I purchase items?",
      answer: "Buyers can browse the platform, discover creations from different cultures, and follow links to complete purchases depending on the seller’s fulfillment method."
    }
  ];

  const policyFaqs = [
    {
      question: "How does WCM protect cultural authenticity?",
      answer: "The platform promotes respectful representation of cultural heritage. Listings must not misrepresent cultural traditions or violate intellectual property rights. Content that misrepresents cultural heritage, violates intellectual property rights, or is deemed offensive may be removed."
    },
    {
      question: "How are listings moderated?",
      answer: "Listings are subject to moderation to ensure they meet platform standards regarding quality, legality, and cultural respect."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Visitors Section */}
        <div>
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center">
            <span className="w-10 h-[2px] bg-blue-600 mr-3"></span>
            For Visitors and Buyers
          </h2>
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-100 dark:shadow-none">
            {visitorFaqs.map((faq, index) => (
              <AccordionItem key={index} {...faq} />
            ))}
          </div>
        </div>

        {/* Policies Section */}
        {/* <div>
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center">
            <span className="w-10 h-[2px] bg-blue-600 mr-3"></span>
            Platform Policies
          </h2>
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-100 dark:shadow-none">
            {policyFaqs.map((faq, index) => (
              <AccordionItem key={index} {...faq} />
            ))}
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default VisitorsAndPolicies;