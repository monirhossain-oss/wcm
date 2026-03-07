'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiZap,
  FiClock,
  FiMousePointer,
  FiArrowLeft,
  FiActivity,
  FiTrendingUp,
  FiEye,
} from 'react-icons/fi';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function PromotionInsightsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/api/creator/promotion-insights/${id}`);
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        console.error('Failed to load insights', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStats();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!data) return null;
  const { ppc, boost } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 dark:border-white/5 pb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white dark:bg-white/5 hover:bg-orange-500 hover:text-white rounded-lg transition-all border border-black/10 dark:border-white/5 shadow-sm"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
              All <span className="text-orange-600 italic">Insights</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">
              Listing: <span className="text-orange-500">{data.title}</span> • ID: {id.slice(-8)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <QuickStat
            icon={FiTrendingUp}
            label="Visibility Level"
            value={`Level ${data.level}`}
            color="text-orange-500"
          />
          <QuickStat icon={FiEye} label="Total Views" value={data.views} color="text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PPC ENGINE CARD */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c0c0c] rounded-lg p-8 border border-black/10 dark:border-white/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-blue-500/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
            <FiMousePointer size={140} />
          </div>

          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <FiActivity className="text-blue-600 dark:text-blue-500" size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                Click Campaign Results
              </h2>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                ppc.isActive
                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                  : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${ppc.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              />
              {ppc.isActive ? 'Live & Active' : 'Campaign Ended'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <MetricBox label="Clicks Remaining" value={ppc.clicksRemaining} sub="In Queue" />
            <MetricBox label="Clicks Delivered" value={ppc.clicksUsed} sub="Successfully" />
            <MetricBox label="Current Balance" value={`€${ppc.balance}`} sub="In Wallet" />
            <MetricBox label="Avg. Cost" value={`€${ppc.costPerClick}`} sub="Per Click" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Budget Consumption
              </p>
              <p className="text-sm font-black text-blue-600 dark:text-blue-500 italic">
                {ppc.consumptionRate}%
              </p>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                style={{ width: `${ppc.consumptionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* BOOST STATUS CARD */}
        <div
          className={`rounded-lg p-8 border transition-all flex flex-col justify-between overflow-hidden relative shadow-sm ${
            boost.isExpiringSoon
              ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/30'
              : 'bg-white dark:bg-[#0c0c0c] border-black/10 dark:border-white/5'
          }`}
        >
          {boost.isExpiringSoon && (
            <div className="absolute top-0 left-0 w-full py-1.5 bg-orange-500 text-[8px] font-black text-center text-white uppercase tracking-[0.3em]">
              Ending Soon • Urgent
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-orange-500/10 rounded-lg">
                <FiZap className="text-orange-600 dark:text-orange-500" size={20} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                Viral Boost
              </h2>
            </div>

            <div className="text-center py-6">
              <div
                className={`text-7xl font-black tracking-tighter mb-2 ${
                  boost.isExpiringSoon ? 'text-orange-600' : 'text-gray-900 dark:text-white'
                }`}
              >
                {boost.isExpiringSoon ? boost.hoursRemaining : boost.daysRemaining}
              </div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">
                {boost.isExpiringSoon ? 'Hours Left' : 'Days Remaining'}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
              <FiClock
                className={boost.isExpiringSoon ? 'text-orange-500' : 'text-gray-400'}
                size={20}
              />
              <div className="overflow-hidden">
                <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Expires On
                </p>
                <p className="text-[11px] font-bold text-gray-800 dark:text-white truncate">
                  {boost.isActive
                    ? new Date(boost.expiresAt).toLocaleDateString(undefined, { dateStyle: 'long' })
                    : 'Promotion Ended'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual Components
const QuickStat = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/5 px-6 py-4 rounded-lg flex items-center gap-4 shadow-sm">
    <Icon size={18} className={color} />
    <div>
      <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  </div>
);

const MetricBox = ({ label, value, sub }) => (
  <div className="bg-gray-50 dark:bg-white/2 border border-black/5 dark:border-white/5 p-5 rounded-lg transition-all hover:border-blue-500/30">
    <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
      {label}
    </p>
    <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
      {value}
    </div>
    <p className="text-[7px] text-gray-500 uppercase font-bold italic mt-1">{sub}</p>
  </div>
);
