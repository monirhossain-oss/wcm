'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaPinterestP, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const staticData = {
    aboutText: "Connecting the world through authentic culture, one story at a time.",
    socialLinks: {
      instagram: "",
      pinterest: "",
      linkedin: "",
      facebook: ""
    },
    platformLinks: [
      { label: "About Us", href: "/about-us" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQ", href: "/faqUs" }
    ],
    resourceLinks: [
      { label: "Blogs", href: "/blogs" },
      { label: "Contact", href: "/contact" },
      { label: "Creators", href: "/creators" }
    ],
    legalLinks: [
      { label: "Boost & PPC terms & condition", href: "/boost-terms-and-ppc" },
      { label: "Creator Terms & Condition", href: "/creator-terms-and-conditions" },
      { label: "Advertising Policy", href: "/advertising-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Cookie Policy", href: "/cookie-policy" }
    ],
    newsletterTitle: "Stay Connected",
    newsletterDescription: "Stay informed about cultural stories and discoveries. More to come."
  };

  const [footerData, setFooterData] = useState(staticData);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");


  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/footer`, { next: { revalidate: 60 } });

        if (data.success && data.data) {
          const db = data.data;

          const getMergedLinks = (staticLinks, dbLinks) => {
            const merged = staticLinks.map(sLink => {
              const foundInDb = dbLinks?.find(dLink => dLink.label.toLowerCase() === sLink.label.toLowerCase());
              return foundInDb ? foundInDb : sLink;
            });

            const staticLabels = staticLinks.map(l => l.label.toLowerCase());
            const extraLinks = dbLinks?.filter(dLink => !staticLabels.includes(dLink.label.toLowerCase())) || [];

            return [...merged, ...extraLinks];
          };

          setFooterData({
            aboutText: db.aboutText || staticData.aboutText,
            newsletterTitle: db.newsletterTitle || staticData.newsletterTitle,
            newsletterDescription: db.newsletterDescription || staticData.newsletterDescription,
            socialLinks: {
              instagram: db.socialLinks?.instagram || "",
              pinterest: db.socialLinks?.pinterest || "",
              linkedin: db.socialLinks?.linkedin || "",
              facebook: db.socialLinks?.facebook || "",
            },
            platformLinks: getMergedLinks(staticData.platformLinks, db.platformLinks),
            resourceLinks: getMergedLinks(staticData.resourceLinks, db.resourceLinks),
            legalLinks: getMergedLinks(staticData.legalLinks, db.legalLinks),
          });
        }
      } catch (error) {
        console.log("Error fetching footer, using static backup.");
      }
    };
    fetchFooter();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emails`;

      const response = await axios.post(apiUrl, { email: email });

      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        setEmail("");
        alert("Subscription Successful! Thank you for staying connected.");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      setStatus("error");

      if (error.response && error.response.status === 400) {
        alert("This email is already subscribed!");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {

      setTimeout(() => setStatus(""), 3000);
    }
  };

  // Social icon configuration
  const socialIcons = [
    { key: 'instagram', icon: FaInstagram, label: 'Instagram' },
    { key: 'pinterest', icon: FaPinterestP, label: 'Pinterest' },
    { key: 'linkedin', icon: FaLinkedinIn, label: 'LinkedIn' },
    { key: 'facebook', icon: FaFacebook, label: 'Facebook' },
  ];

  // Check if URL is valid (admin added)
  const hasValidUrl = (url) => url && url.trim() !== '';

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 transition-colors duration-500 border-t border-gray-200 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Column 1 - Logo & About */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center mb-6">
              <Image src="/wc,-web-logo.png" alt="Logo" width={120} height={40} className="dark:hidden brightness-110 h-auto w-auto" priority />
              <Image src="/wc,-web-white.png" alt="Logo" width={120} height={40} className="hidden dark:block brightness-110 h-auto w-auto" priority />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">{footerData.aboutText}</p>

            {/* Social Icons - Always visible but clickable only if admin added link */}
            <div className="flex space-x-5 text-xl">
              {socialIcons.map(({ key, icon: Icon, label }) => {
                const url = footerData.socialLinks[key];
                const isActive = hasValidUrl(url);

                return isActive ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F57C00] transition-colors cursor-pointer"
                    title={label}
                  >
                    <Icon />
                  </a>
                ) : (
                  <span
                    key={key}
                    className="text-gray-300 dark:text-gray-700 cursor-not-allowed"
                    title={`${label} - Not configured`}
                  >
                    <Icon />
                  </span>
                );
              })}
            </div>
          </div>

          {/* Column 2 & 3 - Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="text-center md:text-left">
              <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                {footerData.platformLinks.map((link, idx) => (
                  <li key={idx}><Link href={link.href} className="hover:text-[#F57C00] transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3 text-sm">
                {footerData.resourceLinks.map((link, idx) => (
                  <li key={idx}><Link href={link.href} className="hover:text-[#F57C00] transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="text-black dark:text-white text-sm font-bold uppercase tracking-widest mb-6">{footerData.newsletterTitle}</h4>
            <p className="text-sm mb-4">{footerData.newsletterDescription}</p>
            <form onSubmit={handleSubscribe} className="w-full space-y-3">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-[#F57C00] transition-all rounded-md"
              />
              <button type="submit" disabled={status === "loading"} className="w-full bg-[#F57C00] hover:bg-[#e67600] text-white py-3 text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded-md shadow-md active:scale-95">
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
            {footerData.legalLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:text-[#F57C00] transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;