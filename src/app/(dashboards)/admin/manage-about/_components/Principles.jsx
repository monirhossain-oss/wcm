"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSave, FiShield, FiX, FiCheck } from 'react-icons/fi';

const Principles = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // নতুন কার্ড ফর্মের জন্য

    // নতুন প্রিন্সিপাল কার্ডের ডাটা
    const [newCardData, setNewCardData] = useState({
        title: '',
        content: ''
    });

    const [header, setHeader] = useState({
        badge: '',
        titlePart1: '',
        titleColored: '',
        description: ''
    });

    useEffect(() => {
        if (data?.header) {
            setHeader({
                badge: data.header.badge || '',
                titlePart1: data.header.titlePart1 || '',
                titleColored: data.header.titleColored || '',
                description: data.header.description || ''
            });
        }
    }, [data]);

    //--- ১. হেডার আপডেট ---
    const handleUpdateHeader = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updatePrinciples(header);
            if (res.data.success) {
                toast.success("Principles header updated!");
                refresh();
            }
        } catch (error) {
            toast.error("Failed to update header");
        } finally {
            setLoading(false);
        }
    };

    //--- ২. নতুন কার্ড যোগ করার ফর্ম ওপেন ---
    const handleOpenForm = () => {
        setNewCardData({ title: '', content: '' });
        setIsAdding(true);
    };

    //--- ৩. নতুন কার্ড কনফার্ম সেভ করা ---
    const handleConfirmAdd = async () => {
        if (!newCardData.title || !newCardData.content) {
            return toast.error("Title and description are required!");
        }

        try {
            setLoading(true);
            const res = await aboutService.addPrincipleCard(newCardData);
            if (res.data.success) {
                toast.success("New principle added!");
                setIsAdding(false);
                refresh();
            }
        } catch (error) {
            toast.error("Failed to add principle");
        } finally {
            setLoading(false);
        }
    };

    //--- ৪. কার্ড আপডেট (onBlur) ---
    const handleUpdateCard = async (index, card) => {
        const originalCard = data.principlesList[index];
        // কোনো পরিবর্তন না হলে API কল হবে না
        if (originalCard.title === card.title && originalCard.content === card.content) return;

        try {
            const res = await aboutService.updatePrincipleCard(index, card);
            if (res.data.success) {
                toast.success("Principle updated!");
                refresh();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    //--- ৫. কার্ড ডিলিট করা ---
    const handleDeleteCard = async (index) => {
        if (!window.confirm("Remove this principle card?")) return;
        try {
            const res = await aboutService.deletePrincipleCard(index);
            if (res.data.success) {
                toast.success("Principle removed!");
                refresh();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl mt-10">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl">
                        <FiShield size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Principles Section</h2>
                        <p className="text-gray-400 text-sm">Manage core foundation values</p>
                    </div>
                </div>
                <button
                    onClick={handleUpdateHeader}
                    disabled={loading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/20"
                >
                    <FiSave size={18} /> {loading ? 'Saving...' : 'Save Main Content'}
                </button>
            </div>

            {/* Header Content Management Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1">Badge Text</label>
                    <input
                        type="text"
                        value={header.badge}
                        onChange={(e) => setHeader({ ...header, badge: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Title (Normal)</label>
                    <input
                        type="text"
                        value={header.titlePart1}
                        onChange={(e) => setHeader({ ...header, titlePart1: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1">Title (Colored)</label>
                    <input
                        type="text"
                        value={header.titleColored}
                        onChange={(e) => setHeader({ ...header, titleColored: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-bold"
                    />
                </div>
                <div className="md:col-span-3 space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Section Description</label>
                    <textarea
                        value={header.description}
                        onChange={(e) => setHeader({ ...header, description: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-sm h-20 resize-none"
                    />
                </div>
            </div>

            {/* Principles Cards List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        Principle Cards <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{data?.principlesList?.length || 0}</span>
                    </h3>
                    {!isAdding && (
                        <button
                            onClick={handleOpenForm}
                            className="flex items-center gap-2 text-emerald-400 hover:bg-emerald-400/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-emerald-400/20"
                        >
                            <FiPlus /> Add New Card
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* New Card Form */}
                    {isAdding && (
                        <div className="bg-[#1e293b] border-2 border-emerald-500 p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-emerald-500 font-bold text-xs uppercase tracking-tighter">Creating New Principle</span>
                                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
                                    <FiX size={18} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white font-bold outline-none focus:border-emerald-500"
                                    placeholder="Principle Title..."
                                    value={newCardData.title}
                                    onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                                />
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white h-28 resize-none outline-none focus:border-emerald-500"
                                    placeholder="Describe the principle..."
                                    value={newCardData.content}
                                    onChange={(e) => setNewCardData({ ...newCardData, content: e.target.value })}
                                />
                                <button
                                    onClick={handleConfirmAdd}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                                >
                                    <FiCheck size={18} /> Confirm Add
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Existing Principles List */}
                    {data?.principlesList?.map((item, index) => (
                        <div key={item._id || index} className="group bg-[#111827]/80 border border-gray-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all relative">
                            {/* Line accent like main site */}
                            <div className="w-8 h-1 bg-gray-700 group-hover:bg-emerald-500 mb-6 transition-colors rounded-full"></div>

                            <button
                                onClick={() => handleDeleteCard(index)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors p-2"
                            >
                                <FiTrash2 size={16} />
                            </button>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    defaultValue={item.title}
                                    onBlur={(e) => handleUpdateCard(index, { ...item, title: e.target.value })}
                                    className="w-full bg-transparent text-xl font-bold text-white border-b border-transparent focus:border-emerald-500 outline-none transition-all italic"
                                    placeholder="Card Title"
                                />
                                <textarea
                                    defaultValue={item.content}
                                    onBlur={(e) => handleUpdateCard(index, { ...item, content: e.target.value })}
                                    className="w-full bg-transparent text-gray-400 text-sm leading-relaxed border-b border-transparent focus:border-emerald-500 outline-none resize-none h-32"
                                    placeholder="Principle details..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Principles;