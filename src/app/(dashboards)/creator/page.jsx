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
  FiTrendingUp,
  FiAlertCircle,
  FiChevronRight,
  FiLayers,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
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

export default function CreatorDashboard() {
  const [stats, setStats] = useState(null);
  const [promotedListings, setPromotedListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, listingsRes, transRes] = await Promise.all([
          api.get('/api/creator/stats'),
          api.get('/api/listings/my-listings'),
          api.get('/api/creator/payments'),
        ]);

        setStats(statsRes.data);
        setPromotedListings(listingsRes.data.filter((l) => l.isPromoted));
        setTransactions(transRes.data.transactions?.slice(0, 5) || []);
      } catch (err) {
        console.error('Dashboard Data Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const downloadInvoice = (transactionId) => {
    window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/creator/invoice/${transactionId}`, '_blank');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700 font-sans">
      
      {/* ⚠️ Low Balance Alert */}
      {stats?.totalPpcBalance > 0 && parseFloat(stats.totalPpcBalance) < 5 && (
        <div className="flex items-center justify-between gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-red-500 text-white rounded-md shadow-lg shadow-red-500/20 animate-pulse">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Critical Balance Detected</h4>
              <p className="text-[11px] dark:text-gray-400 font-bold uppercase mt-0.5">Your PPC campaigns are nearing depletion: €{stats.totalPpcBalance}</p>
            </div>
          </div>
          <Link href="/creator/promote" className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md transition-all active:scale-95 shadow-lg">
            Recharge Node
          </Link>
        </div>
      )}

      {/* 🔹 Metric Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Reach" value={stats?.totalViews} icon={FiEye} trend="Organic Impressions" />
        <MetricCard label="Net Spend" value={`€${stats?.totalSpent || '0.00'}`} icon={FiDollarSign} trend="Ad Expenditure" />
        <MetricCard label="Live Credits" value={`€${stats?.totalPpcBalance || '0.00'}`} icon={FiTrendingUp} isPrimary trend="Active Channels" />
        <MetricCard label="Interactions" value={stats?.totalFavorites} icon={FiActivity} trend="User Engagement" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🔹 Growth Pulse Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Intelligence Terminal</h3>
              <p className="text-2xl font-black dark:text-white mt-1 italic uppercase tracking-tighter">Growth <span className="text-orange-500">Pulse</span></p>
            </div>
            <div className="flex gap-6">
              <LegendItem color="bg-orange-500" label="Views" />
              <LegendItem color="bg-purple-500" label="Clicks" />
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#888' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #ffffff10', borderRadius: '4px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="views" stroke="#f97316" strokeWidth={3} fill="url(#vGrad)" />
                <Area type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={3} fill="url(#cGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Portfolio Overview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg p-8 flex-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                <FiLayers className="text-orange-500" /> Portfolio Health
            </h3>
            <div className="space-y-4">
              <StatusRow label="Deployed" count={stats?.statusCount?.approved} color="text-green-500" />
              <StatusRow label="Under Review" count={stats?.statusCount?.pending} color="text-orange-500" />
              <StatusRow label="Restricted" count={stats?.statusCount?.rejected} color="text-red-500" />
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Nodes</p>
              <p className="text-4xl font-black dark:text-white italic tracking-tighter mt-1">{stats?.totalListings || 0}</p>
            </div>
          </div>
          <Link href="/creator/add" className="bg-orange-600 hover:bg-orange-500 p-5 rounded-lg flex items-center justify-between group transition-all shadow-lg shadow-orange-600/10">
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Initiate New Listing</span>
            <FiArrowUpRight className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 🔹 Campaign Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CampaignBox title="Boost Operations" icon={FiZap} color="text-purple-500" data={promotedListings.filter((l) => l.promotion?.boost?.isActive)} />
        <CampaignBox title="PPC Flow Logic" icon={FiActivity} color="text-orange-500" data={promotedListings.filter((l) => l.promotion?.ppc?.isActive)} isPpc />
      </div>

      {/* 🔹 Transaction Ledger */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/20">
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Financial Ledger</h4>
          <Link href="/creator/payments" className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">Full History</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-8 py-5">Internal Ref</th>
                <th className="px-8 py-5">Scheme</th>
                <th className="px-8 py-5">Debit Amount</th>
                <th className="px-8 py-5 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/20 transition-all group">
                    <td className="px-8 py-4 text-[10px] font-bold text-gray-500">#{tx.stripeSessionId?.slice(-8).toUpperCase()}</td>
                    <td className="px-8 py-4">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-sm ${tx.packageType === 'boost' ? 'bg-purple-500/10 text-purple-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {tx.packageType}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-[12px] font-black dark:text-white italic">€{tx.amountPaid}</td>
                    <td className="px-8 py-4 text-right">
                      <button onClick={() => downloadInvoice(tx._id)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                        <FiFileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-[10px] uppercase font-bold tracking-widest text-gray-500 italic">No Operational Transactions Found.</td>
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
const MetricCard = ({ label, value, icon: Icon, trend, isPrimary }) => (
  <div className={`p-6 rounded-lg border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all bg-white dark:bg-[#0c0c0c] shadow-sm`}>
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{label}</p>
      <h3 className={`text-3xl font-black mt-2 italic tracking-tighter ${isPrimary ? 'text-orange-500' : 'dark:text-white'}`}>{value || 0}</h3>
      <p className="text-[9px] mt-3 font-bold uppercase text-gray-500 tracking-widest italic">{trend}</p>
    </div>
    <Icon className="absolute -right-6 -bottom-6 text-gray-100 dark:text-white/2 group-hover:scale-110 group-hover:text-orange-500/10 transition-all duration-700" size={120} />
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const StatusRow = ({ label, count, color }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
    <span className={`text-sm font-black italic tracking-widest ${color}`}>{count || 0}</span>
  </div>
);

const CampaignBox = ({ title, icon: Icon, color, data, isPpc }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg p-8 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">{title}</h4>
      <Icon className={color} size={22} />
    </div>
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((item, i) => (
          <Link key={i} href={`/listings/${item._id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-md hover:border-orange-500/30 transition-all group">
            <div className="flex items-center gap-4">
              <img src={getImageUrl(item.image)} className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-white/10 grayscale-[0.5] group-hover:grayscale-0 transition-all" alt="" />
              <div>
                <p className="text-[11px] font-black dark:text-white uppercase truncate max-w-[140px] tracking-tight">{item.title}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  {isPpc ? `Credits: €${item.promotion.ppc.ppcBalance}` : `Exp: ${new Date(item.promotion.boost.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <FiChevronRight className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))
      ) : (
        <div className="py-10 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-md">
          <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 italic">No Active Transmissions</p>
        </div>
      )}
    </div>
  </div>
);