'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiX, FiClock, FiUser, FiCalendar, FiAlertCircle, FiGlobe } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
    const confirmMsg = action === 'approve' ? 'Approve this creator?' : 'Reject this request?';
    if (!confirm(confirmMsg)) return;

    try {
      setProcessingId(userId);
      const endpoint =
        action === 'approve'
          ? `/api/admin/approve-creator/${userId}`
          : `/api/admin/reject-creator/${userId}`;

      await api.put(endpoint, { adminComment: 'Action processed by Admin' });

      // রিকোয়েস্ট লিস্ট থেকে রিমুভ করা
      setRequests(requests.filter((req) => req._id !== userId));
    } catch (error) {
      alert(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            Creator <span className="text-orange-500">Approvals</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
            Review and verify incoming creator nodes
          </p>
        </div>
      </div>

      {/* 🔹 Table Container */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Applicant
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Origin/Locale
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Submission Date
                </th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                  Decision Terminal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-8 h-10 bg-gray-50/30 dark:bg-white/10"></td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/20 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden flex items-center justify-center">
                          {request.profile?.profileImage ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${request.profile.profileImage}`}
                              alt="avatar"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-black uppercase">
                              {request.firstName?.[0]}
                              {request.lastName?.[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#1f1f1f] dark:text-white">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 lowercase">
                            @{request.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <FiGlobe className="text-gray-400" size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
                          {request.profile?.country || 'N/A'} • {request.profile?.language || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                        <FiClock size={12} className="text-orange-500" />
                        {new Date(
                          request.creatorRequest?.appliedAt || Date.now()
                        ).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={processingId === request._id}
                          onClick={() => handleAction(request._id, 'approve')}
                          className="px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-green-500/20"
                        >
                          {processingId === request._id ? '...' : 'Approve'}
                        </button>
                        <button
                          disabled={processingId === request._id}
                          onClick={() => handleAction(request._id, 'reject')}
                          className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                        >
                          {processingId === request._id ? '...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-16 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <FiAlertCircle size={24} />
                      <span>Zero Pending Protocols</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
