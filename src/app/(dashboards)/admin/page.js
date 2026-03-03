'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  FiUsers, FiBox, FiDollarSign, FiZap, FiActivity, 
  FiArrowUpRight, FiPieChart, FiTrendingUp 
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const COLORS = ['#f97316', '#a855f7', '#06b6d4', '#ec4899'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/stats');
        setData(data);
      } catch (err) {
        console.error('Dashboard Stats Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const { cards, charts } = data;

  // Pie Chart Data for Revenue Source
  const revenueSourceData = [
    { name: 'PPC Ads', value: parseFloat(cards.ppcRevenue) },
    { name: 'Boost Ads', value: parseFloat(cards.boostRevenue) },
  ];

  const metricCards = [
    { label: 'Total Revenue', value: `€${cards.totalRevenue}`, icon: FiDollarSign, color: 'bg-zinc-900', sub: 'Total earnings' },
    { label: 'PPC Revenue', value: `€${cards.ppcRevenue}`, icon: FiActivity, color: 'bg-orange-600', sub: 'From click ads' },
    { label: 'Boost Revenue', value: `€${cards.boostRevenue}`, icon: FiTrendingUp, iconColor: 'text-purple-400', color: 'bg-purple-900', sub: 'From time ads' },
    { label: 'Active Ads', value: cards.activeCampaigns, icon: FiZap, color: 'bg-zinc-800', sub: `${cards.activePpc} PPC | ${cards.activeBoost} Boost` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 1. Top Section: Welcome & Core Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <div key={i} className={`${card.color} p-6 rounded-sm text-white shadow-lg relative overflow-hidden group`}>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em]">{card.label}</p>
              <h3 className="text-3xl font-black mt-2 tracking-tighter">{card.value}</h3>
              <div className="flex items-center gap-1 mt-3 opacity-80">
                <span className="text-[9px] font-bold uppercase tracking-tight">{card.sub}</span>
              </div>
            </div>
            <card.icon className="absolute right-[-10px] bottom-[-10px] text-white/5 group-hover:text-white/10 transition-all group-hover:scale-110" size={100} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Main Revenue Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-sm border border-gray-100 dark:border-white/5 py-6 pr-6">
          <div className="flex items-center justify-between mb-8 pl-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Financial Growth</h3>
              <p className="text-[10px] text-gray-400 mt-1">Daily revenue and user registration (last 7 days)</p>
            </div>
            <div className="flex gap-4 bg-gray-50 dark:bg-white/5 p-2 rounded-sm">
               <div className="flex items-center gap-2 px-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-[9px] font-bold uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-2 px-2 border-l border-gray-200 dark:border-white/10">
                <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
                <span className="text-[9px] font-bold uppercase">Users</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueAndUsers}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="users" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Revenue Distribution (Pie Chart) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] rounded-sm border border-gray-100 dark:border-white/5 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Revenue Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-sm">
               <span className="text-[10px] font-bold text-gray-500 uppercase">Platform Health</span>
               <span className="text-[10px] font-black text-green-500 uppercase">99.2% Stable</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4. Category Distribution (Bar Chart) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c0c0c] rounded-sm border border-gray-100 dark:border-white/5 py-6 pr-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8 pl-6">Listings per Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categories} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="value" fill="#f97316" barSize={15} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Top Promoted Listings (New Section) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0c0c] rounded-sm border border-gray-100 dark:border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Top Trending (Promoted)</h3>
            <Link href="/admin/listings" className="text-[9px] font-black text-orange-500 uppercase hover:underline">Manage All</Link>
          </div>
          <div className="space-y-3">
            {charts.topPromoted?.map((listing, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-50 dark:border-white/5 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-white/5 rounded-sm text-[10px] font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase truncate max-w-[150px]">{listing.name}</p>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${listing.type === 'PPC' ? 'bg-orange-500/10 text-orange-500' : 'bg-purple-500/10 text-purple-400'}`}>
                      {listing.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase">Score</p>
                   <p className="text-xs font-black text-zinc-800 dark:text-white">{listing.score}</p>
                </div>
              </div>
            ))}
            {!charts.topPromoted?.length && (
              <div className="text-center py-10 opacity-20 italic text-xs uppercase tracking-widest">No promotions active</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}