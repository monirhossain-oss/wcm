"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiCheck, FiEdit3, FiUpload, FiEye } from 'react-icons/fi';
import aboutService from '../_services/aboutService';

const VisionSection = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const [visionData, setVisionData] = useState({
        header: { badge: '', titlePart1: '', titleColored: '', mainDescription: '' },
        imageCard: { topBadge: '', cardTitle: '', cardQuote: '', footerText: '', imageUrl: '' },
        features: []
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
    const [newFeature, setNewFeature] = useState({ title: '', description: '', iconId: 'globe' });

    useEffect(() => {
        if (data) {
            setVisionData(data);
            setPreviewUrl(data.imageCard?.imageUrl || '');
        }
    }, [data]);

    // 1. Main Section Update (Header + Image Card)
    const handleUpdateMain = async () => {
        setLoading(true);
        const formData = new FormData();
        
        formData.append('badge', visionData.header.badge);
        formData.append('titlePart1', visionData.header.titlePart1);
        formData.append('titleColored', visionData.header.titleColored);
        formData.append('mainDescription', visionData.header.mainDescription);

        formData.append('topBadge', visionData.imageCard.topBadge);
        formData.append('cardTitle', visionData.imageCard.cardTitle);
        formData.append('cardQuote', visionData.imageCard.cardQuote);
        formData.append('cardFooterText', visionData.imageCard.footerText);

        if (selectedFile) {
            formData.append('imageCard', selectedFile);
        }

        try {
            const res = await aboutService.updateVision(formData);
            if (res.data.success) {
                toast.success("Vision section updated!");
                setEditMode(false);
                setSelectedFile(null);
                refresh();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    // 2. Add New Feature
    const handleAddNewFeature = async () => {
        if (!newFeature.title || !newFeature.description) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);
            const res = await aboutService.addVisionFeature(newFeature);
            if (res.data.success) {
                toast.success("New feature added!");
                setVisionData({ ...visionData, features: res.data.data });
                setNewFeature({ title: '', description: '', iconId: 'globe' });
                setShowNewFeatureForm(false);
                refresh();
            }
        } catch (err) {
            toast.error("Failed to save feature");
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete Feature
    const deleteFeature = async (index) => {
        if (!window.confirm("Delete this feature?")) return;
        try {
            const res = await aboutService.deleteVisionFeature(index);
            if (res.data.success) {
                const updatedFeatures = [...visionData.features];
                updatedFeatures.splice(index, 1);
                setVisionData({ ...visionData, features: updatedFeatures });
                toast.success("Feature removed");
                refresh();
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // 4. Feature Change Handler
    const handleFeatureChange = (index, field, value) => {
        const updatedFeatures = [...visionData.features];
        updatedFeatures[index][field] = value;
        setVisionData({ ...visionData, features: updatedFeatures });
    };

    // 5. Save Individual Feature
    const saveFeature = async (index) => {
        try {
            const feature = visionData.features[index];
            const res = await aboutService.updateVisionFeature(index, feature);
            if (res.data.success) {
                toast.success(`Feature ${index + 1} saved!`);
                refresh();
            }
        } catch (err) {
            toast.error("Feature save failed");
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl mt-10">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-2xl">
                        <FiEye size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Vision Section</h2>
                        <p className="text-gray-500 text-xs">Manage vision content & features</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button onClick={() => setEditMode(false)} className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-all">
                                <FiX size={18} />
                            </button>
                            <button onClick={handleUpdateMain} disabled={loading} className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-all">
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

            {/* Header & Image Card Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                
                {/* Header Fields */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Header Texts
                    </h3>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Badge Text</label>
                            <input 
                                type="text" 
                                placeholder="OUR VISION" 
                                value={visionData.header.badge} 
                                onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, badge: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Title Part 1</label>
                            <input 
                                type="text" 
                                placeholder="Our" 
                                value={visionData.header.titlePart1} 
                                onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titlePart1: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-1.5">Title Colored</label>
                            <input 
                                type="text" 
                                placeholder="Vision" 
                                value={visionData.header.titleColored} 
                                onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titleColored: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Main Description</label>
                            <textarea 
                                placeholder="Description..." 
                                rows="3" 
                                value={visionData.header.mainDescription} 
                                onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, mainDescription: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none resize-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Image Card Fields */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Image Card & Quote
                    </h3>
                    
                    <div className="space-y-3">
                        {/* Image Upload */}
                        <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
                                {previewUrl ? (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-600 text-xs">No Image</div>
                                )}
                            </div>
                            {editMode && (
                                <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all border border-gray-700 hover:border-orange-500/50">
                                    <FiUpload size={16} /> Change Image
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }} />
                                </label>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Card Top Badge</label>
                            <input 
                                type="text" 
                                placeholder="CULTURAL CRAFT" 
                                value={visionData.imageCard.topBadge} 
                                onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, topBadge: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Card Title</label>
                            <input 
                                type="text" 
                                placeholder="Card Title" 
                                value={visionData.imageCard.cardTitle} 
                                onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardTitle: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Quote Text</label>
                            <input 
                                type="text" 
                                placeholder="Quote..." 
                                value={visionData.imageCard.cardQuote} 
                                onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardQuote: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm italic outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Footer Text</label>
                            <input 
                                type="text" 
                                placeholder="Footer..." 
                                value={visionData.imageCard.footerText} 
                                onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, footerText: e.target.value } })}
                                disabled={!editMode}
                                className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features List Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        Vision Features <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{visionData.features?.length || 0}</span>
                    </h3>
                    {!showNewFeatureForm && (
                        <button
                            onClick={() => setShowNewFeatureForm(true)}
                            className="flex items-center gap-2 text-orange-400 hover:bg-orange-400/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-orange-400/20"
                        >
                            <FiPlus /> Add New Point
                        </button>
                    )}
                </div>

                {/* New Feature Form */}
                {showNewFeatureForm && (
                    <div className="bg-[#1e293b] border-2 border-orange-500 p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-orange-500 font-bold text-xs uppercase tracking-tighter">Creating New Feature</span>
                            <button onClick={() => setShowNewFeatureForm(false)} className="text-gray-400 hover:text-white transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white font-bold outline-none focus:border-orange-500 transition-all"
                                placeholder="Feature Title..."
                                value={newFeature.title}
                                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                            />
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white h-28 resize-none outline-none focus:border-orange-500 transition-all"
                                placeholder="Feature Description..."
                                value={newFeature.description}
                                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNewFeatureForm(false)}
                                    className="flex-1 py-2.5 bg-gray-800 text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNewFeature}
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                                >
                                    <FiCheck size={18} /> Confirm Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visionData.features?.map((feature, index) => (
                        <div key={index} className="group bg-[#111827]/80 border border-gray-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all relative">
                            
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-orange-500 text-xs font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full">
                                    Point #{index + 1}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => saveFeature(index)}
                                        title="Save changes"
                                        className="text-green-400 hover:bg-green-400/10 p-1.5 rounded-lg transition-colors"
                                    >
                                        <FiCheck size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteFeature(index)}
                                        title="Delete"
                                        className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full bg-transparent text-white font-bold border-b border-gray-700 focus:border-orange-500 outline-none py-1 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm border-b border-gray-700 focus:border-orange-500 outline-none resize-none h-20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Icon ID</label>
                                    <input
                                        type="text"
                                        value={feature.iconId}
                                        onChange={(e) => handleFeatureChange(index, 'iconId', e.target.value)}
                                        className="w-full bg-transparent text-gray-500 text-xs border-b border-gray-700 focus:border-orange-500 outline-none py-1 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VisionSection;