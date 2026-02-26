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
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // For Create
  const [updatingId, setUpdatingId] = useState(null); // For Update

  // States
  const [formData, setFormData] = useState({ title: '', image: null });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', image: null, preview: null });

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
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Create Form */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
        <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white mb-6">
          System <span className="text-orange-500">Tags</span>
        </h1>

        <form onSubmit={handleAddTag} className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <label className="w-18 h-18 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 cursor-pointer hover:border-orange-500 transition-all overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <FiImage className="text-gray-400 group-hover:text-orange-500" size={24} />
              )}
              <input type="file" hidden onChange={(e) => handleImageChange(e)} />
            </label>
            {!preview && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-black px-2 py-0.5 rounded text-[8px] font-bold uppercase border dark:border-white/10 whitespace-nowrap">
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
              className="flex-1 bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 dark:text-white font-bold"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 h-12 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? <FiLoader className="animate-spin" size={14} /> : 'Create Tag'}
            </button>
          </div>
        </form>
      </div>

      {/* Tags List */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4 w-24">Visual</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {tags.map((tag) => (
              <tr
                key={tag._id}
                className="group hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors"
              >
                <td className="px-6 py-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border dark:border-white/10">
                    {editingId === tag._id && editData.preview ? (
                      <img src={editData.preview} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={getImageUrl(tag.image)}
                        className="w-full h-full object-cover"
                        alt={tag.title}
                      />
                    )}
                    {editingId === tag._id && (
                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiUploadCloud className="text-white" size={14} />
                        <input type="file" hidden onChange={(e) => handleImageChange(e, true)} />
                      </label>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold uppercase text-xs tracking-wider dark:text-white">
                  {editingId === tag._id ? (
                    <input
                      className="bg-white/10 border border-orange-500/50 rounded px-2 py-1 outline-none w-full"
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
                        {updatingId === tag._id ? (
                          <div className="p-2">
                            <FiLoader className="animate-spin text-orange-500" size={18} />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUpdate(tag._id)}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"
                          >
                            <FiCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={updatingId === tag._id}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-30"
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
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tag._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
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
      </div>
    </div>
  );
}
