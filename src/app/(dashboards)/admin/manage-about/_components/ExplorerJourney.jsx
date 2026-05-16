"use client";

import React, { useState, useEffect } from "react";
import aboutService from "../_services/aboutService";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2, FiSave, FiMap, FiX, FiCheck, FiEdit3 } from "react-icons/fi";

const ExplorerJourney = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [topSection, setTopSection] = useState({
        badge: "",
        titleMain: "",
        subTitle: "",
        footerText: ""
    });
    const [newStep, setNewStep] = useState({
        stepNumber: "",
        title: "",
        description: "",
        iconId: "search"
    });

    useEffect(() => {
        if (data) {
            setTopSection({
                badge: data.topSection?.badge || "",
                titleMain: data.topSection?.titleMain || "",
                subTitle: data.topSection?.subTitle || "",
                footerText: data.footerText || ""
            });
        }
    }, [data]);

    const handleUpdateMain = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updateExplorer(topSection);
            if (res.data?.success) {
                toast.success("Journey header updated!");
                setEditMode(false);
                refresh();
            }
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStep = async () => {
        if (!newStep.title || !newStep.description) {
            return toast.error("Title and description required");
        }
        try {
            setLoading(true);
            const res = await aboutService.addExplorerStep(newStep);
            if (res.data?.success) {
                toast.success("Step added!");
                setShowAddForm(false);
                setNewStep({ stepNumber: "", title: "", description: "", iconId: "search" });
                refresh();
            }
        } catch (error) {
            toast.error("Failed to add step");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStep = async (index) => {
        if (!window.confirm("Delete this step?")) return;
        try {
            const res = await aboutService.deleteExplorerStep(index);
            if (res.data?.success) {
                toast.success("Step deleted!");
                refresh();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleUpdateStep = async (index, field, value) => {
        const step = data.steps[index];
        if (step[field] === value) return;
        try {
            const res = await aboutService.updateExplorerStep(index, { ...step, [field]: value });
            if (res.data?.success) {
                toast.success("Step updated!");
                refresh();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-2xl">
                        <FiMap size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Explorer Journey</h2>
                        <p className="text-gray-500 text-xs">Manage WCM workflow steps</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button onClick={() => setEditMode(false)} className="p-2 bg-red-900/30 text-red-400 rounded-lg">
                                <FiX size={18} />
                            </button>
                            <button onClick={handleUpdateMain} disabled={loading} className="p-2 bg-green-900/30 text-green-400 rounded-lg">
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

            {/* Top Section Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-black/20 rounded-2xl border border-gray-800/50">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">Badge Text</label>
                        <input
                            type="text"
                            value={topSection.badge}
                            onChange={(e) => setTopSection({ ...topSection, badge: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2 text-white ${editMode ? "border-orange-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Main Title</label>
                        <input
                            type="text"
                            value={topSection.titleMain}
                            onChange={(e) => setTopSection({ ...topSection, titleMain: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2 text-white ${editMode ? "border-orange-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Subtitle</label>
                        <textarea
                            value={topSection.subTitle}
                            onChange={(e) => setTopSection({ ...topSection, subTitle: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2 text-white h-[42px] resize-none ${editMode ? "border-orange-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Footer Label</label>
                        <input
                            type="text"
                            value={topSection.footerText}
                            onChange={(e) => setTopSection({ ...topSection, footerText: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2 text-white ${editMode ? "border-orange-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>
                </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {data?.steps?.map((step, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-orange-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-orange-500">{step.stepNumber || index + 1}</span>
                                <h3
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateStep(index, 'title', e.currentTarget.innerText)}
                                    className="text-white font-semibold outline-none border-b border-transparent focus:border-orange-500 px-1"
                                >
                                    {step.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => handleDeleteStep(index)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateStep(index, 'description', e.currentTarget.innerText)}
                            className="text-gray-400 text-sm outline-none border-b border-transparent focus:border-orange-500 px-1 min-h-[60px]"
                        >
                            {step.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-gray-600 uppercase">Icon:</span>
                            <input
                                type="text"
                                value={step.iconId}
                                onChange={(e) => handleUpdateStep(index, 'iconId', e.target.value)}
                                className="bg-transparent text-gray-300 text-xs border-b border-gray-700 focus:border-orange-500 outline-none w-20"
                            />
                        </div>
                    </div>
                ))}

                {/* Add New Step Card */}
                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="border-2 border-dashed border-gray-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all min-h-[180px]"
                    >
                        <FiPlus size={32} />
                        <span className="text-sm font-medium">Add New Step</span>
                    </button>
                ) : (
                    <div className="bg-gray-900/80 border border-orange-500/30 rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <FiPlus className="text-orange-500" /> New Step
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Step Number (e.g. 01)"
                                value={newStep.stepNumber}
                                onChange={(e) => setNewStep({ ...newStep, stepNumber: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Title"
                                value={newStep.title}
                                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                            />
                            <textarea
                                placeholder="Description"
                                value={newStep.description}
                                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none h-20 resize-none"
                            />
                            <input
                                type="text"
                                placeholder="Icon ID"
                                value={newStep.iconId}
                                onChange={(e) => setNewStep({ ...newStep, iconId: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                            />
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddStep}
                                    disabled={loading}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiSave size={14} /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Text Display */}
            {topSection.footerText && (
                <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
                    {topSection.footerText}
                </div>
            )}
        </div>
    );
};

export default ExplorerJourney;