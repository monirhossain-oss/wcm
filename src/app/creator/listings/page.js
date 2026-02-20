'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiUploadCloud,
  FiTag,
  FiBox,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit States
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/listings/my-listings');
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ Tag Logic
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !editFormData.culturalTags.includes(val)) {
        setEditFormData({
          ...editFormData,
          culturalTags: [...editFormData.culturalTags, val],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setEditFormData({
      ...editFormData,
      culturalTags: editFormData.culturalTags.filter((t) => t !== tagToRemove),
    });
  };

  // 🔓 Edit Modal Open
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      externalUrl: item.externalUrl,
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      culturalTags: [...item.culturalTags], // array copy
    });
    setEditImage(null);
    setTagInput('');
  };

  // 💾 Update Submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const data = new FormData();

    Object.keys(editFormData).forEach((key) => {
      if (key === 'culturalTags') {
        data.append(key, editFormData[key].join(','));
      } else {
        data.append(key, editFormData[key]);
      }
    });
    if (editImage) data.append('image', editImage);

    try {
      const res = await api.put(`/api/listings/update/${editingItem._id}`, data);
      setListings(listings.map((l) => (l._id === editingItem._id ? res.data.updatedListing : l)));
      setEditingItem(null);
      alert('Updated Successfully!');
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
      <div className="flex items-center justify-center min-h-100">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
            Creator Workspace
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            My <span className="text-gray-300">Collections</span>
          </h2>
        </div>
        <div className="bg-white dark:bg-[#111] px-8 py-4 rounded-3xl border border-ui flex items-center gap-4">
          <FiBox className="text-orange-500" size={20} />
          <div>
            <p className="text-xl font-black leading-none">{listings.length}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Total Artifacts
            </p>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-[#111] border border-ui rounded-[3rem] overflow-hidden group hover:border-orange-500 transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-orange-500/10"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-6 left-6">
                <span
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${
                    item.status === 'approved'
                      ? 'bg-green-500/80 text-white'
                      : 'bg-orange-500/80 text-white'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-base font-black uppercase truncate tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <FiMapPin className="text-orange-500" /> {item.country} / {item.region}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                {item.culturalTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-ui rounded-md text-[8px] font-black uppercase text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-ui">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-4 bg-ui text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Glassmorphism Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setEditingItem(null)}
          />

          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c0c0c] rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-ui/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                  Refine <span className="text-orange-500">Artifact</span>
                </h3>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
                  Updating global repository
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="h-12 w-12 bg-ui rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              {/* Image Upload UI */}
              <div className="group relative h-56 bg-ui rounded-[2.5rem] border-2 border-dashed border-ui hover:border-orange-500 transition-all overflow-hidden">
                <img
                  src={
                    editImage
                      ? URL.createObjectURL(editImage)
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${editingItem.image}`
                  }
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-3 group-hover:bg-orange-500 transition-all group-hover:scale-110">
                    <FiUploadCloud size={28} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Replace Visual Media
                  </p>
                </div>
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Artifact Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    className="w-full bg-ui/50 p-5 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-orange-500 transition-all"
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    External URL
                  </label>
                  <input
                    type="text"
                    value={editFormData.externalUrl}
                    className="w-full bg-ui/50 p-5 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-orange-500 transition-all"
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, externalUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editFormData.region}
                    className="w-full bg-ui/50 p-5 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-orange-500 transition-all"
                    onChange={(e) => setEditFormData({ ...editFormData, region: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editFormData.country}
                    className="w-full bg-ui/50 p-5 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-orange-500 transition-all"
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 🏷️ Interactive Tag System */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiTag className="text-orange-500" /> Cultural Meta Tags
                </label>
                <div className="min-h-30 w-full bg-ui/20 border border-ui rounded-[2.5rem] p-6 focus-within:border-orange-500 transition-all">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editFormData.culturalTags?.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onKeyDown={handleTagAdd}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Type tag and press Enter..."
                    className="w-full bg-transparent outline-none text-[11px] font-bold placeholder:text-gray-500"
                  />
                </div>
              </div>

              <button
                disabled={updateLoading}
                className="w-full py-6 bg-orange-500 text-white rounded-4xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[0_20px_40px_rgba(249,115,22,0.3)] active:scale-95 disabled:opacity-50"
              >
                {updateLoading ? 'Synchronizing State...' : 'Commit Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
