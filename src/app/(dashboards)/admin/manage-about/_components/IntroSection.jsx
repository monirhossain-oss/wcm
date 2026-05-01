"use client";
import React, { useState, useEffect } from 'react';
import aboutService from '../_services/aboutService';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiSave, FiImage, FiEdit2 } from 'react-icons/fi';

const IntroSection = ({ data, refresh }) => {
    const [loading, setLoading] = useState(false);

    // টেক্সট ডাটা স্টেট
    const [formData, setFormData] = useState({
        normalTextPart1: '',
        coloredTextPart: '',
        normalTextPart2: '',
        description: '',
        creatorCountText: '',
        fullTextSuffix: ''
    });

    // ইমেজ প্রিভিউ এবং ফাইল স্টেট
    const [previews, setPreviews] = useState([null, null, null, null]);
    const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);

    // ডাটাবেজ থেকে ডাটা আসলে স্টেট আপডেট
    useEffect(() => {
        if (data) {
            setFormData({
                normalTextPart1: data.headline?.normalTextPart1 || '',
                coloredTextPart: data.headline?.coloredTextPart || '',
                normalTextPart2: data.headline?.normalTextPart2 || '',
                description: data.description || '',
                creatorCountText: data.socialProof?.creatorCountText || '',
                fullTextSuffix: data.socialProof?.fullTextSuffix || ''
            });
            // ডাটাবেজের ইমেজগুলো প্রিভিউতে দেখানো
            setPreviews(data.gridImages || [null, null, null, null]);
        }
    }, [data]);

    // ইমেজ সিলেক্ট করলে শুধু প্রিভিউ দেখাবে, আপলোড হবে না
    const handleImageSelect = (index, file) => {
        if (!file) return;

        // লোকাল প্রিভিউ তৈরি করা
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...previews];
            newPreviews[index] = reader.result;
            setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);

        // ফাইলটি সেভ করার জন্য স্টেটে রাখা
        const newFiles = [...selectedFiles];
        newFiles[index] = file;
        setSelectedFiles(newFiles);
    };

    // ফাইনাল সাবমিট (টেক্সট এবং ইমেজ একসাথে)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // ১. প্রথমে টেক্সট ডাটা আপডেট করা
            await aboutService.updateIntro(formData);

            // ২. যদি কোনো নতুন ইমেজ সিলেক্ট করা থাকে, সেগুলো আপলোড করা
            const uploadPromises = selectedFiles.map((file, index) => {
                if (file) {
                    const uploadData = new FormData();
                    uploadData.append('gridImage', file);
                    return aboutService.updateIntroSingleImage(index, uploadData);
                }
                return null;
            });

            await Promise.all(uploadPromises.filter(p => p !== null));

            toast.success("All changes saved successfully!");
            setSelectedFiles([null, null, null, null]); // ফাইল স্টেট ক্লিয়ার করা
            refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
                    <FiImage size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Intro Section Settings</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Image Management */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Image Grid (4 Images)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-900 rounded-2xl border-2 border-dashed border-gray-800 overflow-hidden">
                                {previews[idx] ? (
                                    <img src={previews[idx]} className="w-full h-full object-cover opacity-60" alt="" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-600"><FiUploadCloud size={24} /></div>
                                )}

                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageSelect(idx, e.target.files[0])}
                                    />
                                    <div className="bg-purple-600 p-2 rounded-full text-white">
                                        <FiEdit2 size={18} />
                                    </div>
                                </label>
                                {selectedFiles[idx] && (
                                    <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border-2 border-white animate-pulse" title="Ready to upload"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Text Management */}
                <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Headline 1</label>
                            <input type="text" value={formData.normalTextPart1} onChange={(e) => setFormData({ ...formData, normalTextPart1: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-purple-400 font-bold uppercase">Colored</label>
                            <input type="text" value={formData.coloredTextPart} onChange={(e) => setFormData({ ...formData, coloredTextPart: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Headline 2</label>
                            <input type="text" value={formData.normalTextPart2} onChange={(e) => setFormData({ ...formData, normalTextPart2: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white h-24 resize-none outline-none focus:border-purple-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Creator Count</label>
                            <input type="text" value={formData.creatorCountText} onChange={(e) => setFormData({ ...formData, creatorCountText: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Suffix Text</label>
                            <input type="text" value={formData.fullTextSuffix} onChange={(e) => setFormData({ ...formData, fullTextSuffix: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
                    >
                        <FiSave size={20} />
                        {loading ? 'Saving Everything...' : 'Save Intro Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IntroSection;