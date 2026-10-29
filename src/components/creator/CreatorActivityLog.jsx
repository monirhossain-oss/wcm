'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCheckCircle, FiZap, FiDollarSign, FiInfo } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/api/audit/creator/logs');
        if (data.success) setLogs(data.logs);
      } catch (err) {
        console.error('Creator Activity Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        Loading your activity history...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-black italic uppercase tracking-tighter dark:text-white flex items-center gap-2">
          <FiClock className="text-orange-500" /> Recent{' '}
          <span className="text-orange-500">Activities</span>
        </h3>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
          Your system interaction logs
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {logs.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-500 italic">
            No recent activities found.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-white/1 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Icon based on Action */}
                <div
                  className={`mt-1 p-2 rounded-lg ${
                    log.action.includes('PURCHASED')
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {log.action.includes('PURCHASED') ? (
                    <FiDollarSign size={16} />
                  ) : (
                    <FiZap size={16} />
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight dark:text-white">
                    {log.details?.message || log.action.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                      <FiClock size={10} /> {new Date(log.createdAt).toLocaleString()}
                    </span>
                    {log.details?.amountPaid && (
                      <span className="text-[9px] font-black text-orange-500 uppercase bg-orange-500/5 px-2 py-0.5 rounded">
                        {log.details.amountPaid}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block text-right">
                <span className="text-[8px] font-black uppercase px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-gray-500 tracking-widest">
                  ID: {log._id.toString().slice(-6)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
            Showing last 50 actions for security audit
          </p>
        </div>
      )}
    </div>
  );
}
