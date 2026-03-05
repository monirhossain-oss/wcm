'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiZap, FiClock, FiMousePointer, FiArrowLeft, FiActivity } from 'react-icons/fi';
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
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load insights', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStats();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#050505] bg-gray-50">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  // ক্যালকুলেশনগুলো ভেরিয়েবলে নিয়ে আসা যাতে ভুল না হয়
  const { ppc, boost } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans px-4 pt-10 animate-in fade-in duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-orange-500 hover:text-white rounded transition-all"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
              <FiActivity className="text-orange-500" /> Performance{' '}
              <span className="text-orange-500">Node</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
              Target: {data.title}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <HeaderStat label="Rank Level" value={data.level} color="text-orange-500" />
          <HeaderStat label="Total Views" value={data.views} color="dark:text-white text-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PPC Logic Card */}
        <div className="md:col-span-2 bg-white dark:bg-[#0c0c0c] rounded-md p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white">
                <FiMousePointer className="text-blue-500" /> PPC Campaign Logic
              </h2>
              <span
                className={`text-[9px] font-black uppercase tracking-widest italic ${ppc.isActive ? 'text-green-500' : 'text-red-500'}`}
              >
                {ppc.isActive ? '● Executing' : '○ Standby'}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <DataBox label="Available" value={ppc.clicksRemaining} unit="Clicks" />
              <DataBox label="Executed" value={ppc.clicksUsed} unit="Clicks" />
              <DataBox label="Credit" value={`€${ppc.balance}`} unit="EUR" />
              <DataBox label="Unit Cost" value={`€${ppc.costPerClick}`} unit="CPC" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <span>Budget Depletion</span>
              <span className="text-blue-500">{ppc.consumptionRate}% Used</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000"
                style={{ width: `${ppc.consumptionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Boost Card */}
        <div className="bg-white dark:bg-[#0c0c0c] rounded-md p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white mb-8">
              <FiZap className="text-yellow-500" /> Viral Protocol
            </h2>

            <div className="text-center py-6 bg-gray-50 dark:bg-white/5 rounded">
              <div className="text-5xl font-black tracking-tighter text-yellow-500">
                {boost.daysRemaining}
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Days Remaining
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-white/5">
              <FiClock className="text-yellow-500" size={16} />
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase">Status</p>
                <p className="text-[10px] font-bold dark:text-white">
                  {boost.isActive
                    ? `Expires: ${new Date(boost.expiresAt).toLocaleDateString()}`
                    : 'Not Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
const HeaderStat = ({ label, value, color }) => (
  <div className="bg-white dark:bg-[#0c0c0c] px-5 py-3 rounded border border-gray-100 dark:border-white/5 text-center min-w-[100px]">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

const DataBox = ({ label, value, unit }) => (
  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded border border-gray-100 dark:border-white/5">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="text-lg font-black dark:text-white tracking-tight">{value}</div>
    <p className="text-[7px] text-gray-500 uppercase font-bold italic">{unit}</p>
  </div>
);
