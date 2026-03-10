"use client";
import React, { useState } from 'react';
import Image from 'next/image'; // ছবির জন্য ইমপোর্ট
import Link from 'next/link'; // ব্যাক বাটনের জন্য ইমপোর্ট
import { 
    HiOutlineLightBulb, HiOutlineUserCircle, HiOutlineCloudUpload, 
    HiOutlineAcademicCap, HiOutlineStar, HiOutlineShieldCheck, 
    HiChevronRight, HiChevronDown, HiOutlineArrowNarrowLeft // ব্যাক আইকন
} from 'react-icons/hi';

const HelpCenter = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const topics = [
        { id: 1, title: "WCM Basics", desc: "Basic articles that will help you make the most of WCM", icon: <HiOutlineLightBulb className="text-blue-500" /> },
        { id: 2, title: "Account, Profile and Network", desc: "Learn how to manage your account and creative network", icon: <HiOutlineUserCircle className="text-blue-500" /> },
        { id: 3, title: "Creating, Editing & Publishing", desc: "Documentation about project settings and promoting work", icon: <HiOutlineCloudUpload className="text-blue-500" /> },
        { id: 4, title: "Career Resources", desc: "Learn more about our program to launch your creative career", icon: <HiOutlineAcademicCap className="text-blue-500" /> },
        { id: 5, title: "Hiring", desc: "How to hire creatives and get hired on WCM", icon: <HiOutlineStar className="text-blue-500" /> },
        { id: 6, title: "Assets", desc: "How to attach files like fonts and illustrations to your projects.", icon: <HiOutlineShieldCheck className="text-blue-500" /> },
    ];

    const articles = [
        { q: "WCM Pro Overview", a: "WCM Pro is our premium subscription that offers advanced features like portfolio customization, priority support, and detailed analytics for your creative projects." },
        { q: "Guide: Change Or Update Your Adobe ID", a: "To update your Adobe ID, go to Account Settings > Security. Click on 'Edit ID' and follow the verification steps sent to your email." },
        { q: "Guide: Following Creatives On WCM", a: "Simply visit a creator's profile and click the 'Follow' button. You will receive updates on their new projects in your feed." },
        { q: "FAQ: Login and Account Access Issues", a: "If you're having trouble logging in, try clearing your browser cache or use the 'Forgot Password' link to reset your access." }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20 font-sans">
            
            {/* --- ১. হেডার ব্যানার (ব্যাকগ্রাউন্ড ইমেজ এবং ব্যাক বাটন) --- */}
            <div className="relative w-full h-80 flex flex-col items-center justify-center text-white text-center px-6 overflow-hidden">
                
                {/* ব্যাকগ্রাউন্ড ছবি - Next.js Image Component ব্যবহার করে */}
                <Image 
                    src="https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1920" 
                    alt="Help Center Banner"
                    fill
                    className="object-cover absolute inset-0 z-0"
                    priority 
                />
                
            
                <div className="absolute inset-0 bg-black/40 z-10"></div>

              
                <Link href="/" className="absolute top-6 left-6 z-30 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                    <HiOutlineArrowNarrowLeft className="text-2xl transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium uppercase tracking-widest">Back to Home</span>
                </Link>

                {/* ব্যানার টেক্সট */}
                <div className="relative z-20 max-w-3xl mt-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">WCM Help Center</h1>
                    <p className="text-lg md:text-xl opacity-90 font-light max-w-2xl mx-auto">
                        Everything you need to get started on WCM, from basics to career resources.
                    </p>
                </div>
            </div>

            {/* Help Topics Grid */}
            <div className="max-w-7xl mx-auto py-16 px-6 relative z-10">
                <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                    <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">?</span> 
                    Help Topics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div key={topic.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex gap-5 items-start">
                            <div className="text-4xl mt-1 group-hover:scale-110 transition-transform">{topic.icon}</div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-light">{topic.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Articles with Answer (Accordion) */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">📋 Featured Articles</h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                    {articles.map((item, index) => (
                        <div key={index} className="border-b border-gray-50 last:border-0">
                            <button 
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center p-6 hover:bg-gray-50 cursor-pointer transition-colors text-left focus:outline-none group"
                            >
                                <span className="text-gray-700 font-medium text-[15px] group-hover:text-black">{item.q}</span>
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors">
                                    {openIndex === index ? 
                                        <HiChevronDown className="text-blue-600 text-xl" /> : 
                                        <HiChevronRight className="text-gray-400 text-xl group-hover:text-blue-500" />
                                    }
                                </div>
                            </button>
                            
                            {/* উত্তর সেকশন (শুধুমাত্র ক্লিক করলেই দেখাবে) */}
                            {openIndex === index && (
                                <div className="p-6 bg-blue-50/20 text-gray-600 text-sm leading-relaxed border-t border-blue-50 font-light">
                                    <p className="max-w-4xl">{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;