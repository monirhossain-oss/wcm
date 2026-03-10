"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiCloudUpload } from 'react-icons/hi'; 

const ContactPage = () => {
    const router = useRouter();
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // সাবমিট হওয়ার পর আপনার তৈরি করা helpCenter পেজে নিয়ে যাবে
        router.push('/helpCenter'); 
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-20">
            <div className="w-full h-48 bg-gradient-to-r from-[#1a2b49] via-[#8c1e2f] to-[#be8e24] flex flex-col items-center justify-center text-white mb-10 px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">WCM Help Center</h1>
                <p className="opacity-80 mt-2 font-light">Everything you need to get started on WCM</p>
            </div>

            <div className="w-full max-w-2xl bg-white p-6 md:p-12 rounded-lg shadow-sm border border-gray-100 mx-4">
                <h2 className="text-2xl font-semibold mb-8 border-b pb-4 text-gray-800">Submit a request</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Your email address <span className="text-gray-400 font-normal">(required)</span></label>
                        <input type="email" required placeholder="shulybd1245@gmail.com" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Subject <span className="text-gray-400 font-normal">(required)</span></label>
                        <input type="text" required className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Description <span className="text-gray-400 font-normal">(required)</span></label>
                        <textarea required rows="6" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Attachments</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-gray-50 hover:border-blue-500 transition-colors group cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="flex flex-col items-center gap-2">
                                <HiCloudUpload className="text-4xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                                {fileName ? <p className="text-sm text-green-600 font-medium">Selected: {fileName}</p> : <p className="text-sm text-blue-600 font-medium">Add file or drop files here</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full md:w-auto md:px-12 bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;