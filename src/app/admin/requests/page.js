'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiInfo,
  FiExternalLink,
  FiMessageCircle,
  FiAlertCircle,
} from 'react-icons/fi';

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
    try {
      setProcessingId(userId);
      const endpoint =
        action === 'approve'
          ? `/api/admin/approve-creator/${userId}`
          : `/api/admin/reject-creator/${userId}`;

      await api.put(endpoint, { adminComment: 'Action processed by Admin' });

      // রিকোয়েস্ট লিস্ট থেকে রিমুভ করা
      setRequests(requests.filter((req) => req._id !== userId));
    } catch (error) {
      alert(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Creator Requests</h2>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          Review and Verify New Creators
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-ui/20 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-ui p-8 shadow-sm hover:border-orange-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-ui overflow-hidden">
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
                      <h4 className="font-black text-sm uppercase">
                        {request.firstName} {request.lastName}
                      </h4>
                      <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                        @{request.username}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-lg">
                    <FiClock />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-ui rounded-2xl border border-ui">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <FiInfo /> Applied On
                    </p>
                    <p className="text-xs font-black">
                      {new Date(request.creatorRequest?.appliedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-ui rounded-2xl border border-ui">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Country
                      </p>
                      <p className="text-xs font-black">{request.profile?.country || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-ui rounded-2xl border border-ui">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Language
                      </p>
                      <p className="text-xs font-black">{request.profile?.language || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  disabled={processingId === request._id}
                  onClick={() => handleAction(request._id, 'approve')}
                  className="flex-1 bg-black dark:bg-white dark:text-black text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {processingId === request._id ? (
                    '...'
                  ) : (
                    <>
                      <FiCheck size={16} /> Approve
                    </>
                  )}
                </button>
                <button
                  disabled={processingId === request._id}
                  onClick={() => handleAction(request._id, 'reject')}
                  className="flex-1 bg-ui py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {processingId === request._id ? (
                    '...'
                  ) : (
                    <>
                      <FiX size={16} /> Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-ui p-20 text-center">
          <div className="w-20 h-20 bg-ui rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FiAlertCircle size={40} />
          </div>
          <h3 className="font-black uppercase tracking-tight text-lg">No Pending Requests</h3>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-2">
            All applications have been processed
          </p>
        </div>
      )}
    </div>
  );
}
