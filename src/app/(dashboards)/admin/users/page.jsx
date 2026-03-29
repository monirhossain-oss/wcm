'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiUserX,
  FiUserCheck,
  FiCalendar,
  FiShield,
  FiUser,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiClock,
  FiFilter,
  FiPauseCircle,
  FiPlayCircle,
  FiEye,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // --- Filter & Pagination State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchUsers = useCallback(
    async (isForce = false) => {
      try {
        if (isForce) setRefreshing(true);
        else setLoading(true);

        const params = {
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await api.get('/api/admin/users', { params });

        if (res.data.success) {
          setUsers(res.data.users);
          setTotalPages(res.data.pagination.totalPages);
          setTotalUsers(res.data.pagination.totalUsers);
          setLastSynced(Date.now());
          if (isForce) toast.success('Registry Synchronized');
        }
      } catch (error) {
        toast.error('Failed to sync user records');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchTerm, roleFilter, statusFilter, currentPage]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Toggle Actions (Block/Suspend) ---
  const handleToggleAction = async (userId, action) => {
    const targetUser = users.find((u) => u._id === userId);
    if (!targetUser) return;

    // determine state
    let isReverting = false;
    if (action === 'block') isReverting = targetUser.status === 'blocked';
    if (action === 'suspend') isReverting = targetUser.status === 'suspended';

    const confirmMessage = `CONFIRM ACTION: Are you sure you want to ${isReverting ? 'RE-ACTIVATE' : action.toUpperCase()} ${targetUser.firstName.toUpperCase()}'s account?`;

    if (!window.confirm(confirmMessage)) return;

    const toastId = toast.loading(`Processing ${action}...`);
    try {
      const res = await api.put(`/api/admin/toggle-status/${userId}?action=${action}`);

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: res.data.status } : u))
        );
        toast.success(`User is now ${res.data.status}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Protocol failure', { id: toastId });
    }
  };

  const handleDownload = async () => {
    const confirmMessage = `
⚠️ CRITICAL RESOURCE WARNING:
----------------------------------------------
Are you sure you want to EXPORT the full user database?

IMPACT ANALYSIS:
1. High CPU & RAM usage: This will strain the server resources.
2. Latency: Ongoing user sessions may experience slow response times.
3. Heavy Payload: Large data transfers can affect network bandwidth.

Do you want to proceed with this protocol?
`.trim();
    if (!window.confirm(confirmMessage)) return;
    try {
      toast.loading('Preparing Export...', { id: 'export' });
      const response = await api.get('/api/admin/export-users', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Users_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exported Successfully', { id: 'export' });
    } catch (err) {
      toast.error('Export failed', { id: 'export' });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 font-sans">
      <Toaster position="top-right" />

      {/* 🔹 Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic dark:text-white">
            User <span className="text-orange-500">Registry Control</span>
          </h2>
          <div className="flex items-center gap-2 mt-1 opacity-60">
            <FiClock size={10} className="text-orange-500" />
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
              LAST SYNC: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* 🔹 Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH IDENTITY..."
              className="pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 w-full md:w-56 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md px-3">
            <FiShield className="text-gray-400" size={14} />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase tracking-widest outline-none dark:text-white dark:bg-[#151515] cursor-pointer"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">ALL ROLES</option>
              <option value="admin">ADMINS</option>
              <option value="creator">CREATORS</option>
              <option value="user">BASIC USERS</option>
            </select>
          </div>

          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md px-3">
            <FiFilter className="text-gray-400" size={14} />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase tracking-widest outline-none dark:text-white dark:bg-[#151515] cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">ALL STATUS</option>
              <option value="active">ACTIVE ONLY</option>
              <option value="blocked">BLOCKED</option>
              <option value="suspended">SUSPENDED</option>
            </select>
          </div>

          <button
            onClick={() => fetchUsers(true)}
            className="p-3 bg-white dark:bg-white/5 border dark:border-white/10 text-gray-400 hover:text-orange-500 rounded-md transition-all"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-3 bg-white dark:bg-white/5 border dark:border-white/10 px-4 py-2 rounded-md hover:border-green-500/50 transition-all"
          >
            <FiFileText size={14} className="text-green-500" />
            <span className="text-[9px] font-black uppercase text-green-500">Export Registry</span>
          </button>
        </div>
      </div>

      {/* 🔹 Table Content */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b dark:border-white/10">
                <th className="px-8 py-5">Identity Protocol</th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5">Registry Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5">
              {loading && !refreshing ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8 bg-gray-50/10 dark:bg-white/2"></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center">
                          {user?.profile?.profileImage ? (
                            <img
                              src={getImageUrl(user.profile.profileImage, 'avatar')}
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                            />
                          ) : (
                            <div className="text-orange-500 font-black uppercase italic">
                              {user?.firstName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase text-[#1f1f1f] dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 lowercase">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 italic">
                        <FiUser
                          className={user.role === 'admin' ? 'text-red-500' : 'text-gray-400'}
                          size={12}
                        />
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : user.role === 'creator' ? 'text-orange-500' : 'text-blue-500'}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2 uppercase italic">
                        <FiCalendar size={12} className="text-orange-500" />
                        {new Date(user.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Profile/Details (Future placeholder) */}
                        <button
                          onClick={() => router.push(`/admin/users/${user._id}`)}
                          className="p-2.5 rounded-md border border-white/5 text-gray-400 hover:text-orange-500 transition-all"
                        >
                          <FiEye size={16} />
                        </button>

                        {/* Suspend Action */}
                        <button
                          onClick={() => handleToggleAction(user._id, 'suspend')}
                          className={`p-2.5 rounded-md transition-all ${user.status === 'suspended' ? 'text-orange-500 bg-orange-500/10' : 'text-gray-400 hover:bg-orange-500/10 hover:text-orange-500'}`}
                          title="Suspend User"
                        >
                          {user.status === 'suspended' ? (
                            <FiPlayCircle size={18} />
                          ) : (
                            <FiPauseCircle size={18} />
                          )}
                        </button>

                        {/* Block Action */}
                        <button
                          onClick={() => handleToggleAction(user._id, 'block')}
                          className={`p-2.5 rounded-md transition-all ${user.status === 'blocked' ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-red-500/10 hover:text-red-500'}`}
                          title="Block User"
                        >
                          {user.status === 'blocked' ? (
                            <FiUserCheck size={18} />
                          ) : (
                            <FiUserX size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-24 text-center text-gray-400 text-[10px] font-black uppercase italic tracking-[0.4em]"
                  >
                    NO MATCHING DATA NODES.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing {users.length} of {totalUsers} total entities
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white dark:bg-white/5 rounded-md border dark:border-white/10 disabled:opacity-20"
              >
                <FiChevronLeft className="dark:text-white" />
              </button>
              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-md text-[10px] font-black border ${currentPage === i + 1 ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white dark:bg-white/5 rounded-md border dark:border-white/10 disabled:opacity-20"
              >
                <FiChevronRight className="dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 Atomic UI Components
const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-500/5 text-green-500 border-green-500/20',
    blocked: 'bg-red-500/5 text-red-500 border-red-500/20',
    suspended: 'bg-orange-500/5 text-orange-500 border-orange-500/20',
    pending_review: 'bg-blue-500/5 text-blue-500 border-blue-500/20',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${styles[status] || styles.active}`}
    >
      <span
        className={`w-1 h-1 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : status === 'blocked' ? 'bg-red-500' : 'bg-orange-500'}`}
      />
      {status}
    </div>
  );
};
