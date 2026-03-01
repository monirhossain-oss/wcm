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
  FiAlertCircle,
  FiSend,
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

  // 🔹 Rejection State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setrejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleStatusUpdate = async (id, newStatus, reason = '') => {
    setActionLoading(true);
    try {
      await api.put(`/api/admin/update-status/${id}`, {
        status: newStatus,
        rejectionReason: reason,
      });

      setListings(
        listings.map((l) =>
          l._id === id ? { ...l, status: newStatus, rejectionReason: reason } : l
        )
      );
      if (viewItem?._id === id)
        setViewItem({ ...viewItem, status: newStatus, rejectionReason: reason });

      setShowRejectModal(false);
      setrejectionReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Listings',
            value: stats.total,
            icon: FiLayers,
            color: 'text-blue-500',
            bg: 'bg-blue-500/5',
          },
          {
            label: 'Pending Listings',
            value: stats.pending,
            icon: FiClock,
            color: 'text-orange-500',
            bg: 'bg-orange-500/5',
          },
          {
            label: 'Approved Listings',
            value: stats.approved,
            icon: FiShield,
            color: 'text-green-500',
            bg: 'bg-green-500/5',
          },
          {
            label: 'Rejected Listings',
            value: stats.rejected,
            icon: FiShield,
            color: 'text-red-500',
            bg: 'bg-red-500/5',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl shadow-sm"
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

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
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
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-50 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-6">Images</th>
                <th className="px-6 py-6">Creators</th>
                <th className="px-6 py-6">Title</th>
                <th className="px-6 py-6">Locations</th>
                <th className="px-6 py-6 text-center">Status</th>
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
                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black uppercase dark:text-white">
                      {item.creatorId?.firstName} {item.creatorId?.lastName}
                    </p>
                    <span className="text-[9px] text-gray-400 lowercase">
                      {item.creatorId?.email}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black uppercase text-[11px] dark:text-white">
                    {item.title}
                  </td>
                  <td className="px-6 py-5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 mt-2">
                    <FiGlobe /> {item.country}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : item.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => setViewItem(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 text-[9px] font-black uppercase rounded-xl hover:bg-orange-500 hover:text-white transition-all group/btn"
                    >
                      View <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewItem(null)}
          />
          <div className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[85vh] animate-in zoom-in-95">
            {/* Left: Image */}
            <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gray-900 shrink-0">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${viewItem.image}`}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <span className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase rounded-md tracking-widest">
                  {viewItem.status}
                </span>
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mt-4 leading-[0.9]">
                  {viewItem.title}
                </h3>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#0a0a0a] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/10">
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] dark:text-white">
                      Review Terminal
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Protocol Inspection
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <FiX size={26} />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                      Geographic Origin
                    </p>
                    <div className="text-sm font-black text-orange-500 uppercase italic flex items-center gap-2">
                      <FiGlobe /> {viewItem.country}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                      Protocol Region
                    </p>
                    <div className="text-sm font-black dark:text-white uppercase italic flex items-center gap-2">
                      <FiMapPin /> {viewItem.region}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2 italic">
                    <FiFileText className="text-orange-500" /> Description
                  </h4>
                  <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10 min-h-[150px]">
                    <p className="text-sm font-medium leading-relaxed dark:text-gray-300">
                      {viewItem.description}
                    </p>
                  </div>
                </div>

                {/* 🔹 Multiple External URLs Display */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2 italic">
                    <FiExternalLink className="text-orange-500" /> Reference Links
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {viewItem.externalUrls?.length > 0 ? (
                      viewItem.externalUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          className="flex items-center justify-between p-3 bg-white/5 border dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-orange-400 hover:bg-orange-500/10 transition-all truncate"
                        >
                          {url} <FiExternalLink />
                        </a>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-500 italic uppercase">
                        No external URLs provided
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-8 border-t dark:border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStatusUpdate(viewItem._id, 'approved')}
                    disabled={viewItem.status === 'approved' || actionLoading}
                    className="h-16 flex items-center justify-center gap-3 bg-green-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-green-500 transition-all disabled:opacity-20"
                  >
                    <FiCheck size={18} /> Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={viewItem.status === 'rejected' || actionLoading}
                    className="h-16 flex items-center justify-center gap-3 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-500 transition-all disabled:opacity-20"
                  >
                    <FiX size={18} /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Rejection Reason Prompt Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-3xl border dark:border-white/10 p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6 text-red-500">
              <FiAlertCircle size={24} />
              <h3 className="text-lg font-black uppercase tracking-tighter italic">
                Rejection <span className="text-white">Reason</span>
              </h3>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Please provide a reason for the creator to fix.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setrejectionReason(e.target.value)}
              placeholder="E.g. Image quality is low or invalid source link..."
              className="w-full h-32 bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:border-red-500 transition-all resize-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(viewItem._id, 'rejected', rejectionReason)}
                disabled={!rejectionReason.trim() || actionLoading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend /> Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
