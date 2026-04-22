'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaPinterestP, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC;

    const templateParams = {
      user_email: email,
      message: "New Newsletter Subscription",
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setStatus("success");
      setEmail("");
      alert("Subscription Successful!");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      alert("Something went wrong. Please try again.");
    } finally {
      setStatus("");
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 transition-colors duration-500 border-t border-gray-200 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Column 1 - Logo & About */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center mb-6">
              <Image src="/wc,-web-logo.png" alt="Logo" width={120} height={40} className="dark:hidden brightness-110 h-auto w-auto" priority />
              <Image src="/wc,-web-white.png" alt="Logo" width={120} height={40} className="hidden dark:block brightness-110 h-auto w-auto" priority />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Connecting the world through authentic culture, one story at a time.
            </p>
            <div className="flex space-x-5 text-xl">
              <a
                href="https://instagram.com/wordculturemarketplace"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#F57C00] transition-colors cursor-pointer" 
              >
                <FaInstagram />
              </a>

              <a
                href="https://pinterest.com/wordculturemarketplace"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#F57C00] transition-colors cursor-pointer"
              >
                <FaPinterestP />
              </a>

              <a
                href="https://linkedin.com/wordculturemarketplace"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#F57C00] transition-colors cursor-pointer"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://facebook.com/wordculturemarketplace"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#F57C00] transition-colors cursor-pointer"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Column 2 & 3 - Links (Mobile e Pasa Pasi) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* Platform */}
            <div className="text-center md:text-left">
              <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/aboutUs" className="hover:text-[#F57C00] transition-colors">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-[#F57C00] transition-colors">How It Works</Link></li>
                <li><Link href="/faqUs" className="hover:text-[#F57C00] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="text-center md:text-left">
              <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/blogs" className="hover:text-[#F57C00] transition-colors">Blogs</Link></li>
                <li><Link href="/contact" className="hover:text-[#F57C00] transition-colors">Contact</Link></li>
                <li><Link href="/creators" className="hover:text-[#F57C00] transition-colors">Creators</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Stay Connected</h4>
            <p className="text-sm mb-4">Stay informed about cultural stories and discoveries. More to come.</p>
            <form onSubmit={handleSubscribe} className="w-full space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-[#F57C00] transition-all rounded-md"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#F57C00] hover:bg-[#e67600] text-white py-3 text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded-md shadow-md active:scale-95"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-medium">
          <p className="text-center md:text-left order-2 md:order-1">
            © {currentYear} <span className="text-[#F57C00]">World Culture Marketplace</span><sup className="ml-0.5">&reg;</sup>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 order-1 md:order-2">
            <Link href="/boost-terms-and-ppc" className="hover:text-[#F57C00] transition-colors">Boost Terms & PPC</Link>
            <Link href="/creator-terms-and-conditions" className="hover:text-[#F57C00] transition-colors">Creator Terms & Condition</Link>
            <Link href="/advertising-policy" className="hover:text-[#F57C00] transition-colors">Advertising Policy</Link>
            <Link href="/privacy-policy" className="hover:text-[#F57C00] transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#F57C00] transition-colors">Terms & Conditions</Link>
            <Link href="/cookie-policy" className="hover:text-[#F57C00] transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;