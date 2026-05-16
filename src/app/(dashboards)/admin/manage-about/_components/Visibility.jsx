"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiCheck, FiEdit3, FiHeart } from 'react-icons/fi';
import aboutService from '../_services/aboutService';

const Visibility = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [visibilityData, setVisibilityData] = useState({
        headline: { textPart: '', coloredPart: '' },
        founderText: { prefix: '', founderName: '', suffix: '' },
        description: '',
        footerInfo: { locations: [], serviceText: '' }
    });

    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        if (data) {
            setVisibilityData({
                headline: {
                    textPart: data.headline?.textPart || '',
                    coloredPart: data.headline?.coloredPart || ''
                },
                founderText: {
                    prefix: data.founderText?.prefix || '',
                    founderName: data.founderText?.founderName || '',
                    suffix: data.founderText?.suffix || ''
                },
                description: data.description || '',
                footerInfo: {
                    locations: data.footerInfo?.locations || [],
                    serviceText: data.footerInfo?.serviceText || ''
                }
            });
        }
    }, [data]);

    // 1. Update Main Section
    const handleUpdateMain = async () => {
        try {
            setLoading(true);
            const res = await aboutService.updateVisibility({
                textPart: visibilityData.headline.textPart,
                coloredPart: visibilityData.headline.coloredPart,
                prefix: visibilityData.founderText.prefix,
                founderName: visibilityData.founderText.founderName,
                suffix: visibilityData.founderText.suffix,
                description: visibilityData.description,
                locations: visibilityData.footerInfo.locations,
                serviceText: visibilityData.footerInfo.serviceText
            });

            if (res.data.success) {
                toast.success("Visibility section updated!");
                setEditMode(false);
                refresh();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    // 2. Add Location
    const handleAddLocation = () => {
        if (!newLocation.trim()) return;
        setVisibilityData({
            ...visibilityData,
            footerInfo: {
                ...visibilityData.footerInfo,
                locations: [...visibilityData.footerInfo.locations, newLocation.trim()]
            }
        });
        setNewLocation('');
    };

    // 3. Remove Location
    const handleRemoveLocation = (index) => {
        const updatedLocations = [...visibilityData.footerInfo.locations];
        updatedLocations.splice(index, 1);
        setVisibilityData({
            ...visibilityData,
            footerInfo: {
                ...visibilityData.footerInfo,
                locations: updatedLocations
            }
        });
    };

    // 4. Update Location
    const handleUpdateLocation = (index, value) => {
        const updatedLocations = [...visibilityData.footerInfo.locations];
        updatedLocations[index] = value;
        setVisibilityData({
            ...visibilityData,
            footerInfo: {
                ...visibilityData.footerInfo,
                locations: updatedLocations
            }
        });
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl mt-10">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-2xl">
                        <FiHeart size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Visibility Section</h2>
                        <p className="text-gray-500 text-xs">Manage founder story & mission</p>
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

            {/* Headline Section */}
            <div className="mb-8 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Headline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Text Part</label>
                        <input
                            type="text"
                            placeholder="Culture deserves"
                            value={visibilityData.headline.textPart}
                            onChange={(e) => setVisibilityData({ ...visibilityData, headline: { ...visibilityData.headline, textPart: e.target.value } })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-1.5">Colored Part</label>
                        <input
                            type="text"
                            placeholder="visibility."
                            value={visibilityData.headline.coloredPart}
                            onChange={(e) => setVisibilityData({ ...visibilityData, headline: { ...visibilityData.headline, coloredPart: e.target.value } })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                </div>
            </div>

            {/* Founder Text Section */}
            <div className="mb-8 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Founder Text
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Prefix</label>
                        <input
                            type="text"
                            placeholder="World Culture Marketplace was founded by"
                            value={visibilityData.founderText.prefix}
                            onChange={(e) => setVisibilityData({ ...visibilityData, founderText: { ...visibilityData.founderText, prefix: e.target.value } })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-1.5">Founder Name</label>
                        <input
                            type="text"
                            placeholder="Annette Cousin"
                            value={visibilityData.founderText.founderName}
                            onChange={(e) => setVisibilityData({ ...visibilityData, founderText: { ...visibilityData.founderText, founderName: e.target.value } })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Suffix</label>
                        <input
                            type="text"
                            placeholder="with a simple idea..."
                            value={visibilityData.founderText.suffix}
                            onChange={(e) => setVisibilityData({ ...visibilityData, founderText: { ...visibilityData.founderText, suffix: e.target.value } })}
                            disabled={!editMode}
                            className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                        />
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-8 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Description
                </h3>
                <textarea
                    placeholder="Main description..."
                    rows="4"
                    value={visibilityData.description}
                    onChange={(e) => setVisibilityData({ ...visibilityData, description: e.target.value })}
                    disabled={!editMode}
                    className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none resize-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                />
            </div>

            {/* Locations Section */}
            <div className="mb-8 bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Locations
                    </h3>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        {visibilityData.footerInfo.locations?.length || 0}
                    </span>
                </div>

                <div className="space-y-3">
                    {visibilityData.footerInfo.locations?.map((location, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => handleUpdateLocation(index, e.target.value)}
                                disabled={!editMode}
                                className={`flex-1 bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                            />
                            {editMode && (
                                <button
                                    onClick={() => handleRemoveLocation(index)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    {editMode && (
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="text"
                                placeholder="Add new location..."
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition-all"
                            />
                            <button
                                onClick={handleAddLocation}
                                className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all"
                            >
                                <FiPlus size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Service Text Section */}
            <div className="bg-black/20 p-6 rounded-2xl border border-gray-800/50">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Service Text
                </h3>
                <input
                    type="text"
                    placeholder="SERVING GLOBAL ARTISANS"
                    value={visibilityData.footerInfo.serviceText}
                    onChange={(e) => setVisibilityData({ ...visibilityData, footerInfo: { ...visibilityData.footerInfo, serviceText: e.target.value } })}
                    disabled={!editMode}
                    className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all ${editMode ? "border-orange-500 focus:ring-1 focus:ring-orange-500" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                />
            </div>
        </div>
    );
};

export default Visibility;