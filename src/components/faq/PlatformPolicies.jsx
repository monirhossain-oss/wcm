"use client";
import React, { useState } from 'react';

const PolicyItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-white/10 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        <span className={`ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`}>
          ▼
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] pb-6' : 'max-h-0'}`}
      >
        <div className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-white/5 p-5 rounded-2xl">
          {answer}
        </div>
      </div>
    </div>
  );
};

const PlatformPolicies = () => {
  const policies = [
    {
      question: "How does WCM protect cultural authenticity?",
      answer: "The platform promotes respectful representation of cultural heritage. Listings must not misrepresent cultural traditions or violate intellectual property rights. Content that misrepresents cultural heritage, violates intellectual property rights, or is deemed offensive may be removed."
    },
    {
      question: "How are listings moderated?",
      answer: "Listings are subject to moderation to ensure they meet platform standards regarding quality, legality, and cultural respect."
    },
    {
      question: "What happens if a listing violates platform rules?",
      answer: "Listings that violate platform policies may be removed and creator accounts may be subject to review."
    },
    {
      question: "How can I report inappropriate content?",
      answer: "Users can report content directly through the platform using the reporting tools provided on listing pages."
    }
  ];

  return (
    <section className="py-12 px-4 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Platform Policies
          </h2>
        </div>

        {/* Policies Content Box */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-gray-100 dark:border-white/10 shadow-2xl shadow-gray-200/40 dark:shadow-none">
          <div className="space-y-2">
            {policies.map((policy, index) => (
              <PolicyItem 
                key={index} 
                question={policy.question} 
                answer={policy.answer} 
              />
            ))}
          </div>
        </div>

        {/* Integrity Note */}
        <div className="mt-8 p-6 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 rounded-r-2xl">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            <strong>Note:</strong> WCM is committed to maintaining a respectful and authentic environment for all global cultural creators.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PlatformPolicies;