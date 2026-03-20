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
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';

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
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(
    async (isForce = false) => {
      try {
        if (isForce) setRefreshing(true);
        else setLoading(true);

        // ব্যাকএন্ডে ফিল্টার প্যারামিটার পাঠানো হচ্ছে
        const params = {
          search: searchTerm,
          role: roleFilter,
          timeRange: timeFilter,
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
        console.error('Error fetching users:', error);
        toast.error('Failed to sync user records');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchTerm, roleFilter, timeFilter, currentPage]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ফিল্টার চেঞ্জ হলে প্রথম পেজে ফেরত যাওয়া
  const handleFilterChange = (type, value) => {
    if (type === 'role') setRoleFilter(value);
    if (type === 'time') setTimeFilter(value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId) => {
    const targetUser = users.find((u) => u._id === userId);
    if (!targetUser) return;

    const isBlocking = targetUser.status === 'active';

    const confirmMessage = isBlocking
      ? `Are you sure you want to BLOCK ${targetUser.firstName}'s profile?`
      : `Are you sure you want to UNBLOCK ${targetUser.firstName}'s profile?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const toastId = toast.loading('Updating status...');

      await api.put(`/api/admin/toggle-status/${userId}`);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, status: isBlocking ? 'blocked' : 'active' } : u
        )
      );

      toast.success(
        `${targetUser.firstName} has been ${isBlocking ? 'blocked' : 'activated'} successfully`,
        { id: toastId }
      );
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDownload = async () => {
    if (!window.confirm('Export the full user database?')) return;
    try {
      toast.loading('Preparing Export...', { id: 'export' });
      const response = await api.get('/api/admin/export-users', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
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

      {/* 🔹 Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#1f1f1f] dark:text-white">
            User <span className="text-orange-500">Registry</span>
          </h2>
          <div className="flex items-center gap-2 mt-1 opacity-60">
            <FiClock size={10} className="text-orange-500" />
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
              SYNC STATUS: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'WAITING...'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Identity */}
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH IDENTITY..."
              className="pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 w-full md:w-56 transition-all shadow-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3 group">
            <FiShield
              className="text-gray-400 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase tracking-widest outline-none dark:bg-[#151515] dark:text-white cursor-pointer"
              value={roleFilter}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="all">ALL ROLES</option>
              <option value="admin">ADMINS</option>
              <option value="creator">CREATORS</option>
              <option value="user">BASIC USERS</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3 group">
            <FiFilter
              className="text-gray-400 group-hover:text-orange-500 transition-colors"
              size={14}
            />
            <select
              className="bg-transparent py-3 px-2 text-[9px] font-black uppercase tracking-widest outline-none dark:bg-[#151515] dark:text-white cursor-pointer"
              value={timeFilter}
              onChange={(e) => handleFilterChange('time', e.target.value)}
            >
              <option value="all">ALL TIME</option>
              <option value="today">JOINED TODAY</option>
              <option value="week">THIS WEEK</option>
              <option value="month">THIS MONTH</option>
            </select>
          </div>

          <button
            onClick={() => fetchUsers(true)}
            className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-4 py-2 rounded-xl hover:border-green-500/50 transition-all shadow-sm"
          >
            <div className="p-1.5 bg-green-500/10 rounded text-green-500">
              <FiFileText size={14} />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[9px] font-black uppercase text-green-500">Export</span>
              <span className="text-[7px] uppercase text-gray-400 font-bold italic">CSV/XLSX</span>
            </div>
          </button>
        </div>
      </div>

      {/* 🔹 Users Table */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[450px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/10">
                <th className="px-8 py-5">Identity Protocol</th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5">Registry Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
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
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex items-center justify-center relative">
                          <div className="w-full h-full flex items-center justify-center bg-zinc-800 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 overflow-hidden relative group">
                              {user?.profile?.profileImage && user.profile.profileImage !== '' ? (
                                <img
                                  src={getImageUrl(user.profile.profileImage, 'avatar')}
                                  alt={user?.firstName}
                                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-500 font-black text-xl uppercase italic tracking-tighter border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors duration-300">
                                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#1f1f1f] dark:text-white">
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
                          className={`text-gray-400 ${user.role === 'admin' && 'text-red-500'}`}
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
                        <FiCalendar size={12} className="opacity-50 text-orange-500" />
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${user.status === 'active' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                        />
                        {user.status}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${user.status === 'active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'}`}
                      >
                        {user.status === 'active' ? (
                          <FiUserX size={18} />
                        ) : (
                          <FiUserCheck size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-24 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] italic"
                  >
                    NO REGISTRY ENTRIES MATCHING YOUR FILTERS.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30 dark:bg-white/5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing Nodes {(currentPage - 1) * itemsPerPage + 1} —{' '}
              {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers}
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
    </div>
  );
}
