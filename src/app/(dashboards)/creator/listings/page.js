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
  FiPlus,
  FiAlertCircle,
  FiLink,
  FiGlobe,
  FiShield,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

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
      externalUrls: item.externalUrls?.length > 0 ? item.externalUrls : [''],
      websiteLink: item.websiteLink || '',
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      category: item.category?._id || item.category,
      culturalTags: item.culturalTags?.map((t) => t._id || t) || [],
    });
    setEditImage(null);
  };

  // 🔹 Dynamic URL Handlers
  const handleUrlChange = (index, value) => {
    const newUrls = [...editFormData.externalUrls];
    newUrls[index] = value;
    setEditFormData({ ...editFormData, externalUrls: newUrls });
  };

  const addUrlField = () => {
    setEditFormData({ ...editFormData, externalUrls: [...editFormData.externalUrls, ''] });
  };

  const removeUrlField = (index) => {
    const newUrls = editFormData.externalUrls.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, externalUrls: newUrls });
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
          editFormData[key].forEach((t) => data.append('culturalTags', t));
        } else if (key === 'externalUrls') {
          editFormData[key].forEach((url) => {
            if (url.trim()) data.append('externalUrls', url);
          });
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
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={item.title}
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
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`px-2 py-1 rounded text-[9px] font-black uppercase ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' : item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-600'}`}
                      >
                        {item.status}
                      </span>
                      {item.status === 'rejected' && item.rejectionReason && (
                        <span
                          className="text-[7px] font-bold text-red-400 uppercase italic max-w-20 truncate"
                          title={item.rejectionReason}
                        >
                          Reason Attached
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
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

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingItem(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-3xl overflow-hidden animate-in zoom-in-95 shadow-2xl border dark:border-white/10 flex flex-col max-h-[90vh]">
            {/* 🔹 Rejection Header Alert (যদি থাকে) */}
            {viewingItem.status === 'rejected' && viewingItem.rejectionReason && (
              <div className="bg-red-500 p-3 flex items-center gap-3 text-white shrink-0">
                <FiAlertCircle size={18} className="animate-pulse" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-80">
                    Rejection Feedback
                  </p>
                  <p className="text-[10px] font-bold uppercase">{viewingItem.rejectionReason}</p>
                </div>
              </div>
            )}

            <div className="overflow-y-auto scrollbar-hide">
              {/* Media Section */}
              <div className="relative h-72 shrink-0">
                <img
                  src={getImageUrl(viewingItem.image)}
                  className="w-full h-full object-cover"
                  alt={viewingItem.title}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setViewingItem(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-xl hover:bg-red-500 transition-all z-20"
                >
                  <FiX size={20} />
                </button>

                <div className="absolute bottom-6 left-8">
                  <span className="text-[10px] font-black bg-orange-500 text-white px-3 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">
                    {viewingItem.category?.title || 'Protocol'}
                  </span>
                  <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
                    {viewingItem.title}
                  </h3>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Status & Engagement Info */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                    <div
                      className={`w-2 h-2 rounded-full ${viewingItem.status === 'approved' ? 'bg-green-500' : viewingItem.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}
                    />
                    <span className="text-[10px] font-black uppercase dark:text-gray-300">
                      {viewingItem.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                    <FiHeart className="text-red-500" size={12} />
                    <span className="text-[10px] font-black uppercase dark:text-gray-300">
                      {viewingItem.favorites?.length || 0} Favorites
                    </span>
                  </div>
                </div>

                {/* Core Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest flex items-center gap-1">
                      <FiGlobe size={10} /> Origin & Country
                    </p>
                    <p className="text-xs font-bold dark:text-white uppercase italic">
                      {viewingItem.country}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest flex items-center gap-1">
                      <FiMapPin size={10} /> Region
                    </p>
                    <p className="text-xs font-bold dark:text-white uppercase italic">
                      {viewingItem.region || 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 ">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest flex items-center gap-1">
                      <FiShield size={10} /> Cultural Tradition
                    </p>
                    <p className="text-xs font-bold dark:text-white uppercase italic text-orange-500">
                      {viewingItem.tradition}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 ">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Website Reference
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {viewingItem.websiteLink?.length > 0 ? (
                        <a
                          href={viewingItem.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between"
                        >
                          <span className="text-[10px] font-bold dark:text-gray-300 truncate pr-4">
                            {viewingItem.websiteLink}
                          </span>
                          <FiExternalLink className="text-orange-500 group-hover:scale-110 transition-transform" />
                        </a>
                      ) : (
                        <p className="text-[10px] text-gray-500 italic">No Social Links linked.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Analysis & Narrative
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {viewingItem.description}
                  </p>
                </div>

                {/* 🔹 Cultural Tags */}
                {viewingItem.culturalTags?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Identity Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingItem.culturalTags.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-full text-[9px] font-black uppercase tracking-tighter"
                        >
                          # {tag.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🔹 External Verification URLs */}
                <div className="space-y-3 pb-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Social Links
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {viewingItem.externalUrls?.length > 0 ? (
                      viewingItem.externalUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-xl group hover:bg-orange-500/5 transition-all"
                        >
                          <span className="text-[10px] font-bold dark:text-gray-300 truncate pr-4">
                            {url}
                          </span>
                          <FiExternalLink className="text-orange-500 group-hover:scale-110 transition-transform" />
                        </a>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-500 italic">No Social Links linked.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingItem(null)}
          />
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f0f0f] rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            {/* 🔹 Rejection Alert in Edit Modal */}
            {editingItem.status === 'rejected' && editingItem.rejectionReason && (
              <div className="bg-red-500 p-4 flex items-center gap-3 text-white">
                <FiAlertCircle size={20} className="animate-pulse" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
                    Rejection Reason
                  </p>
                  <p className="text-xs font-bold uppercase">{editingItem.rejectionReason}</p>
                </div>
              </div>
            )}

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
              {/* Left: Image Asset */}
              <div className="lg:col-span-4">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">
                  Media Asset
                </label>
                <div className="relative h-80 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden group">
                  <img
                    src={
                      editImage ? URL.createObjectURL(editImage) : getImageUrl(editingItem.image)
                    }
                    className="w-full h-full object-cover"
                    alt="Preview"
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Website Reference
                    </label>
                    <input
                      type="text"
                      value={editFormData.websiteLink}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, websiteLink: e.target.value })
                      }
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
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95">
                        {metaData.categories.map((cat) => (
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
                      className="w-full bg-white dark:bg-white/10 border p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className="w-full bg-white dark:bg-white/10 border p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white resize-none"
                  />
                </div>

                {/* 🔹 Multiple External URLs (Update Section) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                      <FiLink size={10} /> Social Links
                    </label>
                    <button
                      type="button"
                      onClick={addUrlField}
                      className="text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {editFormData.externalUrls?.map((url, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleUrlChange(index, e.target.value)}
                          className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 pr-8 rounded-xl text-[10px] font-bold dark:text-white outline-none focus:border-orange-500"
                          placeholder="https://..."
                        />
                        {editFormData.externalUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUrlField(index)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <FiX size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="relative space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-1">
                    <FiTag size={10} /> Cultural Tags
                  </label>
                  <div
                    onClick={() => setShowTagDrop(!showTagDrop)}
                    className="w-full bg-white dark:bg-white/10 border p-3 rounded-xl text-[10px] font-bold dark:text-white flex flex-wrap gap-1 min-h-12 cursor-pointer"
                  >
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
                </div>

                <div className="pt-4">
                  <button
                    disabled={updateLoading}
                    className="w-full h-16 bg-orange-600 cursor-pointer hover:bg-orange-500 text-white rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    {updateLoading ? <FiRefreshCw className="animate-spin" /> : 'Update Listing'}
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
