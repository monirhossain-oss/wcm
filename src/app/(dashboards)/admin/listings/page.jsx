'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiEye,
  FiGlobe,
  FiTag,
  FiFileText,
  FiExternalLink,
  FiActivity,
  FiClock,
  FiShield,
  FiLayers,
  FiSend,
  FiLink,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiShieldOff,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const LISTINGS_CACHE_KEY = 'drakilo_admin_listings_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// Mandatory Rejection/Block Reasons
const REASON_CODES = [
  'ILLEGAL_CONTENT',
  'HATE_OR_EXTREMISM',
  'CULTURAL_MISREPRESENTATION',
  'COPYRIGHT_ISSUE',
  'COUNTERFEIT_OR_FRAUD',
  'QUALITY_ISSUE',
  'MISLEADING_LINK',
  'SPAM',
  'ADMIN_DECISION',
  'NOT_RELEVANT_TO_OUR_BUSINESS_MODEL',
];

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewItem, setViewItem] = useState(null);

  // Restriction States
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrictionType, setRestrictionType] = useState('rejected'); // 'rejected' or 'blocked'
  const [reasonCode, setReasonCode] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchListings = useCallback(async (isForce = false) => {
    try {
      if (!isForce) {
        const cached = localStorage.getItem(LISTINGS_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setListings(data);
            setLastSynced(timestamp);
            setLoading(false);
            return;
          }
        }
      }
      if (isForce) setRefreshing(true);
      else setLoading(true);
      const res = await api.get('/api/admin/listings');
      if (res.data) {
        setListings(res.data);
        const timestamp = Date.now();
        setLastSynced(timestamp);
        localStorage.setItem(LISTINGS_CACHE_KEY, JSON.stringify({ data: res.data, timestamp }));
        if (isForce) toast.success('Listings Synchronized');
      }
    } catch (err) {
      toast.error('Failed to sync listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleStatusUpdate = async (id, newStatus, code, notes) => {
    setActionLoading(true);
    try {
      await api.put(`/api/admin/update-status/${id}`, {
        status: newStatus,
        reasonCode: code,
        additionalReason: notes,
      });

      const updated = listings.map((l) =>
        l._id === id
          ? { ...l, status: newStatus, rejectionReason: code, additionalReason: notes }
          : l
      );

      setListings(updated);
      localStorage.setItem(
        LISTINGS_CACHE_KEY,
        JSON.stringify({ data: updated, timestamp: Date.now() })
      );
      if (viewItem?._id === id) setViewItem({ ...viewItem, status: newStatus });

      toast.success(`Asset ${newStatus} successfully`);
      setShowRestrictionModal(false);
      setReasonCode('');
      setAdditionalNotes('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
    blocked: listings.filter((l) => l.status === 'blocked').length,
  };

  const filteredListings =
    filter === 'all' ? listings : listings.filter((l) => l.status === filter);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const currentItems = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && !refreshing)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <Toaster position="top-right" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {[
          {
            label: 'Total Assets',
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
            label: 'Blocked',
            value: stats.blocked,
            icon: FiShieldOff, // ব্লকড এর জন্য আলাদা আইকন
            color: 'text-red-600',
            bg: 'bg-red-600/10',
          },
          {
            label: 'Rejected',
            value: stats.rejected,
            icon: FiX, // রিজেক্টেড এর জন্য X আইকন
            color: 'text-pink-500',
            bg: 'bg-pink-500/5',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-lg shadow-sm transition-all hover:border-orange-500/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {stat.label}
                </p>
                <h4 className="text-2xl font-black italic dark:text-white leading-none">
                  {stat.value}
                </h4>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Table Wrapper */}
      <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black uppercase italic dark:text-white">
              Moderation <span className="text-orange-500">Terminal</span>
            </h2>
            <button
              onClick={() => fetchListings(true)}
              disabled={refreshing}
              className={`p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 transition-all ${refreshing ? 'animate-spin' : 'hover:bg-orange-500 hover:text-white'}`}
            >
              <FiRefreshCw size={14} />
            </button>
          </div>

          <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
            {['all', 'pending', 'approved', 'rejected', 'blocked'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${filter === f ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-orange-500'}`}
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
                <th className="px-8 py-4">Preview</th>
                <th className="px-6 py-4">Creator</th>
                <th className="px-6 py-4">Classification</th>
                <th className="px-6 py-4">Protocol Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/30 dark:hover:bg-white/10 transition-all"
                >
                  <td className="px-8 py-4">
                    <img
                      src={getImageUrl(item.image)}
                      className="h-10 w-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-black/10 dark:border-white/10"
                      alt=""
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black dark:text-white uppercase">
                      {item.creatorName}
                    </p>
                    <p className="text-[9px] text-gray-400 lowercase italic">
                      @{item.creatorId?.username || 'unknown'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black dark:text-white uppercase truncate max-w-37.5">
                      {item.title}
                    </p>
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
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-gray-500"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-50"
                  >
                    No items detected in this sector
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 border-t border-gray-50 dark:border-white/10 flex items-center justify-between bg-gray-50/30 dark:bg-white/20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
            <FiClock size={10} className="text-orange-500" />
            Sync: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Establishing...'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft className="dark:text-white" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-100 dark:bg-white/10 text-gray-400 border dark:border-white/10 hover:border-orange-500'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="dark:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setViewItem(null)}
          />
          <div className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] rounded-3xl border dark:border-white/10 overflow-hidden flex flex-col lg:flex-row max-h-[90vh] animate-in slide-in-from-bottom-5">
            {/* Image Side */}
            <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gray-900">
              <img
                src={getImageUrl(viewItem.image)}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
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
            <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto scrollbar-hide bg-white dark:bg-[#0a0a0a]">
              <div className="flex justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
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
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-gray-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-lg border dark:border-white/10">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Tradition</p>
                    <p className="text-[11px] font-black dark:text-white uppercase italic">
                      <FiAward className="inline mr-1 text-orange-500" /> {viewItem.tradition}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-lg border dark:border-white/10">
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
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-lg border dark:border-white/10">
                    <p className="text-xs font-medium dark:text-gray-300 leading-relaxed italic">
                      "{viewItem.description}"
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                    <FiTag className="text-orange-500" /> Protocol Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewItem.culturalTags?.map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-lg"
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
                        className="flex items-center justify-between p-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-opacity hover:opacity-80"
                      >
                        <FiLink /> Website
                      </a>
                    ) : (
                      <p className="text-[9px] text-gray-500 uppercase p-3 border border-dashed dark:border-white/10 rounded-lg text-center">
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
                          className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <FiExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {/* APPROVE BUTTON */}
                  <button
                    onClick={() => handleStatusUpdate(viewItem._id, 'approved')}
                    disabled={
                      viewItem.status === 'approved' ||
                      viewItem.status === 'blocked' ||
                      actionLoading
                    }
                    className="h-14 bg-green-600 text-white rounded-lg cursor-pointer font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiCheck size={18} />
                    {viewItem.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>

                  {/* REJECT BUTTON */}
                  <button
                    onClick={() => {
                      setRestrictionType('rejected');
                      setShowRestrictionModal(true);
                    }}
                    disabled={
                      viewItem.status === 'rejected' ||
                      viewItem.status === 'blocked' ||
                      actionLoading
                    }
                    className="h-14 bg-orange-600 text-white rounded-lg cursor-pointer font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiX size={18} />
                    {viewItem.status === 'rejected' ? 'Rejected' : 'Reject'}
                  </button>

                  {/* BLOCK BUTTON */}
                  <button
                    onClick={() => {
                      setRestrictionType('blocked');
                      setShowRestrictionModal(true);
                    }}
                    disabled={viewItem.status === 'blocked' || actionLoading}
                    className="h-14 bg-red-600 text-white rounded-lg cursor-pointer font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiShieldOff size={18} />
                    {viewItem.status === 'blocked' ? 'Blocked' : 'Block'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection/Block Modal */}
      {showRestrictionModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowRestrictionModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-3xl dark:text-white border dark:border-white/10 p-8 shadow-2xl">
            <h3 className="text-lg font-black uppercase italic dark:text-white mb-6">
              {restrictionType} <span className="text-red-500">Protocol</span>
            </h3>

            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
              Mandatory Reason Code
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0f0f0f] border dark:border-white/10 rounded-lg p-4 text-[10px] font-black dark:text-white mb-4 outline-none focus:border-orange-500 uppercase appearance-none"
            >
              <option value="">-- Select Reason Code --</option>
              {REASON_CODES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Reason for non-compliance..."
              className="w-full h-32 bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-xs font-bold dark:text-white outline-none focus:border-red-500 transition-all mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRestrictionModal(false)}
                className="flex-1 h-12 rounded-lg text-[10px] font-black uppercase dark:text-gray-400 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(viewItem._id, restrictionType, reasonCode, additionalNotes)
                }
                disabled={!reasonCode || actionLoading}
                className={`flex-1 h-12 ${restrictionType === 'blocked' ? 'bg-red-600' : 'bg-orange-600'} text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                <FiSend /> {actionLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
