'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiActivity, FiStar, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const chartData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 700 },
  { name: 'Mar', users: 600 },
  { name: 'Apr', users: 900 },
  { name: 'May', users: 1100 },
  { name: 'Jun', users: 1500 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, requests: [], listings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, requestsRes, listingsRes] = await Promise.all([
          api.get('/api/admin/users'),
          api.get('/api/admin/creator-requests'),
          api.get('/api/admin/listings'),
        ]);

        setStats({
          users: usersRes.data.length,
          requests: requestsRes.data.slice(0, 5),
          listings: listingsRes.data.length,
        });
      } catch (err) {
        console.error('Dashboard Stats Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🔹 Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* বর্ডার gray-50 বা gray-100 ব্যবহার করে সফট করা হয়েছে */}
        <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Global Citizens
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.users}
            </h3>
            <div className="text-green-500 text-[10px] font-black flex items-center gap-1 mb-1">
              <FiTrendingUp /> +12%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Active Artifacts
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.listings}
            </h3>
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <FiStar size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Pending Protocols
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.requests.length}
            </h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <FiActivity size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Chart Area */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-2xl border border-gray-100 dark:border-white/5 p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest">Platform Growth</h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase">Acquisition Node</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#000"
                  strokeOpacity={0.03}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#A0A0A0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #f8fafc',
                    fontSize: '10px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Task List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Action Required
              </h4>
              <Link
                href="/admin/requests"
                className="text-[9px] font-black text-orange-500 uppercase hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4 flex-1">
              {stats.requests.length > 0 ? (
                stats.requests.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-white/10 border border-gray-100 dark:border-transparent rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm">
                        {req.firstName?.[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase leading-tight">
                          {req.firstName} {req.lastName}
                        </p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                          Creator Request
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/requests`}
                      className="p-2 text-gray-300 group-hover:text-orange-500 transition-colors"
                    >
                      <FiArrowRight size={14} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30 italic text-xs text-gray-400">
                  No pending tasks
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span className="text-gray-400 tracking-widest">System Health</span>
                <span className="text-green-500">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
