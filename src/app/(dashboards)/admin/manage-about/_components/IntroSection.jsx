"use client";

import React, { useState, useEffect } from "react";
import aboutService from "../_services/aboutService";
import { toast } from "react-hot-toast";
import { FiImage, FiSave, FiUpload, FiX, FiCheck, FiEdit3 } from "react-icons/fi";

const IntroSection = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        normalTextPart1: "",
        coloredTextPart: "",
        normalTextPart2: "",
        description: "",
        creatorCountText: "",
        fullTextSuffix: ""
    });
    const [previews, setPreviews] = useState([null, null, null, null]);
    const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);

    useEffect(() => {
        if (data) {
            setFormData({
                normalTextPart1: data.headline?.normalTextPart1 || "",
                coloredTextPart: data.headline?.coloredTextPart || "",
                normalTextPart2: data.headline?.normalTextPart2 || "",
                description: data.description || "",
                creatorCountText: data.socialProof?.creatorCountText || "",
                fullTextSuffix: data.socialProof?.fullTextSuffix || ""
            });
            setPreviews(data.gridImages || [null, null, null, null]);
        }
    }, [data]);

    const handleImageSelect = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...previews];
            newPreviews[index] = reader.result;
            setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);

        const newFiles = [...selectedFiles];
        newFiles[index] = file;
        setSelectedFiles(newFiles);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Text update
            await aboutService.updateIntro({
                normalTextPart1: formData.normalTextPart1,
                coloredTextPart: formData.coloredTextPart,
                normalTextPart2: formData.normalTextPart2,
                description: formData.description,
                creatorCountText: formData.creatorCountText,
                fullTextSuffix: formData.fullTextSuffix
            });

            // Image uploads
            const uploadPromises = selectedFiles.map((file, index) => {
                if (file) {
                    const uploadData = new FormData();
                    uploadData.append('gridImage', file);
                    return aboutService.updateIntroSingleImage(index, uploadData);
                }
                return null;
            });

            await Promise.all(uploadPromises.filter(p => p !== null));

            toast.success("Intro section updated!");
            setEditMode(false);
            setSelectedFiles([null, null, null, null]);
            refresh();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                        <FiImage size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-purple-400">Intro Section</h2>
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
                    <button onClick={() => setEditMode(true)} className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 hover:text-white transition-all">
                        <FiEdit3 size={18} />
                    </button>
                )}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="relative aspect-square bg-[#0d0d0d] rounded-xl border border-gray-800 overflow-hidden group">
                        {previews[idx] ? (
                            <img src={previews[idx]} alt="" className="w-full h-full object-cover opacity-60" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600">
                                <FiImage size={24} />
                            </div>
                        )}
                        {editMode && (
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(idx, e.target.files[0])} />
                                <div className="bg-purple-600 p-2 rounded-full text-white">
                                    <FiUpload size={16} />
                                </div>
                            </label>
                        )}
                        {selectedFiles[idx] && (
                            <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Headline 1</label>
                    <input
                        value={formData.normalTextPart1}
                        onChange={(e) => setFormData({ ...formData, normalTextPart1: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-purple-500" : "border-gray-700 opacity-70"}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-purple-400 uppercase tracking-wider mb-2">Colored</label>
                    <input
                        value={formData.coloredTextPart}
                        onChange={(e) => setFormData({ ...formData, coloredTextPart: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-purple-500" : "border-gray-700 opacity-70"}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Headline 2</label>
                    <input
                        value={formData.normalTextPart2}
                        onChange={(e) => setFormData({ ...formData, normalTextPart2: e.target.value })}
                        disabled={!editMode}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-purple-500" : "border-gray-700 opacity-70"}`}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={!editMode}
                        rows={3}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 resize-none ${editMode ? "border-purple-500" : "border-gray-700 opacity-70"}`}
                    />
                </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Suffix</label>
                        <input
                            value={formData.fullTextSuffix}
                            onChange={(e) => setFormData({ ...formData, fullTextSuffix: e.target.value })}
                            disabled={!editMode}
                            className={`w-full bg-[#0d0d0d] border rounded-xl p-3 text-gray-200 ${editMode ? "border-purple-500" : "border-gray-700 opacity-70"}`}
                        />
                    </div>
            </div>
        </section>
    );
};

export default IntroSection;