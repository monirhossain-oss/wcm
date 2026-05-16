"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    FiPlus,
    FiSave,
    FiTrash2,
    FiEdit3,
    FiX,
    FiCheck,
    FiLoader,
    FiEye
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const ManageHowItWorks = () => {
    // ===== STATES =====
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Main content state
    const [content, setContent] = useState({
        headerTitle: "",
        headerDescription: "",
        steps: [],
    });

    // Original content for cancel functionality
    const [originalContent, setOriginalContent] = useState(null);

    // Edit mode for each section
    const [editMode, setEditMode] = useState({
        header: false,
        steps: {}, // { 1: false, 2: true, ... }
    });

    // New step input form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStep, setNewStep] = useState({
        title: "",
        description: "",
    });

    // ===== FETCH DATA =====
    const fetchContent = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`${API_BASE}/api/admin/how-it-works`);
            if (res.data?.success && res.data.data) {
                const data = res.data.data;
                setContent({
                    headerTitle: data.headerTitle || "",
                    headerDescription: data.headerDescription || "",
                    steps: data.steps || [],
                });
                setOriginalContent(JSON.parse(JSON.stringify(data)));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load content");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    // ===== HEADER HANDLERS =====
    const toggleHeaderEdit = () => {
        if (editMode.header) {
            // Cancel - restore original
            setContent((prev) => ({
                ...prev,
                headerTitle: originalContent?.headerTitle || "",
                headerDescription: originalContent?.headerDescription || "",
            }));
        }
        setEditMode((prev) => ({ ...prev, header: !prev.header }));
    };

    const handleHeaderChange = (field, value) => {
        setContent((prev) => ({ ...prev, [field]: value }));
    };

    const saveHeader = async () => {
        if (!content.headerTitle.trim()) {
            toast.error("Header title is required");
            return;
        }
        if (!content.headerDescription.trim()) {
            toast.error("Header description is required");
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_BASE}/api/admin/how-it-works`,
                {
                    headerTitle: content.headerTitle,
                    headerDescription: content.headerDescription,
                    steps: content.steps,
                },
                { withCredentials: true }
            );

            toast.success("Header saved successfully!");
            setEditMode((prev) => ({ ...prev, header: false }));
            setOriginalContent((prev) => ({
                ...prev,
                headerTitle: content.headerTitle,
                headerDescription: content.headerDescription,
            }));
        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    // ===== STEP HANDLERS =====
    const toggleStepEdit = (stepId) => {
        if (editMode.steps[stepId]) {
            // Cancel - restore this step
            const originalStep = originalContent?.steps?.find((s) => s.id === stepId);
            if (originalStep) {
                setContent((prev) => ({
                    ...prev,
                    steps: prev.steps.map((s) =>
                        s.id === stepId ? { ...originalStep } : s
                    ),
                }));
            }
        }
        setEditMode((prev) => ({
            ...prev,
            steps: { ...prev.steps, [stepId]: !prev.steps[stepId] },
        }));
    };

    const handleStepChange = (stepId, field, value) => {
        setContent((prev) => ({
            ...prev,
            steps: prev.steps.map((step) =>
                step.id === stepId ? { ...step, [field]: value } : step
            ),
        }));
    };

    const saveStep = async (stepId) => {
        const step = content.steps.find((s) => s.id === stepId);
        if (!step.title.trim()) {
            toast.error("Step title is required");
            return;
        }
        if (!step.description.trim()) {
            toast.error("Step description is required");
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_BASE}/api/admin/how-it-works/steps/${stepId}`,
                {
                    title: step.title,
                    description: step.description,
                },
                { withCredentials: true }
            );

            toast.success(`Step ${stepId} saved!`);
            setEditMode((prev) => ({
                ...prev,
                steps: { ...prev.steps, [stepId]: false },
            }));

            // Update original
            setOriginalContent((prev) => ({
                ...prev,
                steps: prev.steps.map((s) => (s.id === stepId ? { ...step } : s)),
            }));
        } catch (error) {
            console.error("Save step error:", error);
            toast.error(error.response?.data?.message || "Failed to save step");
        } finally {
            setLoading(false);
        }
    };

    // ===== ADD NEW STEP =====
    const handleAddStep = async (e) => {
        e.preventDefault();

        if (!newStep.title.trim()) {
            toast.error("Step title is required");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE}/api/admin/how-it-works/steps`,
                {
                    title: newStep.title,
                    description: newStep.description,
                },
                { withCredentials: true }
            );

            if (res.data?.success) {
                toast.success("New step added!");
                setContent((prev) => ({
                    ...prev,
                    steps: res.data.data.steps,
                }));
                setOriginalContent((prev) => ({
                    ...prev,
                    steps: res.data.data.steps,
                }));
                setNewStep({ title: "", description: "" });
                setShowAddForm(false);
            }
        } catch (error) {
            console.error("Add step error:", error);
            toast.error(error.response?.data?.message || "Failed to add step");
        } finally {
            setLoading(false);
        }
    };

    // ===== DELETE STEP =====
    const deleteStep = async (stepId) => {
        if (!confirm(`Are you sure you want to delete Step ${stepId}?`)) return;

        setLoading(true);
        try {
            const res = await axios.delete(
                `${API_BASE}/api/admin/how-it-works/steps/${stepId}`,
                { withCredentials: true }
            );

            if (res.data?.success) {
                toast.success("Step deleted!");
                setContent((prev) => ({
                    ...prev,
                    steps: res.data.data.steps,
                }));
                setOriginalContent((prev) => ({
                    ...prev,
                    steps: res.data.data.steps,
                }));
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    // ===== SAVE ALL =====
    const saveAll = async () => {
        if (!content.headerTitle.trim()) {
            toast.error("Header title is required");
            return;
        }
        if (!content.headerDescription.trim()) {
            toast.error("Header description is required");
            return;
        }
        if (content.steps.length === 0) {
            toast.error("At least one step is required");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(
                `${API_BASE}/api/admin/how-it-works`,
                {
                    headerTitle: content.headerTitle,
                    headerDescription: content.headerDescription,
                    steps: content.steps,
                },
                { withCredentials: true }
            );

            if (res.data?.success) {
                toast.success("All content saved!");
                setOriginalContent(JSON.parse(JSON.stringify(content)));
                // Exit all edit modes
                setEditMode({ header: false, steps: {} });
            }
        } catch (error) {
            console.error("Save all error:", error);
            toast.error(error.response?.data?.message || "Failed to save all");
        } finally {
            setLoading(false);
        }
    };

    // ===== LOADING =====
    if (fetching) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <FiLoader className="animate-spin text-4xl text-[#F57C00]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* ===== PAGE HEADER ===== */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#F57C00] flex items-center gap-3">
                            <FiEye /> Manage How It Works
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Manage your How It Works page content
                        </p>
                    </div>
                    <button
                        onClick={saveAll}
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wider transition-all ${loading
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-[#F57C00] hover:bg-orange-600 text-white shadow-lg shadow-orange-900/30"
                            }`}
                    >
                        <FiSave /> {loading ? "Saving..." : "Save All Changes"}
                    </button>
                </div>

                {/* ===== HEADER SECTION ===== */}
                <section className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Page Header
                        </h2>
                        <div className="flex gap-2">
                            {editMode.header ? (
                                <>
                                    <button
                                        onClick={toggleHeaderEdit}
                                        className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-all"
                                        title="Cancel"
                                    >
                                        <FiX size={18} />
                                    </button>
                                    <button
                                        onClick={saveHeader}
                                        disabled={loading}
                                        className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-all"
                                        title="Save"
                                    >
                                        <FiCheck size={18} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={toggleHeaderEdit}
                                    className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                                    title="Edit Header"
                                >
                                    <FiEdit3 size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Header Title
                            </label>
                            <input
                                type="text"
                                value={content.headerTitle}
                                onChange={(e) => handleHeaderChange("headerTitle", e.target.value)}
                                disabled={!editMode.header}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 transition-all ${editMode.header
                                        ? "border-orange-500 focus:border-orange-400 focus:outline-none"
                                        : "border-gray-700 opacity-70 cursor-not-allowed"
                                    }`}
                                placeholder="Enter header title..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Header Description
                            </label>
                            <textarea
                                value={content.headerDescription}
                                onChange={(e) => handleHeaderChange("headerDescription", e.target.value)}
                                disabled={!editMode.header}
                                rows={4}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 resize-none transition-all ${editMode.header
                                        ? "border-orange-500 focus:border-orange-400 focus:outline-none"
                                        : "border-gray-700 opacity-70 cursor-not-allowed"
                                    }`}
                                placeholder="Enter header description..."
                            />
                        </div>
                    </div>
                </section>

                {/* ===== STEPS SECTION ===== */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        Steps ({content.steps.length})
                    </h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-orange-400 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                        <FiPlus /> {showAddForm ? "Close" : "Add New Step"}
                    </button>
                </div>

                {/* ===== ADD NEW STEP FORM ===== */}
                {showAddForm && (
                    <form
                        onSubmit={handleAddStep}
                        className="bg-[#111] p-6 rounded-2xl border border-orange-900/50 shadow-xl mb-8"
                    >
                        <h3 className="text-lg font-bold text-orange-400 mb-4">Add New Step</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Step Title
                                </label>
                                <input
                                    type="text"
                                    value={newStep.title}
                                    onChange={(e) => setNewStep((prev) => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 text-gray-200 focus:border-orange-500 focus:outline-none transition-all"
                                    placeholder="Enter step title..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Step Description
                                </label>
                                <textarea
                                    value={newStep.description}
                                    onChange={(e) => setNewStep((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-[#0d0d0d] border border-gray-700 rounded-xl p-4 text-gray-200 resize-none focus:border-orange-500 focus:outline-none transition-all"
                                    placeholder="Enter step description..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${loading
                                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-[#F57C00] hover:bg-orange-600 text-white"
                                        }`}
                                >
                                    <FiPlus /> {loading ? "Adding..." : "Add Step"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* ===== STEPS GRID ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.steps.map((step) => (
                        <div
                            key={step.id}
                            className="bg-[#111] p-6 rounded-2xl border border-gray-800 relative group hover:border-orange-900/50 transition-all"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#F57C00] text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                                {step.id}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editMode.steps[step.id] ? (
                                    <>
                                        <button
                                            onClick={() => toggleStepEdit(step.id)}
                                            className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-all"
                                            title="Cancel"
                                        >
                                            <FiX size={16} />
                                        </button>
                                        <button
                                            onClick={() => saveStep(step.id)}
                                            disabled={loading}
                                            className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-all"
                                            title="Save"
                                        >
                                            <FiCheck size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleStepEdit(step.id)}
                                            className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                                            title="Edit"
                                        >
                                            <FiEdit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteStep(step.id)}
                                            disabled={loading}
                                            className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Step Content */}
                            <div className="pt-4">
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={step.title}
                                        onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                                        disabled={!editMode.steps[step.id]}
                                        className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 transition-all ${editMode.steps[step.id]
                                                ? "border-orange-500 focus:border-orange-400 focus:outline-none"
                                                : "border-gray-700 opacity-70 cursor-not-allowed"
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                                        disabled={!editMode.steps[step.id]}
                                        rows={3}
                                        className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 resize-none transition-all ${editMode.steps[step.id]
                                                ? "border-orange-500 focus:border-orange-400 focus:outline-none"
                                                : "border-gray-700 opacity-70 cursor-not-allowed"
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {content.steps.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl mb-4">No steps added yet</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="text-[#F57C00] hover:underline"
                        >
                            Add your first step
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageHowItWorks;