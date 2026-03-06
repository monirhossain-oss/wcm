'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FiUsers,
  FiDollarSign,
  FiZap,
  FiActivity,
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
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
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
     color: 'bg-orange-600', // হাইলাইট করা হয়েছে (Main Focus)
     trend: 'Gross (Incl. VAT)',
     isInverted: true,
   },
   {
     label: 'Net Profit',
     value: `€${cards.netProfit}`,
     icon: FiTrendingUp,
     color: 'bg-green-600/10 dark:bg-white/20', // প্রফিট হাইলাইট
     trend: 'Pure In-Hand Profit',
     isPrimary: true,
   },
   {
     label: 'Stripe Fees',
     value: `€${cards.stripeFees}`,
     icon: FiActivity,
     color: 'bg-white dark:bg-[#0c0c0c]',
     trend: 'Gateway Charges',
   },
   {
     label: 'VAT Collected',
     value: `€${cards.totalVat}`,
     icon: FiShield,
     color: 'bg-white dark:bg-[#0c0c0c]',
     trend: 'Tax Obligations',
   },
   {
     label: 'Active Promotions',
     value: cards.activeCampaigns,
     icon: FiZap,
     color: 'bg-white dark:bg-[#0c0c0c]', // এটিকে ক্লিন রাখা হয়েছে ব্যালেন্স করার জন্য
     trend: `${cards.activePpc || 0} PPC | ${cards.activeBoost || 0} Boost`,
   },
   {
     label: 'Total Creators',
     value: cards.totalCreators || '0',
     icon: FiUsers,
     color: 'bg-white dark:bg-[#0c0c0c]',
     trend: 'Verified Vendors',
   },
   {
     label: 'Pending Requests',
     value: cards.pendingRequests || '0',
     icon: FiShield,
     color:
       cards.pendingRequests > 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-white dark:bg-[#0c0c0c]',
     trend: 'Creator Applications',
     isWarning: cards.pendingRequests > 0,
   },
   {
     label: 'Pending Listings', // সিস্টেম স্ট্যাটাসের বদলে রিয়েল গুরুত্বপূর্ণ ডেটা
     value: cards.pendingListings || '0',
     icon: FiLayers,
     color:
       cards.pendingListings > 0
         ? 'bg-orange-500/10 border-orange-500/50'
         : 'bg-white dark:bg-[#0c0c0c]',
     trend: 'Ads Waiting Approval',
     isWarning: cards.pendingListings > 0,
   },
 ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      {/* 🔹 Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white flex items-center gap-3">
            Admin <span className="text-orange-500">Overview</span>
          </h2>
          <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mt-2 italic">
            Live Feed: <span className="text-green-500">Operations Normal</span> // End-to-End
            Encrypted
          </p>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded text-[9px] font-black uppercase tracking-widest dark:text-gray-400">
          V 2.4.0
        </div>
      </div>

      {/* 1. Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`${
              card.isInverted
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10'
            } p-5 md:p-6 rounded-md shadow-sm relative overflow-hidden group/card transition-all active:scale-95 ${card.isWarning ? 'border-red-500/50' : ''}`}
          >
            <div className="relative z-10">
              <p
                className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${card.isInverted ? 'text-white/60' : 'text-gray-400'}`}
              >
                {card.label}
              </p>
              <h3
                className={`text-xl md:text-3xl font-black mt-1 md:mt-2 italic tracking-tighter ${card.isPrimary && !card.isInverted ? 'text-orange-500' : ''}`}
              >
                {card.value}
              </h3>
              <p
                className={`text-[7px] md:text-[9px] mt-2 md:mt-3 font-bold uppercase tracking-widest italic ${card.isInverted ? 'text-white/80' : 'text-gray-500'}`}
              >
                {card.trend}
              </p>
            </div>
            <card.icon
              className={`absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 opacity-10 ${card.isInverted ? 'text-white' : 'text-gray-400'} group-hover/card:scale-110 transition-transform duration-700`}
              size={100}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Revenue vs Profit Flow Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Financial Performance
              </h3>
              <p className="text-2xl font-black dark:text-white mt-1 italic uppercase tracking-tighter">
                Revenue <span className="text-orange-500">vs</span> Profit Flow
              </p>
            </div>
            <div className="flex gap-4 bg-gray-50 dark:bg-white/5 p-2 rounded border border-gray-100 dark:border-white/10">
              <LegendItem color="bg-orange-500" label="Revenue" />
              <LegendItem color="bg-green-500" label="Net Profit" />
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.revenueProfitFlow}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                  strokeWidth={3}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Distribution Pie */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
            <FiPieChart className="text-orange-500" /> Revenue Split
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
                  {revenueSourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: '9px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    paddingTop: '20px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            <StatusRow label="Syncing" value="Live" color="text-green-500" />
            <StatusRow
              label="Profit Margin"
              value={`${((cards.netProfit / cards.totalRevenue) * 100).toFixed(1)}%`}
              color="text-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 4. Category Sector */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 py-6 pr-6 shadow-sm">
          <h3 className="text-[10px] pl-6 font-black uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-2">
            <FiLayers className="text-orange-500" /> Inventory by Sector
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
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#888' }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: '#88888808' }}
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #ffffff10',
                    fontSize: '10px',
                  }}
                />
                <Bar dataKey="value" fill="#f97316" barSize={12} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. User Growth Visual */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0c0c] rounded-lg border border-gray-100 dark:border-white/5 p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
            User Acquisition
          </h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueProfitFlow}>
                <Area
                  type="stepAfter"
                  dataKey="users"
                  stroke="#a855f7"
                  fill="#a855f710"
                  strokeWidth={2}
                />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 p-4 border border-dashed border-gray-100 dark:border-white/10 rounded-md">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
              Total Impact
            </p>
            <p className="text-2xl font-black italic text-orange-500">{cards.totalUsers} Members</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Atomic Components
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const StatusRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md">
    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
    <span className={`text-[11px] font-black italic ${color}`}>{value}</span>
  </div>
);
