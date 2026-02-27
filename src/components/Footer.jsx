'use client';

import Link from 'next/link';
import { FaGlobe } from 'react-icons/fa'; // লোগো আইকন হিসেবে ব্যবহারের জন্য

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    
                    {/* Column 1: Logo & About */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-[#F57C00] text-2xl">
                                <FaGlobe />
                            </span>
                            <span className="text-xl font-bold tracking-tight text-[#1a1a1a] dark:text-white">
                                World Culture Marketplace
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed max-w-xs">
                            Connecting the world through cultural craftsmanship. Discover authentic creations from artisans across every continent.
                        </p>
                    </div>

                    {/* Column 2: Discover */}
                    <div>
                        <h3 className="text-[15px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">Discover</h3>
                        <ul className="space-y-4">
                            {['Discover','Cultures', 'Categories','Regions', 'Creators'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[15px]">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h3 className="text-[15px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-4">
                            {['About WCM', 'How It Works', 'Cultural Insights', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[15px]">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div>
                        <h3 className="text-[15px] font-bold text-[#1a1a1a] dark:text-white mb-6 uppercase tracking-wider">Support</h3>
                        <ul className="space-y-4">
                            {['FAQ', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 dark:text-gray-400 hover:text-[#F57C00] transition-colors text-[15px]">
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