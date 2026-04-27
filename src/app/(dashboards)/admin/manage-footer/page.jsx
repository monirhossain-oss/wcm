'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Link as LinkIcon, Globe, Info } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageFooter() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Initial State - Full structure according to Backend Schema
    const [footer, setFooter] = useState({
        aboutText: '',
        socialLinks: { instagram: '', pinterest: '', linkedin: '', facebook: '' },
        platformLinks: [],
        resourceLinks: [],
        legalLinks: [],
        newsletterTitle: '',
        newsletterDescription: ''
    });

    // ১. ডাটা লোড করা (Read)
    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/footer`);
                if (data.success && data.data) {
                    setFooter(data.data);
                }
            } catch (err) {
                console.error("Error fetching footer:", err);
                toast.error("Could not load footer data");
            } finally {
                setFetching(false);
            }
        };
        fetchFooterData();
    }, []);

    // ২. নতুন লিঙ্ক যোগ করা (Create logic for Arrays)
    const handleAddLink = (section) => {
        setFooter({
            ...footer,
            [section]: [...footer[section], { label: '', href: '' }]
        });
    };

    // ৩. লিঙ্ক রিমুভ করা (Delete logic for Arrays)
    const handleRemoveLink = (section, index) => {
        const updatedArray = footer[section].filter((_, i) => i !== index);
        setFooter({ ...footer, [section]: updatedArray });
    };

    // ৪. লিঙ্ক এডিট করা (Update logic for Arrays)
    const handleLinkEdit = (section, index, field, value) => {
        const updatedArray = [...footer[section]];
        updatedArray[index][field] = value;
        setFooter({ ...footer, [section]: updatedArray });
    };

    // ৫. পুরো ফুটার সেভ করা (Update/Create API Call)
    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/footer`,
                footer,
                { withCredentials: true }
            );
            if (data.success) {
                toast.success("Footer has been updated successfully!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save footer");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={40} />
            <p className="text-zinc-500">Loading Footer CMS...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-900">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Footer Management</h1>
                    <p className="text-zinc-500 text-sm">Control every text and link of your website footer from here.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Update Footer
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Left Side: About & Socials */}
                <div className="space-y-8">
                    <section className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-wider">
                            <Info size={16} /> About Section
                        </div>
                        <textarea
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                            rows="4"
                            placeholder="Write your footer about text here..."
                            value={footer.aboutText}
                            onChange={(e) => setFooter({ ...footer, aboutText: e.target.value })}
                        />
                    </section>

                    <section className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-wider">
                            <Globe size={16} /> Social Media Links
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {['facebook', 'instagram', 'linkedin', 'pinterest'].map((platform) => (
                                <div key={platform} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                    <span className="w-24 text-xs font-semibold capitalize text-zinc-500">{platform}:</span>
                                    <input
                                        type="text"
                                        placeholder={`https://${platform}.com/yourpage`}
                                        className="flex-1 bg-transparent border-none text-sm outline-none"
                                        value={footer.socialLinks[platform]}
                                        onChange={(e) => setFooter({
                                            ...footer,
                                            socialLinks: { ...footer.socialLinks, [platform]: e.target.value }
                                        })}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Side: Dynamic Links (Platform, Resources, Legal) */}
                <div className="space-y-8">
                    {['platformLinks', 'resourceLinks', 'legalLinks'].map((sectionName) => (
                        <section key={sectionName} className="p-6 border border-zinc-100 dark:border-zinc-900 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-zinc-800 dark:text-zinc-200 capitalize">
                                    {sectionName.replace('Links', ' Links')}
                                </h3>
                                <button
                                    onClick={() => handleAddLink(sectionName)}
                                    className="p-1 hover:bg-orange-50 dark:hover:bg-orange-950 text-orange-600 rounded-md transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {footer[sectionName].map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group animate-in slide-in-from-right-2">
                                        <div className="flex flex-1 gap-2 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <input
                                                type="text"
                                                placeholder="Label"
                                                className="w-1/3 bg-transparent border-r dark:border-zinc-800 pr-2 text-xs font-bold outline-none"
                                                value={link.label}
                                                onChange={(e) => handleLinkEdit(sectionName, idx, 'label', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="URL"
                                                className="flex-1 bg-transparent text-xs outline-none"
                                                value={link.href}
                                                onChange={(e) => handleLinkEdit(sectionName, idx, 'href', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveLink(sectionName, idx)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {footer[sectionName].length === 0 && (
                                    <p className="text-center text-zinc-400 text-xs py-4 border-2 border-dashed rounded-xl">No links added yet.</p>
                                )}
                            </div>
                        </section>
                    ))}
                </div>

            </div>

            {/* Newsletter Section */}
            <section className="mt-10 p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Newsletter CMS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Newsletter Title Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1">
                            Title
                        </label>
                        <input
                            type="text"
                            placeholder="Stay Connected"
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-all text-zinc-800 dark:text-zinc-200"
                            value={footer.newsletterTitle}
                            onChange={(e) => setFooter({ ...footer, newsletterTitle: e.target.value })}
                        />
                    </div>

                    {/* Newsletter Description Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1">
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="Stay informed about cultural stories..."
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-all text-zinc-800 dark:text-zinc-200"
                            value={footer.newsletterDescription}
                            onChange={(e) => setFooter({ ...footer, newsletterDescription: e.target.value })}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}