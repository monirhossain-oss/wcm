'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiDownload,
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX,
  FiCheckCircle,
  FiActivity,
  FiRefreshCw,
  FiClock,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

const CACHE_KEY = 'wcm_tx_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // all, today, month, year
  const limit = 10;

  const fetchTransactions = useCallback(
    async (isForce = false) => {
      try {
        // ১. ক্যাশ চেক (যদি ফোর্স রিফ্রেশ না হয় এবং ডিফল্ট স্টেটে থাকে)
        if (!isForce && currentPage === 1 && searchTerm === '' && timeFilter === 'all') {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { data, pages, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
              setTransactions(data);
              setTotalPages(pages);
              setLastSynced(timestamp);
              setLoading(false);
              return;
            }
          }
        }

        if (isForce) setRefreshing(true);
        else setLoading(true);

        const { data } = await api.get(`/api/admin/transactions`, {
          params: {
            page: currentPage,
            limit,
            search: searchTerm,
            filter: timeFilter,
          },
        });

        if (data.success) {
          setTransactions(data.transactions);
          setTotalPages(data.totalPages);
          setLastSynced(Date.now());

          // ২. লোকাল স্টোরেজ আপডেট (শুধুমাত্র জেনারেল ডাটার জন্য)
          if (currentPage === 1 && searchTerm === '' && timeFilter === 'all') {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                data: data.transactions,
                pages: data.totalPages,
                timestamp: Date.now(),
              })
            );
          }
          if (isForce) toast.success('Data Synchronized');
        }
      } catch (err) {
        toast.error('Sync failed');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, searchTerm, timeFilter]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTransactions();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchTransactions]);

  const handleFullExport = async () => {
    const isConfirmed = window.confirm('This is resource-intensive. Proceed?');
    if (!isConfirmed) return;
    try {
      setExporting(true);
      const response = await api.get('/api/admin/export-transactions', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `WCM_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report Downloaded');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
            Revenue <span className="text-orange-500">Ledger</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <FiClock className="text-orange-500" size={10} />
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Last Sync: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search Invoice/Creator..."
              className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-orange-500 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Time Filter Tabs */}
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            {['all', 'today', 'month', 'year'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setTimeFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                  timeFilter === f
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Force Refresh */}
          <button
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
            className="p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
          </button>

          <button
            onClick={handleFullExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-lg shadow-orange-600/20"
          >
            {exporting ? '...' : <FiDownload size={16} />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Invoice/Date
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Creator
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Type
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Amount</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Audit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading && !refreshing ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] font-black text-gray-500 animate-pulse uppercase tracking-[0.3em]"
                  >
                    Syncing Core...
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-black dark:text-white mb-0.5 uppercase tracking-tighter italic">
                        {tx.invoiceNumber}
                      </div>
                      <div className="text-[9px] text-gray-500 font-bold flex items-center gap-1">
                        <FiCalendar size={10} className="text-orange-500" />{' '}
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-black dark:text-white uppercase">
                        {tx.creatorName}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold lowercase">
                        {tx.creatorEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-orange-500/5 text-orange-500 border border-orange-500/10 rounded text-[8px] font-black uppercase italic">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[11px] font-black dark:text-white tracking-tighter">
                        {tx.currency} {(tx.amount || 0).toFixed(2)}
                      </div>
                      <div className="text-[9px] font-bold text-green-500 italic">
                        Net: €{(tx.amountInEUR || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="p-2 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-orange-500 rounded-lg transition-all"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/30 dark:bg-white/1">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
            Page {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 border dark:border-white/10 rounded-lg disabled:opacity-20"
            >
              <FiChevronLeft />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-orange-500'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 border dark:border-white/10 rounded-lg disabled:opacity-20"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-6 text-center bg-gray-50/50 dark:bg-white/2 relative">
              <button
                onClick={() => setSelectedTx(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest dark:text-white italic">
                Internal Receipt
              </h3>
              <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">
                {selectedTx.invoiceNumber}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="border-y border-dashed border-gray-200 dark:border-white/10 py-5 space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-500 uppercase">Gross Amount</span>
                  <span className="font-black dark:text-white">
                    {(selectedTx.amount || 0).toFixed(2)} {selectedTx.currency}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-500 uppercase">VAT (19%)</span>
                  <span className="font-black text-red-500">
                    - €{(selectedTx.vatAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase text-orange-500 tracking-tighter">
                    Net System Profit
                  </span>
                  <span className="text-xl font-black text-green-500">
                    €{(selectedTx.amountInEUR || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl space-y-2 border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase flex items-center gap-1">
                  <FiActivity className="text-orange-500" /> Stripe Trace
                </p>
                <p className="text-[9px] font-mono text-gray-400 break-all">
                  {selectedTx.stripeId}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
