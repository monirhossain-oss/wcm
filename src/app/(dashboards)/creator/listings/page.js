'use client';
import { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [metaData, setMetaData] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();

  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCatDrop, setShowCatDrop] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);

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
      if (currentTags.length >= 5) {
        alert('Maximum 5 tags allowed');
        return;
      }
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
      setListings(listings.map((l) => (l._id === editingItem._id ? res.data.updatedListing : l)));
      setEditingItem(null);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this node? All promotion data will be lost.')) return;
    try {
      await api.delete(`/api/listings/delete/${id}`);
      setListings(listings.filter((l) => l._id !== id));
      if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/10 pb-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
            <FiActivity className="text-orange-500" /> Total{' '}
            <span className="text-orange-500">Listings</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
            Total Assets: {listings.length}
          </p>
        </div>
      </div>

      {/* Table & Pagination Wrapper */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Asset
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Identity
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Status
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/10">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/50 dark:hover:bg-white/20 transition-all"
                >
                  <td className="px-6 py-4 shrink-0">
                    <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-100 dark:border-white/10">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black uppercase dark:text-white truncate max-w-50">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-sm italic">
                        {item.category?.title}
                      </span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.tradition}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'approved'
                          ? 'bg-green-500/10 text-green-500'
                          : item.status === 'rejected'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-orange-500/10 text-orange-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        icon={FiEye}
                        onClick={() => router.push(`/listings/${item._id}`)}
                        color="hover:bg-blue-500"
                      />
                      <ActionButton
                        icon={FiEdit2}
                        onClick={() => openEditModal(item)}
                        color="hover:bg-orange-500"
                      />
                      <ActionButton
                        icon={FiTrash2}
                        onClick={() => handleDelete(item._id)}
                        color="hover:bg-red-500"
                        isDelete
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        <div className="p-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, listings.length)} of{' '}
            {listings.length} Assets
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded border border-gray-200 dark:border-white/10 disabled:opacity-20 transition-all text-gray-400 hover:text-orange-500"
            >
              <FiChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded text-[10px] font-black transition-all border ${
                    currentPage === idx + 1
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400 hover:border-orange-500'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded border border-gray-200 dark:border-white/10 disabled:opacity-20 transition-all text-gray-400 hover:text-orange-500"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal (Re-Config) - Unchanged but included for completeness */}
      {editingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0c0c0c] rounded-lg border dark:border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/20">
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">
                Protocol <span className="text-orange-500">Re-Configuration</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">
                    Asset Visual
                  </p>
                  <div className="relative h-64 bg-gray-50 dark:bg-white/20 border border-dashed dark:border-white/10 rounded-md overflow-hidden group">
                    <img
                      src={
                        editImage ? URL.createObjectURL(editImage) : getImageUrl(editingItem.image)
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                      <FiUploadCloud size={24} className="mb-2 text-orange-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Update Source
                      </span>
                      <input
                        type="file"
                        onChange={(e) => setEditImage(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    Cultural Tags ({editFormData.culturalTags?.length || 0}/5)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metaData.tags.map((tag) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagToggle(tag._id)}
                        className={`px-3 py-1.5 rounded-sm text-[8px] font-black uppercase border transition-all ${
                          editFormData.culturalTags?.includes(tag._id)
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-orange-500'
                        }`}
                      >
                        {tag.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
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
                      className="w-full bg-gray-50 dark:bg-white/20 border dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white flex justify-between items-center cursor-pointer"
                    >
                      {metaData.categories.find((c) => c._id === editFormData.category)?.title ||
                        'Select'}
                      <FiChevronDown />
                    </div>
                    {showCatDrop && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border dark:border-white/10 rounded-md shadow-2xl max-h-48 overflow-y-auto scrollbar-hide">
                        {metaData.categories.map((cat) => (
                          <div
                            key={cat._id}
                            onClick={() => {
                              setEditFormData({ ...editFormData, category: cat._id });
                              setShowCatDrop(false);
                            }}
                            className="p-3 text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white cursor-pointer transition-colors dark:text-gray-300 border-b last:border-0 dark:border-white/10"
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
                    label="External Access Link"
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
                    className="w-full bg-gray-50 dark:bg-white/20 border dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white outline-none focus:border-orange-500 resize-none transition-all"
                  />
                </div>
                <button
                  disabled={updateLoading}
                  className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-lg shadow-orange-500/20 rounded-md flex items-center justify-center gap-3"
                >
                  {updateLoading ? <FiRefreshCw className="animate-spin" /> : 'Synchronize updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
const ActionButton = ({ icon: Icon, onClick, color, isDelete }) => (
  <button
    onClick={onClick}
    className={`p-2.5 bg-gray-100 dark:bg-white/20 rounded-md transition-all flex items-center justify-center group/btn ${color} hover:text-white`}
  >
    <Icon
      size={14}
      className={`transition-colors ${isDelete ? 'text-red-500 group-hover/btn:text-white' : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-white'}`}
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
      className="w-full bg-gray-50 dark:bg-white/20 border dark:border-white/10 p-4 rounded-md text-[11px] font-black dark:text-white outline-none focus:border-orange-500 transition-all"
    />
  </div>
);
