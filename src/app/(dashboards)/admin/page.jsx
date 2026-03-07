'use client';
import { useState, useEffect } from 'react';
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
  FiEye,
  FiMousePointer,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
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

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/stats');
        if (data.success) {
          setData(data);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (err) {
        console.error('Dashboard Stats Error:', err);
        setError('Connection to server failed');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Loading Intelligence...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 gap-2">
        <FiAlertCircle size={24} />
        <p className="text-xs font-black uppercase tracking-widest">{error}</p>
      </div>
    );

  const { cards, charts } = data;

  // 🔹 Safety Calculations (To prevent NaN or Infinity errors)
  const revenueNum = parseFloat(cards.totalRevenue) || 0;
  const netProfitNum = parseFloat(cards.netProfit) || 0;
  const stripeFeesNum = parseFloat(cards.stripeFees) || 0;

  const profitMargin = revenueNum > 0 ? ((netProfitNum / revenueNum) * 100).toFixed(1) : '0.0';
  const feeImpact = revenueNum > 0 ? ((stripeFeesNum / revenueNum) * 100).toFixed(1) : '0.0';

  // 🔹 Main 4 Performance Cards
  const mainMetrics = [
    {
      label: 'Total Revenue',
      value: `€${cards.totalRevenue}`,
      icon: FiDollarSign,
      sub: 'Lifetime Gross',
      color: 'bg-orange-600',
    },
    {
      label: 'Total Clicks',
      value: cards.totalClicks,
      icon: FiMousePointer,
      sub: 'Analytics Sync',
      color: 'bg-blue-600',
    },
    {
      label: 'Total Views',
      value: cards.totalViews,
      icon: FiEye,
      sub: 'Global Reach',
      color: 'bg-purple-600',
    },
    {
      label: 'Active Promotions',
      value: cards.activePromotions,
      icon: FiZap,
      sub: 'PPC & Boost Live',
      color: 'bg-green-600',
    },
  ];

  // 🔹 Financial & System Cards
  const secondaryMetrics = [
    {
      label: 'Net Profit',
      value: `€${cards.netProfit}`,
      icon: FiTrendingUp,
      trend: 'Post Tax & Fees',
      isHighlight: true,
    },
    {
      label: 'Stripe Fees',
      value: `€${cards.stripeFees}`,
      icon: FiActivity,
      trend: 'Estimated Cost',
    },
    { label: 'VAT Liability', value: `€${cards.totalVat}`, icon: FiShield, trend: 'Total Tax' },
    {
      label: 'Payments',
      value: cards.recentPayments,
      icon: FiClock,
      trend: 'Last 24 Hours',
    },
    {
      label: 'Creators',
      value: cards.totalCreators,
      icon: FiUsers,
      trend: 'Approved Partners',
    },
    {
      label: 'Pending Apps',
      value: cards.pendingCreatorRequests,
      icon: FiShield,
      trend: 'Review Required',
      isWarning: cards.pendingCreatorRequests > 0,
    },
    {
      label: 'Pending Ads',
      value: cards.pendingListings,
      icon: FiLayers,
      trend: 'Manual Review',
      isWarning: cards.pendingListings > 0,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-sans">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
            Admin <span className="text-orange-500">Overview</span>
          </h2>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-gray-500">
          Last Check: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* --- 1. Top 4 Priority Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainMetrics.map((card, i) => (
          <div
            key={i}
            className={`${card.color} p-6 rounded-xl text-white shadow-xl shadow-black/5 relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                {card.label}
              </p>
              <h3 className="text-3xl font-black mt-2 italic tracking-tighter">{card.value}</h3>
              <p className="text-[9px] mt-4 font-bold uppercase tracking-widest opacity-80">
                {card.sub}
              </p>
            </div>
            <card.icon
              className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"
              size={100}
            />
          </div>
        ))}
      </div>

      {/* --- 2. Financial & Meta Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {secondaryMetrics.map((card, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-[#0c0c0c] border ${card.isWarning ? 'border-red-500/50 bg-red-500/5' : 'border-gray-100 dark:border-white/10'} p-4 rounded-lg transition-all hover:border-orange-500/30`}
          >
            <div className="flex items-center gap-2 mb-3">
              <card.icon
                className={
                  card.isHighlight
                    ? 'text-orange-500'
                    : card.isWarning
                      ? 'text-red-500'
                      : 'text-gray-400'
                }
                size={14}
              />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                {card.label}
              </span>
            </div>
            <h4
              className={`text-lg font-black tracking-tighter italic ${card.isHighlight ? 'text-orange-500' : card.isWarning ? 'text-red-500' : 'dark:text-white'}`}
            >
              {card.value}
            </h4>
            <p className="text-[8px] font-bold text-gray-500 uppercase mt-1 tracking-tighter">
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* --- 3. Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Flow Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] rounded-xl border border-gray-100 dark:border-white/5 py-6 pr-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <h3 className="text-xl pl-6 font-black italic uppercase tracking-tighter dark:text-white">
              Revenue <span className="text-orange-500">&</span> Profit{' '}
              <span className="text-gray-400 text-[10px] font-black ml-2 tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-1 rounded uppercase">
                7 Day Performance
              </span>
            </h3>
            <div className="flex gap-4">
              <LegendItem color="bg-orange-500" label="Revenue" />
              <LegendItem color="bg-green-500" label="Net Profit" />
            </div>
          </div>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueFlow}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }}
                  tickFormatter={(val) => `€${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                    fontWeight: '800',
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={4}
                  fill="url(#colorRev)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={4}
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Meter */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] rounded-xl border border-gray-100 dark:border-white/5 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
              <FiPieChart className="text-orange-500" /> Margin Analysis
            </h3>
            <div className="space-y-6">
              <StatBlock
                label="Gross Profit Margin"
                value={`${profitMargin}%`}
                color="text-green-500"
              />
              <StatBlock label="Stripe Fee Impact" value={`${feeImpact}%`} color="text-red-500" />
              <StatBlock label="VAT Liability" value={`€${cards.totalVat}`} color="text-blue-500" />
            </div>
          </div>

          <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
            <p className="text-[9px] font-black uppercase text-orange-500 tracking-widest mb-1">
              Business Health
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed italic font-medium">
              Revenue is successfully distributed. System is calculating Stripe fees at{' '}
              <span className="text-orange-500 font-bold">2.9% + 0.30€</span>. Net margin is
              healthy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Atomic UI Components
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const StatBlock = ({ label, value, color }) => (
  <div className="group cursor-default">
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1 group-hover:text-orange-500 transition-colors">
      {label}
    </p>
    <p className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</p>
  </div>
);
