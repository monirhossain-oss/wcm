'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaGlobe } from 'react-icons/fa'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo & About */}
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="cursor-pointer">
              {/* Light Mode Logo */}
              <Image
                src="/wc,-web-logo.png"
                alt="Logo Light"
                width={100}
                height={100}
                className="dark:hidden brightness-125 h-auto w-auto"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/wc,-web-white.png"
                alt="Logo Dark"
                width={100}
                height={100}
                className="hidden dark:block brightness-125 h-auto w-auto"
              />
            </Link>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h4 className="text-[1-px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">
              Discover
            </h4>
            <ul className="3">
              {['Discover', 'Cultures', 'Categories', 'Regions', 'Creators'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
         <div>
  <h4 className="text-[12px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">
    Company
  </h4>
  
  {/* Flex column ব্যবহার করে লিঙ্কগুলো সাজানো হয়েছে */}
  <ul className="flex flex-col ">
    <li>
      <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]">
        About WCM
      </Link>
    </li>
    <li>
      <Link href="/howItWorks" className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]">
        How It Works
      </Link>
    </li>
    <li>
      <Link href="/cultural-insights" className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]">
        Cultural Insights
      </Link>
    </li>
    <li>
      <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]">
        Contact
      </Link>
    </li>

    
  </ul>
</div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-[12px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">
              Support
            </h4>
            <ul className="3">
              {['FAQ', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[12px]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright Only */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            {currentYear} World Culture Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
