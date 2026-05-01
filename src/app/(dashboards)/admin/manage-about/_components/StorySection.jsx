"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiSave, FiBookOpen, FiUploadCloud, FiEdit3 } from 'react-icons/fi';

const StorySection = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // নতুন ইমেজ ফাইল
    const [previewUrl, setPreviewUrl] = useState(null); // প্রিভিউ দেখানোর জন্য

    const [formData, setFormData] = useState({
        upperLine: '',
        lowerLine: '',
        descriptions: '',
        highlightText: '',
        testimonialQuote: '',
        testimonialAuthor: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                upperLine: data.headline?.upperLine || '',
                lowerLine: data.headline?.lowerLine || '',
                descriptions: data.descriptions?.join('\n\n') || '',
                highlightText: data.highlightText || '',
                testimonialQuote: data.testimonialCard?.quote || '',
                testimonialAuthor: data.testimonialCard?.author || ''
            });
            // ডাটা লোড হলে প্রিভিউ রিসেট করা
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [data]);

    // ইমেজ সিলেক্ট করলে শুধু প্রিভিউ দেখাবে, আপলোড হবে না
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // লোকাল প্রিভিউ ইউআরএল তৈরি
        }
    };

    const handleUpdateAll = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // যেহেতু ইমেজ ফাইল আছে, তাই FormData ব্যবহার করতে হবে
            const uploadData = new FormData();

            uploadData.append('upperLine', formData.upperLine);
            uploadData.append('lowerLine', formData.lowerLine);
            uploadData.append('highlightText', formData.highlightText);
            uploadData.append('testimonialQuote', formData.testimonialQuote);
            uploadData.append('testimonialAuthor', formData.testimonialAuthor);

            // ডেসক্রিপশন অ্যারে হিসেবে JSON স্ট্রিং করে পাঠানো (আপনার ব্যাকএন্ডের JSON.parse অনুযায়ী)
            const descArray = formData.descriptions.split('\n\n').filter(p => p.trim() !== '');
            uploadData.append('descriptions', JSON.stringify(descArray));

            // যদি নতুন কোনো ফাইল সিলেক্ট করা থাকে
            if (selectedFile) {
                uploadData.append('mainImage', selectedFile);
            }

            const res = await aboutService.updateStory(uploadData);

            if (res.data.success) {
                toast.success("Story updated successfully!");
                setSelectedFile(null);
                setPreviewUrl(null);
                refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl mt-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
                    <FiBookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Story Section</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left: Image Preview & Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Story Image</label>
                    <div className="relative group aspect-[4/5] bg-gray-900 rounded-2xl border-2 border-dashed border-gray-800 hover:border-amber-500/50 overflow-hidden transition-all">
                        {/* যদি নতুন সিলেক্ট করা প্রিভিউ থাকে সেটা দেখাবে, না থাকলে সার্ভারেরটা */}
                        <img
                            src={previewUrl || data?.mainImage || "/placeholder-image.jpg"}
                            alt="Story"
                            className={`w-full h-full object-cover transition-opacity ${selectedFile ? 'opacity-100' : 'opacity-70 group-hover:opacity-50'}`}
                        />

                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl font-semibold">
                                <FiEdit3 /> {selectedFile ? "Change Selection" : "Select Image"}
                            </div>
                        </label>
                    </div>
                    {selectedFile && (
                        <p className="text-xs text-amber-500 text-center font-medium animate-pulse italic">
                            * New image selected. Click update to save.
                        </p>
                    )}
                </div>

                {/* Right: Form Data */}
                <form onSubmit={handleUpdateAll} className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Upper Headline</label>
                            <input
                                type="text"
                                value={formData.upperLine}
                                onChange={(e) => setFormData({ ...formData, upperLine: e.target.value })}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Lower Headline</label>
                            <input
                                type="text"
                                value={formData.lowerLine}
                                onChange={(e) => setFormData({ ...formData, lowerLine: e.target.value })}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Narrative (Descriptions)</label>
                        <textarea
                            value={formData.descriptions}
                            onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-4 text-white h-48 resize-none leading-relaxed outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-rose-400 uppercase tracking-widest">Highlight Text</label>
                        <input
                            type="text"
                            value={formData.highlightText}
                            onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-rose-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/30 p-4 rounded-2xl border border-gray-800">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Testimonial Quote</label>
                            <textarea
                                value={formData.testimonialQuote}
                                onChange={(e) => setFormData({ ...formData, testimonialQuote: e.target.value })}
                                className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white h-20 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Author Name</label>
                            <input
                                type="text"
                                value={formData.testimonialAuthor}
                                onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                                className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg"
                    >
                        <FiSave size={20} />
                        {loading ? 'Processing Update...' : 'Update Our Story'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StorySection;