'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FiTrash2,
  FiEdit2,
  FiLoader,
  FiCheck,
  FiX,
  FiTag,
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

export default function AdminTags() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({ title: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ক্যাটাগরি লোড করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/admin/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ক্লিক আউটসাইড টু ক্লোজ ড্রপডাউন
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ক্যাটাগরি চেঞ্জ হলে ট্যাগ লোড করা
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchTags = async () => {
      setLoadingTags(true);
      setTags([]);
      setCurrentPage(1);
      try {
        const res = await api.get(`/api/admin/tags/by-category/${selectedCategory._id}`);
        setTags(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, [selectedCategory]);

  const totalPages = Math.ceil(tags.length / itemsPerPage);
  const currentItems = tags.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Title required');
    setSubmitting(true);
    try {
      const res = await api.post('/api/admin/tags', {
        title: formData.title,
        categoryId: selectedCategory._id,
      });
      setTags((prev) => [res.data, ...prev]);
      setFormData({ title: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editData.title) return alert('Title required');
    setUpdatingId(id);
    try {
      const res = await api.put(`/api/admin/tags/${id}`, { title: editData.title });
      setTags((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch (err) {
      alert('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tag?')) return;
    try {
      await api.delete(`/api/admin/tags/${id}`);
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loadingCategories)
    return (
      <div className="flex justify-center p-20">
        <FiLoader className="animate-spin text-orange-500" size={30} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-20 font-sans">
      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter dark:text-white mb-1">
            System <span className="text-orange-500">Tags</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Manage labels for your marketplace items
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
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">
                  Category
                </p>
                <p className="text-[11px] font-black text-gray-700 dark:text-white uppercase tracking-widest truncate">
                  {selectedCategory?.title}
                </p>
              </div>
            </div>
            <FiChevronDown
              className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              size={18}
            />
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
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all mb-1 last:mb-0 ${
                      selectedCategory?._id === cat._id
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {cat.title}
                    </span>
                    {selectedCategory?._id === cat._id && <FiCheck size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Create Form ── */}
        <div className="bg-white dark:bg-[#0c0c0c] p-2 rounded-lg border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
          <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiTag
                className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500"
                size={18}
              />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`Type tag name for ${selectedCategory?.title}...`}
                className="w-full bg-transparent border-none rounded-md pl-14 pr-5 py-5 text-[12px] outline-none dark:text-white font-bold uppercase tracking-widest placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-8 font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 m-1 h-14 cursor-pointer"
            >
              {submitting ? (
                <FiLoader className="animate-spin" size={16} />
              ) : (
                <>
                  <FiPlus size={18} /> Add Tag
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── List Table ── */}
        <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <th className="px-8 py-5">Label</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loadingTags ? (
                <tr>
                  <td colSpan={2} className="py-24 text-center">
                    <FiLoader className="animate-spin text-orange-500 mx-auto" size={30} />
                    <p className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Loading tags...
                    </p>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-24 text-center">
                    <div className="bg-gray-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiTag className="text-gray-300 dark:text-gray-700" size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                      No tags found in this category
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((tag) => (
                  <tr
                    key={tag._id}
                    className="group hover:bg-gray-50/50 dark:hover:bg-orange-500/5 transition-colors"
                  >
                    <td className="px-8 py-6">
                      {editingId === tag._id ? (
                        <input
                          className="bg-white dark:bg-white/10 border-2 border-orange-500 rounded-md px-5 py-2.5 outline-none w-full max-w-sm text-white font-bold uppercase tracking-widest text-[12px]"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                          <span className="font-black uppercase text-[12px] tracking-tight dark:text-white italic">
                            {tag.title}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {editingId === tag._id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(tag._id)}
                              disabled={updatingId === tag._id}
                              className="w-10 h-10 flex items-center justify-center text-green-500 bg-green-500/10 rounded-md hover:bg-green-500 hover:text-white transition-all"
                            >
                              {updatingId === tag._id ? (
                                <FiLoader className="animate-spin" />
                              ) : (
                                <FiCheck size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-500/10 rounded-md hover:bg-red-500 hover:text-white transition-all"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(tag._id);
                                setEditData({ title: tag.title });
                              }}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-white/5 rounded-md hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tag._id)}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-white/5 rounded-md hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
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
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Showing {currentItems.length} of {tags.length}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
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
