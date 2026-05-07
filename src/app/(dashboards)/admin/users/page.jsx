'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  FiDownload,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// ─── CSV export utility (no library needed) ───────────────────────────────────
function exportToCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v ?? '').replace(/"/g, '""');
    return /[,"\n\r]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function usersToRows(users) {
  return users.map((u) => ({
    ID: u._id,
    'First Name': u.firstName || '',
    'Last Name': u.lastName || '',
    'Business Name': u.profile?.businessName || '',
    Email: u.email || '',
    Username: u.username || '',
    Role: (u.role || '').toUpperCase(),
    Status: (u.status || '').toUpperCase(),
    Country: u.profile?.country || '',
    City: u.profile?.city || '',
    Website: u.profile?.websiteLink || '',
    'Email Verified': u.isEmailVerified ? 'YES' : 'NO',
    'Wallet Balance': u.walletBalance ?? 0,
    'Listings Count': u.listingsCount ?? 0,
    'Join Date': u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '',
  }));
}
// ──────────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;
  const router = useRouter();

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const buildParams = useCallback(
    () => ({
      search: searchTerm,
      role: roleFilter,
      status: statusFilter,
      page: currentPage,
      limit: itemsPerPage,
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    }),
    [searchTerm, roleFilter, statusFilter, currentPage, dateFrom, dateTo]
  );

  const fetchUsers = useCallback(
    async (isForce = false) => {
      try {
        if (isForce) setRefreshing(true);
        else setLoading(true);
        const res = await api.get('/api/admin/users', { params: buildParams() });
        if (res.data.success) {
          setUsers(res.data.users);
          setTotalPages(res.data.pagination.totalPages);
          setTotalUsers(res.data.pagination.totalUsers);
          setLastSynced(Date.now());
          if (isForce) toast.success('Registry Synchronized');
        }
      } catch {
        toast.error('Failed to sync user records');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [buildParams]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Export current page as CSV (frontend, no server)
  const handleExportCurrentPage = () => {
    if (!users.length) return toast.error('No data on this page');
    exportToCSV(
      usersToRows(users),
      `WCM_Users_Page${currentPage}_${new Date().toISOString().split('T')[0]}.csv`
    );
    setShowExportMenu(false);
    toast.success(`Page ${currentPage} exported as CSV`);
  };

  // Export all filtered data as Excel (server)
  const handleExportAllFiltered = async () => {
    setShowExportMenu(false);
    if (!window.confirm(`Export all ${totalUsers} matching users as Excel?`)) return;
    try {
      setExporting(true);
      toast.loading('Preparing Excel export...', { id: 'export' });
      const params = {
        role: roleFilter,
        status: statusFilter,
        ...(searchTerm && { search: searchTerm }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      };
      const response = await api.get('/api/admin/export-users', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `WCM_Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Excel export ready', { id: 'export' });
    } catch {
      toast.error('Export failed', { id: 'export' });
    } finally {
      setExporting(false);
    }
  };

  const handleToggleAction = async (userId, action) => {
    const targetUser = users.find((u) => u._id === userId);
    if (!targetUser) return;
    const isReverting =
      action === 'block' ? targetUser.status === 'blocked' : targetUser.status === 'suspended';
    if (
      !window.confirm(
        `CONFIRM: ${isReverting ? 'RE-ACTIVATE' : action.toUpperCase()} ${targetUser.firstName.toUpperCase()}?`
      )
    )
      return;
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

  const clearDates = () => {
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };
  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 font-sans">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
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

        <div className="flex flex-col gap-3 w-full xl:w-auto">
          {/* Row 1 — Search, Role, Status, Refresh, Export */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
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

            {/* Role */}
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

            {/* Status */}
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
                <option value="active">ACTIVE</option>
                <option value="blocked">BLOCKED</option>
                <option value="suspended">SUSPENDED</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchUsers(true)}
              className="p-3 bg-white dark:bg-white/5 border dark:border-white/10 text-gray-400 hover:text-orange-500 rounded-md transition-all"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
            </button>

            {/* Export dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu((p) => !p)}
                disabled={exporting}
                className="flex items-center gap-2 bg-white dark:bg-white/5 border dark:border-white/10 px-4 py-[11px] rounded-md hover:border-green-500/50 transition-all disabled:opacity-50"
              >
                <FiDownload size={14} className="text-green-500" />
                <span className="text-[9px] font-black uppercase text-green-500">
                  {exporting ? 'Exporting...' : 'Export'}
                </span>
                <FiChevronDown size={12} className="text-green-500" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b dark:border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Export Options
                    </p>
                  </div>

                  {/* Option 1: Current page CSV */}
                  <button
                    onClick={handleExportCurrentPage}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left"
                  >
                    <FiFileText size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide dark:text-white">
                        Export Current Page
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        CSV • {users.length} users visible • No server load
                      </p>
                    </div>
                  </button>

                  {/* Option 2: All filtered Excel */}
                  <button
                    onClick={handleExportAllFiltered}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left border-t dark:border-white/10"
                  >
                    <FiDownload size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide dark:text-white">
                        Export All Filtered
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        Excel (.xlsx) • {totalUsers} total users • Current filters applied
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 2 — Date range filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Join Date:
              </span>
              <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md px-3 gap-2">
                <FiCalendar className="text-orange-500" size={12} />
                <input
                  type="date"
                  className="bg-transparent py-2.5 text-[9px] font-black outline-none dark:text-white cursor-pointer"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <span className="text-[9px] font-black text-gray-400">—</span>
              <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md px-3 gap-2">
                <FiCalendar className="text-orange-500" size={12} />
                <input
                  type="date"
                  className="bg-transparent py-2.5 text-[9px] font-black outline-none dark:text-white cursor-pointer"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {hasDateFilter && (
                <button
                  onClick={clearDates}
                  className="flex items-center gap-1 text-[9px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all"
                >
                  <FiX size={12} /> CLEAR
                </button>
              )}
            </div>

            {/* Active filter pills */}
            <div className="flex flex-wrap gap-2">
              {roleFilter !== 'all' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-[8px] font-black uppercase text-orange-500">
                  {roleFilter}
                  <FiX
                    size={10}
                    className="cursor-pointer"
                    onClick={() => {
                      setRoleFilter('all');
                      setCurrentPage(1);
                    }}
                  />
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black uppercase text-blue-500">
                  {statusFilter}
                  <FiX
                    size={10}
                    className="cursor-pointer"
                    onClick={() => {
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                  />
                </span>
              )}
              {hasDateFilter && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[8px] font-black uppercase text-purple-500">
                  {dateFrom || '...'} → {dateTo || '...'}
                  <FiX size={10} className="cursor-pointer" onClick={clearDates} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
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
                    <td colSpan="5" className="px-8 py-8 bg-gray-50/10 dark:bg-white/2" />
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
                              alt=""
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
                          className={`text-[9px] font-black uppercase tracking-widest ${
                            user.role === 'admin'
                              ? 'text-red-500'
                              : user.role === 'creator'
                                ? 'text-orange-500'
                                : 'text-blue-500'
                          }`}
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
                        <button
                          onClick={() => router.push(`/admin/users/${user._id}`)}
                          className="p-2.5 rounded-md border border-white/5 text-gray-400 hover:text-orange-500 transition-all"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleAction(user._id, 'suspend')}
                          className={`p-2.5 rounded-md transition-all ${
                            user.status === 'suspended'
                              ? 'text-orange-500 bg-orange-500/10'
                              : 'text-gray-400 hover:bg-orange-500/10 hover:text-orange-500'
                          }`}
                          title="Suspend User"
                        >
                          {user.status === 'suspended' ? (
                            <FiPlayCircle size={18} />
                          ) : (
                            <FiPauseCircle size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleAction(user._id, 'block')}
                          className={`p-2.5 rounded-md transition-all ${
                            user.status === 'blocked'
                              ? 'text-red-500 bg-red-500/10'
                              : 'text-gray-400 hover:bg-red-500/10 hover:text-red-500'
                          }`}
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

        {/* Pagination */}
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
                    className={`w-9 h-9 rounded-md text-[10px] font-black border ${
                      currentPage === i + 1
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
                    }`}
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
