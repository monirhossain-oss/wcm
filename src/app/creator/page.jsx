'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FiBox,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiActivity,
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🔹 Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Assets */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Total Artifacts
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.total}
            </h3>
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <FiBox size={16} />
            </div>
          </div>
        </div>

        {/* Verified Assets */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Verified Nodes
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.approved}
            </h3>
            <div className="text-green-500 text-[10px] font-black flex items-center gap-1 mb-1">
              <FiCheckCircle /> Success
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            In Review
          </p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-black tracking-tighter text-[#1f1f1f] dark:text-white">
              {stats.pending}
            </h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <FiClock size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 Performance Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1f1f1f] dark:text-white">
              Artifact Impact
            </h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase">Interaction Node</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#000"
                  strokeOpacity={0.03}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#A0A0A0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    fontSize: '10px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
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

        {/* 🔹 Recent Activity / Inventory Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Recent Protocols
              </h4>
              <Link
                href="/creator/listings"
                className="text-[9px] font-black text-orange-500 uppercase hover:underline"
              >
                Inventory
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
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm bg-white dark:bg-white/5">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase leading-tight text-[#1f1f1f] dark:text-white truncate w-32">
                          {item.title}
                        </p>
                        <p
                          className={`text-[8px] font-bold uppercase tracking-tighter ${
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

            {/* Status Footer */}
            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/10">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span className="text-gray-400 tracking-widest">Profile Integrity</span>
                <span className="text-green-500">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
