'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiUsers, FiBox, FiClock, FiTrendingUp, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  const metricCards = [
    {
      label: 'Total Users',
      value: stats.users,
      icon: FiUsers,
      color: 'bg-red-800', 
      trend: '+12%',
    },
    {
      label: 'Popular Artifacts',
      value: stats.listings,
      icon: FiBox,
      color: 'bg-orange-500', 
      trend: '+5%',
    },
    {
      label: 'Active Requests',
      value: stats.requests.length,
      icon: FiClock,
      color: 'bg-orange-600', 
      trend: 'Pending',
    },
    {
      label: 'System Health',
      value: '98%',
      icon: FiCheckCircle,
      color: 'bg-purple-900',
      trend: 'Optimal',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="w-full bg-linear-to-r from-purple-900 to-pink-800 p-8 rounded-xl text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold">Welcome, Admin!</h2>
        <p className="text-sm opacity-80 mt-1 italic">
          Here's a quick overview of your system's performance and recent activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`${card.color} p-5 rounded-xl text-white shadow-md relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">
                {card.label}
              </p>
              <h3 className="text-3xl font-black mt-1">{card.value}</h3>
              <p className="text-[9px] mt-2 font-medium opacity-70">{card.trend} increase</p>
            </div>
            <card.icon
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:scale-110 transition-transform"
              size={40}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Chart Area */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">
              Platform Growth
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span className="text-[10px] font-bold uppercase text-gray-400">Posts Overview</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={true}
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
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

        {/* 🔹 Recent Activity / Tasks */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Recent Activity
            </h4>
            <Link
              href="/admin/requests"
              className="text-[10px] font-black text-orange-500 uppercase hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {stats.requests.length > 0 ? (
              stats.requests.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 text-orange-600 rounded-lg flex items-center justify-center font-bold text-xs">
                      {req.firstName?.[0]}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase">
                        {req.firstName} {req.lastName}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium">
                        #{req.role || 'Creator'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold italic">Pending</span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-30 italic text-xs text-gray-400">
                No pending tasks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
