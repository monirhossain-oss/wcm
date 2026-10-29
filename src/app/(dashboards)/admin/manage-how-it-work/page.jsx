"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ১. API URL কনফিগারেশন (Undefined সমস্যা দূর করার জন্য Fallback সহ)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ManageHowItWorks = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [content, setContent] = useState({
        headerTitle: "",
        headerDescription: "",
        steps: [
            { id: 1, title: "", description: "" },
            { id: 2, title: "", description: "" },
            { id: 3, title: "", description: "" },
            { id: 4, title: "", description: "" },
        ],
    });

    // ২. ডাটা ফেচ করা
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/admin/how-it-works`);
                if (res.data) {
                    setContent(res.data);
                }
            } catch (error) {
                console.error("Error fetching content:", error);
                if (error.response?.status === 404) {
                    console.log("No existing data, using default schema values.");
                }
            } finally {
                setFetching(false);
            }
        };
        fetchContent();
    }, []);

    // ৩. ইনপুট হ্যান্ডেলার
    const handleInputChange = (e, field, stepId = null) => {
        if (stepId !== null) {
            const updatedSteps = content.steps.map((step) =>
                step.id === stepId ? { ...step, [field]: e.target.value } : step
            );
            setContent({ ...content, steps: updatedSteps });
        } else {
            setContent({ ...content, [field]: e.target.value });
        }
    };

    // ৪. ডাটা সেভ করা (PUT Request)
    const handleSubmit = async (e) => {
        e.preventDefault(); // পেজ রিফ্রেশ রোধ করে
        setLoading(true);
        try {
            // এখানে সরাসরি API_BASE ব্যবহার করা হয়েছে
            await axios.put(`${API_BASE}/api/admin/how-it-works`, content, {
                withCredentials: true,
            });
            toast.success("Content updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update content");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-xl">
            Loading Settings...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#F57C00]">Manage How It Works</h1>
                        <p className="text-gray-400 mt-1 text-sm">Update the global craftsmanship journey steps</p>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                        Endpoint: {API_BASE}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Header Section */}
                    <section className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 text-orange-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Main Header Section
                        </h2>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Title</label>
                                <input
                                    type="text"
                                    value={content.headerTitle}
                                    onChange={(e) => handleInputChange(e, "headerTitle")}
                                    className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-orange-500 transition-all text-gray-200"
                                    placeholder="Enter main heading"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Sub-description</label>
                                <textarea
                                    value={content.headerDescription}
                                    onChange={(e) => handleInputChange(e, "headerDescription")}
                                    className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 h-28 focus:outline-none focus:border-orange-500 transition-all text-gray-200 resize-none"
                                    placeholder="Enter description text"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Steps Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.steps.map((step) => (
                            <section key={step.id} className="bg-[#111] p-8 rounded-2xl border border-gray-800 relative group hover:border-orange-900/50 transition-all">
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#F57C00] text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-orange-900/40">
                                    {step.id}
                                </div>
                                <h3 className="text-lg font-bold mb-5 ml-4 text-gray-300 uppercase tracking-tight">Step Detail</h3>
                                <div className="space-y-5">
                                    <input
                                        type="text"
                                        value={step.title}
                                        onChange={(e) => handleInputChange(e, "title", step.id)}
                                        className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-orange-500 transition-all text-gray-200"
                                        placeholder="Step Title"
                                        required
                                    />
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => handleInputChange(e, "description", step.id)}
                                        className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 h-24 focus:outline-none focus:border-orange-500 transition-all text-gray-200 resize-none text-sm"
                                        placeholder="Describe this step..."
                                        required
                                    />
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-xl tracking-widest transition-all uppercase ${loading
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    : "bg-orange-600 hover:bg-orange-500 text-white shadow-2xl shadow-orange-900/40 active:scale-[0.98]"
                                }`}
                        >
                            {loading ? "Syncing with Cloud..." : "Push Updates to Live Page"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageHowItWorks;