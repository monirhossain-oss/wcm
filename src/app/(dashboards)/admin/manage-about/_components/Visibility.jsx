"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiEye, FiSave, FiPlus, FiTrash2, FiInfo } from 'react-icons/fi';

const Visibility = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [header, setHeader] = useState({
        badge: '',
        title: '',
        subtitle: ''
    });

    useEffect(() => {
        if (data) {
            setHeader({
                badge: data.badge || '',
                title: data.title || '',
                subtitle: data.subtitle || ''
            });
        }
    }, [data]);

    // ১. মেইন হেডার আপডেট
    const handleUpdateHeader = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updateVisibility(header);
            if (res.data.success) {
                toast.success("Visibility header updated!");
                refresh();
            }
        } catch (error) {
            toast.error("Failed to update visibility header");
        } finally {
            setLoading(false);
        }
    };

    // ২. নতুন ভিজিবিলিটি কার্ড অ্যাড করা
    const handleAddCard = async () => {
        const newCard = {
            title: "New Value Title",
            description: "Detail explanation goes here...",
            iconId: "eye"
        };
        try {
            const res = await aboutService.addVisibilityCard(newCard);
            if (res.data.success) {
                toast.success("New visibility card added!");
                refresh();
            }
        } catch (error) {
            toast.error("Failed to add card");
        }
    };

    // ৩. কার্ড আপডেট (onBlur)
    const handleUpdateCard = async (index, card) => {
        try {
            const res = await aboutService.updateVisibilityCard(index, card);
            if (res.data.success) {
                toast.success("Card updated!");
                refresh();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    // ৪. কার্ড ডিলিট করা
    const handleDeleteCard = async (index) => {
        if (!window.confirm("Delete this card?")) return;
        try {
            const res = await aboutService.deleteVisibilityCard(index);
            if (res.data.success) {
                toast.success("Card removed!");
                refresh();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl mt-10">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl">
                        <FiEye size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Visibility Section</h2>
                        <p className="text-gray-400 text-sm">Transparency & Impact Metrics</p>
                    </div>
                </div>
                <button
                    onClick={handleUpdateHeader}
                    disabled={loading}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-900/20"
                >
                    <FiSave size={18} /> {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Header Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-black/20 rounded-2xl border border-gray-800/50">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-cyan-500 uppercase tracking-widest px-1">Badge Text</label>
                        <input
                            type="text"
                            value={header.badge}
                            onChange={(e) => setHeader({ ...header, badge: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                            placeholder="e.g. IMPACT"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Main Title</label>
                        <input
                            type="text"
                            value={header.title}
                            onChange={(e) => setHeader({ ...header, title: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1.5 flex flex-col h-full">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                    <textarea
                        value={header.subtitle}
                        onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                        className="w-full h-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                        placeholder="Section summary..."
                    />
                </div>
            </div>

            {/* Visibility Cards List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FiInfo className="text-cyan-400" /> Information Cards
                    </h3>
                    <button
                        onClick={handleAddCard}
                        className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 px-4 py-1.5 rounded-lg text-sm border border-emerald-600/20 transition-all"
                    >
                        <FiPlus /> Add New Card
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.cards?.map((card, index) => (
                        <div key={index} className="group bg-[#111827]/80 border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    type="text"
                                    defaultValue={card.iconId}
                                    onBlur={(e) => handleUpdateCard(index, { ...card, iconId: e.target.value })}
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-cyan-400 border border-gray-700 text-center outline-none text-[10px] focus:border-cyan-500"
                                    title="Icon Name"
                                />
                                <button
                                    onClick={() => handleDeleteCard(index)}
                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    defaultValue={card.title}
                                    onBlur={(e) => handleUpdateCard(index, { ...card, title: e.target.value })}
                                    placeholder="Value Title"
                                    className="w-full bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-cyan-500 outline-none transition-all"
                                />
                                <textarea
                                    defaultValue={card.description}
                                    onBlur={(e) => handleUpdateCard(index, { ...card, description: e.target.value })}
                                    placeholder="Description..."
                                    className="w-full bg-transparent text-gray-400 text-sm leading-relaxed border-b border-transparent focus:border-cyan-500 outline-none resize-none h-24"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Visibility;