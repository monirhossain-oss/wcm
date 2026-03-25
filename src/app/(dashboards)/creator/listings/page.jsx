'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiUploadCloud,
  FiRefreshCw,
  FiEye,
  FiChevronDown,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiSearch,
  FiFilter,
  FiLayers,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const LISTINGS_CACHE_KEY = 'drakilo_listings_cache';
const CACHE_TIME = 24 * 60 * 60 * 1000;

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [metaData, setMetaData] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCatDrop, setShowCatDrop] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const cachedData = localStorage.getItem(LISTINGS_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_TIME;
      if (!isExpired) {
        setListings(data);
        setLastSynced(timestamp);
        setLoading(false);
        fetchMeta();
        return;
      }
    }
    fetchListings();
    fetchMeta();
  }, []);

  const fetchListings = async (isForce = false) => {
    try {
      if (isForce) setRefreshing(true);
      else setLoading(true);

      const res = await api.get('/api/listings/my-listings');
      const data = res.data;

      localStorage.setItem(LISTINGS_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      setListings(data);
      setLastSynced(Date.now());
      if (isForce) toast.success('Inventory Synchronized');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  // --- Unified Filtering Logic (Local for Speed) ---
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tradition?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || (item.category?._id || item.category) === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination Logic on Filtered Data
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      websiteLink: item.websiteLink || '',
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      category: item.category?._id || item.category,
      culturalTags: item.culturalTags?.map((t) => t._id || t) || [],
    });
    setEditImage(null);
  };

  const handleTagToggle = (tagId) => {
    const currentTags = [...(editFormData.culturalTags || [])];
    if (currentTags.includes(tagId)) {
      setEditFormData({ ...editFormData, culturalTags: currentTags.filter((id) => id !== tagId) });
    } else {
      if (currentTags.length >= 5) return toast.error('Maximum 5 tags allowed');
      setEditFormData({ ...editFormData, culturalTags: [...currentTags, tagId] });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (key === 'culturalTags') {
          editFormData[key].forEach((t) => data.append('culturalTags', t));
        } else {
          data.append(key, editFormData[key]);
        }
      });
      if (editImage) data.append('image', editImage);

      const res = await api.put(`/api/listings/update/${editingItem._id}`, data);
      const updatedListings = listings.map((l) =>
        l._id === editingItem._id ? res.data.updatedListing : l
      );
      setListings(updatedListings);
      localStorage.setItem(
        LISTINGS_CACHE_KEY,
        JSON.stringify({ data: updatedListings, timestamp: Date.now() })
      );
      setEditingItem(null);
      toast.success('Asset updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this node? All promotion data will be lost.')) return;
    try {
      await api.delete(`/api/listings/delete/${id}`);
      const filtered = listings.filter((l) => l._id !== id);
      setListings(filtered);
      localStorage.setItem(
        LISTINGS_CACHE_KEY,
        JSON.stringify({ data: filtered, timestamp: Date.now() })
      );
      toast.success('Node deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b border-gray-100 dark:border-white/10 pb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3 italic">
            <FiActivity className="text-orange-500" /> My{' '}
            <span className="text-orange-500">Listings</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <FiClock size={10} className="text-orange-500" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Synchronized: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Pending'}
            </p>
          </div>
        </div>

        {/* 🔹 Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH ASSET..."
              className="pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase outline-none focus:border-orange-500/50 w-full md:w-48 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3">
            <FiLayers className="text-gray-400" size={14} />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase outline-none dark:bg-[#151515] dark:text-white cursor-pointer"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">ALL CATEGORIES</option>
              {metaData.categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3">
            <FiFilter className="text-gray-400" size={14} />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase outline-none dark:bg-[#151515] dark:text-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">ALL STATUS</option>
              <option value="approved">APPROVED</option>
              <option value="pending">PENDING</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>

          <button
            onClick={() => fetchListings(true)}
            disabled={refreshing}
            className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all shadow-sm"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Node Asset
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Identity Details
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Protocol Status
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 relative shadow-sm">
                        <img
                          src={getImageUrl(item.image)}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          alt=""
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[12px] font-black uppercase dark:text-white tracking-tight truncate max-w-48">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[8px] font-black uppercase text-orange-500 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10 italic">
                          {item.category?.title || 'General'}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                          {item.tradition}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                          item.status === 'approved'
                            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                            : item.status === 'rejected'
                              ? 'bg-red-500/5 border-red-500/10 text-red-500'
                              : 'bg-orange-500/5 border-orange-500/10 text-orange-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <ActionButton
                          icon={FiEye}
                          onClick={() => router.push(`/listings/${item._id}`)}
                          color="hover:bg-blue-600"
                          label="View"
                        />
                        <ActionButton
                          icon={FiEdit2}
                          onClick={() => openEditModal(item)}
                          color="hover:bg-orange-600"
                          label="Edit"
                        />
                        <ActionButton
                          icon={FiTrash2}
                          onClick={() => handleDelete(item._id)}
                          color="hover:bg-red-600"
                          isDelete
                          label="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic opacity-50"
                  >
                    No matching nodes detected in system index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between bg-gray-50/30 dark:bg-white/2 gap-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic opacity-60">
              Indexing {indexOfFirstItem + 1} — {Math.min(indexOfLastItem, filteredListings.length)}{' '}
              of {filteredListings.length} ASSETS
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronLeft size={18} className="dark:text-white" />
              </button>
              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all border ${
                      currentPage === idx + 1
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                        : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-orange-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronRight size={18} className="dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal (Keeping all your existing logic) */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80">
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0c0c0c] rounded-2xl border dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] dark:text-white italic">
                  Node <span className="text-orange-500 text-sm">Re-Configuration</span>
                </h3>
                <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">
                  Asset ID Ref: {editingItem._id}
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2.5 bg-gray-100 dark:bg-white/5 hover:text-red-500 rounded-xl transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[75vh] overflow-y-auto scrollbar-hide"
            >
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    Visual Identity
                  </p>
                  <div className="relative h-64 bg-gray-50 dark:bg-white/5 border border-dashed dark:border-white/10 rounded-2xl overflow-hidden group">
                    <img
                      src={
                        editImage ? URL.createObjectURL(editImage) : getImageUrl(editingItem.image)
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                      <FiUploadCloud size={30} className="mb-2 text-orange-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Update Buffer
                      </span>
                      <input
                        type="file"
                        onChange={(e) => setEditImage(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex justify-between">
                    Taxonomy Tags <span>{editFormData.culturalTags?.length}/5</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metaData.tags.map((tag) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagToggle(tag._id)}
                        className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${editFormData.culturalTags?.includes(tag._id) ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-orange-500'}`}
                      >
                        {tag.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Asset Title"
                    value={editFormData.title}
                    onChange={(v) => setEditFormData({ ...editFormData, title: v })}
                  />
                  <div className="space-y-2 relative">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
                      Category Protocol
                    </label>
                    <div
                      onClick={() => setShowCatDrop(!showCatDrop)}
                      className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-4 rounded-xl text-[11px] font-black dark:text-white flex justify-between items-center cursor-pointer hover:border-orange-500/50 transition-all"
                    >
                      {metaData.categories.find((c) => c._id === editFormData.category)?.title ||
                        'SELECT CATEGORY'}
                      <FiChevronDown
                        className={`${showCatDrop ? 'rotate-180' : ''} transition-transform`}
                      />
                    </div>
                    {showCatDrop && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border dark:border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {metaData.categories.map((cat) => (
                          <div
                            key={cat._id}
                            onClick={() => {
                              setEditFormData({ ...editFormData, category: cat._id });
                              setShowCatDrop(false);
                            }}
                            className="p-4 text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b dark:border-white/5 last:border-0"
                          >
                            {cat.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <InputField
                    label="Tradition"
                    value={editFormData.tradition}
                    onChange={(v) => setEditFormData({ ...editFormData, tradition: v })}
                  />
                  <InputField
                    label="Country"
                    value={editFormData.country}
                    onChange={(v) => setEditFormData({ ...editFormData, country: v })}
                  />
                  <InputField
                    label="Region"
                    value={editFormData.region}
                    onChange={(v) => setEditFormData({ ...editFormData, region: v })}
                  />
                  <InputField
                    label="Access Link"
                    value={editFormData.websiteLink}
                    onChange={(v) => setEditFormData({ ...editFormData, websiteLink: v })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Asset Description
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-4 rounded-xl text-[11px] font-black dark:text-white outline-none focus:border-orange-500 resize-none transition-all"
                  />
                </div>
                <button
                  disabled={updateLoading}
                  className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-xl shadow-orange-600/20 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {updateLoading ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    'Synchronize Node Updates'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const ActionButton = ({ icon: Icon, onClick, color, isDelete, label }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-3 bg-gray-50 dark:bg-white/5 rounded-xl transition-all flex items-center justify-center group/btn ${color} hover:text-white hover:shadow-lg active:scale-90 border dark:border-white/10 shadow-sm`}
  >
    <Icon
      size={15}
      className={`transition-colors ${isDelete ? 'text-red-500 group-hover/btn:text-white' : 'text-gray-400 group-hover/btn:text-white'}`}
    />
  </button>
);

const InputField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 p-4 rounded-xl text-[11px] font-black dark:text-white outline-none focus:border-orange-500 transition-all"
    />
  </div>
);
