'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    FiTrash2,
    FiEdit2,
    FiLoader,
    FiCheck,
    FiX,
    FiZap, // Tradition এর জন্য আইকন চেঞ্জ করে Zap দিলাম
    FiChevronLeft,
    FiChevronRight,
    FiGrid,
    FiChevronDown,
    FiPlus,
} from 'react-icons/fi';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

export default function AdminTraditions() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [traditions, setTraditions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTraditions, setLoadingTraditions] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [formData, setFormData] = useState({ title: '' });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/api/admin/categories');
                setCategories(res.data);
                if (res.data.length > 0) setSelectedCategory(res.data[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Dropdown Outside Click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Traditions when category changes
    useEffect(() => {
        if (!selectedCategory) return;
        const fetchTraditions = async () => {
            setLoadingTraditions(true);
            setTraditions([]);
            setCurrentPage(1);
            try {
                const res = await api.get(`/api/admin/traditions/by-category/${selectedCategory._id}`);
                setTraditions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingTraditions(false);
            }
        };
        fetchTraditions();
    }, [selectedCategory]);

    const totalPages = Math.ceil(traditions.length / itemsPerPage);
    const currentItems = traditions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddTradition = async (e) => {
        e.preventDefault();
        if (!formData.title) return alert('Title required');
        setSubmitting(true);
        try {
            const res = await api.post('/api/admin/traditions', {
                title: formData.title,
                categoryId: selectedCategory._id,
            });
            setTraditions((prev) => [res.data, ...prev]);
            setFormData({ title: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding tradition');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id) => {
        if (!editData.title) return alert('Title required');
        setUpdatingId(id);
        try {
            const res = await api.put(`/api/admin/traditions/${id}`, { title: editData.title });
            setTraditions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
            setEditingId(null);
        } catch (err) {
            alert('Update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this tradition?')) return;
        try {
            await api.delete(`/api/admin/traditions/${id}`);
            setTraditions((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loadingCategories) return (
        <div className="flex justify-center p-20">
            <FiLoader className="animate-spin text-orange-500" size={30} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 font-sans">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter dark:text-white mb-1">
                        Cultural <span className="text-orange-500">Traditions</span>
                    </h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Manage heritage and traditional styles for listings
                    </p>
                </div>

                {/* Custom Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full md:w-64 flex items-center justify-between bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-5 py-3 rounded-md hover:border-orange-500 transition-all shadow-sm group"
                    >
                        <div className="flex items-center gap-3">
                            <FiGrid className="text-orange-500" size={16} />
                            <div className="text-left">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Category</p>
                                <p className="text-[11px] font-black text-gray-700 dark:text-white uppercase tracking-widest truncate">
                                    {selectedCategory?.title}
                                </p>
                            </div>
                        </div>
                        <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-full md:w-72 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 max-h-80 overflow-y-auto scrollbar-hide">
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all mb-1 last:mb-0 ${selectedCategory?._id === cat._id
                                            ? 'bg-orange-500 text-white'
                                            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest">{cat.title}</span>
                                        {selectedCategory?._id === cat._id && <FiCheck size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* --- Create Form --- */}
                <div className="bg-white dark:bg-[#0c0c0c] p-2 rounded-lg border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
                    <form onSubmit={handleAddTradition} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <FiZap className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={`Type tradition name for ${selectedCategory?.title}...`}
                                className="w-full bg-transparent border-none rounded-md pl-14 pr-5 py-5 text-[12px] outline-none dark:text-white font-bold uppercase tracking-widest placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-8 font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 m-1 h-14 cursor-pointer"
                        >
                            {submitting ? <FiLoader className="animate-spin" size={16} /> : <><FiPlus size={18} /> Add Tradition</>}
                        </button>
                    </form>
                </div>

                {/* --- List Table --- */}
                <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-lg">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <th className="px-8 py-5">Tradition Name</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {loadingTraditions ? (
                                <tr>
                                    <td colSpan={2} className="py-24 text-center">
                                        <FiLoader className="animate-spin text-orange-500 mx-auto" size={30} />
                                        <p className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Loading traditions...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-24 text-center">
                                        <div className="bg-gray-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiZap className="text-gray-300 dark:text-gray-700" size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">No traditions found in this category</p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((tradition) => (
                                    <tr key={tradition._id} className="group hover:bg-gray-50/50 dark:hover:bg-orange-500/5 transition-colors">
                                        <td className="px-8 py-6">
                                            {editingId === tradition._id ? (
                                                <input
                                                    className="bg-white dark:bg-white/10 border-2 border-orange-500 rounded-md px-5 py-2.5 outline-none w-full max-w-sm text-white font-bold uppercase tracking-widest text-[12px]"
                                                    value={editData.title}
                                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                                    <span className="font-black uppercase text-[12px] tracking-tight dark:text-white italic">{tradition.title}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                {editingId === tradition._id ? (
                                                    <>
                                                        <button onClick={() => handleUpdate(tradition._id)} className="w-10 h-10 flex items-center justify-center text-green-500 bg-green-500/10 rounded-md hover:bg-green-500 hover:text-white transition-all">
                                                            {updatingId === tradition._id ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-500/10 rounded-md hover:bg-red-500 hover:text-white transition-all">
                                                            <FiX size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setEditingId(tradition._id); setEditData({ title: tradition.title }); }} className="w-10 h-10 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-white/5 rounded-md hover:text-blue-500 hover:bg-blue-500/10 transition-all">
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(tradition._id)} className="w-10 h-10 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-white/5 rounded-md hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/30 dark:bg-transparent">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing {currentItems.length} of {traditions.length}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 shadow-sm">
                                    <FiChevronLeft size={18} />
                                </button>
                                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 shadow-sm">
                                    <FiChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}