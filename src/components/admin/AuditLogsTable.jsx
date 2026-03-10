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
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AuditLogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/api/audit/admin/logs?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      if (data.success) {
        setLogs(data.logs);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      console.error('Audit Log Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // সার্চ করার সময় ইউজার টাইপ করা শেষ করলে এপিআই হিট করার জন্য ডিবান্সিং (Debouncing)
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchLogs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // সার্চ শুরু করলে প্রথম পেজে ফেরত যাবে
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-black italic uppercase tracking-tighter dark:text-white flex items-center gap-2">
            <FiActivity className="text-orange-500" /> Audit{' '}
            <span className="text-orange-500">Intelligence</span>
          </h3>

          <div className="relative w-full md:w-80">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search Action, Identity or IP..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-orange-500 transition-all dark:text-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto min-h-100">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-[10px] font-black uppercase tracking-widest text-gray-500 animate-pulse">
              Syncing Audit Trail...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Timestamp
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Identity
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Action
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Target
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Operation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/1 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold dark:text-gray-300">
                        <FiClock className="text-orange-500" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase dark:text-white">
                          {log.user?.name || 'System'}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold">
                          {log.user?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-tighter border whitespace-nowrap ${
                          log.action.includes('PAYMENT') || log.action.includes('COMPLETED')
                            ? 'bg-green-500/5 text-green-500 border-green-500/10'
                            : 'bg-blue-500/5 text-blue-500 border-blue-500/10'
                        }`}
                      >
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        <FiDatabase className="text-gray-400" />
                        {log.targetType}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-orange-600 hover:text-white rounded-md text-[9px] font-black uppercase transition-all shadow-sm whitespace-nowrap"
                      >
                        <FiEye /> View Data
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30 dark:bg-white/1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
              Showing Page {currentPage} of {totalPages} — Total Records: {logs.length}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2.5 border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-20 hover:bg-orange-600 hover:text-white transition-all text-gray-500"
              >
                <FiChevronLeft size={14} />
              </button>

              {/* Page Numbers Logic with Range & Ellipsis */}
              <div className="flex items-center gap-1.5">
                {(() => {
                  const pages = [];
                  const range = 1; // বর্তমান পেজের আশেপাশে কয়টি নম্বর দেখাবে

                  for (let i = 1; i <= totalPages; i++) {
                    // Logic: প্রথম পেজ, শেষ পেজ, এবং বর্তমান পেজের আশেপাশের range পর্যন্ত নম্বর দেখাবে
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - range && i <= currentPage + range)
                    ) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all border ${
                            currentPage === i
                              ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20'
                              : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-orange-500 hover:text-orange-500'
                          }`}
                        >
                          {String(i).padStart(2, '0')}
                        </button>
                      );
                    }
                    // Ellipsis (...) অ্যাড করার লজিক
                    else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
                      pages.push(
                        <span key={i} className="px-1 text-gray-400 text-[10px] font-black italic">
                          ...
                        </span>
                      );
                    }
                  }
                  return pages;
                })()}
              </div>

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-20 hover:bg-orange-600 hover:text-white transition-all text-gray-500"
              >
                <FiChevronRight size={14} />
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
