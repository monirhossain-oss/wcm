'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiGrid, FiLoader, FiCheck, FiX, FiMenu } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    try {
      await api.put('/api/admin/categories/reorder', { categories: items });
    } catch (err) {
      console.error('Real API Error:', err.response?.data || err.message);
    }
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/api/admin/categories', { title: newCategory });
      setCategories([...categories, res.data]);
      setNewCategory('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
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
            <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-orange-500">
              Structure <span className="dark:text-white text-black">Terminal</span>
            </h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Drag to reorder system categories
            </p>
          </div>

          <form onSubmit={handleAddCategory} className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category Name..."
              className="bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white w-full"
            />
            <button
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <FiPlus size={16} /> Add
            </button>
          </form>
        </div>
      </div>

      {/* Drag and Drop List */}
      <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="category-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y divide-gray-50 dark:divide-white/5"
              >
                {/* Header Row */}
                <div className="grid grid-cols-12 bg-gray-50 dark:bg-white/5 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <div className="col-span-1">Move</div>
                  <div className="col-span-8">Category Name</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                {categories.map((cat, index) => (
                  <Draggable key={cat._id} draggableId={cat._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-12 items-center px-6 py-4 transition-all ${
                          snapshot.isDragging
                            ? 'bg-orange-500/20 backdrop-blur-md shadow-2xl ring-1 ring-orange-500/50'
                            : 'hover:bg-gray-50/50 dark:hover:bg-white/10'
                        }`}
                      >
                        {/* Drag Handle */}
                        <div className="col-span-1" {...provided.dragHandleProps}>
                          <FiMenu
                            className="text-gray-500 cursor-grab active:cursor-grabbing hover:text-orange-500 transition-colors"
                            size={18}
                          />
                        </div>

                        {/* Title Section */}
                        <div className="col-span-8">
                          {editingId === cat._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                className="bg-gray-100 dark:bg-white/20 border border-orange-500/50 rounded-lg px-3 py-1 text-sm dark:text-white outline-none w-full max-w-xs"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <FiGrid className="text-orange-500" size={14} />
                              <span className="text-xs font-bold uppercase tracking-wider dark:text-white">
                                {cat.title}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-3 text-right flex justify-end gap-1">
                          {editingId === cat._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(cat._id)}
                                className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                              >
                                <FiCheck size={18} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <FiX size={18} />
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {categories.length === 0 && !loading && (
          <div className="p-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-50">
            No Data structures found
          </div>
        )}
      </div>
    </div>
  );
}
