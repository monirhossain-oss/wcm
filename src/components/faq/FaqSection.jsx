"use client";
import React, { useState } from 'react';

const FaqItem = ({ question, answer, list }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <h3 className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-[#F57C00]' : 'text-gray-800 dark:text-gray-200'}`}>
          {question}
        </h3>
        <span className={`transform transition-transform duration-300 text-2xl ${isOpen ? 'rotate-45 text-[#F57C00]' : 'text-gray-400'}`}>
          +
        </span>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
          {answer}
        </p>
        {list && (
          <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-400">
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      category: "General Questions",
      items: [
        {
          question: "What is World Culture Marketplace?",
          answer: "World Culture Marketplace (WCM) is an online cultural art marketplace dedicated to showcasing and promoting creative works inspired by cultures from around the world. The platform connects creators, artists and artisans with a global audience interested in cultural art, handmade crafts, traditional textiles, fashion, and many more traditional objects."
        },
        {
          question: "Who can join the platform?",
          answer: "Creators, artists, artisans, designers, and cultural entrepreneurs from anywhere in the world can join the platform and showcase their work, provided their content complies with our quality and cultural integrity guidelines."
        },
        {
          question: "What types of products or content can be listed?",
          answer: "Creators may showcase a wide range of cultural and creative works, including:",
          list: [
            "Paintings and illustrations",
            "Sculptures and carvings",
            "Handmade crafts",
            "Cultural fashion and textiles",
            "Decorative objects and home decor",
            "Digital creative works inspired by cultural traditions"
          ]
        }
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 bg-[#F57C00] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-10">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-[#F57C00] uppercase tracking-widest mb-6">
                {section.category}
              </h4>
              <div className="space-y-2">
                {section.items.map((faq, i) => (
                  <FaqItem 
                    key={i} 
                    question={faq.question} 
                    answer={faq.answer} 
                    list={faq.list}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;