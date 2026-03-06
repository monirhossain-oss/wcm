'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FiUsers,
  FiBox,
  FiDollarSign,
  FiZap,
  FiActivity,
  FiArrowUpRight,
  FiPieChart,
  FiTrendingUp,
  FiLayers,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const { cards, charts } = data;

  const revenueSourceData = [
    { name: 'PPC Ads', value: parseFloat(cards.ppcRevenue) },
    { name: 'Boost Ads', value: parseFloat(cards.boostRevenue) },
  ];

  const metricCards = [
    {
      label: 'Total Revenue',
      value: `€${cards.totalRevenue}`,
      icon: FiDollarSign,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'Overall Earnings',
      isPrimary: true,
    },
    {
      label: 'Click Revenue',
      value: `€${cards.ppcRevenue}`,
      icon: FiActivity,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'From PPC Ads',
    },
    {
      label: 'Boost Revenue',
      value: `€${cards.boostRevenue}`,
      icon: FiTrendingUp,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'From Featured Boosts',
    },
    {
      label: 'Active Ads',
      value: cards.activeCampaigns,
      icon: FiZap,
      color: 'bg-orange-600',
      trend: `${cards.activePpc} Click | ${cards.activeBoost} Boost`,
      isInverted: true,
    },
    {
      label: 'Total Users',
      value: cards.totalUsers || '0',
      icon: FiUsers,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'Registered Members',
    },
    {
      label: 'All Listings',
      value: cards.totalListings || '0',
      icon: FiLayers,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'Database Assets',
    },
    {
      label: 'Pending Creators',
      value: cards.pendingListings || '0',
      icon: FiShield,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'Waiting for Approval',
      isWarning: cards.pendingListings > 0,
    },
    {
      label: 'System Status',
      value: 'Online',
      icon: FiActivity,
      color: 'bg-white dark:bg-[#0c0c0c]',
      trend: 'Server is Live',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      {/* 🔹 Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white flex items-center gap-3">
            Admin <span className="text-orange-500">Control Center</span>
          </h2>
          <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mt-2 italic">
            System Overview: <span className="text-green-500">All Systems Live</span> // Updated Now
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded text-[9px] font-black uppercase tracking-widest dark:text-gray-400">
            V 2.4.0
          </div>
        </div>
      </div>

      {/* 1. Metric Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`${
              card.isInverted
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10'
            } p-5 md:p-6 rounded-md shadow-sm relative overflow-hidden group/card hover:border-orange-500/30 transition-all active:scale-95`}
          >
            <div className="relative z-10">
              <p
                className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${
                  card.isInverted ? 'text-white/60' : 'text-gray-400'
                }`}
              >
                {card.label}
              </p>
              <h3
                className={`text-xl md:text-3xl font-black mt-1 md:mt-2 italic tracking-tighter ${
                  card.isPrimary && !card.isInverted ? 'text-orange-500' : ''
                }`}
              >
                {card.value}
              </h3>
              <p
                className={`text-[7px] md:text-[9px] mt-2 md:mt-3 font-bold uppercase tracking-widest italic ${
                  card.isInverted ? 'text-white/80' : 'text-gray-500'
                }`}
              >
                {card.trend}
              </p>
            </div>

            {/* Background Icon - Specific Class Added */}
            <card.icon
              className={`metric-bg-icon absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 ${
                card.isInverted ? 'text-white/10' : 'text-gray-100 dark:text-white/3'
              } group-hover/card:scale-110 transition-all duration-700`}
              size={80}
            />

            {/* Scoped Style: Targets only metric-bg-icon */}
            <style jsx>{`
              @media (min-width: 768px) {
                .metric-bg-icon {
                  width: 120px !important;
                  height: 120px !important;
                }
              }
            `}</style>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Main Growth Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Revenue Growth
              </h3>
              <p className="text-2xl font-black dark:text-white mt-1 italic uppercase tracking-tighter">
                Revenue <span className="text-orange-500">&</span> New Registrations
              </p>
            </div>
            <div className="flex gap-6 bg-gray-50/50 dark:bg-white/20 p-3 rounded-md border border-gray-100 dark:border-white/5">
              <LegendItem color="bg-orange-500" label="Revenue" />
              <LegendItem color="bg-gray-400" label="New Users" />
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.revenueAndUsers}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 800, fill: '#888' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 800, fill: '#888' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #ffffff10',
                    borderRadius: '4px',
                    fontSize: '10px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={4}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Distribution Matrix */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
            <FiPieChart className="text-orange-500" /> Revenue Breakdown
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />6{' '}
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: '9px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    paddingTop: '20px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            <StatusRow label="Server Uptime" value="99.9%" color="text-green-500" />
            <StatusRow label="Data Sync" value="Real-time" color="text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 4. Category Sector Analysis */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 py-6 pr-6 shadow-sm">
          <h3 className="text-[10px] pl-6 font-black uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-2">
            <FiLayers className="text-orange-500" /> Sector Volume Analysis
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categories} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#888', textTransform: 'uppercase' }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: '#88888808' }}
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #ffffff10',
                    color: '#fff',
                    fontSize: '10px',
                  }}
                />
                <Bar dataKey="value" fill="#f97316" barSize={12} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Trending Assets */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              High-Priority Listings
            </h3>
            <Link
              href="/admin/listings"
              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
            >
              All Listings
            </Link>
          </div>
          <div className="space-y-4">
            {charts.topPromoted?.map((listing, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md hover:border-orange-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded font-black text-[11px] italic">
                    0{i + 1}
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase truncate max-w-[160px] tracking-tight dark:text-white">
                      {listing.name}
                    </p>
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm mt-1 inline-block ${listing.type === 'PPC' ? 'bg-orange-500/10 text-orange-500' : 'bg-purple-500/10 text-purple-400'}`}
                    >
                      {listing.type} Scheme
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Yield Score
                  </p>
                  <p className="text-sm font-black text-orange-500 italic tracking-tighter">
                    {listing.score}
                  </p>
                </div>
              </div>
            ))}
            {!charts.topPromoted?.length && (
              <div className="py-16 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-md">
                <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 italic">
                  No Trending Transmissions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Atomic UI Components
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 px-2">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const StatusRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
    <span className={`text-[11px] font-black italic tracking-widest ${color}`}>{value}</span>
  </div>
);
