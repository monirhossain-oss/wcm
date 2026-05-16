"use client";

import React, { useState, useEffect } from "react";
import aboutService from "../_services/aboutService";
import { toast } from "react-hot-toast";
import { FiBookOpen, FiSave, FiX, FiEdit3, FiUpload } from "react-icons/fi";

const StorySection = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        upperLine: "",
        lowerLine: "",
        descriptions: "",
        highlightText: "",
        testimonialQuote: "",
        testimonialAuthor: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (data) {
            setFormData({
                upperLine: data.headline?.upperLine || "",
                lowerLine: data.headline?.lowerLine || "",
                descriptions: data.descriptions?.join("\n\n") || "",
                highlightText: data.highlightText || "",
                testimonialQuote: data.testimonialCard?.quote || "",
                testimonialAuthor: data.testimonialCard?.author || ""
            });
            setPreviewUrl("");
        }
    }, [data]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('upperLine', formData.upperLine);
            uploadData.append('lowerLine', formData.lowerLine);
            uploadData.append('highlightText', formData.highlightText);
            uploadData.append('testimonialQuote', formData.testimonialQuote);
            uploadData.append('testimonialAuthor', formData.testimonialAuthor);

            const descArray = formData.descriptions.split('\n\n').filter(p => p.trim() !== '');
            uploadData.append('descriptions', JSON.stringify(descArray));

            if (selectedFile) {
                uploadData.append('mainImage', selectedFile);
            }

            const res = await aboutService.updateStory(uploadData);
            if (res.data?.success) {
                toast.success("Story updated!");
                setEditMode(false);
                setSelectedFile(null);
                setPreviewUrl("");
                refresh();
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-[#111] p-8  rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                        <FiBookOpen size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-amber-500">Story Section</h2>
                </div>
                {editMode ? (
                    <div className="flex gap-2">
                        <button onClick={() => setEditMode(false)} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                            <FiX size={18} />
                        </button>
                        <button onClick={handleSave} disabled={loading} className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50">
                            <FiSave size={18} />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setEditMode(true)} className="p-2 bg-gray-800 rounded-lg hover:bg-amber-600 hover:text-white transition-all">
                        <FiEdit3 size={18} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="space-y-4">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Main Image</label>
                    <div className="relative aspect-[4/3] bg-[#0d0d0d] rounded-xl border border-gray-800 overflow-hidden group">
                        <img
                            src={previewUrl || data?.mainImage || "/placeholder.jpg"}
                            alt="Story"
                            className="w-full h-full object-cover opacity-60"
                        />
                        {editMode && (
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                <div className="bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold">
                                    <FiUpload size={16} /> Change Image
                                </div>
                            </label>
                        )}
                    </div>
                    {selectedFile && (
                        <p className="text-xs text-amber-500 animate-pulse">* New image selected. Click save to update.</p>
                    )}
                </div>

                {/* Text Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Upper Headline</label>
                            <input
                                value={formData.upperLine}
                                onChange={(e) => setFormData({ ...formData, upperLine: e.target.value })}
                                disabled={!editMode}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-amber-500" : "border-gray-700 opacity-70"}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Lower Headline</label>
                            <input
                                value={formData.lowerLine}
                                onChange={(e) => setFormData({ ...formData, lowerLine: e.target.value })}
                                disabled={!editMode}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-amber-500" : "border-gray-700 opacity-70"}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Descriptions (separate with blank line)</label>
                        <textarea
                            value={formData.descriptions}
                            onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                            disabled={!editMode}
                            rows={5}
                            className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 resize-none ${editMode ? "border-amber-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-rose-400 uppercase tracking-wider mb-2">Highlight Text</label>
                        <input
                            value={formData.highlightText}
                            onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-rose-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quote</label>
                            <textarea
                                value={formData.testimonialQuote}
                                onChange={(e) => setFormData({ ...formData, testimonialQuote: e.target.value })}
                                disabled={!editMode}
                                rows={2}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 resize-none ${editMode ? "border-amber-500" : "border-gray-700 opacity-70"}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Author</label>
                            <input
                                value={formData.testimonialAuthor}
                                onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                                disabled={!editMode}
                                className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-amber-500" : "border-gray-700 opacity-70"}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;