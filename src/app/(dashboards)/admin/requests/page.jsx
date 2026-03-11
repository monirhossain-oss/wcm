'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiGlobe,
  FiEye,
  FiMapPin,
  FiInfo,
  FiMessageSquare,
  FiSend,
  FiInstagram,
  FiLink,
  FiRepeat,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiCalendar,
  FiFilter,
  FiClock,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectingUser, setRejectingUser] = useState(null);
  const [rejectData, setRejectData] = useState({ reason: '', statusType: 'rejected' });

  // --- Filter & Pagination State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const itemsPerPage = 10;

  const fetchRequests = useCallback(
    async (isForce = false) => {
      try {
        setLoading(true);
        const params = {
          search: searchTerm,
          timeRange: timeFilter,
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await api.get('/api/admin/creator-requests', { params });

        if (res.data.success) {
          setRequests(res.data.requests);
          setTotalPages(res.data.pagination.totalPages);
          setTotalRequests(res.data.pagination.totalRequests);
          if (isForce) toast.success('Registry Synchronized');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, timeFilter, currentPage]
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ফিল্টার চেঞ্জ হলে প্রথম পেজে ফেরত যাওয়া
  const handleFilterChange = (value) => {
    setTimeFilter(value);
    setCurrentPage(1);
  };

  const handleApprove = async (userId) => {
    if (!confirm('Are you sure you want to approve this creator?')) return;
    try {
      setProcessingId(userId);
      await api.put(`/api/admin/approve-creator/${userId}`);
      toast.success('Creator Approved Successfully');
      fetchRequests(); // লিস্ট রিফ্রেশ করা
      setSelectedUser(null);
    } catch (error) {
      toast.error('Approval failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectData.reason) return toast.error('Please provide feedback reason');
    try {
      setProcessingId(rejectingUser._id);
      await api.put(`/api/admin/reject-creator/${rejectingUser._id}`, {
        reason: rejectData.reason,
        statusType: rejectData.statusType,
      });
      toast.success('Application Rejected');
      fetchRequests();
      setRejectingUser(null);
      setSelectedUser(null);
      setRejectData({ reason: '', statusType: 'rejected' });
    } catch (error) {
      toast.error('Rejection failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 font-sans">
      <Toaster position="top-right" />

      {/* 🔹 Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-gray-100 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Protocol <span className="text-orange-500">Verification</span>
          </h2>
          <div className="flex items-center gap-2 mt-1 opacity-60">
            <FiClock size={10} className="text-orange-500" />
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
              Pending Nodes: {totalRequests}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Applicant */}
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH APPLICANT..."
              className="pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 w-full md:w-56 transition-all shadow-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Time Filter */}
          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3 group">
            <FiFilter
              className="text-gray-400 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase tracking-widest outline-none dark:text-white dark:bg-[#151515] cursor-pointer"
              value={timeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">ALL REQUESTS</option>
              <option value="today">APPLIED TODAY</option>
              <option value="week">THIS WEEK</option>
              <option value="month">THIS MONTH</option>
            </select>
          </div>

          <button
            onClick={() => fetchRequests(true)}
            className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
          >
            <FiRepeat className={loading ? 'animate-spin' : ''} size={16} />
          </button>
        </div>
      </div>

      {/* 🔹 Main Table */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5">Applicant Protocol</th>
                <th className="px-8 py-5">Origin / Details</th>
                <th className="px-8 py-5">Entry Type</th>
                <th className="px-8 py-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-10 bg-gray-50/10 dark:bg-white/2"></td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(request.profile?.profileImage, 'avatar')}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-white/10 shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                          alt=""
                        />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#1f1f1f] dark:text-white">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-orange-500">
                            @{request.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase italic">
                          <FiGlobe size={10} className="text-orange-500" />{' '}
                          {request.profile?.country || 'Global'}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 truncate max-w-[150px]">
                          <FiLink size={10} /> {request.profile?.websiteLink || 'NO PORTFOLIO'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${request.creatorRequest?.rejectionReason ? 'bg-orange-500/5 text-orange-500 border-orange-500/20' : 'bg-blue-500/5 text-blue-500 border-blue-500/20'}`}
                      >
                        {request.creatorRequest?.rejectionReason ? 'RE-SUBMISSION' : 'FIRST ACCESS'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(request)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-orange-500 rounded-xl transition-all shadow-sm"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="px-4 py-2 bg-green-500/10 text-green-600 text-[9px] font-black uppercase rounded-xl border border-green-500/20 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingUser(request)}
                          className="px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <FiCheck size={40} className="text-gray-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                        NO PENDING NODES DETECTED.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30 dark:bg-white/5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing Nodes {(currentPage - 1) * itemsPerPage + 1} —{' '}
              {Math.min(currentPage * itemsPerPage, totalRequests)} of {totalRequests}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white dark:bg-white/5 rounded-xl border dark:border-white/10 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronLeft className="dark:text-white" />
              </button>

              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-orange-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white dark:bg-white/5 rounded-xl border dark:border-white/10 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronRight className="dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Modal: View Details (Unchanged Logic, Adjusted UI) */}
      {selectedUser && !rejectingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-40 w-full bg-gray-100 dark:bg-white/5 relative">
              <img
                src={
                  getImageUrl(selectedUser.profile?.coverImage) ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                }
                className="w-full h-full object-cover opacity-60"
                alt=""
              />
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-8 -mt-16 relative">
              <div className="flex items-end gap-6 mb-8">
                <img
                  src={getImageUrl(selectedUser.profile?.profileImage, 'avatar')}
                  className="h-28 w-28 rounded-2xl border-4 border-white dark:border-[#0a0a0a] bg-white object-cover shadow-2xl"
                  alt=""
                />
                <div className="pb-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white leading-none mb-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-orange-500 text-[11px] font-black uppercase tracking-[0.2em]">
                    PROTOCOL @{selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <DetailItem
                    icon={FiMapPin}
                    label="GEOGRAPHIC ORIGIN"
                    value={`${selectedUser.profile?.city || 'UNKNOWN'}, ${selectedUser.profile?.country}`}
                  />
                  <DetailItem
                    icon={FiInstagram}
                    label="SOCIAL IDENTITY"
                    value={selectedUser.profile?.socialLink || 'NOT LINKED'}
                    isLink={!!selectedUser.profile?.socialLink}
                  />
                </div>
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <FiInfo size={14} className="text-orange-500" /> APPLICANT STATEMENT
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed dark:text-gray-300 italic tracking-tight">
                    "{selectedUser.profile?.bio || 'THE APPLICANT DID NOT PROVIDE A BIO STATEMENT.'}
                    "
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t dark:border-white/10">
                <button
                  onClick={() => handleApprove(selectedUser._id)}
                  disabled={processingId === selectedUser._id}
                  className="flex-[2] py-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                >
                  GRANT CREATOR ACCESS
                </button>
                <button
                  onClick={() => setRejectingUser(selectedUser)}
                  className="flex-1 py-4 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  DENY ACCESS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal: Reject/Feedback */}
      {rejectingUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setRejectingUser(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl p-8 animate-in zoom-in-95">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <FiMessageSquare size={28} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                Review Feedback
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                PROTOCOL REJECTION: @{rejectingUser.username}
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  RESOLUTION TYPE
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['rejected', 'needs_review'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRejectData({ ...rejectData, statusType: type })}
                      className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${rejectData.statusType === type ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-100 dark:bg-white/5 border-transparent text-gray-400 hover:border-gray-300 dark:hover:border-white/20'}`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  FEEDBACK LOG
                </label>
                <textarea
                  value={rejectData.reason}
                  onChange={(e) => setRejectData({ ...rejectData, reason: e.target.value })}
                  placeholder="PROVIDE DETAILED REASON FOR PROTOCOL DENIAL..."
                  className="w-full mt-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-orange-500 dark:text-white h-32 resize-none placeholder:text-gray-300 dark:placeholder:text-white/10"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={processingId === rejectingUser._id}
                className="flex-[2] py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                {processingId === rejectingUser._id ? (
                  'SYNCING...'
                ) : (
                  <>
                    <FiSend /> FINALIZE DENIAL
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

const DetailItem = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-orange-500 border border-gray-100 dark:border-white/10 shadow-sm">
      <Icon size={18} />
    </div>
    <div className="leading-tight">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      {isLink && value !== 'NOT LINKED' ? (
        <a
          href={value}
          target="_blank"
          className="text-[11px] font-bold text-orange-500 hover:underline tracking-tight break-all uppercase"
        >
          {value}
        </a>
      ) : (
        <p className="text-[11px] font-bold dark:text-white tracking-tight uppercase">{value}</p>
      )}
    </div>
  </div>
);
