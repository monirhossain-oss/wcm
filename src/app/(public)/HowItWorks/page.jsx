'use client';

import React from 'react';
import Link from 'next/link';

const howItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Sign up as a creator and tell the world about your craft, culture, and story."
    },
    {
      id: 2,
      title: "Upload Listings",
      description: "Add your creations with photos, descriptions, and cultural tags that connect visitors to your traditions."
    },
    {
      id: 3,
      title: "Review & Approval",
      description: "Our team reviews listings for authenticity and cultural relevance before publishing."
    },
    {
      id: 4,
      title: "Get Discovered",
      description: "Your listings appear in our discovery feed. Boost visibility with optional featured placements."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-28 pb-20 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
  Empowering Global <span className="text-[#F57C00]">Craftsmanship</span>
</h1>
<p className="text-gray-500 dark:text-gray-400  md:text-xl max-w-3xl mx-auto leading-relaxed">
  World Cultural Marketplace (WCM) brings the world's finest artisans under one roof. 
  Follow these simple steps to start your journey with us.
</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-left">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="p-8 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0d0d0d] hover:shadow-xl transition-all duration-300 flex flex-col items-start h-full"
            >
              {/* Step Number Badge */}
              <div className="w-10 h-10 bg-[#F57C00] text-white rounded-full flex items-center justify-center font-bold mb-8 text-sm">
                {step.id}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link 
            href="/become-creator" 
            className="px-10 py-4 bg-[#F57C00] hover:bg-[#E65100] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Get Started
          </Link>
        </div>

      </div>
    </div>
  );
};

export default howItWorksPage;