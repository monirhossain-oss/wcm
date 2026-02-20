'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiBox, FiClock, FiPlus, FiActivity, FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/api/listings/my-listings');
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // 📊 Chart Data Preparation
  const statusData = [
    {
      name: 'Approved',
      value: listings.filter((l) => l.status === 'approved').length,
      color: '#f97316',
    },
    {
      name: 'Pending',
      value: listings.filter((l) => l.status === 'pending').length,
      color: '#444',
    },
    {
      name: 'Rejected',
      value: listings.filter((l) => l.status === 'rejected').length,
      color: '#ef4444',
    },
  ];

  // লিস্টিং ক্রিয়েশন টাইমলাইন (সিমুলেটেড মান)
  const timelineData = [
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 7 },
    { name: 'Mar', count: listings.length }, // Current
  ];

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: FiBox, trend: '+12%' },
    { label: 'Approved', value: statusData[0].value, icon: FiTrendingUp, trend: 'Success' },
    { label: 'In Review', value: statusData[1].value, icon: FiClock, trend: 'Pending' },
  ];

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center font-black uppercase text-[10px] tracking-widest animate-pulse">
        Analyzing Studio Data...
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 🚀 Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111] p-8 rounded-[3rem] border border-ui group hover:border-orange-500 transition-all duration-500 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-ui rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <stat.icon size={22} />
                </div>
                <span className="text-[9px] font-black px-3 py-1 bg-ui rounded-full uppercase tracking-tighter flex items-center gap-1">
                  <FiArrowUpRight /> {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {stat.label}
              </p>
              <h2 className="text-5xl font-black mt-2 tracking-tighter">{stat.value}</h2>
            </div>
            {/* Background Accent */}
            <div className="absolute -bottom-4 -right-4 text-ui opacity-5 group-hover:text-orange-500 transition-colors">
              <stat.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      {/* 📈 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-ui rounded-[3.5rem] p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <FiActivity className="text-orange-500" /> Publication Activity
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    borderRadius: '15px',
                    border: 'none',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution (Pie) */}
        <div className="bg-white dark:bg-[#111] border border-ui rounded-[3.5rem] p-10 flex flex-col items-center justify-center">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-center w-full border-b border-ui pb-4">
            Verification
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-6">
            {statusData.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: s.color }}
                ></div>
                <p className="text-[8px] font-black uppercase opacity-50">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⚡ Quick Actions & Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black dark:bg-white p-12 rounded-[3.5rem] text-white dark:text-black flex flex-col justify-between items-start group">
          <div>
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FiPlus size={24} className="text-white" />
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
              Create New
              <br />
              Masterpiece
            </h3>
            <p className="text-xs opacity-50 font-medium max-w-xs uppercase tracking-widest leading-loose">
              Upload your latest cultural artifacts and reach the world.
            </p>
          </div>
          <Link
            href="/creator/add"
            className="mt-10 px-10 py-5 bg-orange-500 rounded-4xl text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-xl shadow-orange-500/20"
          >
            Launch Collection
          </Link>
        </div>

        <div className="bg-white dark:bg-[#111] border border-ui p-10 rounded-[3.5rem]">
          <div className="flex justify-between items-center mb-8 border-b border-ui pb-6">
            <h3 className="text-sm font-black uppercase tracking-widest">Live Inventory</h3>
            <Link
              href="/creator/listings"
              className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-6">
            {listings.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-ui overflow-hidden border border-ui">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}
                      ></span>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-ui rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <FiArrowUpRight size={14} />
                </div>
              </div>
            ))}
            {listings.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <FiBox size={40} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No listings detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
