'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiGlobe,
  FiAlertCircle,
  FiEye,
  FiExternalLink,
  FiMapPin,
  FiInfo,
  FiMessageSquare,
  FiSend,
  FiInstagram,
  FiLink,
  FiRepeat,
} from 'react-icons/fi';
// ✅ ১. getImageUrl ইমপোর্ট করুন
import { getImageUrl } from '@/lib/imageHelper';

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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/creator-requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId) => {
    if (!confirm('Are you sure you want to approve this creator?')) return;
    try {
      setProcessingId(userId);
      await api.put(`/api/admin/approve-creator/${userId}`);
      setRequests(requests.filter((req) => req._id !== userId));
      setSelectedUser(null);
    } catch (error) {
      alert('Approval failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectData.reason) return alert('Please provide a feedback reason.');
    try {
      setProcessingId(rejectingUser._id);
      await api.put(`/api/admin/reject-creator/${rejectingUser._id}`, {
        reason: rejectData.reason,
        statusType: rejectData.statusType,
      });
      setRequests(requests.filter((req) => req._id !== rejectingUser._id));
      setRejectingUser(null);
      setSelectedUser(null);
      setRejectData({ reason: '', statusType: 'rejected' });
    } catch (error) {
      alert('Rejection failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Protocol <span className="text-orange-500">Verification</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
            Total {requests.length} Pending Creator Nodes
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:rotate-180 transition-all duration-500"
        >
          <FiRepeat className="text-gray-500" />
        </button>
      </div>

      {/* 🔹 Main Table */}
      <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* ✅ ২. আপনার প্রেফারেন্স অনুযায়ী dark:bg-white/20 করা হয়েছে */}
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Applicant
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Details
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Status Type
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-10 bg-gray-50/10 dark:bg-white/5"></td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {/* ✅ ৩. ইমেজ ফিক্স */}
                          <img
                            src={getImageUrl(request.profile?.profileImage, 'avatar')}
                            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-white/5 shadow-md"
                            alt="applicant"
                          />
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-[#111] rounded-full"></div>
                        </div>
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
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase">
                          <FiGlobe size={10} /> {request.profile?.country || 'Global'}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 truncate max-w-[150px]">
                          <FiLink size={10} /> {request.profile?.websiteLink || 'No Portfolio'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${request.creatorRequest?.rejectionReason ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}
                      >
                        {request.creatorRequest?.rejectionReason ? 'Re-Submission' : 'First Access'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(request)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white rounded-xl transition-all"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="px-4 py-2 bg-green-500/10 text-green-600 text-[9px] font-black uppercase rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingUser(request)}
                          className="px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
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
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                        All Clear. No Pending Nodes.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal: View Details */}
      {selectedUser && !rejectingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-40 w-full bg-gray-100 dark:bg-white/5 relative">
              {/* ✅ ৪. কভার ইমেজ ফিক্স */}
              <img
                src={
                  getImageUrl(selectedUser.profile?.coverImage) ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                }
                className="w-full h-full object-cover opacity-60"
                alt="cover"
              />
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-10 -mt-20 relative">
              <div className="flex items-end gap-6 mb-10">
                {/* ✅ ৫. প্রোফাইল ইমেজ ফিক্স ইন মডেল */}
                <img
                  src={getImageUrl(selectedUser.profile?.profileImage, 'avatar')}
                  className="h-32 w-32 rounded-[2.5rem] border-8 border-white dark:border-[#0a0a0a] bg-white object-cover shadow-2xl"
                  alt="profile"
                />
                <div className="pb-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white leading-none mb-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-orange-500 text-sm font-black uppercase tracking-widest mb-2">
                    @ {selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400">
                      <FiMapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Origin
                      </p>
                      <p className="text-xs font-bold dark:text-white">
                        {selectedUser.profile?.city || 'Unknown'}, {selectedUser.profile?.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400">
                      <FiInstagram size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Social Handle
                      </p>
                      <a
                        href={selectedUser.profile?.socialLink}
                        target="_blank"
                        className="text-xs font-bold text-orange-500 hover:underline"
                      >
                        {selectedUser.profile?.socialLink || 'Not Linked'}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 relative">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <FiInfo size={14} className="text-orange-500" /> Applicant Statement
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed dark:text-gray-300 italic">
                    "{selectedUser.profile?.bio || 'The applicant did not provide a bio.'}"
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t dark:border-white/10">
                <button
                  onClick={() => handleApprove(selectedUser._id)}
                  disabled={processingId === selectedUser._id}
                  className="flex-[2] py-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
                >
                  Grant Creator Access
                </button>
                <button
                  onClick={() => setRejectingUser(selectedUser)}
                  className="flex-1 py-4 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  Deny Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal: Reject/Feedback (Unchanged except minor styling) */}
      {rejectingUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setRejectingUser(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl p-10 animate-in zoom-in-95">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare size={30} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                Review Feedback
              </h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                Protocol rejection for @{rejectingUser.username}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Resolution Type
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['rejected', 'needs_review'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRejectData({ ...rejectData, statusType: type })}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${rejectData.statusType === type ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-gray-200'}`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Feedback Note
                </label>
                <textarea
                  value={rejectData.reason}
                  onChange={(e) => setRejectData({ ...rejectData, reason: e.target.value })}
                  placeholder="Tell the user what to fix..."
                  className="w-full mt-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold outline-none focus:border-orange-500 dark:text-white resize-none h-32"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-black dark:hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={processingId === rejectingUser._id}
                className="flex-[2] py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                {processingId === rejectingUser._id ? (
                  'Dispatching...'
                ) : (
                  <>
                    <FiSend /> Finalize
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
