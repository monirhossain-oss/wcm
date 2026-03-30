'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiActivity,
  FiClock,
  FiSearch,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
  FiShield,
  FiFilter,
  FiRefreshCw,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const CACHE_KEY = 'admin_audit_logs_cache';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes for testing, change to 10 * 60 * 1000 for production

export default function AdminAuditLogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // Filtering & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionType, setActionType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(
    async (isForce = false) => {
      try {
        // ক্যাশ চেক লজিক (শুধুমাত্র যদি ফোর্স রিফ্রেশ না হয় এবং প্রথম পেজে থাকে)
        if (
          !isForce &&
          currentPage === 1 &&
          searchTerm === '' &&
          filter === 'all' &&
          actionType === ''
        ) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { data, pagination, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TIME) {
              setLogs(data);
              setTotalPages(pagination.pages);
              setLastSynced(timestamp);
              setLoading(false);
              return;
            }
          }
        }

        if (isForce) setRefreshing(true);
        else setLoading(true);

        const { data } = await api.get(`/api/audit/admin/logs`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            filter: filter,
            actionType: actionType,
          },
        });

        if (data.success) {
          setLogs(data.logs);
          setTotalPages(data.pagination.pages);
          setLastSynced(Date.now());

          // প্রথম পেজের জেনারেল ডাটা ক্যাশ করা
          if (currentPage === 1 && searchTerm === '' && filter === 'all' && actionType === '') {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                data: data.logs,
                pagination: data.pagination,
                timestamp: Date.now(),
              })
            );
          }
          if (isForce) toast.success('Audit Trail Synchronized');
        }
      } catch (err) {
        toast.error('Failed to sync security logs');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, searchTerm, filter, actionType]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchLogs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header & Advanced Filters */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white flex items-center gap-2">
              <FiShield className="text-orange-500 animate-pulse" /> Audit{' '}
              <span className="text-orange-500">Intelligence</span>
            </h3>
            <div className="flex items-center gap-2 opacity-60">
              <FiClock size={10} className="text-orange-500" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Last Sync:{' '}
                {lastSynced
                  ? new Date(lastSynced).toLocaleTimeString()
                  : 'Establishing Connection...'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 lg:min-w-60.5">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="SEARCH ACTION OR USER..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-orange-500 transition-all dark:text-white uppercase"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Date Filters */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5">
              {['all', 'today', 'month', 'year'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                    filter === f
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Force Refresh Button */}
            <button
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
              className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              title="Force Sync"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
            </button>
          </div>
        </div>

        {/* Action Type Chips */}
        {/* <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FiFilter className="text-gray-500 flex-shrink-0" size={12} />
          {[
            { label: 'ALL ACTIONS', val: '' },
            { label: 'PPC CLICKS', val: 'PPC_CLICK_DEDUCTION' },
            { label: 'PAYMENTS', val: 'PAYMENT_COMPLETED' },
            { label: 'LISTING UPDATES', val: 'LISTING_UPDATED' },
          ].map((type) => (
            <button
              key={type.val}
              onClick={() => {
                setActionType(type.val);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-[8px] font-black whitespace-nowrap transition-all border ${
                actionType === type.val
                  ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                  : 'border-gray-200 dark:border-white/10 text-gray-500'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5">Timestamp / Listing IP</th>
                <th className="px-8 py-5">Identity Protocol</th>
                <th className="px-8 py-5">Operation</th>
                <th className="px-8 py-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading && !refreshing ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                        Decrypting Audit Trail...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/1 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black dark:text-gray-300 flex items-center gap-1.5">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 tracking-tighter">
                          {log.ipAddress || 'SYSTEM_INTERNAL'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase dark:text-white tracking-tighter italic">
                          {log.user?.name || 'SYSTEM_AUTO'}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold">
                          {log.user?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-md text-[8px] font-black uppercase border italic ${
                          log.action.includes('PAYMENT')
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : log.action.includes('DEDUCTION')
                              ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}
                      >
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-white hover:bg-orange-600 rounded-xl transition-all shadow-sm"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-24 text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic"
                  >
                    No Audit Records Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/50 dark:bg-white/1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
              Page {currentPage} of {totalPages} — Log Density: {logs.length} / PAGE
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:bg-orange-600 hover:text-white transition-all"
              >
                <FiChevronLeft size={18} />
              </button>

              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  if (
                    pNum === 1 ||
                    pNum === totalPages ||
                    (pNum >= currentPage - 1 && pNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pNum)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                          currentPage === pNum
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  if (pNum === currentPage - 2 || pNum === currentPage + 2)
                    return (
                      <span key={i} className="self-center text-gray-500">
                        ...
                      </span>
                    );
                  return null;
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:bg-orange-600 hover:text-white transition-all"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0c0c0c] w-full max-w-xl rounded-xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                <FiShield className="animate-pulse" /> Security Audit Log
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide">
              {/* 1. Identity & Network */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-white/2 rounded-lg border border-gray-100 dark:border-white/5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Performed By
                  </p>
                  <p className="text-[11px] font-black dark:text-white uppercase">
                    {selectedLog.user?.name || 'System Auto-Task'}
                  </p>
                  <p className="text-[8px] font-bold text-gray-500">
                    {selectedLog.user?.email || 'internal@system.com'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/2 rounded-lg border border-gray-100 dark:border-white/5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Network Source
                  </p>
                  <p className="text-[11px] font-mono font-bold dark:text-orange-500">
                    {selectedLog.ipAddress || 'Internal Loopback'}
                  </p>
                </div>
              </div>

              {/* 2. Target Information (Fixing [object Object] Error) */}
              <div className="p-4 bg-zinc-900 border-l-4 border-orange-600 rounded-r-lg">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Target Architecture
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase block">
                      Node Type
                    </span>
                    <span className="text-[11px] font-black text-white uppercase">
                      {selectedLog.targetType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase block">
                      Node UID
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 break-all">
                      {/* ⚠️ FIX: If targetId is populated (an object), we take the _id string */}
                      {typeof selectedLog.targetId === 'object'
                        ? selectedLog.targetId?._id
                        : selectedLog.targetId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Smart Details Table (Showing all fields) */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiDatabase /> Operation Intelligence
                </p>

                {/* Visual Data Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedLog.details &&
                    Object.entries(selectedLog.details).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 dark:bg-white/2 p-2 rounded border border-white/5"
                      >
                        <p className="text-[8px] font-black text-gray-500 uppercase">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="text-[10px] font-bold dark:text-gray-200">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  {/* Populated Data from targetId (Transaction details) */}
                  {selectedLog.targetType === 'Transaction' && selectedLog.targetId && (
                    <>
                      <div className="bg-orange-500/5 p-2 rounded border border-orange-500/10">
                        <p className="text-[8px] font-black text-orange-500 uppercase">
                          Invoice Ref
                        </p>
                        <p className="text-[10px] font-bold dark:text-white">
                          {selectedLog.targetId.invoiceNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-orange-500/5 p-2 rounded border border-orange-500/10">
                        <p className="text-[8px] font-black text-orange-500 uppercase">
                          VAT Applied
                        </p>
                        <p className="text-[10px] font-bold dark:text-white">
                          €{selectedLog.targetId.vatAmount || 0}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Raw JSON for Debugging */}
                <details className="group border border-white/5 rounded-lg overflow-hidden">
                  <summary className="bg-zinc-950 p-2 text-[9px] font-black text-gray-500 uppercase cursor-pointer hover:text-orange-500 transition-colors">
                    View Raw System Object
                  </summary>
                  <div className="bg-zinc-950 p-4 overflow-x-auto border-t border-white/5">
                    <pre className="text-[9px] font-mono text-green-500/80 leading-relaxed">
                      {JSON.stringify(selectedLog, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </div>

            {/* Footer / Acknowledge Button */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 text-right bg-gray-50/30 flex justify-between items-center">
              <span className="text-[9px] font-bold text-gray-500 italic">
                Log Time: {new Date(selectedLog.createdAt).toLocaleString()}
              </span>
              {/* <button
                onClick={() => setSelectedLog(null)}
                className="px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2"
              >
                <FiShield size={14} /> Acknowledge & Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
