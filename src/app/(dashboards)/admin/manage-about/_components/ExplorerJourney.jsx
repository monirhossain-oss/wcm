"use client";

import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSave, FiMap, FiX, FiCheck } from 'react-icons/fi';

const ExplorerJourney = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // ফর্ম দেখানোর জন্য স্টেট

    // নতুন স্টেপের ডাটা হোল্ড করার জন্য স্টেট
    const [newStepData, setNewStepData] = useState({
        stepNumber: '',
        title: '',
        description: '',
        iconId: 'search'
    });

    const [topSection, setTopSection] = useState({
        badge: '',
        titleMain: '',
        subTitle: '',
        footerText: ''
    });

    useEffect(() => {
        if (data) {
            setTopSection({
                badge: data.topSection?.badge || '',
                titleMain: data.topSection?.titleMain || '',
                subTitle: data.topSection?.subTitle || '',
                footerText: data.footerText || ''
            });
        }
    }, [data]);

    //--- ১. মেইন টেক্সট আপডেট ---
    const handleUpdateMain = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updateExplorer(topSection);
            if (res.data.success) {
                toast.success("Journey section updated!");
                if (refresh) refresh();
            }
        } catch (error) {
            toast.error("Failed to update journey header");
        } finally {
            setLoading(false);
        }
    };

    //--- ২. নতুন স্টেপ ফর্ম ওপেন করা ---
    const handleOpenForm = () => {
        // NaN ফিক্স: data?.steps?.length না থাকলে 0 ধরবে
        const nextNum = ((data?.steps?.length || 0) + 1).toString().padStart(2, '0');
        setNewStepData({
            stepNumber: nextNum,
            title: '',
            description: '',
            iconId: 'search'
        });
        setIsAdding(true);
    };

    //--- ৩. নতুন স্টেপ কনফার্ম সেভ করা ---
    const handleConfirmAdd = async () => {
        if (!newStepData.title || !newStepData.description) {
            return toast.error("Please provide title and description");
        }

        try {
            setLoading(true);
            const res = await aboutService.addExplorerStep(newStepData);
            if (res.data.success) {
                toast.success("New step added!");
                setIsAdding(false); // ফর্ম বন্ধ হবে
                refresh();
            }
        } catch (error) {
            toast.error("Failed to add step");
        } finally {
            setLoading(false);
        }
    };

    //--- ৪. বিদ্যমান স্টেপ ডিলিট করা ---
    const handleDeleteStep = async (index) => {
        if (!window.confirm("Delete this step?")) return;
        try {
            const res = await aboutService.deleteExplorerStep(index);
            if (res.data.success) {
                toast.success("Step removed!");
                refresh();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    //--- ৫. বিদ্যমান স্টেপ এডিট (onBlur) ---
    const onStepBlur = async (index, field, value) => {
        const currentStep = data.steps[index];
        if (currentStep[field] === value) return;

        const updatedStep = { ...currentStep, [field]: value };
        try {
            const res = await aboutService.updateExplorerStep(index, updatedStep);
            if (res.data.success) {
                toast.success(`Step ${field} updated!`);
                refresh();
            }
        } catch (error) {
            toast.error("Step update failed");
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl">
            {/* Header Part */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-2xl">
                        <FiMap size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Explorer Journey</h2>
                        <p className="text-gray-500 text-xs mt-1 italic font-mono">Manage WCM workflow steps</p>
                    </div>
                </div>
                <button
                    onClick={handleUpdateMain}
                    disabled={loading}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/20"
                >
                    <FiSave size={18} /> {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Layout Customizer Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-black/20 rounded-2xl border border-gray-800/50">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-orange-500 uppercase tracking-widest">Badge Text</label>
                        <input
                            type="text"
                            value={topSection.badge}
                            onChange={(e) => setTopSection({ ...topSection, badge: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Title</label>
                        <input
                            type="text"
                            value={topSection.titleMain}
                            onChange={(e) => setTopSection({ ...topSection, titleMain: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtitle</label>
                        <textarea
                            value={topSection.subTitle}
                            onChange={(e) => setTopSection({ ...topSection, subTitle: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white h-[42px] resize-none focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Footer Label</label>
                        <input
                            type="text"
                            value={topSection.footerText}
                            onChange={(e) => setTopSection({ ...topSection, footerText: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Steps Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ১. বিদ্যমান স্টেপগুলো */}
                {data?.steps?.map((step, index) => (
                    <div key={step._id || index} className="group relative bg-[#111827]/80 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300">
                        <button
                            onClick={() => handleDeleteStep(index)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                            <FiTrash2 size={18} />
                        </button>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    className="w-12 h-10 bg-gray-800 text-orange-500 text-center font-bold rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                                    defaultValue={step.stepNumber}
                                    onBlur={(e) => onStepBlur(index, 'stepNumber', e.target.value)}
                                />
                                <input
                                    className="flex-1 bg-transparent text-xl font-bold text-white border-b border-gray-800 focus:border-orange-500 outline-none pb-1"
                                    defaultValue={step.title}
                                    onBlur={(e) => onStepBlur(index, 'title', e.target.value)}
                                />
                            </div>
                            <textarea
                                className="w-full bg-transparent text-gray-400 text-sm h-20 resize-none outline-none leading-relaxed"
                                defaultValue={step.description}
                                onBlur={(e) => onStepBlur(index, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {/* ২. নতুন স্টেপ অ্যাড করার ফর্ম (Conditional Rendering) */}
                {isAdding ? (
                    <div className="bg-[#1e293b] border-2 border-orange-500 p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-orange-500 font-bold uppercase tracking-widest text-sm">Add New Step</h3>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    className="w-16 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-center"
                                    placeholder="No."
                                    value={newStepData.stepNumber}
                                    onChange={(e) => setNewStepData({ ...newStepData, stepNumber: e.target.value })}
                                />
                                <input
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white"
                                    placeholder="Enter title..."
                                    value={newStepData.title}
                                    onChange={(e) => setNewStepData({ ...newStepData, title: e.target.value })}
                                />
                            </div>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white h-24 resize-none"
                                placeholder="Write step description..."
                                value={newStepData.description}
                                onChange={(e) => setNewStepData({ ...newStepData, description: e.target.value })}
                            />
                            <button
                                onClick={handleConfirmAdd}
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg"
                            >
                                <FiCheck size={20} /> {loading ? "Adding..." : "Confirm & Save Step"}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ৩. অ্যাড বাটন (যখন ফর্ম বন্ধ থাকে) */
                    <button
                        onClick={handleOpenForm}
                        className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group min-h-[200px]"
                    >
                        <div className="p-4 bg-gray-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <FiPlus size={32} />
                        </div>
                        <span className="font-bold text-lg">Add Journey Step</span>
                        <p className="text-xs text-gray-600 mt-1">Click to reveal step editor</p>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExplorerJourney;