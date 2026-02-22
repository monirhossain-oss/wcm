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
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // For View Modal

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

  const handleAction = async (userId, action) => {
    try {
      setProcessingId(userId);
      const endpoint =
        action === 'approve'
          ? `/api/admin/approve-creator/${userId}`
          : `/api/admin/reject-creator/${userId}`;

      await api.put(endpoint, { adminComment: `Request ${action}d by Admin` });

      setRequests(requests.filter((req) => req._id !== userId));
      setSelectedUser(null);
    } catch (error) {
      alert(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Protocol <span className="text-orange-500">Verification</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
            Validate incoming creator access requests
          </p>
        </div>
      </div>

      {/* 🔹 Table Container */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Applicant
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Region
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Submission
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-8 h-12 bg-gray-50/10 dark:bg-white/5"></td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shadow-inner">
                          <img
                            src={
                              request.profile?.profileImage
                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${request.profile.profileImage}`
                                : '/default-avatar.png'
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#1f1f1f] dark:text-white">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-orange-500 lowercase">
                            @{request.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <FiGlobe className="text-gray-400" size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest dark:text-gray-300">
                          {request.profile?.country || 'Global'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-[10px] font-bold text-gray-500">
                      {new Date(request.creatorRequest?.appliedAt || Date.now()).toLocaleDateString(
                        'en-GB'
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(request)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-all"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          disabled={processingId === request._id}
                          onClick={() => handleAction(request._id, 'approve')}
                          className="px-4 py-2 bg-green-500/10 text-green-600 text-[9px] font-black uppercase rounded-lg border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                        >
                          {processingId === request._id ? '...' : 'Approve'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <FiAlertCircle size={30} />
                      <span>Zero Pending Requests</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 View Details Modal (The "View" Option) */}
      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Cover */}
            <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative">
              <img
                src={
                  selectedUser.profile?.coverImage
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedUser.profile.coverImage}`
                    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
                }
                className="w-full h-full object-cover opacity-50"
              />
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-5 right-5 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-8 -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                <div className="h-28 w-28 rounded-3xl border-4 border-white dark:border-[#0a0a0a] shadow-xl overflow-hidden bg-white">
                  <img
                    src={
                      selectedUser.profile?.profileImage
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedUser.profile.profileImage}`
                        : '/default-avatar.png'
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-orange-500 text-xs font-black uppercase tracking-widest">
                    @{selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                      <FiMapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase">Location</p>
                      <p className="text-[10px] font-bold dark:text-white">
                        {selectedUser.profile?.city}, {selectedUser.profile?.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400">
                      <FiExternalLink size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase">
                        Website/Social
                      </p>
                      <a
                        href={selectedUser.profile?.websiteLink}
                        target="_blank"
                        className="text-[10px] font-bold text-orange-500 hover:underline"
                      >
                        {selectedUser.profile?.websiteLink || 'No link provided'}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <FiInfo size={12} /> Bio Statement
                  </p>
                  <p className="text-[11px] font-medium leading-relaxed dark:text-gray-300 italic">
                    "{selectedUser.profile?.bio || 'No bio provided for this applicant.'}"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
                <button
                  disabled={processingId === selectedUser._id}
                  onClick={() => handleAction(selectedUser._id, 'approve')}
                  className="flex-1 py-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm Approval
                </button>
                <button
                  disabled={processingId === selectedUser._id}
                  onClick={() => handleAction(selectedUser._id, 'reject')}
                  className="flex-1 py-4 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
