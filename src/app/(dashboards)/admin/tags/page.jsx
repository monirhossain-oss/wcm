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
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // States
  const [formData, setFormData] = useState({ title: '', image: null });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', image: null, preview: null });

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get('/api/listings/meta-data');
      setTags(res.data.tags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(tags.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tags.slice(indexOfFirstItem, indexOfLastItem);

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditData({ ...editData, image: file, preview: reader.result });
        else {
          setFormData({ ...formData, image: file });
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return alert('Please provide title and image');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('image', formData.image);

    setSubmitting(true);
    try {
      const res = await api.post('/api/admin/tags', data);
      setTags([res.data, ...tags]);
      setFormData({ title: '', image: null });
      setPreview(null);
      setCurrentPage(1); // নতুন ট্যাগ যোগ করলে প্রথম পেজে নিয়ে যাবে
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
      setTags(tags.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditData({ title: '', image: null, preview: null });
    } catch (err) {
      alert('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this tag?')) return;
    try {
      await api.delete(`/api/admin/tags/${id}`);
      setTags(tags.filter((t) => t._id !== id));
      // যদি ডিলিট করার পর কারেন্ট পেজ খালি হয়ে যায়, তবে আগের পেজে যাবে
      if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <FiLoader className="animate-spin text-orange-500" size={30} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      {/* Create Form */}
      <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
        <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white mb-6">
          System <span className="text-orange-500">Tags</span>
        </h1>

        <form onSubmit={handleAddTag} className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <label className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 cursor-pointer hover:border-orange-500 transition-all overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <FiImage className="text-gray-400 group-hover:text-orange-500" size={20} />
              )}
              <input type="file" hidden onChange={(e) => handleImageChange(e)} />
            </label>
            {!preview && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-black px-2 py-0.5 rounded text-[7px] font-black uppercase border dark:border-white/10 whitespace-nowrap tracking-tighter">
                Upload Icon
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter Tag Identity..."
              className="flex-1 bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-3 text-[11px] outline-none focus:ring-1 focus:ring-orange-500 dark:text-white font-bold uppercase tracking-widest"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-8 font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 h-12 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? <FiLoader className="animate-spin" size={14} /> : 'Create Tag'}
            </button>
          </div>
        </form>
      </div>

      {/* Tags List */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-6 py-5 w-24 text-center">Visual</th>
              <th className="px-6 py-5">Tag Identity</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {currentItems.map((tag) => (
              <tr
                key={tag._id}
                className="group hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors"
              >
                <td className="px-6 py-3">
                  <div className="relative w-10 h-10 mx-auto rounded-md overflow-hidden border dark:border-white/10 bg-gray-100 dark:bg-white/5">
                    {editingId === tag._id && editData.preview ? (
                      <img src={editData.preview} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <img
                        src={getImageUrl(tag.image)}
                        className="w-full h-full object-cover"
                        alt={tag.title}
                      />
                    )}
                    {editingId === tag._id && (
                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-100 transition-opacity">
                        <FiUploadCloud className="text-white" size={14} />
                        <input type="file" hidden onChange={(e) => handleImageChange(e, true)} />
                      </label>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-black uppercase text-[10px] tracking-widest dark:text-white">
                  {editingId === tag._id ? (
                    <input
                      className="bg-white/10 border border-orange-500/50 rounded-md px-3 py-2 outline-none w-full text-[10px]"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 italic">
                      <FiTag className="text-orange-500" size={12} /> {tag.title}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === tag._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(tag._id)}
                          disabled={updatingId === tag._id}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-md transition-all"
                        >
                          {updatingId === tag._id ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <FiCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={updatingId === tag._id}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-all"
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
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tag._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/20">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, tags.length)} of{' '}
              {tags.length} Tags
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
              >
                <FiChevronLeft className="dark:text-white" />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-md text-[10px] font-black transition-all border ${
                      currentPage === i + 1
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
              >
                <FiChevronRight className="dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
