'use client';

import { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
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

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 font-sans">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/10 pb-6">
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
          className="p-2 bg-gray-100 dark:bg-white/5 rounded-md hover:rotate-180 transition-all duration-500"
        >
          <FiRepeat className="text-gray-500" />
        </button>
      </div>

      {/* 🔹 Main Table */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Applicant
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Details
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Status Type
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {!loading &&
                currentItems.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(request.profile?.profileImage, 'avatar')}
                          className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-100 dark:ring-white/10 shadow-md"
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
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase">
                          <FiGlobe size={10} /> {request.profile?.country || 'Global'}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 truncate max-w-37.5">
                          <FiLink size={10} /> {request.profile?.websiteLink || 'No Portfolio'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest ${request.creatorRequest?.rejectionReason ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}
                      >
                        {request.creatorRequest?.rejectionReason ? 'Re-Submission' : 'First Access'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(request)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white rounded-md transition-all"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="px-4 py-2 bg-green-500/10 text-green-600 text-[9px] font-black uppercase rounded-md border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingUser(request)}
                          className="px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded-md border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && requests.length === 0 && (
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

        {/* --- Pagination Controls --- */}
        <div className="p-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, requests.length)} of{' '}
            {requests.length} Nodes
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft className="dark:text-white" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-[10px] font-black transition-all border ${
                    currentPage === i + 1
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="dark:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Modal: View Details */}
      {selectedUser && !rejectingUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative">
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
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-8 -mt-12 relative">
              <div className="flex items-end gap-4 mb-8">
                <img
                  src={getImageUrl(selectedUser.profile?.profileImage, 'avatar')}
                  className="h-24 w-24 rounded-lg border-4 border-white dark:border-[#0a0a0a] bg-white object-cover shadow-xl"
                  alt=""
                />
                <div className="pb-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white leading-none mb-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">
                    @ {selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <DetailItem
                    icon={FiMapPin}
                    label="Origin"
                    value={`${selectedUser.profile?.city || 'Unknown'}, ${selectedUser.profile?.country}`}
                  />
                  <DetailItem
                    icon={FiInstagram}
                    label="Social Handle"
                    value={selectedUser.profile?.socialLink || 'Not Linked'}
                    isLink={!!selectedUser.profile?.socialLink}
                  />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/10">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <FiInfo size={12} className="text-orange-500" /> Applicant Statement
                  </p>
                  <p className="text-[10px] font-medium leading-relaxed dark:text-gray-300 italic">
                    "{selectedUser.profile?.bio || 'The applicant did not provide a bio.'}"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t dark:border-white/10">
                <button
                  onClick={() => handleApprove(selectedUser._id)}
                  disabled={processingId === selectedUser._id}
                  className="flex-[2] py-4 bg-green-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-green-700 transition-all"
                >
                  Grant Creator Access
                </button>
                <button
                  onClick={() => setRejectingUser(selectedUser)}
                  className="flex-1 py-4 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  Deny Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal: Reject/Feedback */}
      {rejectingUser && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setRejectingUser(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f0f0f] rounded-lg border border-gray-100 dark:border-white/10 shadow-2xl p-8 animate-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="h-14 w-14 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white">
                Review Feedback
              </h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                Protocol rejection for @{rejectingUser.username}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Resolution Type
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['rejected', 'needs_review'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRejectData({ ...rejectData, statusType: type })}
                      className={`py-3 rounded-md text-[8px] font-black uppercase transition-all ${rejectData.statusType === type ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Feedback Note
                </label>
                <textarea
                  value={rejectData.reason}
                  onChange={(e) => setRejectData({ ...rejectData, reason: e.target.value })}
                  className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md px-4 py-3 text-[10px] font-bold outline-none focus:border-orange-500 dark:text-white h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400 hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={processingId === rejectingUser._id}
                className="flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase rounded-md flex items-center justify-center gap-2"
              >
                {processingId === rejectingUser._id ? (
                  'Processing...'
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

const DetailItem = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md text-gray-400">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          className="text-[10px] font-bold text-orange-500 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-[10px] font-bold dark:text-white">{value}</p>
      )}
    </div>
  </div>
);
