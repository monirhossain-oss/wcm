"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HiCloudUpload, HiArrowLeft, HiX } from 'react-icons/hi'; 
import emailjs from '@emailjs/browser';
import Lottie from "lottie-react";
import contactAnim from "../../../../public/animation/contact.json";

const ContactPage = () => {
    const router = useRouter();
    const formRef = useRef();
    const [fileName, setFileName] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null); // ইমেজের জন্য স্টেট
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            // ইমেজ ফাইল হলে প্রিভিউ তৈরি করবে
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const removeFile = () => {
        setFileName('');
        setPreviewUrl(null);
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
                setPreviewUrl(null);
            }, (error) => {
                console.log("Error:", error.text);
                alert("Something went wrong. Please try again.");
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-16 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold uppercase text-[10px] tracking-[0.2em] group"
                >
                    <HiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" /> Back
                </button>
            </div>

          
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch overflow-hidden">
                
                {/* --- Animation (Rounded-l only) --- */}
                <div className="hidden lg:flex bg-white dark:bg-slate-900/50 rounded-l-2xl border border-r-0 border-gray-100 dark:border-slate-800 items-center justify-center p-8">
                    <div className="w-full h-full max-h-[500px]">
                        <Lottie animationData={contactAnim} loop={true} autoplay={true} />
                    </div>
                </div>

                {/* ---  Form (Rounded-r only) --- */}
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl lg:rounded-l-none lg:rounded-r-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Get in touch</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Our support team will get in touch with you shortly.</p>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px] font-bold">Full Name</label>
                                <input name="user_name" type="text" required placeholder="Your Name" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px] font-bold">Email Address</label>
                                <input name="user_email" type="email" required placeholder="example@mail.com" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px] font-bold">Subject</label>
                            <input name="subject" type="text" required placeholder="What is this regarding?" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px] font-bold">Message Details</label>
                            <textarea name="message" required rows="3" placeholder="How can we help you?" className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none resize-none"></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 dark:text-gray-300 uppercase tracking-widest text-[10px] font-bold">Attachments (Optional)</label>
                            
                            {!previewUrl ? (
                                <div className="relative border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-4 text-center bg-gray-50 dark:bg-slate-800/30 hover:border-blue-400 transition-all group cursor-pointer">
                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center justify-center gap-3">
                                        <HiCloudUpload className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Add screenshot or files</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <HiX size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F57C00] hover:bg-[#E65100]'}`}
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;