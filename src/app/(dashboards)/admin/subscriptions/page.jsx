'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import {
  FiSearch,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiCalendar,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
  FiDownload,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// 🔔 CUSTOM TOAST COMPONENT
// ============================================
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <FiCheckCircle size={20} className="text-green-500" />,
    error: <FiX size={20} className="text-red-500" />,
    warning: <FiAlertTriangle size={20} className="text-orange-500" />,
    info: <FiMail size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    warning:
      'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg min-w-[300px] ${bgColors[type]}`}
      >
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ============================================
// 🔔 CUSTOM CONFIRM MODAL
// ============================================
const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const colors = {
    warning: 'text-orange-500',
    danger: 'text-red-500',
    info: 'text-blue-500',
    success: 'text-green-500',
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
            <FiAlertTriangle size={28} className={colors[type]} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSubscriptions = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [exporting, setExporting] = useState(false);

  // 🔔 Toast State
  const [toastData, setToastData] = useState(null);

  // 🔔 Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning',
    confirmText: 'Yes',
  });

  const showToast = (message, type = 'success') => setToastData({ message, type });
  const hideToast = () => setToastData(null);

  const showConfirm = ({ title, message, onConfirm, type = 'warning', confirmText = 'Yes' }) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type, confirmText });
  };

  const hideConfirm = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/emails', {
        params: { page, limit, search, sort: '-createdAt' },
      });
      const result = response.data;
      setEmails(result.emails || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalEmails(result.pagination?.total || 0);
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Your token is invalid or has expired. Please login again.', 'error');
      } else {
        showToast('Failed to load subscribers', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmails();
  };

  const handleDelete = (emailId, emailAddress) => {
    showConfirm({
      title: 'Delete Subscriber?',
      message: `Are you sure you want to delete ${emailAddress}? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Yes, Delete',
      onConfirm: async () => {
        hideConfirm();
        try {
          await api.delete(`/api/emails/${emailId}`);
          showToast('Subscriber deleted successfully!', 'success');
          fetchEmails();
        } catch (error) {
          showToast(error.response?.data?.message || 'Failed to delete subscriber', 'error');
        }
      },
    });
  };

  const handleDeleteAll = () => {
    showConfirm({
      title: 'Delete All Subscribers?',
      message: `Are you sure you want to delete all ${totalEmails} subscribers? This action cannot be undone!`,
      type: 'danger',
      confirmText: 'Yes, Delete All',
      onConfirm: async () => {
        hideConfirm();
        try {
          await api.delete('/api/emails');
          showToast('All subscribers deleted successfully!', 'success');
          setPage(1);
          fetchEmails();
        } catch (error) {
          showToast(error.response?.data?.message || 'Failed to delete all subscribers', 'error');
        }
      },
    });
  };

  // ============================================
  // 📥 EXCEL EXPORT — fetches ALL subscribers
  // ============================================
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Fetch all subscribers (no pagination limit)
      const response = await api.get('/api/emails', {
        params: { page: 1, limit: totalEmails || 99999, search: '', sort: '-createdAt' },
      });

      const allEmails = response.data.emails || [];

      if (allEmails.length === 0) {
        showToast('No subscribers to export', 'warning');
        return;
      }

      // Build workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Admin Panel';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('Subscribers', {
        pageSetup: { paperSize: 9, orientation: 'portrait' },
      });

      // ── Column definitions ──
      sheet.columns = [
        { key: 'sl', width: 8 },
        { key: 'email', width: 40 },
        { key: 'joinedAt', width: 22 },
      ];

      // ── Title row ──
      sheet.mergeCells('A1:C1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = 'Newsletter Subscribers';
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEA580C' } }; // orange-600
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getRow(1).height = 32;

      // ── Meta row ──
      sheet.mergeCells('A2:C2');
      const metaCell = sheet.getCell('A2');
      metaCell.value = `Exported on ${new Date().toLocaleString('en-US')}  |  Total: ${allEmails.length}`;
      metaCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF6B7280' } };
      metaCell.alignment = { horizontal: 'center', vertical: 'middle' };
      metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7ED' } }; // orange-50
      sheet.getRow(2).height = 18;

      // ── Header row ──
      const headerRow = sheet.getRow(3);
      headerRow.values = ['#', 'Email Address', 'Joined Date'];
      headerRow.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }; // gray-800
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFEA580C' } },
        };
      });
      headerRow.height = 24;

      // ── Data rows ──
      allEmails.forEach((item, index) => {
        const row = sheet.addRow({
          sl: index + 1,
          email: item.email?.toLowerCase(),
          joinedAt: new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        });

        const isEven = index % 2 === 0;
        row.eachCell((cell) => {
          cell.font = { name: 'Arial', size: 10 };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFFFF7ED' }, // white / orange-50
          };
          cell.alignment = { vertical: 'middle', horizontal: cell.col === 1 ? 'center' : 'left' };
          cell.border = {
            bottom: { style: 'hair', color: { argb: 'FFFDE8D8' } },
          };
        });
        row.height = 20;
      });

      // ── Total footer row ──
      const totalRow = sheet.addRow({
        sl: '',
        email: `Total Subscribers: ${allEmails.length}`,
        joinedAt: '',
      });
      sheet.mergeCells(`B${totalRow.number}:C${totalRow.number}`);
      totalRow.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFEA580C' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7ED' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFEA580C' } },
        };
      });
      totalRow.height = 22;

      // ── Freeze header rows ──
      sheet.views = [{ state: 'frozen', ySplit: 3 }];

      // ── Download ──
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      showToast(`${allEmails.length} subscribers exported successfully!`, 'success');
    } catch (error) {
      showToast('Failed to export subscribers', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      {/* 🔔 TOAST */}
      {toastData && <Toast message={toastData.message} type={toastData.type} onClose={hideToast} />}

      {/* 🔔 CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        onConfirm={() => {
          if (confirmModal.onConfirm) confirmModal.onConfirm();
        }}
        onCancel={hideConfirm}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-orange-500">
            Newsletter <span className="dark:text-white text-black">Subscriptions</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Manage subscriber emails and newsletter data
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Total Count */}
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Total: <span className="text-orange-500">{totalEmails}</span>
          </span>

          {/* Export Excel Button */}
          {totalEmails > 0 && (
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all shadow-md text-[10px] font-black uppercase tracking-widest"
            >
              {exporting ? (
                <FiLoader size={14} className="animate-spin" />
              ) : (
                <FiDownload size={14} />
              )}
              {exporting ? 'Exporting...' : 'Export Excel'}
            </button>
          )}

          {/* Delete All Button */}
          {totalEmails > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all shadow-md text-[10px] font-black uppercase tracking-widest"
            >
              <FiTrash2 size={14} /> Delete All
            </button>
          )}
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 dark:bg-white/20 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-orange-500 transition-all dark:text-white w-full md:w-64 lowercase"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all shadow-md shadow-orange-500/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <FiSearch size={14} /> Search
        </button>
      </form>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        {/* Header Row */}
        <div className="grid grid-cols-12 bg-gray-50/50 dark:bg-white/20 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
          <div className="col-span-1">#</div>
          <div className="col-span-7 flex items-center gap-2">
            <FiMail size={12} /> Email Address
          </div>
          <div className="col-span-3 text-right flex items-center justify-end gap-2">
            <FiCalendar size={12} /> Joined Date
          </div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-white/5">
          {loading ? (
            <div className="p-20 flex justify-center">
              <FiLoader className="animate-spin text-orange-500" size={30} />
            </div>
          ) : emails.length > 0 ? (
            emails.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-white/10 transition-all"
              >
                <div className="col-span-1 text-[10px] font-bold text-gray-400">
                  {(page - 1) * limit + index + 1}
                </div>
                <div className="col-span-7 flex items-center gap-3">
                  <FiMail className="text-orange-500 opacity-50" size={14} />
                  <span className="text-[10px] font-black tracking-widest dark:text-white lowercase">
                    {item.email?.toLowerCase()}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleDelete(item._id, item.email)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-all"
                    title="Delete Subscriber"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-50">
              No subscribers found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/20">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Page <span className="text-orange-500 font-bold">{page}</span> of{' '}
            <span className="text-orange-500">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft className="dark:text-white" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-md border dark:border-white/10 disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
