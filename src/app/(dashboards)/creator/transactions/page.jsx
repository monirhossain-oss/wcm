'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiDownloadCloud,
  FiRefreshCw,
  FiClock,
  FiFilter,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useLocale } from '@/context/LocaleContext';
import { formatCurrency, intlLocale } from '@/lib/i18n/formatters';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function TransactionsPage() {
  const { locale, t, tf } = useLocale();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Filtering & Search States
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // ডাটা ফেচ করার মেইন ফাংশন
  const fetchTransactions = useCallback(
    async (isForce = false) => {
      try {
        if (isForce) setRefreshing(true);
        else setLoading(true);

        const res = await api.get(`/api/creator/my-transactions`, {
          params: {
            page: currentPage,
            limit: 12,
            filter: filter,
            search: search,
          },
        });

        setTransactions(res.data.transactions || []);
        setPagination(res.data.pagination);

        if (isForce) toast.success(t('creator.transactions.synced'));
      } catch (err) {
        toast.error(t('creator.transactions.syncFailed'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, filter, search, t]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500); // সার্চের জন্য ৫০০এমএস ডিবounce

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTransactions]);

  const downloadInvoice = async (transactionId) => {
    const toastId = toast.loading(t('creator.transactions.generating'));
    try {
      const response = await api.get(`/api/payments/creator/invoice/${transactionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `INV-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t('creator.transactions.downloaded'), { id: toastId });
    } catch (error) {
      toast.error(t('creator.transactions.downloadFailed'), { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans p-4 md:p-0 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">
            {t('creator.transactions.headingLead')}{' '}
            <span className="text-orange-500">{t('creator.transactions.headingAccent')}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 min-w-50">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={14}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('creator.transactions.searchPlaceholder')}
              className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 pl-9 pr-4 py-2.5 rounded-lg text-[10px] font-bold uppercase outline-none focus:border-orange-500/50 w-full transition-all shadow-sm"
            />
          </div>

          {/* Date Filter Tabs */}
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/5">
            {['all', 'today', 'month', 'year'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${
                  filter === f
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                {t(`creator.transactions.filter${f.charAt(0).toUpperCase()}${f.slice(1)}`, f)}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchTransactions(true)}
            className="p-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 rounded-lg hover:text-orange-500 transition-all active:scale-95"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
          </button>
        </div>
      </div>

      {/* Stats Quick View (Optional) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
            {t('creator.transactions.totalEntries')}
          </p>
          <p className="text-xl font-black dark:text-white italic">{pagination.total}</p>
        </div>
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
            {t('creator.transactions.userActivity')}
          </p>
          <p className="text-xl font-black text-emerald-500 italic">
            {t('creator.transactions.online')}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5">{t('creator.transactions.columnVerification')}</th>
                <th className="px-8 py-5">{t('creator.transactions.columnProtocol')}</th>
                <th className="px-8 py-5">{t('creator.transactions.columnValue')}</th>
                <th className="px-8 py-5">{t('creator.transactions.columnStatus')}</th>
                <th className="px-8 py-5 text-right">
                  {t('creator.transactions.columnInvoicing')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading && !refreshing ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {t('creator.transactions.decrypting')}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/20 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                          <FiClock className="text-orange-500" size={12} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black dark:text-gray-200 uppercase tracking-tight">
                            {new Date(tx.createdAt).toLocaleDateString(intlLocale(locale), {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">
                            {new Date(tx.createdAt).toLocaleTimeString(intlLocale(locale), {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                          tx.packageType.includes('boost')
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                            : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                        }`}
                      >
                        {t(`creator.packageType.${tx.packageType}`, tx.packageType)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black dark:text-white italic">
                        {formatCurrency(tx.amountPaid, locale, tx.currency)}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t('creator.transactions.syncComplete')}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => downloadInvoice(tx._id)}
                        className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500 rounded-xl transition-all"
                      >
                        <FiDownloadCloud size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-20 text-center text-[10px] uppercase font-bold text-gray-500 italic tracking-[0.2em]"
                  >
                    {t('creator.transactions.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {pagination.pages > 1 && (
          <div className="px-8 py-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/50 dark:bg-white/1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
              {tf('creator.common.pageOf', { page: pagination.page, pages: pagination.pages })}{' '}
              <span className="mx-2">|</span>{' '}
              {tf('creator.transactions.totalRecords', { total: pagination.total })}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <FiChevronLeft size={18} className="text-gray-500" />
              </button>

              <div className="flex gap-1">
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  // শুধু প্রথম, শেষ এবং বর্তমান পেজের আসেপশে বাটন দেখানোর লজিক
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:border-orange-500/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={i} className="px-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-20 hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <FiChevronRight size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
