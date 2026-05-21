'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiDatabase,
  FiDownloadCloud,
  FiTrash2,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiHardDrive,
  FiCheckCircle,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function DatabaseBackupPage() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/database/backups');
      setBackups(res.data);
    } catch (err) {
      toast.error('Failed to load backup files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setActionLoading(true);
    const toastId = toast.loading('Generating timestamped database snapshot...');
    try {
      const res = await api.post('/api/admin/database/backup');
      if (res.data.success) {
        toast.success('Backup generated successfully!', { id: toastId });
        fetchBackups();
      }
    } catch (err) {
      toast.error('Backup pipeline failed', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBackup = async (fileName) => {
    if (!confirm('Are you sure you want to permanently delete this backup?')) return;
    try {
      const res = await api.delete(`/api/admin/database/backups/${fileName}`);
      if (res.data.success) {
        toast.success('File deleted successfully');
        fetchBackups();
      }
    } catch (err) {
      toast.error('Failed to delete backup file');
    }
  };

  const handleRestoreBackup = async (e) => {
    e.preventDefault();
    if (confirmText !== 'MERGE') return toast.error('Signature code mismatch');

    setShowModal(false);
    setActionLoading(true);
    const toastId = toast.loading('Merging backup data with current database state...', {
      duration: 60000,
    });

    try {
      const res = await api.post(
        '/api/admin/database/restore',
        { fileName: selectedFile },
        { timeout: 300000 }
      );
      if (res.data.success) {
        toast.success('Database content safely merged with zero data loss!', { id: toastId });
        setConfirmText('');
      }
    } catch (err) {
      console.error('Full Restore Error Context: ', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Restoration data sync broken.', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 min-h-screen">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Database <span className="text-orange-500">Backups</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Safe Merge & Cron Sync Center
          </p>
        </div>
        <button
          type="button"
          disabled={actionLoading}
          onClick={handleCreateBackup}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {actionLoading ? <FiRefreshCw className="animate-spin" /> : <FiDownloadCloud size={16} />}
          Backup Now
        </button>
      </div>

      {/* Backups Table / Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FiRefreshCw className="animate-spin text-orange-500" size={32} />
        </div>
      ) : backups.length === 0 ? (
        <div className="border border-dashed dark:border-white/10 p-12 text-center rounded-xl text-gray-400 text-xs font-bold uppercase tracking-wider">
          No historical backups recorded yet.
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-white/10 text-[10px] font-black uppercase text-gray-400 tracking-wider bg-gray-100/50 dark:bg-white/5">
                  <th className="p-4 whitespace-nowrap">Backup File Target</th>
                  <th className="p-4 whitespace-nowrap">Generated At</th>
                  <th className="p-4 whitespace-nowrap">File Size</th>
                  <th className="p-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 text-xs font-medium">
                {backups.map((file) => (
                  <tr
                    key={file.fileName}
                    className="hover:bg-gray-100/30 dark:hover:bg-white/5 transition-all"
                  >
                    <td className="p-4 font-mono font-bold text-orange-500 flex items-center gap-2">
                      <FiDatabase size={14} className="opacity-60" /> {file.fileName}
                    </td>
                    <td className="p-4 text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <FiClock /> {new Date(file.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <FiHardDrive /> {file.size}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedFile(file.fileName);
                          setShowModal(true);
                        }}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded font-bold text-[10px] uppercase tracking-wider transition-all"
                      >
                        Safe Restore (Merge)
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(file.fileName)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all rounded hover:bg-red-500/10"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-500 mb-4">
              <FiAlertTriangle size={24} />
              <h3 className="font-black uppercase tracking-tight text-md">
                Safe-Merge Data Restore
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              You are restoring from{' '}
              <span className="font-mono text-orange-500 font-bold">{selectedFile}</span>. This
              process will **not delete** newer data. It will only import missing historical data
              back into your current cluster collections.
            </p>
            <form onSubmit={handleRestoreBackup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Type <span className="text-emerald-500 font-mono font-bold">MERGE</span> to
                  execute
                </label>
                <input
                  required
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type MERGE..."
                  className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 px-4 py-2.5 text-xs font-bold rounded-md outline-none focus:border-emerald-500 transition-all uppercase tracking-widest"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setConfirmText('');
                  }}
                  className="flex-1 py-2 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirmText !== 'MERGE'}
                  className="flex-1 py-2 bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-xs uppercase tracking-widest rounded-md transition-all"
                >
                  Confirm Merge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
