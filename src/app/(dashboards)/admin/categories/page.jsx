'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiGrid, FiLoader, FiCheck, FiX } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/listings/meta-data');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/api/admin/categories', { title: newCategory });
      setCategories([res.data, ...categories]);
      setNewCategory('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/api/admin/categories/${id}`, { title: editValue });
      setCategories(categories.map((c) => (c._id === id ? res.data : c)));
      setEditingId(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <FiLoader className="animate-spin text-orange-500" size={30} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header Form */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">
              System <span className="text-orange-500">Categories</span>
            </h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Structure terminal
            </p>
          </div>

          <form onSubmit={handleAddCategory} className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add New..."
              className="bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white w-full"
            />
            <button
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 flex items-center gap-2 text-xs font-bold uppercase"
            >
              <FiPlus size={16} /> Add
            </button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">Structure Name</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="group hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors"
              >
                <td className="px-6 py-4">
                  {editingId === cat._id ? (
                    <input
                      className="bg-gray-100 dark:bg-white/10 border-none rounded px-2 py-1 text-sm dark:text-white outline-none focus:ring-1 focus:ring-orange-500"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <FiGrid className="text-orange-500" size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider dark:text-white">
                        {cat.title}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(cat._id)}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <FiX size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditValue(cat.title);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
        {categories.length === 0 && !loading && (
          <div className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}
