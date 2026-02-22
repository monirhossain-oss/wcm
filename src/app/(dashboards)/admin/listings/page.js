'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiEye,
  FiGlobe,
  FiTag,
  FiFileText,
  FiMapPin,
  FiExternalLink,
  FiImage,
  FiActivity,
  FiClock,
  FiShield,
  FiLayers,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/admin/listings');
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching admin listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!confirm(`Switch protocol status to ${newStatus.toUpperCase()}?`)) return;
    try {
      await api.put(`/api/admin/update-status/${id}`, { status: newStatus });
      setListings(listings.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
      if (viewItem?._id === id) setViewItem({ ...viewItem, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
  };

  const filteredListings =
    filter === 'all' ? listings : listings.filter((l) => l.status === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* 📊 Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Index',
            value: stats.total,
            icon: FiLayers,
            color: 'text-blue-500',
            bg: 'bg-blue-500/5',
          },
          {
            label: 'Pending Review',
            value: stats.pending,
            icon: FiClock,
            color: 'text-orange-500',
            bg: 'bg-orange-500/5',
          },
          {
            label: 'Live Protocols',
            value: stats.approved,
            icon: FiShield,
            color: 'text-green-500',
            bg: 'bg-green-500/5',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-3xl shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {stat.label}
                </p>
                <h4 className="text-3xl font-black italic dark:text-white">{stat.value}</h4>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Header & Filter Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic dark:text-white">
            System <span className="text-orange-500">Moderation</span>
          </h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Cultural asset validation terminal
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                filter === f
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Enhanced Table */}
      <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-50 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-6">Image</th>
                <th className="px-6 py-6">Name</th>
                <th className="px-6 py-6">Title</th>
                <th className="px-6 py-6">Location</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredListings.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/30 dark:hover:bg-white/10 transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex items-center justify-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black uppercase dark:text-white leading-none">
                      {item.creatorId.firstName}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black uppercase dark:text-white leading-none">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase">
                      <FiGlobe className="text-gray-300" /> {item.country}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        item.status === 'approved'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : item.status === 'rejected'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => setViewItem(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 text-[9px] font-black uppercase rounded-xl hover:bg-orange-500 hover:text-white transition-all group/btn"
                    >
                      View{' '}
                      <FiEye size={14} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Refined Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewItem(null)}
          />

          <div className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[85vh] animate-in zoom-in-95 duration-300">
            {/* Visual Section (Left) */}
            <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gray-900 shrink-0">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${viewItem.image}`}
                className="w-full h-full object-cover opacity-90"
                alt=""
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <span className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase rounded-md tracking-widest shadow-lg">
                  {viewItem.status}
                </span>
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mt-4 leading-[0.9]">
                  {viewItem.title}
                </h3>
              </div>
            </div>

            {/* Data Section (Right) */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col h-full overflow-y-scroll scrollbar-hide bg-white dark:bg-[#0a0a0a]">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/10">
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
                      Review Terminal
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      System v2.0
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                >
                  <FiX size={26} />
                </button>
              </div>

              {/* Information Body */}
              <div className="space-y-8 flex-1 flex flex-col">
                {/* Geographic & Meta Grid */}
                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div className="p-6 bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Geographic Origin
                    </p>
                    <div className="text-sm font-black text-orange-600 dark:text-orange-500 uppercase italic flex items-center gap-2">
                      <FiGlobe size={16} /> {viewItem.country}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Protocol Region
                    </p>
                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase italic flex items-center gap-2">
                      <FiMapPin size={16} /> {viewItem.region}
                    </div>
                  </div>
                </div>

                {/* Description - Internal scroll only for this box */}
                <div className="flex flex-col flex-1 min-h-0 space-y-3">
                  <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2 italic">
                    <FiFileText className="text-orange-500" /> Description & Analysis
                  </h4>
                  <div className="flex-1 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col">
                    <div className="p-6 overflow-y-auto scrollbar-hide h-full">
                      <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                        {viewItem.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tradition & Creator Row */}
                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-white/2 rounded-xl border border-gray-100 dark:border-white/10">
                    <FiShield className="text-orange-500" size={18} />
                    <div>
                      <p className="text-[9px] font-black uppercase text-gray-400">Tradition</p>
                      <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white">
                        {viewItem.tradition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-white/2 rounded-xl border border-gray-100 dark:border-white/10">
                    <FiActivity className="text-orange-500" size={18} />
                    <div>
                      <p className="text-[9px] font-black uppercase text-gray-400">Node Creator</p>
                      <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white">
                        {viewItem.creatorId?.username || 'System'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 shrink-0">
                <a
                  href={viewItem.externalUrl}
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl group hover:bg-orange-500/10 transition-all mb-6"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                    Verification Source
                  </span>
                  <FiExternalLink className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStatusUpdate(viewItem._id, 'approved')}
                    disabled={viewItem.status === 'approved'}
                    className="h-16 flex items-center justify-center gap-3 bg-green-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-green-500 transition-all shadow-lg shadow-green-500/20 disabled:opacity-20"
                  >
                    <FiCheck size={20} /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(viewItem._id, 'rejected')}
                    disabled={viewItem.status === 'rejected'}
                    className="h-16 flex items-center justify-center gap-3 bg-red-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-red-500 transition-all shadow-lg shadow-red-500/20 disabled:opacity-20"
                  >
                    <FiX size={20} /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
