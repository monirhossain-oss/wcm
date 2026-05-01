"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiSave, FiEdit3 } from 'react-icons/fi';

const AboutHeader = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subTitle: ''
    });

    // ডেটা লোড হলে স্টেট আপডেট করা
    useEffect(() => {
        if (data) {
            setFormData({
                title: data.title || '',
                subTitle: data.subTitle || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await aboutService.updateHeader(formData);
            if (res.data.success) {
                toast.success("Header updated successfully!");
                refresh(); // মেইন পেজ রিফ্রেশ করা
            }
        } catch (error) {
            toast.error("Failed to update header");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <FiEdit3 size={20} />
                </div>
                <h2 className="text-xl font-semibold text-white">Header Settings</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                    {/* Title Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">Main Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. About Our Journey"
                            className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Subtitle Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">Subtitle</label>
                        <textarea
                            name="subTitle"
                            value={formData.subTitle}
                            onChange={handleChange}
                            placeholder="Brief description under the title..."
                            rows="3"
                            className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'
                            }`}
                    >
                        <FiSave size={18} />
                        {loading ? 'Saving...' : 'Update Header'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutHeader;