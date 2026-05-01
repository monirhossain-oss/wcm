"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Globe, Heart, ShieldCheck, CheckCircle2, Edit3, Save, X, Upload } from 'lucide-react';
// import aboutService from '@/services/aboutService';
import { toast } from 'react-hot-toast';
import aboutService from '@/app/(dashboards)/admin/manage-about/_services/aboutService';

const AboutCulture = ({ data }) => {
    // ১. প্রপস থেকে আসা ডাটা সরাসরি স্টেটে রাখা হচ্ছে যেন এডিট করা যায়
    const [visionData, setVisionData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // পেজ থেকে ডাটা আসলে সেটা স্টেটে সিঙ্ক করা
    useEffect(() => {
        if (data) {
            setVisionData(data);
            setPreviewUrl(data.imageCard?.imageUrl || '');
        }
    }, [data]);

    if (!visionData) return null;

    const handleUpdate = async () => {
        setLoading(true);
        const formData = new FormData();

        // হেডার ডাটা
        formData.append('badge', visionData.header?.badge);
        formData.append('titlePart1', visionData.header?.titlePart1);
        formData.append('titleColored', visionData.header?.titleColored);
        formData.append('mainDescription', visionData.header?.mainDescription);

        // কার্ড ডাটা
        formData.append('topBadge', visionData.imageCard?.topBadge);
        formData.append('cardTitle', visionData.imageCard?.cardTitle);
        formData.append('cardQuote', visionData.imageCard?.cardQuote);
        formData.append('cardFooterText', visionData.imageCard?.footerText);

        if (selectedFile) formData.append('imageCard', selectedFile);

        try {
            const res = await aboutService.updateVision(formData);
            if (res.data.success) {
                toast.success("Vision Section Updated!");
                setIsEditing(false);
                setSelectedFile(null);
                // নোট: এখানে উইন্ডো রিলোড বা রাউটার রিফ্রেশ দিতে পারেন ডাটা আপডেট দেখার জন্য
            }
        } catch (err) {
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (id) => {
        switch (id) {
            case 'shield': return <ShieldCheck className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />;
            case 'heart': return <Heart className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />;
            case 'check': return <CheckCircle2 className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />;
            default: return <Globe className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />;
        }
    };

    return (
        <section className="bg-[#fafafa] dark:bg-[#0d0d0d] py-20 px-6 relative">

            <div className="max-w-7xl mx-auto flex justify-end mb-4">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition-all"
                >
                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Section</>}
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Image Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 group">
                    <div className="relative aspect-[4/5] w-full bg-[#f9f9f9] dark:bg-zinc-800">
                        {isEditing ? (
                            <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
                                <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg">
                                    <Upload size={20} /> Change Image
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const file = e.target.files[0];
                                        setSelectedFile(file);
                                        setPreviewUrl(URL.createObjectURL(file));
                                    }} />
                                </label>
                            </div>
                        ) : (
                            <span className="absolute top-6 left-6 bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] z-10 rounded-full">
                                {visionData.imageCard?.topBadge}
                            </span>
                        )}

                        <Image
                            src={previewUrl || visionData.imageCard?.imageUrl}
                            alt="Cultural Craft"
                            fill
                            className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                    </div>

                    <div className="p-8 md:p-10 space-y-6">
                        <div className="space-y-2">
                            {isEditing ? (
                                <input
                                    className="w-full bg-gray-100 dark:bg-zinc-800 p-2 rounded text-2xl font-bold"
                                    value={visionData.imageCard?.cardTitle}
                                    onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardTitle: e.target.value } })}
                                />
                            ) : (
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{visionData.imageCard?.cardTitle}</h3>
                            )}

                            {isEditing ? (
                                <textarea
                                    className="w-full bg-gray-100 dark:bg-zinc-800 p-2 rounded italic text-sm"
                                    value={visionData.imageCard?.cardQuote}
                                    onChange={(e) => setVisionData({ ...visionData, imageCard: { ...visionData.imageCard, cardQuote: e.target.value } })}
                                />
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    "{visionData.imageCard?.cardQuote}"
                                </p>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
                                    {visionData.imageCard?.footerText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <span className="bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-4 py-2 uppercase tracking-[0.3em] rounded-full">
                            {visionData.header?.badge}
                        </span>

                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1]">
                            {isEditing ? (
                                <div className="flex flex-col gap-2">
                                    <input className="bg-gray-100 dark:bg-zinc-800 p-2 rounded"
                                        value={visionData.header?.titlePart1} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titlePart1: e.target.value } })} />
                                    <input className="bg-gray-100 dark:bg-zinc-800 text-orange-600 p-2 rounded"
                                        value={visionData.header?.titleColored} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, titleColored: e.target.value } })} />
                                </div>
                            ) : (
                                <>
                                    {visionData.header?.titlePart1} <br />
                                    <span className="text-orange-600">{visionData.header?.titleColored}</span>
                                </>
                            )}
                        </h3>

                        {isEditing ? (
                            <textarea className="w-full bg-gray-100 dark:bg-zinc-800 p-2 rounded h-32"
                                value={visionData.header?.mainDescription} onChange={(e) => setVisionData({ ...visionData, header: { ...visionData.header, mainDescription: e.target.value } })} />
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                {visionData.header?.mainDescription}
                            </p>
                        )}
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-1 gap-8">
                        {visionData.features?.map((item, index) => (
                            <div key={index} className="flex gap-5 group p-2">
                                {getIcon(item.iconId)}
                                <div className="space-y-2 flex-1">
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-700 transition-all"
                        >
                            <Save size={20} /> {loading ? "Updating..." : "Save All Changes"}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AboutCulture;