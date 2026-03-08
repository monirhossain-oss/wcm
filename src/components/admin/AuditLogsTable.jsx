'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiActivity, FiUser, FiClock, FiSearch, FiInfo } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function AuditLogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/api/audit/admin/logs');
        if (data.success) setLogs(data.logs);
      } catch (err) {
        console.error('Audit Log Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center py-10 text-xs font-black uppercase tracking-widest text-gray-500">
        Syncing Audit Trail...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-black italic uppercase tracking-tighter dark:text-white flex items-center gap-2">
          <FiActivity className="text-orange-500" /> Audit{' '}
          <span className="text-orange-500">Intelligence</span>
        </h3>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by User or Action..."
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-[10px] font-bold focus:outline-none focus:border-orange-500 transition-all dark:text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Timestamp
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                User / Identity
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Action Type
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Details
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredLogs.map((log) => (
              <tr
                key={log._id}
                className="hover:bg-gray-50 dark:hover:bg-white/1 transition-colors"
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
                    className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${
                      log.action.includes('PURCHASED')
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4 max-w-xs">
                  <div className="flex items-start gap-2">
                    <FiInfo className="mt-1 text-gray-400 shrink-0" size={12} />
                    <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-tight">
                      {log.details?.message || `Action on ${log.targetType}`}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-[9px] font-mono text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                    {log.ipAddress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
