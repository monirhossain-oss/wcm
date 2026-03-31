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
  FiRefreshCw,
  FiClock,
  FiFilter,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [userIdFilter, setUserIdFilter] = useState('');

  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const limit = 10;

  const fetchTransactions = useCallback(
    async (isForce = false) => {
      try {
        if (isForce) setRefreshing(true);
        else setLoading(true);

        const { data } = await api.get(`/api/admin/transactions`, {
          params: {
            page: currentPage,
            limit,
            search: searchTerm,
            filter: timeFilter,
            userId: userIdFilter,
          },
        });

        if (data.success) {
          setTransactions(data.transactions);
          setTotalPages(data.pagination.totalPages || 1);
          setLastSynced(Date.now());
          if (isForce) toast.success('Sync Complete');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Connection Error');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, searchTerm, timeFilter, userIdFilter]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchTransactions(), 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchTransactions]);

  const handleRangeExport = async () => {
    if (!dateRange.start || !dateRange.end) return toast.error('Select Range');
    try {
      setExporting(true);
      const response = await api.get('/api/admin/export-transactions-range', {
        params: { startDate: dateRange.start, endDate: dateRange.end, userId: userIdFilter },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${dateRange.start}_to_${dateRange.end}.xlsx`);
      link.click();
      setShowExportModal(false);
      toast.success('Excel Generated');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <Toaster />

      {/* --- Header --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
            Revenue <span className="text-orange-500">Ledger</span>
          </h2>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-1">
            <FiClock className="text-orange-500" /> Last Sync:{' '}
            {lastSynced ? new Date(lastSynced).toLocaleTimeString() : '---'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search Invoice/User/Email..."
              className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold dark:text-white focus:outline-none focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
          >
            <FiCalendar size={14} /> Range Export
          </button>
          <button
            onClick={() => fetchTransactions(true)}
            className="p-2.5 bg-white dark:bg-white/5 border dark:border-white/10 rounded-xl hover:text-orange-500"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border dark:border-white/10">
          {['all', 'today', 'month', 'year'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setTimeFilter(f);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeFilter === f ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-orange-500'}`}
            >
              {f}
            </button>
          ))}
        </div>
        {userIdFilter && (
          <button
            onClick={() => setUserIdFilter('')}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg text-[9px] font-black uppercase"
          >
            <FiUser size={12} /> Filtered User <FiX />
          </button>
        )}
      </div>

      {/* --- Table --- */}
      <div className="bg-white dark:bg-[#0c0c0c] border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b dark:border-white/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Invoice/Date
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Creator Details
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Package
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Amount</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Audit
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5">
              {loading && !refreshing ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] font-black text-gray-500 animate-pulse uppercase tracking-[0.2em]"
                  >
                    Processing Request...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] font-black text-gray-400 uppercase"
                  >
                    No Protocol Data Found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-black dark:text-white uppercase italic">
                        {tx.invoiceNumber || 'N/A'}
                      </div>
                      <div className="text-[9px] text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                        <FiCalendar size={10} className="text-orange-500" />{' '}
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-black dark:text-white uppercase flex items-center gap-2">
                        {tx.creator?.firstName} {tx.creator?.lastName}
                        <button
                          onClick={() => setUserIdFilter(tx.creator?._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-orange-500/10 text-orange-500 rounded transition-all"
                        >
                          <FiFilter size={10} />
                        </button>
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold">{tx.creator?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-orange-500/5 text-orange-500 border border-orange-500/10 rounded text-[8px] font-black uppercase italic">
                        {tx.packageType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[11px] font-black dark:text-white">
                        {(tx.currency || 'EUR').toUpperCase()} {tx.amountPaid}
                      </div>
                      <div className="text-[9px] font-bold text-green-500 italic">
                        Net: €{tx.amountInEUR}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="p-2 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-orange-500 rounded-lg"
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

        {/* --- Pagination --- */}
        <div className="px-6 py-4 border-t dark:border-white/10 flex justify-between items-center bg-gray-50/30 dark:bg-white/1">
          <p className="text-[9px] font-black text-gray-500 uppercase italic">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border dark:border-white/10 rounded-lg disabled:opacity-20"
            >
              <FiChevronLeft />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border dark:border-white/10 rounded-lg disabled:opacity-20"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* --- Detail Sidebar (All Dynamic) --- */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#0c0c0c] h-full rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 bg-orange-600 flex justify-between items-center">
              <h3 className="text-white font-black uppercase italic tracking-tighter">
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-white hover:rotate-90 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              <div className="text-center">
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                  Total Paid
                </p>
                <h1 className="text-4xl font-black dark:text-white tracking-tighter italic">
                  {(selectedTx.currency || 'EUR').toUpperCase()} {selectedTx.amountPaid}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t dark:border-white/5">
                <DetailItem
                  label="Status"
                  value={selectedTx.status}
                  icon={
                    selectedTx.status === 'completed' ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiAlertCircle className="text-orange-500" />
                    )
                  }
                />
                <DetailItem label="Invoice No" value={selectedTx.invoiceNumber || 'N/A'} />
                <div className="col-span-2">
                  <DetailItem
                    label="Stripe ID"
                    value={selectedTx.stripeSessionId || 'Manual/N/A'}
                    isMono
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t dark:border-white/5">
                <SummaryRow label="VAT Amount" value={`€${selectedTx.vatAmount || 0}`} />
                <SummaryRow
                  label="Exchange Rate"
                  value={`1 ${selectedTx.currency} = ${selectedTx.fxRate} EUR`}
                />
                <div className="pt-4 border-t border-dashed dark:border-white/10 flex justify-between items-center">
                  <p className="text-[10px] font-black text-orange-500 uppercase">Revenue (EUR)</p>
                  <p className="text-2xl font-black dark:text-white italic">
                    €{selectedTx.amountInEUR}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Range Export Modal --- */}
      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c0c0c] rounded-3xl p-8 border border-white/10 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase italic dark:text-white">
                Date <span className="text-orange-500">Range</span>
              </h3>
              <button onClick={() => setShowExportModal(false)} className="dark:text-white">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full bg-gray-100 dark:bg-white/5 p-3 rounded-xl dark:text-white font-bold"
                onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
              />
              <input
                type="date"
                className="w-full bg-gray-100 dark:bg-white/5 p-3 rounded-xl dark:text-white font-bold"
                onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
              />
              <button
                onClick={handleRangeExport}
                disabled={exporting}
                className="w-full bg-orange-600 text-white font-black uppercase py-4 rounded-xl hover:bg-zinc-900 transition-all flex justify-center items-center gap-2"
              >
                {exporting ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
                {exporting ? 'Generating...' : 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
const DetailItem = ({ label, value, icon, isMono }) => (
  <div>
    <p className="text-[8px] text-gray-400 font-black uppercase mb-1">{label}</p>
    <div
      className={`text-[11px] font-bold dark:text-white flex items-center gap-1 ${isMono ? 'font-mono break-all opacity-70' : ''}`}
    >
      {icon} {value}
    </div>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <p className="text-[10px] font-black text-gray-500 uppercase">{label}</p>
    <p className="text-[11px] font-bold dark:text-white">{value}</p>
  </div>
);
