"use client";

import React, { useState, useEffect } from "react";
import aboutService from "../_services/aboutService";
import { toast } from "react-hot-toast";
import { FiEdit3, FiSave, FiX, FiType } from "react-icons/fi";

const AboutHeader = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        subTitle: ""
    });

    useEffect(() => {
        if (data) {
            setFormData({
                title: data.title || "",
                subTitle: data.subTitle || ""
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }

        setLoading(true);
        try {
            const res = await aboutService.updateHeader(formData);
            if (res.data?.success) {
                toast.success("Header updated!");
                setEditMode(false);
                refresh();
            }
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
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <FiType size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-blue-400">About Header</h2>
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
                    <button onClick={() => setEditMode(true)} className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                        <FiEdit3 size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 transition-all ${editMode ? "border-blue-500 focus:outline-none" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subtitle</label>
                    <textarea
                        name="subTitle"
                        value={formData.subTitle}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows={3}
                        className={`w-full bg-[#0d0d0d] border rounded-xl p-4 text-gray-200 resize-none transition-all ${editMode ? "border-blue-500 focus:outline-none" : "border-gray-700 opacity-70 cursor-not-allowed"}`}
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutHeader;