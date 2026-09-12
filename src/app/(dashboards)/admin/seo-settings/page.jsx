"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { Eye, Edit3, Trash2, Globe, Loader2, Search, X, Save, Hash, AlertCircle } from 'lucide-react';
import { SEO_PAGE_OPTIONS as PAGE_OPTIONS, seoPagePath, seoDraft, seoPayload, renderedTitle, addsBrandSuffix } from '@/lib/seo/adminSeo';
import { DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/seo/siteConfig';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const languageName = (code) => code === 'fr' ? 'French' : 'English';

// ── Input Styles ──
const getInputClasses = (isOverLimit) => `
    w-full px-5 py-3.5 rounded-2xl border text-sm font-medium outline-none transition-all duration-300
    ${isOverLimit
        ? 'border-red-300 dark:border-red-500/50 bg-red-50/30 dark:bg-red-500/5 focus:ring-4 focus:ring-red-500/10 focus:border-red-400'
        : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50'
    }
    dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600
`;

function SocialFields({ form, onChange }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Social image URL (optional)</span>
            <input name="ogImage" value={form.ogImage} onChange={onChange} className={getInputClasses(false)} placeholder="https://… or /og-image.jpg" />
            <span className="block text-xs text-gray-400">Leave blank to use the page’s default image.</span>
        </label>
        <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Social image alt text (optional)</span>
            <input name="imageAlt" value={form.imageAlt} onChange={onChange} className={getInputClasses(false)} placeholder="Describe the image in the selected language" />
        </label>
    </div>;
}

// ── Character Counter Component ──
const CharCounter = ({ current, limit, label }) => {
    const percentage = Math.min((current / limit) * 100, 100);
    const isOver = current > limit;
    const isNear = current > limit * 0.85 && !isOver;

    return (
        <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold ${isOver ? 'text-red-500' : isNear ? 'text-orange-500' : 'text-gray-400'}`}>
                {label}
            </span>
            <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-red-500' : isNear ? 'bg-orange-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className={`text-[10px] font-black ${isOver ? 'text-red-500' : isNear ? 'text-orange-500' : 'text-gray-400'}`}>
                {current}/{limit}
            </span>
            {isOver && <AlertCircle size={12} className="text-red-500" />}
        </div>
    );
};

// ── View Modal (Responsive + Google SERP Simulation) ──
function ViewModal({ item, onClose }) {
    const [imageFailed, setImageFailed] = useState(false);
    if (!item) return null;

    // The page renders the stored title plus a brand suffix, so that is what the preview shows
    // and what the counter measures — the raw field alone under-reports by up to 28 characters.
    const renderedItemTitle = renderedTitle(item.title);
    const titleTruncated = renderedItemTitle.length > 60;
    const descTruncated = item.description?.length > 160;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            {/* Capped height with a scrollable body: header and footer stay reachable on short and
                mobile viewports, where the image preview would otherwise push Close off screen. */}
            <div className="bg-white dark:bg-[#0f0f0f] rounded-[24px] md:rounded-[32px] border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Globe size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[2px] mb-0.5">SEO Preview</p>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white capitalize truncate">{item.pageName} — {languageName(item.languageCode)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 md:p-2.5 shrink-0 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7 space-y-5 md:space-y-6">
                    {/* Meta Title */}
                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 flex items-center justify-between">
                            <span>Meta Title</span>
                            <span className={`text-[10px] ${titleTruncated ? 'text-red-500' : 'text-emerald-500'}`}>
                                {renderedItemTitle.length} chars rendered
                            </span>
                        </label>
                        <div className="p-3 md:p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed break-words">
                                {item.title ? renderedItemTitle : '—'}
                            </p>
                        </div>
                        {titleTruncated && (
                            <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle size={10} /> Long titles may be shortened in search results
                            </p>
                        )}
                    </section>

                    {/* Meta Description */}
                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 flex items-center justify-between">
                            <span>Description</span>
                            <span className={`text-[10px] ${item.description?.length > 160 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {item.description?.length || 0} chars
                            </span>
                        </label>
                        <div className="p-3 md:p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                                {item.description || '—'}
                            </p>
                        </div>
                        {descTruncated && (
                            <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle size={10} /> Long descriptions may be shortened in search results
                            </p>
                        )}
                    </section>

                    {/* Keywords */}
                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                            Keywords ({item.keywords?.length || 0})
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(item.keywords || []).map(k => (
                                <span key={k} className="px-3 py-1.5 rounded-xl bg-orange-100/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold border border-orange-200/50 dark:border-orange-500/20">
                                    #{k}
                                </span>
                            ))}
                            {(!item.keywords || item.keywords.length === 0) && (
                                <span className="text-gray-400 text-sm italic">No keywords set</span>
                            )}
                        </div>
                    </section>

                    {/* Google SERP Simulation - Responsive */}
                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                            Google Search Result Preview
                        </label>
                        <div className="p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 shadow-inner overflow-hidden">
                            {/* URL */}
                            <p className="text-[11px] md:text-[12px] text-emerald-600 dark:text-emerald-500 mb-1 truncate">
                                {seoPagePath(item.pageName, item.languageCode)}
                            </p>
                            {/* Title - Google style: blue, 20px, 600px max, 1 line */}
                            <p className="text-blue-600 dark:text-blue-400 font-medium text-lg md:text-xl mb-1 line-clamp-1 break-words" style={{ maxWidth: '100%' }}>
                                {renderedItemTitle.slice(0, 60)}{titleTruncated ? '...' : ''}
                            </p>
                            {/* Description - Google style: gray, 14px, 2 lines */}
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base line-clamp-2 leading-relaxed break-words">
                                {item.description?.slice(0, 160)}{item.description?.length > 160 ? '...' : ''}
                            </p>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Actual Google display may vary by device and query
                        </p>
                    </section>
                    <section className="text-sm text-gray-600 dark:text-gray-300 break-all space-y-2">
                        {!imageFailed ? <Image src={item.ogImage || DEFAULT_SOCIAL_IMAGE_PATH} alt={item.imageAlt || item.title} width={1200} height={630} unoptimized onError={() => setImageFailed(true)} className="w-full max-h-56 object-contain rounded-xl bg-gray-50 dark:bg-white/5" />
                            : <p role="status">Image preview unavailable. Check the image URL.</p>}
                        <p>Social image: {item.ogImage || DEFAULT_SOCIAL_IMAGE_PATH}{!item.ogImage && ' (default preview)'}</p>
                        <p>Image alt text: {item.imageAlt || item.title}</p>
                        <p className="text-xs text-gray-400">Preview of saved settings. Page fallbacks may differ when no custom image is set.</p>
                    </section>
                </div>

                <div className="px-5 sm:px-6 md:px-8 py-4 md:py-5 bg-gray-50/50 dark:bg-white/2 border-t border-gray-100 dark:border-white/5 flex justify-end shrink-0">
                    <button onClick={onClose} className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-2xl bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all active:scale-95">
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Edit Modal ──
function EditModal({ item, onClose, onSave }) {
    const [form, setForm] = useState(() => seoDraft(item.pageName, item));
    const [loading, setLoading] = useState(false);

    // Measured on the rendered title: what the editor types is not what Google shows.
    const renderedFormTitle = renderedTitle(form.title);
    const titleLen = renderedFormTitle.length;
    const descLen = form.description.length;
    const keywordCount = form.keywords ? form.keywords.split(',').filter(k => k.trim()).length : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = seoPayload(form, item.languageCode);
            await axios.post(`${API_URL}/api/seo/update`, payload, { withCredentials: true });
            toast.success(`${languageName(item.languageCode)} SEO settings updated!`);
            onSave();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to update.');
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => { if (!loading) onClose(); }}>
            <div className="bg-white dark:bg-[#0f0f0f] rounded-[32px] border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Edit3 size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Editor</p>
                            <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white capitalize">{item.pageName} — {languageName(item.languageCode)} SEO</p>
                            <p className="text-xs text-gray-500 break-all">{seoPagePath(item.pageName, item.languageCode)}</p>
                        </div>
                    </div>
                    <button disabled={loading} onClick={onClose} className="p-2 md:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset disabled={loading} className="px-6 md:px-8 py-6 md:py-7 space-y-5">
                        {/* Title with counter */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Title</label>
                                <CharCounter current={titleLen} limit={60} label="Title" />
                            </div>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                className={getInputClasses(titleLen > 60)}
                                required
                            />
                            {addsBrandSuffix(form.title) && (
                                <p className="text-[10px] text-gray-400 break-words">Renders as: {renderedFormTitle}</p>
                            )}
                            {titleLen > 60 && (
                                <p className="text-[10px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={10} /> Google truncates titles over 60 characters, brand suffix included
                                </p>
                            )}
                        </div>

                        {/* Description with counter */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <CharCounter current={descLen} limit={160} label="Desc" />
                            </div>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                className={`${getInputClasses(descLen > 160)} resize-none`}
                                required
                            />
                            {descLen > 160 && (
                                <p className="text-[10px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={10} /> Google shows only ~160 characters
                                </p>
                            )}
                        </div>

                        {/* Keywords with counter */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                    <Hash size={12} /> Keywords
                                </label>
                                <span className={`text-[10px] font-bold ${keywordCount > 10 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {keywordCount}/10 recommended
                                </span>
                            </div>
                            <input
                                type="text"
                                value={form.keywords}
                                onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
                                placeholder="culture, marketplace, handmade, global"
                                className={getInputClasses(keywordCount > 10)}
                            />
                            {keywordCount > 10 && (
                                <p className="text-[10px] text-orange-500 flex items-center gap-1">
                                    <AlertCircle size={10} /> Too many keywords may dilute focus
                                </p>
                            )}
                        </div>
                        <SocialFields form={form} onChange={(event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))} />
                    </fieldset>

                    <div className="px-6 md:px-8 py-4 md:py-5 bg-gray-50/50 dark:bg-white/2 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
                        <button type="button" disabled={loading} onClick={onClose} className="px-5 md:px-6 py-2.5 md:py-3 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-sm transition-all">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-all shadow-xl shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Component ──
const SeoWorkspace = ({ languageCode, onLanguageChange }) => {
    const [loading, setLoading] = useState(false);
    const [allSeoData, setAllSeoData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(() => seoDraft());
    const [listLoading, setListLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [revision, setRevision] = useState(0);
    const fetchAllData = () => { setListLoading(true); setLoadError(''); setRevision((value) => value + 1); };

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        const load = async () => {
            try {
                if (!API_URL) throw new Error('API URL is not configured.');
                const response = await axios.get(`${API_URL}/api/seo/all`, { params: { languageCode }, signal: controller.signal });
                if (!Array.isArray(response.data)) throw new Error('Unexpected SEO response. Please retry.');
                const records = response.data.filter((item) => (item.languageCode || 'en') === languageCode);
                if (!active) return;
                setAllSeoData(records);
                setFormData((previous) => seoDraft(previous.pageName, records.find(({ pageName }) => pageName === previous.pageName)));
            } catch (error) {
                if (active) setLoadError(error.response?.data?.message || error.message || 'Failed to load SEO settings.');
            } finally { if (active) setListLoading(false); }
        };
        load();
        return () => { active = false; controller.abort(); };
    }, [languageCode, revision]);

    const selectedRecord = allSeoData.find(({ pageName }) => pageName === formData.pageName);
    const isDirty = JSON.stringify(formData) !== JSON.stringify(seoDraft(formData.pageName, selectedRecord));
    const allowDiscard = () => !isDirty || window.confirm('Discard unsaved SEO changes?');
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pageName') {
            if (allowDiscard()) setFormData(seoDraft(value, allSeoData.find(({ pageName }) => pageName === value)));
        } else setFormData((previous) => ({ ...previous, [name]: value }));
    };

    // Same rule as the edit modal: the counter measures the title as rendered, suffix included.
    const renderedFormTitle = renderedTitle(formData.title);
    const titleLen = renderedFormTitle.length;
    const descLen = formData.description.length;
    const keywordCount = formData.keywords ? formData.keywords.split(',').filter(k => k.trim()).length : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/seo/update`, seoPayload(formData, languageCode), { withCredentials: true });
            toast.success(`${languageName(languageCode)} ${formData.pageName} SEO updated!`);
            fetchAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to update SEO.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item) => {
        if (!allowDiscard()) return;
        setLoading(true);
        try {
            const result = await Swal.fire({
            title: 'Delete SEO Entry?',
            text: `Remove ${languageName(languageCode)} SEO for ${item.pageName}? The other language is unchanged.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            background: document.documentElement.classList.contains('dark') ? '#111' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/api/seo/delete/${item._id}`, { withCredentials: true });
                    toast.success(`${languageName(languageCode)} entry removed.`);
                    fetchAllData();
                } catch (error) { toast.error(error.response?.data?.message || 'Delete failed.'); }
            }
        } catch (error) { toast.error(error.response?.data?.message || 'Delete failed.'); }
        finally { setLoading(false); }
    };

    const rows = PAGE_OPTIONS.map((option) => ({
        ...allSeoData.find(({ pageName }) => pageName === option.value),
        pageName: option.value, languageCode, label: option.label,
    }));
    const filtered = rows.filter(item =>
        item.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 md:px-0">
            {/* ── CREATE FORM CARD ── */}
            <div className="bg-white dark:bg-[#0d0d0d] rounded-[24px] md:rounded-[40px] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/20 flex-shrink-0">
                        <Globe size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">SEO Settings</h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Configure search engine appearance for your platform</p>
                    </div>
                    <label className="ml-auto text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <span className="block">SEO language</span>
                        <select aria-label="SEO language" value={languageCode} disabled={loading || Boolean(editItem)}
                            onChange={(event) => { if (allowDiscard()) onLanguageChange(event.target.value); }}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-2">
                            <option value="en">English</option><option value="fr">French</option>
                        </select>
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                    <fieldset disabled={loading || listLoading || Boolean(loadError)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page</label>
                            <select
                                name="pageName"
                                aria-label="Page"
                                value={formData.pageName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-zinc-900 dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all cursor-pointer appearance-none"
                            >
                                {PAGE_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Title</label>
                                <CharCounter current={titleLen} limit={60} label="Title" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Best Cultural Marketplace | WCM"
                                className={getInputClasses(titleLen > 60)}
                                required
                            />
                            {addsBrandSuffix(formData.title) && (
                                <p className="text-[10px] text-gray-400 break-words">Renders as: {renderedFormTitle}</p>
                            )}
                            {titleLen > 60 && (
                                <p className="text-[10px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={10} /> Google truncates titles over 60 characters, brand suffix included
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 break-all">{seoPagePath(formData.pageName, languageCode)}</p>
                    {!listLoading && !loadError && <p className="text-sm text-gray-500">{selectedRecord
                        ? `Editing saved ${languageName(languageCode)} SEO.`
                        : `No custom ${languageName(languageCode)} SEO saved. The page’s existing fallback applies until a record is configured and connected.`}</p>}

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                            <CharCounter current={descLen} limit={160} label="Desc" />
                        </div>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="A brief summary of what this page offers..."
                            className={`${getInputClasses(descLen > 160)} resize-none`}
                            required
                        />
                        {descLen > 160 && (
                            <p className="text-[10px] text-red-500 flex items-center gap-1">
                                <AlertCircle size={10} /> Google shows only ~160 characters
                            </p>
                        )}
                    </div>

                    <SocialFields form={formData} onChange={handleChange} />
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords</label>
                                <span className={`text-[10px] font-bold ${keywordCount > 10 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {keywordCount}/10 recommended
                                </span>
                            </div>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                placeholder="culture, marketplace, handmade, global"
                                className={getInputClasses(keywordCount > 10)}
                            />
                            {keywordCount > 10 && (
                                <p className="text-[10px] text-orange-500 flex items-center gap-1">
                                    <AlertCircle size={10} /> Too many keywords may dilute focus
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
                        >
                            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                            {loading ? 'Saving...' : `Save ${languageName(languageCode)} SEO`}
                        </button>
                    </div>
                    </fieldset>
                </form>
            </div>

            {/* ── DATA TABLE CARD ── */}
            <div className="bg-white dark:bg-[#0d0d0d] rounded-[24px] md:rounded-[40px] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{languageName(languageCode)} SEO configurations</h2>
                        <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">{listLoading ? 'Loading…' : loadError ? 'Could not load configurations' : `${allSeoData.length} of ${PAGE_OPTIONS.length} pages configured`}</p>
                    </div>

                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by page or title..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-3 md:py-3.5 rounded-[20px] border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm text-gray-700 dark:text-white outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/40 w-full md:w-80 transition-all"
                        />
                    </div>
                </div>

                {loadError && <div role="alert" className="p-6 text-red-600">{loadError} <button onClick={fetchAllData} className="underline ml-2">Retry</button></div>}
                {listLoading && <p role="status" className="p-6 text-gray-500">Loading {languageName(languageCode)} SEO settings…</p>}
                {!listLoading && !loadError && <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/2">
                                <th className="px-4 md:px-10 py-4 md:py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Page</th>
                                <th className="px-4 md:px-10 py-4 md:py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[2px]">SEO Title</th>
                                <th className="px-4 md:px-10 py-4 md:py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[2px] hidden lg:table-cell">Keywords</th>
                                <th className="px-4 md:px-10 py-4 md:py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filtered.length > 0 ? filtered.map(item => (
                                <tr key={item.pageName} className="group hover:bg-gray-50/80 dark:hover:bg-white/2 transition-all duration-300">
                                    <td className="px-4 md:px-10 py-4 md:py-6">
                                        <span className="px-2.5 md:px-3 py-1 rounded-xl bg-orange-100/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] md:text-[11px] font-black uppercase tracking-wider border border-orange-200/50 dark:border-orange-500/20">
                                            {item.label}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-6">
                                        <p className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 line-clamp-1 max-w-[200px] md:max-w-[280px] group-hover:text-orange-500 transition-colors">
                                            {item.title || 'No custom SEO — page fallback'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 md:hidden">
                                            {item.title?.length || 0} chars
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-6 hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                                            {(item.keywords || []).slice(0, 2).map(k => (
                                                <span key={k} className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[9px] md:text-[10px] font-bold border border-gray-200/50 dark:border-white/5">
                                                    #{k}
                                                </span>
                                            ))}
                                            {(item.keywords || []).length > 2 && (
                                                <span className="text-[9px] md:text-[10px] font-black text-orange-400 self-center">+{item.keywords.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-6">
                                        <div className="flex justify-end gap-2 md:gap-3">
                                            <button aria-label={`Preview ${item.label} SEO`} disabled={!item._id || loading} onClick={() => setViewItem(item)} className="p-2 md:p-3 rounded-[10px] md:rounded-[14px] bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-90 border border-blue-100 dark:border-blue-500/20 disabled:opacity-30">
                                                <Eye size={14} className="md:w-4 md:h-4" />
                                            </button>
                                            <button aria-label={`${item._id ? 'Edit' : 'Add'} ${item.label} SEO`} disabled={loading} onClick={() => { if (allowDiscard()) setEditItem(item); }} className="p-2 md:p-3 rounded-[10px] md:rounded-[14px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90 border border-emerald-100 dark:border-emerald-500/20">
                                                <Edit3 size={14} className="md:w-4 md:h-4" />
                                            </button>
                                            <button aria-label={`Delete ${item.label} SEO`} disabled={!item._id || loading} onClick={() => handleDelete(item)} className="p-2 md:p-3 rounded-[10px] md:rounded-[14px] bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90 border border-red-100 dark:border-red-500/20 disabled:opacity-30">
                                                <Trash2 size={14} className="md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-16 md:py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 md:gap-4 opacity-40">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                                <Search size={20} className="md:w-7 md:h-7" />
                                            </div>
                                            <p className="text-sm md:text-base font-bold">No results matching your query</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}
            </div>

            {/* Mount a fresh editor for each page/language, so previous draft state cannot leak. */}
            {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
            {editItem && <EditModal key={`${languageCode}:${editItem.pageName}`} item={editItem} onClose={() => setEditItem(null)} onSave={fetchAllData} />}
        </div>
    );
};

export default function SeoSettings() {
    const [languageCode, setLanguageCode] = useState('en');
    return <SeoWorkspace key={languageCode} languageCode={languageCode} onLanguageChange={setLanguageCode} />;
}
