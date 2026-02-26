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
  FiActivity,
  FiClock,
  FiShield,
  FiLayers,
  FiAlertCircle,
  FiSend,
  FiLink,
  FiAward,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewItem, setViewItem] = useState(null);
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

      const updated = listings.map((l) =>
        l._id === id ? { ...l, status: newStatus, rejectionReason: reason } : l
      );
      setListings(updated);

      if (viewItem?._id === id) {
        setViewItem({ ...viewItem, status: newStatus, rejectionReason: reason });
      }

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
            label: 'Pending',
            value: stats.pending,
            icon: FiClock,
            color: 'text-orange-500',
            bg: 'bg-orange-500/5',
          },
          {
            label: 'Approved',
            value: stats.approved,
            icon: FiShield,
            color: 'text-green-500',
            bg: 'bg-green-500/5',
          },
          {
            label: 'Rejected',
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

      {/* Filter & Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-white/10 flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-black uppercase italic dark:text-white">
            Moderation <span className="text-orange-500">Terminal</span>
          </h2>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b dark:border-white/10">
                <th className="px-8 py-4">Image</th>
                <th className="px-6 py-4">Creator</th>
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredListings.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/30 dark:hover:bg-white/10 transition-all"
                >
                  <td className="px-8 py-4">
                    <img
                      src={getImageUrl(item.image)}
                      className="h-10 w-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt=""
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black dark:text-white uppercase">
                      {item.creatorName}
                    </p>
                    <p className="text-[9px] text-gray-400 lowercase italic">
                      @{item.creatorId?.username}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black dark:text-white uppercase">{item.title}</p>
                    <p className="text-[9px] text-orange-500 font-bold uppercase">
                      {item.categoryName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${item.status === 'approved' ? 'bg-green-500/10 text-green-600' : item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => setViewItem(item)}
                      className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setViewItem(null)}
          />
          <div className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] rounded-3xl border dark:border-white/10 overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
            {/* Image Side */}
            <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gray-900">
              <img
                src={getImageUrl(viewItem.image)}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  {viewItem.categoryName}
                </p>
                <h3 className="text-4xl font-black text-white uppercase italic leading-none">
                  {viewItem.title}
                </h3>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto bg-white dark:bg-[#0a0a0a]">
              <div className="flex justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black dark:text-white uppercase tracking-widest">
                      Inspection Node
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase">ID: {viewItem._id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Tradition</p>
                    <p className="text-[11px] font-black dark:text-white uppercase italic">
                      <FiAward className="inline mr-1 text-orange-500" /> {viewItem.tradition}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Origin</p>
                    <p className="text-[11px] font-black dark:text-white uppercase italic">
                      <FiGlobe className="inline mr-1 text-orange-500" /> {viewItem.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                    <FiFileText className="text-orange-500" /> Description
                  </h4>
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border dark:border-white/10">
                    <p className="text-xs font-medium dark:text-gray-300 leading-relaxed italic">
                      "{viewItem.description}"
                    </p>
                  </div>
                </div>

                {/* ✅ Flipped 'name' to 'title' for Cultural Tags */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                    <FiTag className="text-orange-500" /> Protocol Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewItem.culturalTags?.map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-xl"
                      >
                        {tag.image && (
                          <img
                            src={getImageUrl(tag.image)}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        )}
                        <span className="text-[9px] font-black text-orange-500 uppercase">
                          # {tag.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase italic">
                      Core Source
                    </h4>
                    {viewItem.websiteLink ? (
                      <a
                        href={viewItem.websiteLink}
                        target="_blank"
                        className="flex items-center justify-between p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest"
                      >
                        <FiLink /> Website
                      </a>
                    ) : (
                      <p className="text-[9px] text-gray-500 uppercase p-3 border border-dashed dark:border-white/10 rounded-xl text-center">
                        No Link
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase italic">
                      References
                    </h4>
                    <div className="flex gap-2">
                      {viewItem.externalUrls?.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <FiExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t dark:border-white/10 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStatusUpdate(viewItem._id, 'approved')}
                    disabled={viewItem.status === 'approved' || actionLoading}
                    className="h-14 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <FiCheck size={18} /> Approve Asset
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={viewItem.status === 'rejected' || actionLoading}
                    className="h-14 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <FiX size={18} /> Reject Asset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-3xl border dark:border-white/10 p-8">
            <h3 className="text-lg font-black uppercase italic dark:text-white mb-4">
              Rejection <span className="text-red-500">Note</span>
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setrejectionReason(e.target.value)}
              placeholder="Reason for non-compliance..."
              className="w-full h-32 bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:border-red-500 transition-all mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase dark:text-gray-400 bg-gray-100 dark:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(viewItem._id, 'rejected', rejectionReason)}
                disabled={!rejectionReason.trim() || actionLoading}
                className="flex-1 h-12 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSend /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
