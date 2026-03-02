'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaPinterestP, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 - Logo + Description */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <Image
                src="/wc,-web-logo.png"
                alt="Logo Light"
                width={100}
                height={100}
                className="dark:hidden brightness-125 h-auto w-auto"
              />
              <Image
                src="/wc,-web-white.png"
                alt="Logo Dark"
                width={100}
                height={100}
                className="hidden dark:block brightness-125 h-auto w-auto"
              />
            </Link>

            <p className="text-sm leading-relaxed mb-6">
              Connecting the world through authentic culture,
              one story at a time.
            </p>

            <div className="flex space-x-4 text-lg">
              <FaInstagram className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
              <FaPinterestP className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
              <FaLinkedinIn className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Column 2 - Platform */}
          <div>
            <h4 className="text-black dark:text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/discover" className="hover:text-black dark:hover:text-white transition-colors">Discover</Link></li>
              <li><Link href="/regions" className="hover:text-black dark:hover:text-white transition-colors">Regions</Link></li>
              <li><Link href="/creators" className="hover:text-black dark:hover:text-white transition-colors">Creators</Link></li>
              <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-black dark:text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/blogs" className="hover:text-black dark:hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-black dark:hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-black dark:text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Stay Connected
            </h4>

            <p className="text-sm mb-4">
              Weekly cultural stories, delivered to your inbox.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 text-sm font-medium hover:opacity-90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-600 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">
            © {currentYear} World Culture Marketplace. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-black dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-&-conditions" className="hover:text-black dark:hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-black dark:hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;