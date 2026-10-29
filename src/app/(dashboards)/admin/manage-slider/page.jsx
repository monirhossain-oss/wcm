'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { getImageUrl } from '@/lib/imageHelper';
import {
    Trash2, Plus, ImageIcon, Loader2, UploadCloud,
    Type, Link2, AlignLeft, Pencil, X, Check, Eye,
    GripVertical, AlertTriangle,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────
// Cloudinary helper
// ─────────────────────────────────────────────────────────
async function uploadToCloudinary(imageFile) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Image upload failed');
    }
    return res.json();
}

// ─────────────────────────────────────────────────────────
// Shared field wrapper (dark glass style)
// ─────────────────────────────────────────────────────────
function FieldWrapper({ icon, label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                {icon} {label}
            </label>
            <div className="relative flex items-start gap-1 bg-white/4 border border-white/8 rounded-xl px-4 focus-within:border-orange-500/50 focus-within:bg-orange-500/4 transition-all duration-200">
                {children}
            </div>
        </div>
    );
}

function CharCount({ value, max }) {
    const len = value?.length ?? 0;
    const pct = len / max;
    return (
        <span className={`absolute right-3 top-3 text-[9px] font-bold tabular-nums transition-colors pointer-events-none ${pct > 0.9 ? 'text-red-400' : pct > 0.7 ? 'text-orange-400' : 'text-white/20'}`}>
            {len}/{max}
        </span>
    );
}

// ─────────────────────────────────────────────────────────
// Image upload zone (reused in Add + Edit)
// ─────────────────────────────────────────────────────────
function ImageUploadZone({ preview, onFileChange, onRemove }) {
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef(null);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileChange({ target: { files: [file] } });
    }, [onFileChange]);

    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <UploadCloud size={11} /> Slider Image
            </label>

            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={onRemove}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors shadow-lg">
                            <X size={12} /> Remove
                        </button>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white/60 uppercase tracking-widest rounded-md border border-white/10">
                        Preview
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`relative flex flex-col items-center justify-center gap-3 aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 select-none 
    ${dragging
                            ? 'border-orange-500 bg-orange-500/5 scale-[1.01]'
                            : 'border-black/10 bg-gray-50 hover:border-black/20 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10'
                        }`}
                >
                    {/* Icon Container */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
        ${dragging ? 'bg-orange-500/20' : 'bg-black/5 dark:bg-white/5'}`}>
                        <UploadCloud
                            size={20}
                            className={dragging ? 'text-orange-500' : 'text-black/30 dark:text-white/30'}
                        />
                    </div>

                    {/* Text Section */}
                    <div className="text-center px-4">
                        <p className="text-[11px] font-bold text-black/60 dark:text-white/50">
                            {dragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
                        </p>
                        <p className="text-[9px] text-black/40 dark:text-white/20 mt-1 uppercase tracking-widest font-medium">
                            PNG, JPG, WEBP · Max 5MB
                        </p>
                    </div>
                </div>
            )}
            <input ref={fileRef} type="file" onChange={onFileChange} accept="image/*" className="hidden" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Add Slide Panel
// ─────────────────────────────────────────────────────────
function AddSlidePanel({ onSuccess }) {
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setFile(f);
        if (f) setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select an image');
        setLoading(true);
        try {
            const imageData = await uploadToCloudinary(file);
            await axios.post(`${API_BASE}/api/sliders/add`, {
                title, subTitle, link,
                imageUrl: imageData.secure_url,
                public_id: imageData.public_id,
            }, { withCredentials: true });
            setTitle(''); setSubTitle(''); setLink('');
            setFile(null); setPreview(null);
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-[#0f0f0f] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70" />

            <div className="px-6 pt-6 pb-4 border-b border-white/6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Plus size={14} className="text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-black dark:text-white">Add New Slide</h2>
                        <p className="text-[10px] text-white/30 font-medium mt-0.5">Fill in all fields before publishing</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                <ImageUploadZone preview={preview} onFileChange={handleFileChange} onRemove={() => { setFile(null); setPreview(null); }} />

                <FieldWrapper
                    icon={<Type size={11} />}
                    label="Main Title"
                // যদি FieldWrapper এ ক্লাসের অপশন থাকে, তবে সেখানে border-black/10 dark:border-white/10 দিতে পারেন
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="e.g. Discover Unique Handcrafted Items"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={80}
                            className="w-full bg-transparent text-sm outline-none py-3 pr-10 transition-colors
                /* Light Mode Colors */
                text-black/80 placeholder:text-black/20 focus:placeholder:text-black/10
                /* Dark Mode Colors */
                dark:text-white dark:placeholder:text-white/20 dark:focus:placeholder:text-white/10"
                        />
                        <CharCount value={title} max={80} />
                    </div>
                </FieldWrapper>

                <FieldWrapper icon={<AlignLeft size={11} />} label="Subtitle / Description">
                    <textarea
                        placeholder="A short compelling description…"
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        maxLength={160}
                        rows={2}
                        className="w-full bg-transparent text-sm outline-none py-3 pr-10 resize-none transition-colors
            /* Light Mode */
            text-black/80 placeholder:text-black/20 focus:placeholder:text-black/10
            /* Dark Mode */
            dark:text-white dark:placeholder:text-white/20 dark:focus:placeholder:text-white/10"
                    />
                    <div className="absolute bottom-3 right-3">
                        <CharCount value={subTitle} max={160} />
                    </div>
                </FieldWrapper>

                <FieldWrapper icon={<Link2 size={11} />} label="Button Link">
                    {/* Slash (/) prefix color update */}
                    <span className="text-black/20 dark:text-white/20 text-sm py-3 select-none pr-1">/</span>

                    <input
                        type="text"
                        placeholder="discover"
                        value={link.replace(/^\//, '')}
                        onChange={(e) => setLink('/' + e.target.value.replace(/^\//, ''))}
                        className="flex-1 bg-transparent text-sm outline-none py-3 transition-colors
            /* Light Mode */
            text-black/80 placeholder:text-black/20 focus:placeholder:text-black/10
            /* Dark Mode */
            dark:text-white dark:placeholder:text-white/20 dark:focus:placeholder:text-white/10"
                    />
                </FieldWrapper>

                <button type="submit" disabled={loading}
                    className="relative w-full group overflow-hidden bg-orange-500 hover:bg-orange-600 disabled:bg-white/8 disabled:cursor-not-allowed text-white disabled:text-white/30 text-[11px] font-black uppercase tracking-[0.15em] py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.99]">
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Plus size={15} /> Publish Slide</>}
                </button>
                <p className="text-center text-[9px] text-white/20 uppercase tracking-widest">Slides go live immediately after upload</p>
            </form>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Edit Modal
// ─────────────────────────────────────────────────────────
function EditModal({ slide, onClose, onSuccess }) {
    const [title, setTitle] = useState(slide.title || '');
    const [subTitle, setSubTitle] = useState(slide.subTitle || '');
    const [link, setLink] = useState(slide.link || '');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(getImageUrl(slide.imageUrl) || null);
    const [loading, setLoading] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setImageChanged(true);
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreview(null);
        setImageChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = slide.imageUrl;
            let public_id = slide.public_id;

            if (imageChanged && file) {
                const imageData = await uploadToCloudinary(file);
                imageUrl = imageData.secure_url;
                public_id = imageData.public_id;
            }

            await axios.put(`${API_BASE}/api/sliders/${slide._id}`, {
                title, subTitle, link, imageUrl, public_id,
            }, { withCredentials: true });

            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    // close on backdrop click
    const backdropRef = useRef(null);
    const handleBackdrop = (e) => { if (e.target === backdropRef.current) onClose(); };

    // close on Escape
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    return (
        <div ref={backdropRef} onClick={handleBackdrop}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                {/* top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70" />

                {/* header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Pencil size={13} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-white">Edit Slide</h2>
                            <p className="text-[10px] text-white/30 mt-0.5">Changes are saved immediately</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* scrollable body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto scrollbar-hide flex-1">
                    <ImageUploadZone preview={preview} onFileChange={handleFileChange} onRemove={handleRemoveImage} />

                    <FieldWrapper icon={<Type size={11} />} label="Main Title">
                        <input type="text" placeholder="Main title…" value={title}
                            onChange={(e) => setTitle(e.target.value)} maxLength={80}
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none py-3 pr-10 transition-colors" />
                        <CharCount value={title} max={80} />
                    </FieldWrapper>

                    <FieldWrapper icon={<AlignLeft size={11} />} label="Subtitle / Description">
                        <textarea placeholder="Short description…" value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)} maxLength={160} rows={2}
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none py-3 pr-10 resize-none transition-colors" />
                        <div className="absolute bottom-3 right-3"><CharCount value={subTitle} max={160} /></div>
                    </FieldWrapper>

                    <FieldWrapper icon={<Link2 size={11} />} label="Button Link">
                        <span className="text-white/20 text-sm py-3 select-none pr-1">/</span>
                        <input type="text" placeholder="discover"
                            value={link.replace(/^\//, '')}
                            onChange={(e) => setLink('/' + e.target.value.replace(/^\//, ''))}
                            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none py-3 transition-colors" />
                    </FieldWrapper>

                    {/* actions */}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[11px] font-black uppercase tracking-widest transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 relative group overflow-hidden bg-orange-500 hover:bg-orange-600 disabled:bg-white/8 disabled:cursor-not-allowed text-white disabled:text-white/30 text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.99]">
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                            {loading ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Delete confirm modal
// ─────────────────────────────────────────────────────────
function DeleteModal({ slide, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-white">Delete Slide?</h3>
                        <p className="text-[11px] text-white/30 mt-1.5 leading-relaxed">
                            <span className="text-white/60 font-semibold">"{slide.title || 'This slide'}"</span> will be permanently removed. This cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full">
                        <button onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[11px] font-black uppercase tracking-widest transition-all">
                            Cancel
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Slide card
// ─────────────────────────────────────────────────────────
function SlideCard({ slide, onEdit, onDelete }) {
    return (
        <div className="group relative bg-[#0f0f0f] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-xl hover:shadow-black/40">
            {/* image */}
            <div className="relative aspect-video overflow-hidden">
                <img src={getImageUrl(slide.imageUrl)} alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {/* overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                    <a href={slide.link || '#'} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                        <Eye size={11} /> Preview
                    </a>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(slide)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors shadow-lg">
                            <Pencil size={10} /> Edit
                        </button>
                        <button onClick={() => onDelete(slide)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors shadow-lg">
                            <Trash2 size={10} /> Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* info */}
            <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-[12px] font-black text-black dark:text-white truncate">{slide.title || 'Untitled'}</h3>
                    <p className="text-[10px] text-black dark:text-white truncate mt-0.5">{slide.subTitle || '—'}</p>
                </div>
                {slide.link && (
                    <span className="flex-shrink-0 text-[9px] font-bold text-orange-500/70 bg-orange-500/8 border border-orange-500/15 px-2 py-1 rounded-md truncate max-w-[80px]">
                        {slide.link}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
const ManageSlider = () => {
    const [sliders, setSliders] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [editingSlide, setEditingSlide] = useState(null);
    const [deletingSlide, setDeletingSlide] = useState(null);

    const fetchSliders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/sliders`);
            setSliders(res.data);
        } catch (err) {
            console.error('Error fetching sliders:', err);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchSliders(); }, []);

    const handleConfirmDelete = async () => {
        if (!deletingSlide) return;
        try {
            await axios.delete(`${API_BASE}/api/sliders/${deletingSlide._id}`, { withCredentials: true });
            setDeletingSlide(null);
            fetchSliders();
        } catch {
            alert('Failed to delete slider');
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] p-6 md:p-8">
            {/* Page header */}
            <div className="mb-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <ImageIcon size={18} className="text-orange-500" />
                </div>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-[0.15em] text-black dark:text-white">Hero Sliders</h1>
                    <p className="text-[11px] text-white/30 mt-0.5">
                        {sliders.length} slide{sliders.length !== 1 ? 's' : ''} · Manage your homepage hero carousel
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* ── Left: Add form ── */}
                <div className="lg:col-span-1">
                    <AddSlidePanel onSuccess={fetchSliders} />
                </div>

                {/* ── Right: Slides list ── */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                            Current Slides
                        </p>
                        <div className="h-px flex-1 mx-4 bg-white/5" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            {sliders.length} total
                        </span>
                    </div>

                    {fetchLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border border-orange-500/20" />
                                <Loader2 className="animate-spin text-orange-500 absolute inset-0 m-auto" size={20} />
                            </div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loading slides…</p>
                        </div>
                    ) : sliders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-white/6 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-white/4 flex items-center justify-center">
                                <ImageIcon size={20} className="text-white/20" />
                            </div>
                            <div className="text-center">
                                <p className="text-[12px] font-bold text-white/30">No slides yet</p>
                                <p className="text-[10px] text-white/15 mt-1">Add your first slide using the form on the left</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sliders.map((slide) => (
                                <SlideCard
                                    key={slide._id}
                                    slide={slide}
                                    onEdit={setEditingSlide}
                                    onDelete={setDeletingSlide}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit modal */}
            {editingSlide && (
                <EditModal
                    slide={editingSlide}
                    onClose={() => setEditingSlide(null)}
                    onSuccess={fetchSliders}
                />
            )}

            {/* Delete confirm modal */}
            {deletingSlide && (
                <DeleteModal
                    slide={deletingSlide}
                    onClose={() => setDeletingSlide(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default ManageSlider;