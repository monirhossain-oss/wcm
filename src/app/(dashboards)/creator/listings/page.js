'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiX,
  FiUploadCloud,
  FiImage,
  FiRefreshCw,
  FiEye,
  FiHeart,
  FiExternalLink,
  FiSearch,
  FiChevronDown,
  FiCheck,
  FiGrid,
  FiTag,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [metaData, setMetaData] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Edit Form States
  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Dropdown States
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showTagDrop, setShowTagDrop] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    fetchListings();
    fetchMeta();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/listings/my-listings');
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const res = await api.get('/api/listings/meta-data');
      setMetaData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      externalUrl: item.externalUrl,
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      category: item.category?._id || item.category,
      culturalTags: item.culturalTags?.map((t) => t._id || t) || [],
    });
    setEditImage(null);
  };

  const handleTagToggle = (tagId) => {
    setEditFormData((prev) => {
      const isSelected = prev.culturalTags.includes(tagId);
      if (isSelected)
        return { ...prev, culturalTags: prev.culturalTags.filter((id) => id !== tagId) };
      if (prev.culturalTags.length >= 5) return prev;
      return { ...prev, culturalTags: [...prev.culturalTags, tagId] };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (key === 'culturalTags') {
          // ব্যাকেন্ড স্ট্রিং এক্সপেক্ট করলে: data.append(key, editFormData[key].join(','));
          // অথবা মাল্টিপল অ্যাপেন্ড:
          editFormData[key].forEach((t) => data.append('culturalTags', t));
        } else {
          data.append(key, editFormData[key]);
        }
      });
      if (editImage) data.append('image', editImage);

      const res = await api.put(`/api/listings/update/${editingItem._id}`, data);
      setListings(listings.map((l) => (l._id === editingItem._id ? res.data.updatedListing : l)));
      setEditingItem(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/api/listings/delete/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FiRefreshCw className="animate-spin text-orange-500" />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Listing <span className="text-orange-500">Management</span>
          </h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
            Nodes In Archive: {listings.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Preview
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Title & Category
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Tradition
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Engagement
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Status
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {listings.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black uppercase text-[#1f1f1f] dark:text-white mb-1">
                      {item.title}
                    </p>
                    <span className="text-[8px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded font-black uppercase">
                      {item.category?.title || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold uppercase text-[10px] italic dark:text-gray-400">
                    {item.tradition}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-black">
                      <FiHeart size={10} /> {item.favorites?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[9px] font-black uppercase ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-600'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingItem(item)}
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <FiEye size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal - Simplified & Rounded */}
      {viewingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingItem(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden animate-in zoom-in-95 shadow-2xl">
            <div className="relative h-64">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${viewingItem.image}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setViewingItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                <FiX />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black uppercase italic dark:text-white tracking-tighter">
                  {viewingItem.title}
                </h3>
                <span className="text-xs font-black text-orange-500 uppercase">
                  @{viewingItem.country}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                {viewingItem.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Tradition</p>
                  <p className="text-xs font-bold dark:text-white uppercase">
                    {viewingItem.tradition}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Region</p>
                  <p className="text-xs font-bold dark:text-white uppercase">
                    {viewingItem.region}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Matches AddListing Style */}
      {editingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingItem(null)}
          />
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f0f0f] rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
              <h3 className="text-lg font-black uppercase italic dark:text-white">
                Edit <span className="text-orange-500">Protocol</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-red-500 hover:text-white rounded-xl transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto scrollbar-hide"
            >
              {/* Left: Image */}
              <div className="lg:col-span-4">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">
                  Media Asset
                </label>
                <div className="relative h-80 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden group">
                  <img
                    src={
                      editImage
                        ? URL.createObjectURL(editImage)
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${editingItem.image}`
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                    <FiUploadCloud size={24} className="mb-2 text-orange-500" />
                    <span className="text-[9px] font-black uppercase">Replace Image</span>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="lg:col-span-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Listing Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-1">
                      <FiGrid size={10} /> Category
                    </label>
                    <div
                      onClick={() => setShowCatDrop(!showCatDrop)}
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold dark:text-white flex justify-between items-center cursor-pointer"
                    >
                      {editFormData.category
                        ? metaData.categories.find((c) => c._id === editFormData.category)?.title
                        : 'Select Category'}
                      <FiChevronDown />
                    </div>
                    {showCatDrop && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-2 border-b dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center gap-2">
                          <FiSearch size={12} className="text-gray-400" />
                          <input
                            placeholder="Search..."
                            className="w-full bg-transparent text-[10px] font-bold outline-none dark:text-white"
                            onChange={(e) => setCatSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {metaData.categories
                            .filter((c) => c.title.toLowerCase().includes(catSearch.toLowerCase()))
                            .map((cat) => (
                              <div
                                key={cat._id}
                                onClick={() => {
                                  setEditFormData({ ...editFormData, category: cat._id });
                                  setShowCatDrop(false);
                                }}
                                className="p-3 text-[10px] font-bold uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b last:border-0 dark:border-white/5"
                              >
                                {cat.title}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-1">
                      <FiMapPin size={10} /> Region
                    </label>
                    <input
                      type="text"
                      value={editFormData.region}
                      onChange={(e) => setEditFormData({ ...editFormData, region: e.target.value })}
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Story & Description
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white resize-none"
                  />
                </div>

                {/* Tags Searchable Dropdown */}
                <div className="relative space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-1">
                    <FiTag size={10} /> Cultural Tags
                  </label>
                  <div
                    onClick={() => setShowTagDrop(!showTagDrop)}
                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-3 rounded-xl text-[10px] font-bold dark:text-white flex flex-wrap gap-1 min-h-15 cursor-pointer"
                  >
                    {editFormData.culturalTags?.length === 0 && (
                      <span className="text-gray-400">Search tags...</span>
                    )}
                    {editFormData.culturalTags?.map((tId) => (
                      <span
                        key={tId}
                        className="bg-orange-500 text-white px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {metaData.tags.find((t) => t._id === tId)?.title}
                        <FiX
                          size={10}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagToggle(tId);
                          }}
                        />
                      </span>
                    ))}
                  </div>
                  {showTagDrop && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                      <div className="p-2 border-b dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center gap-2">
                        <FiSearch size={12} className="text-gray-400" />
                        <input
                          placeholder="Search tags..."
                          className="w-full bg-transparent text-[10px] font-bold outline-none dark:text-white"
                          onChange={(e) => setTagSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto p-2 grid grid-cols-2 gap-1">
                        {metaData.tags
                          .filter((t) => t.title.toLowerCase().includes(tagSearch.toLowerCase()))
                          .map((tag) => (
                            <div
                              key={tag._id}
                              onClick={() => handleTagToggle(tag._id)}
                              className={`p-2 rounded-lg text-[9px] font-black uppercase cursor-pointer flex justify-between items-center transition-all ${editFormData.culturalTags.includes(tag._id) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'}`}
                            >
                              {tag.title}{' '}
                              {editFormData.culturalTags.includes(tag._id) && <FiCheck />}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Country"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tradition"
                    value={editFormData.tradition}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, tradition: e.target.value })
                    }
                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={updateLoading}
                    className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    {updateLoading ? <FiRefreshCw className="animate-spin" /> : 'Synchronize Node'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
