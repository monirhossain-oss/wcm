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
  FiPackage,
  FiChevronRight,
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
  baseURL: 'http://localhost:5000',
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
        // এখানে বুস্ট এবং পিপিই আলাদা করে ফিল্টার করা হচ্ছে
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
    window.open(`http://localhost:5000/api/payments/creator/invoice/${transactionId}`, '_blank');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ⚠️ Low Balance Alert */}
      {stats?.totalPpcBalance > 0 && parseFloat(stats.totalPpcBalance) < 5 && (
        <div className="flex items-center justify-between gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-md shadow-lg shadow-red-500/20">
              <FiAlertCircle className="text-white" size={18} />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-red-500">
                Critical Balance
              </h4>
              <p className="text-xs text-zinc-400 font-medium">
                Your PPC ads might stop soon. Current: €{stats.totalPpcBalance}
              </p>
            </div>
          </div>
          <Link
            href="/creator/promote"
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase rounded-md transition-all shadow-md active:scale-95"
          >
            Recharge
          </Link>
        </div>
      )}

      {/* 🔹 Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Reach"
          value={stats?.totalViews}
          icon={FiEye}
          color="bg-white/3"
          trend="Organic Impressions"
        />
        <MetricCard
          label="Spendings"
          value={`€${stats?.totalSpent || '0.00'}`}
          icon={FiDollarSign}
          color="bg-white/3 border-emerald-500/30"
          trend="Marketing Budget"
        />
        <MetricCard
          label="Ad Credits"
          value={`€${stats?.totalPpcBalance || '0.00'}`}
          icon={FiTrendingUp}
          color="bg-orange-600"
          trend="Active Channels"
        />
        <MetricCard
          label="Interactions"
          value={stats?.totalFavorites}
          icon={FiActivity}
          color="bg-white/3"
          trend="Saved by Users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Recharts Traffic Analytics */}
        <div className="lg:col-span-8 bg-white/3 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Analytics Terminal
              </h3>
              <p className="text-xl font-bold text-white mt-1 italic uppercase tracking-tighter">
                Growth Pulse
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase">Clicks</span>
              </div>
            </div>
          </div>

          <div className="h-70.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.chartData || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#555', fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#555' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #ffffff10',
                    borderRadius: '4px',
                    fontSize: '10px',
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
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
                  fill="url(#cGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Asset Health */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white/3 border border-white/10 rounded-lg p-6 flex-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">
              Inventory Status
            </h3>
            <div className="space-y-3">
              <StatusRow
                label="Approved"
                count={stats?.statusCount?.approved}
                color="text-green-500"
              />
              <StatusRow
                label="Under Review"
                count={stats?.statusCount?.pending}
                color="text-orange-500"
              />
              <StatusRow
                label="Rejected"
                count={stats?.statusCount?.rejected}
                color="text-red-500"
              />
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-zinc-600 uppercase">Total Portfolio</p>
              <p className="text-3xl font-black text-white italic">{stats?.totalListings || 0}</p>
            </div>
          </div>
          <Link
            href="/creator/listings/create"
            className="bg-orange-600 hover:bg-orange-500 p-4 rounded-lg flex items-center justify-between group transition-all"
          >
            <span className="text-xs font-black text-white uppercase tracking-widest">
              New Listing
            </span>
            <FiArrowUpRight className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 🔹 Active Campaigns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignBox
          title="Viral Boosts"
          icon={FiZap}
          color="text-purple-500"
          data={promotedListings.filter((l) => l.promotion?.boost?.isActive)}
        />
        <CampaignBox
          title="PPC Channels"
          icon={FiActivity}
          color="text-orange-500"
          data={promotedListings.filter((l) => l.promotion?.ppc?.isActive)}
          isPpc
        />
      </div>

      {/* 🔹 Financial Ledger */}
      <div className="bg-white/3 border border-white/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Transaction Ledger
          </h4>
          <Link
            href="/creator/payments"
            className="text-[9px] font-black text-orange-500 uppercase hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-white/3 transition-all group">
                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-400">
                      #{tx.stripeSessionId?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${tx.packageType === 'boost' ? 'bg-purple-500/10 text-purple-500' : 'bg-orange-500/10 text-orange-500'}`}
                      >
                        {tx.packageType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-black text-white">
                      €{tx.amountPaid}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadInvoice(tx._id)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <FiFileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-xs italic text-zinc-600">
                    No recent activity.
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

// 🔹 Small Components
const MetricCard = ({ label, value, icon: Icon, color, trend }) => (
  <div
    className={`${color} p-5 rounded-lg border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all`}
  >
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{label}</p>
      <h3 className="text-2xl font-black mt-1 text-white italic tracking-tighter">{value || 0}</h3>
      <p className="text-[9px] mt-2 font-bold uppercase text-zinc-500">{trend}</p>
    </div>
    <Icon
      className="absolute -right-4 -bottom-4 text-white/3 group-hover:scale-110 transition-transform duration-500"
      size={100}
    />
  </div>
);

const StatusRow = ({ label, count, color }) => (
  <div className="flex justify-between items-center p-3 bg-white/2 border border-white/5 rounded-md">
    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{label}</span>
    <span className={`text-sm font-black italic ${color}`}>{count || 0}</span>
  </div>
);

const CampaignBox = ({ title, icon: Icon, color, data, isPpc }) => (
  <div className="bg-white/3 border border-white/10 rounded-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">{title}</h4>
      <Icon className={color} size={18} />
    </div>
    <div className="space-y-3">
      {data.length > 0 ? (
        data.map((item, i) => (
          <Link
            key={i}
            href={`/listings/${item._id}`} 
            className="flex items-center justify-between p-3 bg-white/2 border border-white/5 rounded-md hover:bg-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl(item.image)}
                className="w-9 h-9 rounded object-cover border border-white/10"
                alt=""
              />
              <div>
                <p className="text-[11px] font-black text-white uppercase truncate max-w-7xl">
                  {item.title}
                </p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">
                  {isPpc
                    ? `Balance: €${item.promotion.ppc.ppcBalance}`
                    : `Exp: ${new Date(item.promotion.boost.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <FiChevronRight className="text-zinc-700 group-hover:text-white transition-colors" />
          </Link>
        ))
      ) : (
        <div className="py-6 text-center border border-dashed border-white/10 rounded-md">
          <p className="text-[10px] uppercase font-bold text-zinc-600">No Active Stream</p>
        </div>
      )}
    </div>
  </div>
);
