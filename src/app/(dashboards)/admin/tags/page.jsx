'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiTrash2,
  FiEdit2,
  FiLoader,
  FiUploadCloud,
  FiCheck,
  FiX,
  FiTag,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiLayers,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminTags() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tags, setTags] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({ title: '', image: null });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', image: null, preview: null });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert('File too large! Max 5MB.');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditData((prev) => ({ ...prev, image: file, preview: reader.result }));
        else {
          setFormData((prev) => ({ ...prev, image: file }));
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return alert('Title and Image required');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('image', formData.image);
    data.append('categoryId', selectedCategory._id);

    setSubmitting(true);
    try {
      const res = await api.post('/api/admin/tags', data);
      setTags((prev) => [res.data, ...prev]);
      setFormData({ title: '', image: null });
      setPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    const data = new FormData();
    data.append('title', editData.title);
    if (editData.image) data.append('image', editData.image);

    setUpdatingId(id);
    try {
      const res = await api.put(`/api/admin/tags/${id}`, data);
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
    <div className="max-w-7xl mx-auto pb-20 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">
          System <span className="text-orange-500">Tags</span>
        </h1>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-md max-md:hidden">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            Active Category:
          </span>
          <span className="text-[10px] font-black text-orange-500 uppercase ml-2 tracking-widest">
            {selectedCategory?.title}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar: Category Selection ── */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden sticky top-6">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FiLayers size={12} /> Select Category
              </p>
            </div>
            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedCategory?._id === cat._id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <FiGrid size={14} />
                  <span className="text-[11px] font-black uppercase tracking-widest truncate">
                    {cat.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main: Tag Management ── */}
        <div className="flex-1 space-y-6">
          {/* Create Form */}
          <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
            <form onSubmit={handleAddTag} className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <label className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/20 cursor-pointer hover:border-orange-500 transition-all overflow-hidden">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <FiImage className="text-gray-400 group-hover:text-orange-500" size={20} />
                  )}
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={`NEW TAG FOR ${selectedCategory?.title}...`}
                  className="flex-1 bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-5 py-4 text-[11px] outline-none focus:ring-1 focus:ring-orange-500 dark:text-white font-bold uppercase tracking-widest"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-10 font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 h-14 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <FiLoader className="animate-spin" size={14} /> : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>

          {/* List Table */}
          <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-5 w-24 text-center">Icon</th>
                  <th className="px-6 py-5">Identity</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {loadingTags ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center">
                      <FiLoader className="animate-spin text-orange-500 mx-auto" size={24} />
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 opacity-50"
                    >
                      Empty category
                    </td>
                  </tr>
                ) : (
                  currentItems.map((tag) => (
                    <tr
                      key={tag._id}
                      className="group hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-12 mx-auto rounded-lg overflow-hidden border dark:border-white/10 bg-gray-100 dark:bg-white/5">
                          <img
                            src={
                              editingId === tag._id && editData.preview
                                ? editData.preview
                                : getImageUrl(tag.image)
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          {editingId === tag._id && (
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                              <FiUploadCloud className="text-white" size={16} />
                              <input
                                type="file"
                                hidden
                                onChange={(e) => handleImageChange(e, true)}
                              />
                            </label>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black uppercase text-[11px] tracking-widest dark:text-white italic">
                        {editingId === tag._id ? (
                          <input
                            className="bg-white/10 border border-orange-500 rounded-md px-4 py-2 outline-none w-full"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FiTag className="text-orange-500" size={14} />
                            {tag.title}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === tag._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(tag._id)}
                                className="p-2.5 text-green-500 bg-green-500/10 rounded-lg"
                              >
                                <FiCheck size={18} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2.5 text-red-500 bg-red-500/10 rounded-lg"
                              >
                                <FiX size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(tag._id);
                                  setEditData({ title: tag.title, image: null, preview: null });
                                }}
                                className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(tag._id)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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

            {/* Pagination UI (Simplified for Theme) */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-500 uppercase">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 bg-white/5 border border-white/10 rounded-md hover:bg-orange-500 transition-all"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 bg-white/5 border border-white/10 rounded-md hover:bg-orange-500 transition-all"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
