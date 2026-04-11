"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Next.js এর জন্য সঠিক এনভায়রনমেন্ট ভেরিয়েবল
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SeoSettings = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formData, setFormData] = useState({
        pageName: 'home',
        title: '',
        description: '',
        keywords: ''
    });

    // নির্দিষ্ট পেজের এসইও ডাটা ডাটাবেজ থেকে নিয়ে আসা
    const fetchSeoData = async (page) => {
        setFetching(true);
        try {
            // API_URL ব্যবহার করা হয়েছে
            const res = await axios.get(`${API_URL}/api/seo/${page}`);
            if (res.data) {
                setFormData({
                    pageName: page,
                    title: res.data.title || '',
                    description: res.data.description || '',
                    keywords: res.data.keywords?.join(', ') || ''
                });
            }
        } catch (error) {
            // ডাটা না থাকলে ফিল্ড খালি করে দিবে
            setFormData({
                pageName: page,
                title: '',
                description: '',
                keywords: ''
            });
            console.log("No existing SEO data for this page.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (API_URL) {
            fetchSeoData(formData.pageName);
        }
    }, [formData.pageName]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!API_URL) {
            toast.error("API URL not found in environment variables!");
            return;
        }

        setLoading(true);
        try {
            const keywordsArray = formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [];

            // API_URL ব্যবহার করে আপডেট করা
            await axios.post(`${API_URL}/api/seo/update`, {
                ...formData,
                keywords: keywordsArray
            });

            toast.success(`${formData.pageName.toUpperCase()} SEO updated successfully!`);
        } catch (error) {
            toast.error('Failed to update SEO. Please try again.');
            console.error("SEO Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Engine Optimization (SEO)</h1>
                <p className="text-gray-500 dark:text-gray-400">Configure how your pages appear on Google and other search engines.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Page to Edit</label>
                        <select
                            name="pageName"
                            value={formData.pageName}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-black p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="home">Home Page</option>
                            <option value="about">About Us Page</option>
                            <option value="explore">Explore / Marketplace</option>
                            <option value="contact">Contact Page</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                {fetching ? (
                    <div className="py-10 text-center text-gray-500">Loading current SEO data...</div>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Meta Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Handmade Crafts | World Culture Marketplace"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">Optimal length: 50-60 characters.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Meta Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly describe the page content..."
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                            <p className="mt-1 text-xs text-gray-400">Optimal length: 150-160 characters.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Focus Keywords</label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                placeholder="culture, craft, handmade, global"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-400">Comma-separated values.</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 rounded-lg font-bold text-white bg-[#F57C00] hover:bg-[#E65100] transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving Changes...' : 'Save SEO Settings'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SeoSettings;