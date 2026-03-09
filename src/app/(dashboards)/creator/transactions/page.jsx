'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiArrowLeft,
  FiDownloadCloud,
} from 'react-icons/fi';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/creator/payments');
      // আপনার ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী (e.g., res.data.transactions)
      setTransactions(res.data.transactions || res.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (transactionId) => {
    const toastId = toast.loading('Generating invoice...');
    try {
      const response = await api.get(`/api/payments/creator/invoice/${transactionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success('Downloaded successfully', { id: toastId });
    } catch (error) {
      toast.error('Invoice download failed', { id: toastId });
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">
            Financial <span className="text-orange-500">Ledger</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
            Transaction node monitoring system
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={14}
            />
            <input
              type="text"
              placeholder="SEARCH NODE..."
              className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 pl-9 pr-4 py-2.5 rounded-md text-[10px] font-bold uppercase outline-none focus:border-orange-500/50 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Protocol Type</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5 text-right">Invoicing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {currentItems.length > 0 ? (
                currentItems.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-bold dark:text-gray-300 uppercase tracking-tight">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-[8px] text-gray-500 font-medium mt-0.5 uppercase tracking-widest">
                        {new Date(tx.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-sm border ${
                          tx.packageType.includes('boost')
                            ? 'bg-purple-500/5 border-purple-500/20 text-purple-500'
                            : 'bg-orange-500/5 border-orange-500/20 text-orange-500'
                        }`}
                      >
                        {tx.packageType}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[9px] font-black uppercase text-green-500 flex items-center gap-1.5 italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Verified
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black dark:text-white italic tracking-wider">
                        {tx.currency?.toUpperCase()} {tx.amountPaid}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => downloadInvoice(tx._id)}
                        className="inline-flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-orange-500 hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 rounded-md transition-all group/btn"
                      >
                        <FiDownloadCloud className="group-hover/btn:translate-y-0.5 transition-transform" />
                        <span className="text-[9px] font-black uppercase hidden md:block">
                          Download PDF
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-20 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 italic"
                  >
                    No matching records found in the ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/2 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
              Displaying {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, transactions.length)}{' '}
              of {transactions.length} Nodes
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 border border-gray-100 dark:border-white/5 rounded-md disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all text-gray-500"
              >
                <FiChevronLeft size={16} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-md text-[10px] font-black transition-all ${
                      currentPage === i + 1
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 border border-gray-100 dark:border-white/5 rounded-md disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all text-gray-500"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 py-8 opacity-40 grayscale">
        <FiFileText size={20} className="text-gray-400" />
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">
          End of Encrypted Transaction Log
        </p>
      </div>
    </div>
  );
}
