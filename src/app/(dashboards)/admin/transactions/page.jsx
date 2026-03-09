'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiDollarSign,
  FiDownload,
  FiSearch,
  FiCalendar,
  FiHash,
  FiUser,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX,
  FiCheckCircle,
  FiActivity,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/admin/transactions?page=${currentPage}&limit=${limit}`);
      if (data.success) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // ১. Bulk Export (Full Data)
  const handleFullExport = async () => {
    try {
      setExporting(true);
      const response = await api.get('/api/admin/export-transactions', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Drakilo_Full_Report_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      toast.success('Full Excel Report Downloaded');
    } catch (err) {
      toast.error('Bulk export failed');
    } finally {
      setExporting(false);
    }
  };

  // ২. Individual Export (Single Receipt) - Client Side Generation logic or call specific API if exists
  const handleIndividualExport = (tx) => {
    toast.success(`Exporting Invoice: ${tx.invoiceNumber}`);
    // এখানে আপনি চাইলে নির্দিষ্ট একটা ট্রানজেকশনের জন্য আলাদা এপিআই কল করতে পারেন
    // অথবা এই ডাটা দিয়ে Client-side PDF তৈরি করতে পারেন।
  };

  const filteredData = transactions.filter(
    (tx) =>
      tx.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
            Revenue <span className="text-orange-500">Ledger</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Financial Audit Control Panel
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search Invoice/Creator..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-orange-500 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleFullExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all"
          >
            {exporting ? (
              'Processing...'
            ) : (
              <>
                <FiDownload /> Full Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Invoice/Date
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Creator Details
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Package
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Amount (Gross)
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] font-black text-gray-500 animate-pulse"
                  >
                    Syncing Streams...
                  </td>
                </tr>
              ) : (
                filteredData.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/1 transition-all group"
                  >
                    <td className="p-4">
                      <div className="text-[10px] font-black dark:text-white mb-1 uppercase tracking-tighter italic">
                        {tx.invoiceNumber}
                      </div>
                      <div className="text-[9px] text-gray-500 font-bold flex items-center gap-1">
                        <FiCalendar /> {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[11px] font-black dark:text-white uppercase">
                        {tx.creatorName}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold lowercase">
                        {tx.creatorEmail}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-orange-500/5 text-orange-500 border border-orange-500/10 rounded text-[8px] font-black uppercase tracking-widest">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-xs font-black dark:text-white tracking-tighter">
                        {tx.currency} {tx.amount.toFixed(2)}
                      </div>
                      <div className="text-[9px] font-bold text-green-500">
                        Net: €{tx.amountInEUR.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="p-2 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-orange-500 rounded-lg transition-all"
                      >
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30 dark:bg-white/1">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
            Showing Page {currentPage} of {totalPages} — Total Records: {transactions.length}
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

            {/* Page Numbers Logic */}
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
                  } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
                    // Ellipsis (...) এড করা
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
      </div>

      {/* Detail Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-6 text-center bg-gray-50/50 dark:bg-white/2 relative">
              <button
                onClick={() => setSelectedTx(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white italic">
                Payment Receipt
              </h3>
              <p className="text-[10px] font-mono text-gray-500 mt-1">{selectedTx.invoiceNumber}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="font-black text-gray-400 uppercase tracking-widest mb-1">Creator</p>
                  <p className="font-bold dark:text-white uppercase">{selectedTx.creatorName}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-400 uppercase tracking-widest mb-1">Listing</p>
                  <p className="font-bold dark:text-white truncate">{selectedTx.listingTitle}</p>
                </div>
              </div>

              <div className="border-y border-dashed border-gray-200 dark:border-white/10 py-4 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-500">
                    Gross Amount ({selectedTx.currency})
                  </span>
                  <span className="font-black dark:text-white">{selectedTx.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-500">VAT (19%)</span>
                  <span className="font-black text-red-500">
                    - €{selectedTx.vatAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[10px] font-black uppercase text-orange-500">
                    Net Internal Value
                  </span>
                  <span className="text-xl font-black text-green-500">
                    €{selectedTx.amountInEUR.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl space-y-2 border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase flex items-center gap-1">
                  <FiActivity /> Network Trace
                </p>
                <p className="text-[9px] font-mono text-gray-400 break-all">
                  {selectedTx.stripeId}
                </p>
              </div>

              <button
                onClick={() => handleIndividualExport(selectedTx)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-600/20"
              >
                Download Individual Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
