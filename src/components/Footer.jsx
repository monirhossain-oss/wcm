'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#F9F9F9] dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Column 1: Logo & About */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            {/* Light Mode Logo */}
                            <Image
                                src="/wc,-web-logo.png"
                                alt="Logo Light"
                                width={120}
                                height={40}
                                className="dark:hidden h-auto"
                            />
                            {/* Dark Mode Logo */}
                            <Image
                                src="/wc,-web-white.png"
                                alt="Logo Dark"
                                width={120}
                                height={40}
                                className="hidden dark:block h-auto"
                            />
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Connecting the world through authentic stories, traditional crafts, and cultural experiences. Discover the beauty of heritage.
                        </p>
                        <div className="flex space-x-4">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                                <a key={index} href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#F57C00] hover:text-white transition-all duration-300 shadow-sm">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-6">Explore</h3>
                        <ul className="space-y-4">
                            {['Discover', 'Cultures', 'Categories', 'Regions', 'Creators'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-400 hover:text-[#F57C00] dark:hover:text-[#F57C00] transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            
                            <li className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                <FaPhoneAlt className="text-[#F57C00]" />
                                <span>+1 234 567 890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                <FaEnvelope className="text-[#F57C00]" />
                                <span>hello@culturemarket.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-6">Stay Updated</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Subscribe to get the latest cultural stories and product drops.
                        </p>
                        <form className="relative">
                            <input 
                                type="email" 
                                placeholder="Your email" 
                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all"
                            />
                            <button className="absolute right-1.5 top-1.5 bg-[#F57C00] text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-[#d46a00] transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-left">
                       {currentYear} World Culture Marketplace. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-xs text-gray-500 dark:text-gray-500">
                        <Link href="/privacy" className="hover:text-[#F57C00]">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#F57C00]">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
