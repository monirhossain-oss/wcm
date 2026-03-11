"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HiCloudUpload, HiArrowLeft } from 'react-icons/hi'; 
import emailjs from '@emailjs/browser';
import Lottie from "lottie-react";
import contactAnim from "../../../../public/animation/contact.json";

const ContactPage = () => {
    const router = useRouter();
    const formRef = useRef();
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setFileName(file.name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID; 
        const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC;

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                alert("Message Sent Successfully!");
                setLoading(false);
                formRef.current.reset(); 
                setFileName('');
            }, (error) => {
                console.log("Error:", error.text);
                alert("Something went wrong. Please try again.");
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 font-sans">
            {/* Back Button Section */}
            <div className="max-w-7xl mx-auto p-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-semibold uppercase text-[10px] tracking-[0.2em] group"
                >
                    <HiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" /> Back
                </button>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                
                {/* --- Lottie Animation Section --- */}
                <div className="hidden lg:flex bg-white rounded-2xl shadow-sm border border-gray-100 items-center justify-center p-8 overflow-hidden">
                    <div className="w-full h-full max-h-[600px]">
                        <Lottie
                            animationData={contactAnim}
                            loop={true}
                            autoplay={true}
                            style={{ width: '100%', height: '100%' }}
                            rendererSettings={{
                                preserveAspectRatio: 'xMidYMid slice'
                            }}
                        />
                    </div>
                </div>

                {/* --- Contact Form Section --- */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-center">
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get in touch</h1>
                        <p className="text-gray-500 mt-3 font-medium">
                            Our support team will get in touch with you shortly.
                        </p>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 uppercase tracking-widest text-[10px] font-bold">Full Name</label>
                                <input name="user_name" type="text" required placeholder="Your Name" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-700 uppercase tracking-widest text-[10px] font-bold">Email Address</label>
                                <input name="user_email" type="email" required placeholder="example@mail.com" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 uppercase tracking-widest text-[10px] font-bold">Subject</label>
                            <input name="subject" type="text" required placeholder="What is this regarding?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 uppercase tracking-widest text-[10px] font-bold">Message Details</label>
                            <textarea name="message" required rows="4" placeholder="How can we help you?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 uppercase tracking-widest text-[10px] font-bold">Attachments (Optional)</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all group cursor-pointer">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="flex items-center justify-center gap-3">
                                    <HiCloudUpload className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-sm font-medium text-gray-500 truncate max-w-[200px]">{fileName ? fileName : "Add screenshot or files"}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] shadow-blue-200 shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F57C00]'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Sending...
                                </span>
                            ) : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

