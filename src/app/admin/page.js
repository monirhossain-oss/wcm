'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUsers,
  FiArrowUpRight,
  FiActivity,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiDatabase,
  FiShield,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
} from 'recharts';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const chartData = [
  { name: 'Jan', users: 400, requests: 240 },
  { name: 'Feb', users: 700, requests: 300 },
  { name: 'Mar', users: 600, requests: 500 },
  { name: 'Apr', users: 900, requests: 400 },
  { name: 'May', users: 1100, requests: 580 },
  { name: 'Jun', users: 1500, requests: 700 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, requests: 0, listings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await api.get('/api/admin/users');
        const requests = await api.get('/api/admin/creator-requests');
        setStats({
          users: users.data.length,
          requests: requests.data.length,
          listings: 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[2.5rem] border border-ui shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group hover:border-orange-500 transition-all relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full group-hover:bg-orange-500/10 transition-all" />
      <div className="flex items-start justify-between relative z-10">
        <div className="p-4 rounded-2xl bg-ui text-black dark:text-white group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
          <Icon size={24} />
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-success text-[10px] font-black">
            <FiTrendingUp /> {trend}%
          </div>
          <FiArrowUpRight className="text-gray-300 group-hover:text-orange-500 mt-1" />
        </div>
      </div>
      <div className="mt-8 relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-4xl font-black mt-2 tracking-tighter italic">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🔹 Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111] p-6 rounded-4xl border border-ui">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">System Analytics</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            Real-time platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> Live Server Status
          </div>
        </div>
      </div>

      {/* 🔹 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.users} icon={FiUsers} trend="12.5" />
        <StatCard title="Creator Requests" value={stats.requests} icon={FiActivity} trend="5.2" />
        <StatCard title="Active Listings" value={stats.listings} icon={FiStar} trend="0.0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🔹 System Overview with Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111] rounded-[3rem] border border-ui p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter italic">
                Growth Overview
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Monthly user acquisition & requests
              </p>
            </div>
            <select className="bg-ui px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="h-63.5 w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#888888"
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#888' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#f97316"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Right Column Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black dark:bg-white p-8 rounded-[3rem] text-white dark:text-black shadow-xl shadow-orange-500/10 group">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="text-orange-500" size={20} />
              <h4 className="font-black text-xs uppercase tracking-widest">Admin Security</h4>
            </div>
            <p className="text-xs font-medium opacity-70 leading-relaxed mb-6">
              Platform status is{' '}
              <span className="text-orange-500 font-bold uppercase">Optimal</span>. All security
              protocols are active.
            </p>
            <button className="w-full py-4 bg-orange-500 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-orange-600 transition-all text-white">
              Security Audit
            </button>
          </div>

          <div className="bg-white dark:bg-[#111] p-8 rounded-[3rem] border border-ui shadow-sm">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <FiZap className="text-orange-500" /> Quick Actions
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <button className="group flex items-center justify-between p-5 bg-ui rounded-2xl transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  <FiDatabase size={16} /> Backup System
                </span>
                <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="group flex items-center justify-between p-5 bg-ui rounded-2xl transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  <FiActivity size={16} /> Server Logs
                </span>
                <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
