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
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const [editFormData, setEditFormData] = useState({});
  const [editImage, setEditImage] = useState(null);
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

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      externalUrl: item.externalUrl,
      region: item.region,
      country: item.country,
      tradition: item.tradition,
      culturalTags: [...item.culturalTags],
    });
    setEditImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const data = new FormData();
    Object.keys(editFormData).forEach((key) => {
      if (key === 'culturalTags') data.append(key, editFormData[key].join(','));
      else data.append(key, editFormData[key]);
    });
    if (editImage) data.append('image', editImage);

    try {
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
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Listing <span className="text-orange-500">Management</span>
          </h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
            Total Listings: {listings.length}
          </p>
        </div>
      </div>

      {/* 📊 Table Interface */}
      <div className="bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Images
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Title
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Tradition
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Favoruite
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
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black uppercase text-[#1f1f1f] dark:text-white">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase italic">
                      {item.tradition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs text-red-500 font-black">
                      <FiHeart size={8} /> {item.favorites?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'approved'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-orange-500/10 text-red-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingItem(item)}
                        title="View"
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <FiEye size={12} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit"
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                        className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ 🔹 Listings View Modal (Details) */}
      {viewingItem && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setViewingItem(null)}
          />
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-black/20 hover:bg-red-500 text-white rounded-2xl transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="overflow-y-auto scrollbar-hide">
              <div className="relative h-[40vh] w-full">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${viewingItem.image}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent">
                  <span className="px-3 py-1 bg-orange-500 text-white text-[8px] font-black uppercase rounded-lg tracking-widest">
                    {viewingItem.status} node
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mt-2">
                    {viewingItem.title}
                  </h3>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase text-orange-500 tracking-widest">
                      Historical context
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {viewingItem.description || 'No description provided for this protocol.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {viewingItem.culturalTags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-[9px] font-bold text-gray-500 uppercase"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 h-fit">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-gray-400">
                      Popularity
                    </span>
                    <div className="flex items-center gap-1.5 text-orange-500 font-black text-sm">
                      <FiHeart size={16} fill="currentColor" />
                      {viewingItem.favorites?.length || 0}
                    </div>
                  </div>
                  <hr className="border-gray-200 dark:border-white/10" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-orange-500" />
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Location</p>
                        <p className="text-[10px] font-bold dark:text-white uppercase">
                          {viewingItem.country}, {viewingItem.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiRefreshCw className="text-orange-500" />
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Tradition</p>
                        <p className="text-[10px] font-bold dark:text-white uppercase">
                          {viewingItem.tradition}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    href={viewingItem.externalUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase mt-4 hover:bg-orange-500 transition-colors"
                  >
                    External Reference <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditingItem(null)}
          />
          <div className="relative w-full max-w-5xl bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 shrink-0">
              <h3 className="text-lg font-black uppercase italic text-[#1f1f1f] dark:text-white">
                Modify <span className="text-orange-500">Protocol</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
            <form
              onSubmit={handleUpdate}
              className="p-8 space-y-6 overflow-y-auto scrollbar-hide flex-1"
            >
              {/* ফর্ম কন্টেন্ট আগের মতো থাকবে */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-2">
                    <FiImage className="text-orange-500" /> Source Asset
                  </label>
                  <div className="relative h-64 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden group">
                    <img
                      src={
                        editImage
                          ? URL.createObjectURL(editImage)
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${editingItem.image}`
                      }
                      className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <FiUploadCloud size={24} className="text-orange-500 mb-1" />
                      <p className="text-[9px] font-black uppercase">Replace Image</p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setEditImage(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editFormData.title}
                        className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white"
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase ml-1 text-orange-500">
                        Region
                      </label>
                      <input
                        type="text"
                        value={editFormData.region}
                        className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white"
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, region: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editFormData.country}
                        className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white"
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Description
                    </label>
                    <textarea
                      value={editFormData.description}
                      className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all dark:text-white h-32 resize-none"
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, description: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-white/10 rounded-2xl border border-gray-100 dark:border-white/10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    External URL
                  </label>
                  <input
                    type="text"
                    value={editFormData.externalUrl}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, externalUrl: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Tradition
                  </label>
                  <input
                    type="text"
                    value={editFormData.tradition}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-orange-500 dark:text-white"
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, tradition: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={updateLoading}
                  className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  {updateLoading ? <FiRefreshCw className="animate-spin" /> : 'Synchronize Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
