'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FiBox,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiTrendingUp,
  FiActivity,
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
import { getImageUrl } from '@/lib/imageHelper';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// ডামি চার্ট ডাটা
const performanceData = [
  { name: 'Mon', views: 120 },
  { name: 'Tue', views: 340 },
  { name: 'Wed', views: 250 },
  { name: 'Thu', views: 580 },
  { name: 'Fri', views: 490 },
  { name: 'Sat', views: 800 },
  { name: 'Sun', views: 720 },
];

export default function CreatorDashboard() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorStats = async () => {
      try {
        const res = await api.get('/api/listings/my-listings');
        const listings = res.data;

        setStats({
          total: listings.length,
          approved: listings.filter((l) => l.status === 'approved').length,
          pending: listings.filter((l) => l.status === 'pending').length,
          recent: listings.slice(0, 5),
        });
      } catch (err) {
        console.error('Creator Stats Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreatorStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const creatorCards = [
    {
      label: 'Total Listings',
      value: stats.total,
      icon: FiBox,
      color: 'bg-red-800',
      trend: 'Total Indexed',
    },
    {
      label: 'Approved Listings',
      value: stats.approved,
      icon: FiCheckCircle,
      color: 'bg-orange-500',
      trend: 'Approved Status',
    },
    {
      label: 'In Review',
      value: stats.pending,
      icon: FiClock,
      color: 'bg-orange-600',
      trend: 'Awaiting Action',
    },
    {
      label: 'Performance',
      value: '+24%',
      icon: FiTrendingUp,
      color: 'bg-purple-900',
      trend: 'Engagement Node',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 🔹 Welcome Banner */}
      <div className="w-full bg-linear-to-r from-purple-900 to-pink-800 p-8 rounded-xl text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold italic tracking-tighter uppercase">Creator Terminal</h2>
        <p className="text-sm opacity-80 mt-1 italic font-medium">
          Monitor your cultural assets and validation status in real-time.
        </p>
      </div>

      {/* 🔹 Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {creatorCards.map((card, i) => (
          <div
            key={i}
            className={`${card.color} p-5 rounded-xl text-white shadow-md relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">
                {card.label}
              </p>
              <h3 className="text-3xl font-black mt-1 tracking-tighter italic">{card.value}</h3>
              <p className="text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-60">
                {card.trend}
              </p>
            </div>
            <card.icon
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:scale-110 transition-transform"
              size={40}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Performance Chart Area */}
        <div className="lg:col-span-8 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Listings Impact
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase text-gray-400 italic">
                Interaction Node
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={true}
                  strokeOpacity={0.05}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔹 Recent Protocols List */}
        <div className="lg:col-span-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Recent Listings
            </h4>
            <Link
              href="/creator/listings"
              className="text-[9px] font-black text-orange-500 uppercase hover:underline italic"
            >
              Full Listings
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {stats.recent.length > 0 ? (
              stats.recent.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-white/20 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={item.title}
                      />
                    </div>
                    <div className="max-w-30">
                      <p className="text-[10px] font-black uppercase leading-tight truncate">
                        {item.title}
                      </p>
                      <p
                        className={`text-[8px] font-black uppercase mt-1 italic tracking-tighter ${
                          item.status === 'approved' ? 'text-green-500' : 'text-orange-500'
                        }`}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/creator/listings`}
                    className="p-2 text-gray-300 group-hover:text-orange-500 transition-colors"
                  >
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-30 italic text-xs text-gray-400">
                No data indexed
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/10">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Profile Integrity</span>
              <span className="text-green-500 flex items-center gap-1">
                <FiActivity size={10} /> Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
