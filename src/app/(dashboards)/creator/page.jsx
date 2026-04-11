'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FiEye,
  FiDollarSign,
  FiZap,
  FiActivity,
  FiArrowUpRight,
  FiFileText,
  FiRefreshCw,
  FiAlertCircle,
  FiLayers,
  FiInfo,
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
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorDashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const statsUrl = isRefresh ? '/api/creator/stats?refresh=true' : '/api/creator/stats';

      const [statsRes, transRes] = await Promise.all([
        api.get(statsUrl),
        api.get('/api/creator/my-transactions'),
      ]);

      setStats(statsRes.data);
      setTransactions(transRes.data.transactions?.slice(0, 5) || []);

      if (isRefresh) toast.success('Dashboard Updated');
    } catch (err) {
      console.error('Dashboard Data Error:', err);
      if (isRefresh) toast.error('Failed to sync data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      console.log("Auto-syncing dashboard stats...");
      fetchDashboardData(true);
    }, 1 * 60 * 1000); // 1 minute for testing, change to 5 * 60 * 1000 for production
    return () => clearInterval(interval);
  }, []);

  const downloadInvoice = async (transactionId) => {
    try {
      const response = await api.get(`/api/payments/creator/invoice/${transactionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Could not download invoice.');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const mainStats = stats?.stats;
  const walletBalance = stats?.walletBalance || '0.00';

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* 🚀 Header Section with Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">
            Creator <span className="text-orange-500">Command Center</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Last Sync:{' '}
            {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Just now'}
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
        >
          <FiRefreshCw
            className={`text-orange-500 ${refreshing ? 'animate-spin' : ''}`}
            size={14}
          />
          <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-300">
            {refreshing ? 'Syncing...' : 'Force Refresh'}
          </span>
        </button>
      </div>

      {/* ⚠️ Low Balance Alert */}
      {parseFloat(walletBalance) < 5 && parseFloat(walletBalance) > 0 && (
        <div className="flex items-center justify-between gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-red-500 text-white rounded-md shadow-lg shadow-red-500/20 animate-pulse">
              <FiAlertCircle size={20} />
            </div>
            <p className="text-[11px] dark:text-gray-300 font-bold uppercase">
              Operational Hazard: Your wallet balance is critically low (€{walletBalance})
            </p>
          </div>
          <Link
            href="/creator/promotions"
            className="px-6 py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-red-600"
          >
            Recharge Now
          </Link>
        </div>
      )}

      {/* 🔹 Metric Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="My Wallet"
          value={`€${walletBalance}`}
          icon={Wallet}
          trend="Current Balance"
          color="border-emerald-500/20 text-emerald-500"
          bg="bg-emerald-500/5"
          description="Operational Liquidity: Total funds available in your vault for instant deployment into promotions."
        />
        <MetricCard
          label="Total Reach"
          value={mainStats?.totalViews}
          icon={FiEye}
          trend="Lifetime Views"
          color="border-blue-500/20 text-blue-500"
          bg="bg-blue-500/5"
          description="Global Exposure: The total number of unique impressions your assets have generated across the network."
        />
        <MetricCard
          label="Promotion Spend"
          value={`€${mainStats?.totalMonthlySpend || '0.00'}`}
          icon={FiDollarSign}
          trend="This Month"
          color="border-orange-500/20 text-orange-500"
          bg="bg-orange-500/5"
          description="Resource Allocation: Total capital successfully utilized for Viral Boost and PPC campaigns this month."
        />
        <MetricCard
          label="Active Campaign"
          value={mainStats?.totalActivePromoted}
          icon={FiZap}
          trend="Viral Status"
          color="border-purple-500/20 text-purple-500"
          bg="bg-purple-500/5"
          isPrimary
          description="Live Nodes: The count of your assets currently running on high-priority discovery channels."
        />
        <MetricCard
          label="Engagement"
          value={mainStats?.totalClicks}
          icon={FiActivity}
          trend="PPC Clicks"
          color="border-pink-500/20 text-pink-500"
          bg="bg-pink-500/5"
          description="Interaction Pulse: Total direct actions and clicks received through your Pay-Per-Click configurations."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Growth Analytics Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl pr-6 py-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[80px] rounded-full"></div>
          <div className="flex justify-between items-center mb-10 pl-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Nodes Performance
              </h3>
              <p className="text-xl font-black dark:text-white italic uppercase tracking-tighter mt-1">
                Growth <span className="text-orange-500">Pulse</span>
              </p>
            </div>
            <div className="flex gap-4">
              <LegendItem color="bg-orange-500" label="Views" />
              <LegendItem color="bg-purple-500" label="Clicks" />
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#888', fontWeight: 'bold' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid #ffffff10',
                    borderRadius: '8px',
                    fontSize: '10px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#vGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fill="none"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Status Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                <FiLayers className="text-orange-500" /> Portfolio Health
              </h3>
              <div className="space-y-3">
                <StatusRow
                  label="Approved"
                  count={mainStats?.statusCount?.approved}
                  color="text-emerald-500"
                  bg="bg-emerald-500/5"
                />
                <StatusRow
                  label="Reviewing"
                  count={mainStats?.statusCount?.pending}
                  color="text-orange-500"
                  bg="bg-orange-500/5"
                />
                <StatusRow
                  label="Rejected"
                  count={mainStats?.statusCount?.rejected}
                  color="text-red-500"
                  bg="bg-red-500/5"
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Total Active Nodes
                </p>
                <p className="text-5xl font-black dark:text-white italic tracking-tighter mt-1">
                  {mainStats?.totalListings || 0}
                </p>
              </div>
              <Link
                href="/creator/add"
                className="bg-orange-600 p-4 rounded-lg hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20"
              >
                <FiArrowUpRight className="text-white" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Payment Ledger */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden">
        <div className="px-8 py-5 flex justify-between items-center bg-gray-50/50 dark:bg-white/20">
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Capital Ledger
          </h4>
          <Link
            href="/creator/transactions"
            className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:tracking-[0.4em] transition-all"
          >
            View All Entries
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-transparent">
              <tr>
                <th className="px-8 py-4">Transaction Date</th>
                <th className="px-8 py-4">Protocol</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/20 transition-all group"
                  >
                    <td className="px-8 py-4 text-[10px] font-bold text-gray-500">
                      {new Date(tx.createdAt).toDateString()}
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${tx.packageType === 'boost' ? 'border-purple-500/30 text-purple-500' : 'border-orange-500/30 text-orange-500'}`}
                      >
                        {tx.packageType}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-[12px] font-black dark:text-white italic">
                      €{tx.amountPaid}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => downloadInvoice(tx._id)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <FiFileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-12 text-center text-[10px] uppercase font-bold text-gray-500 italic"
                  >
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🔹 Atomic UI Components
const MetricCard = ({ label, value, icon: Icon, trend, color, bg, isPrimary, description }) => (
  <div
    className={`p-6 rounded-xl border border-gray-100 dark:border-white/5 relative group transition-all hover:-translate-y-1 bg-white dark:bg-[#0c0c0c] ${bg}`}
  >
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      <Icon
        className={`absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 transition-all duration-700 ${color}`}
        size={100}
      />
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-2">
        <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{label}</p>

        {description && (
          <div className="relative group/info">
            <FiInfo
              size={10}
              className="text-gray-600 hover:text-orange-500 cursor-help transition-colors"
            />
            <div className="absolute bottom-full left-0 mb-3 w-52 p-3 bg-zinc-900 text-[10px] text-zinc-300 rounded-xl opacity-0 group-hover/info:opacity-100 transition-all pointer-events-none shadow-2xl border border-white/10 z-100 leading-relaxed font-medium transform -translate-x-2">
              <span className="text-orange-500 font-bold block mb-1 text-[8px] tracking-widest uppercase">
                Reserve Policy
              </span>
              {description}
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-4 border-8 border-transparent border-t-zinc-900"></div>
            </div>
          </div>
        )}
      </div>

      <h3
        className={`text-2xl font-black mt-2 italic tracking-tighter ${isPrimary ? 'text-orange-500 underline decoration-orange-500/20 underline-offset-4' : 'dark:text-white'}`}
      >
        {value || 0}
      </h3>
      <p className="text-[8px] mt-3 font-bold uppercase text-gray-500 tracking-widest italic opacity-60">
        {trend}
      </p>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const StatusRow = ({ label, count, color, bg }) => (
  <div
    className={`flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-white/5 ${bg}`}
  >
    <span className="text-[9px] font-black uppercase tracking-tight text-gray-500">{label}</span>
    <span className={`text-[12px] font-black italic ${color}`}>{count || 0}</span>
  </div>
);
