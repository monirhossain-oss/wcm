"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSave, FiShield, FiX, FiCheck, FiEdit3 } from 'react-icons/fi';

const Principles = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

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

    //--- 1. Header Update ---
    const handleUpdateHeader = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updatePrinciples(header);
            if (res.data.success) {
                toast.success("Principles header updated!");
                setEditMode(false);
                refresh();
            }
        } catch (error) {
            toast.error("Failed to update header");
        } finally {
            setLoading(false);
        }
    };

    //--- 2. Open Add Form ---
    const handleOpenForm = () => {
        setNewCardData({ title: '', content: '' });
        setIsAdding(true);
    };

    //--- 3. Confirm Add ---
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

    //--- 4. Update Card (onBlur) ---
    const handleUpdateCard = async (index, card) => {
        const originalCard = data.principlesList[index];
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

    //--- 5. Delete Card ---
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
                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-2xl">
                        <FiShield size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Principles Section</h2>
                        <p className="text-gray-500 text-xs">Manage core foundation values</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button onClick={() => setEditMode(false)} className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-all">
                                <FiX size={18} />
                            </button>
                            <button onClick={handleUpdateHeader} disabled={loading} className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-all">
                                <FiCheck size={18} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-orange-600 hover:text-white transition-all">
                            <FiEdit3 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Header Content Management Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Badge Text</label>
                    <input
                        type="text"
                        value={header.badge}
                        onChange={(e) => setHeader({ ...header, badge: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white outline-none text-sm transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Title (Normal)</label>
                    <input
                        type="text"
                        value={header.titlePart1}
                        onChange={(e) => setHeader({ ...header, titlePart1: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white outline-none text-sm transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Title (Colored)</label>
                    <input
                        type="text"
                        value={header.titleColored}
                        onChange={(e) => setHeader({ ...header, titleColored: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white outline-none text-sm font-bold transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
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
                            className="flex items-center gap-2 text-orange-400 hover:bg-orange-400/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-orange-400/20"
                        >
                            <FiPlus /> Add New Card
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* New Card Form */}
                    {isAdding && (
                        <div className="bg-[#1e293b] border-2 border-orange-500 p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-orange-500 font-bold text-xs uppercase tracking-tighter">Creating New Principle</span>
                                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <FiX size={18} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white font-bold outline-none focus:border-orange-500 transition-all"
                                    placeholder="Principle Title..."
                                    value={newCardData.title}
                                    onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                                />
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white h-28 resize-none outline-none focus:border-orange-500 transition-all"
                                    placeholder="Describe the principle..."
                                    value={newCardData.content}
                                    onChange={(e) => setNewCardData({ ...newCardData, content: e.target.value })}
                                />
                                <button
                                    onClick={handleConfirmAdd}
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                                >
                                    <FiCheck size={18} /> Confirm Add
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Existing Principles List */}
                    {data?.principlesList?.map((item, index) => (
                        <div key={item._id || index} className="group bg-[#111827]/80 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all relative">
                            {/* Line accent like main site */}
                            <div className="w-8 h-1 bg-gray-700 group-hover:bg-orange-500 mb-6 transition-colors rounded-full"></div>

                            <button
                                onClick={() => handleDeleteCard(index)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                            >
                                <FiTrash2 size={16} />
                            </button>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    defaultValue={item.title}
                                    onBlur={(e) => handleUpdateCard(index, { ...item, title: e.target.value })}
                                    className="w-full bg-transparent text-xl font-bold text-white border-b border-transparent focus:border-orange-500 outline-none transition-all italic placeholder-gray-600"
                                    placeholder="Card Title"
                                />
                                <textarea
                                    defaultValue={item.content}
                                    onBlur={(e) => handleUpdateCard(index, { ...item, content: e.target.value })}
                                    className="w-full bg-transparent text-gray-400 text-sm leading-relaxed border-b border-transparent focus:border-orange-500 outline-none resize-none h-32 placeholder-gray-600"
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