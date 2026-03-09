import React from 'react';
import { 
    HiOutlineLightBulb, HiOutlineUserCircle, HiOutlineCloudUpload, 
    HiOutlineAcademicCap, HiOutlineStar, HiOutlineShieldCheck, 
    HiOutlineQuestionMarkCircle, HiChevronRight 
} from 'react-icons/hi';

const HelpCenter = () => {
    const topics = [
        { id: 1, title: "WCM Basics", desc: "Basic articles that will help you make the most of WCM", icon: <HiOutlineLightBulb className="text-blue-500" /> },
        { id: 2, title: "Account, Profile and Network", desc: "Learn how to manage your account and creative network", icon: <HiOutlineUserCircle className="text-blue-500" /> },
        { id: 3, title: "Creating, Editing & Publishing", desc: "Documentation about project settings and promoting work", icon: <HiOutlineCloudUpload className="text-blue-500" /> },
        { id: 4, title: "Career Resources", desc: "Learn more about our program to launch your creative career", icon: <HiOutlineAcademicCap className="text-blue-500" /> },
        { id: 5, title: "Hiring", desc: "How to hire creatives and get hired on WCM", icon: <HiOutlineStar className="text-blue-500" /> },
        { id: 6, title: "Assets", desc: "How to attach files like fonts and illustrations to your projects.", icon: <HiOutlineShieldCheck className="text-blue-500" /> },
    ];

    const articles = [
        "WCM Pro Overview", "Guide: Change Or Update Your Adobe ID", 
        "Guide: Following Creatives On WCM", "FAQ: Login and Account Access Issues"
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            <div className="w-full h-64 bg-gradient-to-r from-[#1a2b49] via-[#8c1e2f] to-[#be8e24] flex flex-col items-center justify-center text-white text-center px-4 shadow-inner">
                <h1 className="text-4xl font-bold mb-4">WCM Help Center</h1>
                <p className="text-lg opacity-90 font-light mb-8">Everything you need to get started on WCM</p>
                <input type="text" placeholder="Search help articles..." className="w-full max-w-2xl p-4 rounded-md text-gray-800 outline-none shadow-2xl" />
            </div>

            <div className="max-w-7xl mx-auto py-16 px-6">
                <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2 uppercase">
                    <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">?</span> Help Topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div key={topic.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex gap-4">
                            <div className="text-3xl mt-1">{topic.icon}</div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">{topic.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{topic.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase">📋 Featured Articles</h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {articles.map((article, index) => (
                        <div key={index} className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                            <span className="text-gray-700 font-medium">{article}</span>
                            <HiChevronRight className="text-gray-400 text-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;