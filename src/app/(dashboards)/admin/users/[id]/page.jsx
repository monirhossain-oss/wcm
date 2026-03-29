'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiActivity,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiHash,
  FiCheckCircle,
  FiLock,
  FiSlash,
  FiUser,
  FiClock,
  FiExternalLink,
  FiDollarSign,
  FiMousePointer,
  FiEye,
} from 'react-icons/fi';
import { Wallet, ShieldCheck, CreditCard, Award, BarChart3 } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/users/${id}`);
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      toast.error('FAILED TO FETCH CORE INTELLIGENCE');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleToggleAction = async (userId, action) => {
    if (!user) return;

    let isReverting =
      (action === 'block' && user.status === 'blocked') ||
      (action === 'suspend' && user.status === 'suspended');

    const confirmMessage = `CONFIRM ACTION: Are you sure you want to ${isReverting ? 'RE-ACTIVATE' : action.toUpperCase()} ${user.firstName.toUpperCase()}'s account?`;
    if (!window.confirm(confirmMessage)) return;

    const toastId = toast.loading(`Processing ${action}...`);
    try {
      const res = await api.put(`/api/admin/toggle-status/${userId}?action=${action}`);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, status: res.data.status }));
        toast.success(`Protocol Updated: User is now ${res.data.status.toUpperCase()}`, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Protocol failure', { id: toastId });
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!user)
    return (
      <div className="text-center py-20 font-black uppercase text-gray-500 italic tracking-[0.5em]">
        PROTOCOL_NOT_FOUND
      </div>
    );

  // Extracting data for cleaner access
  const profile = user.profile || {};
  const creatorData = user.creatorRequest || {};
  const stats = user.dashboardStats?.data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-20">
      <Toaster position="top-right" />

      {/* 🔹 HEADER CONTROL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 p-4 rounded-md shadow-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-all group"
        >
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md group-hover:border-orange-500/50 border border-transparent transition-all">
            <FiArrowLeft size={16} />
          </div>
          BACK_TO_REGISTRY
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right pr-4 border-r border-white/10">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">
              ENTITY_ID
            </p>
            <p className="text-[10px] font-bold dark:text-white uppercase italic">{user._id}</p>
          </div>
          <StatusBadge status={user.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🔹 LEFT COLUMN: IDENTITY & WALLET */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-md p-8 relative overflow-hidden shadow-2xl">
            {/* Cover Image Subtle Background */}
            {profile.coverImage && (
              <div className="absolute top-0 left-0 w-full h-24 opacity-20 grayscale">
                <img src={profile.coverImage} className="w-full h-full object-cover" alt="cover" />
              </div>
            )}

            <div className="relative flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-md bg-zinc-900 border-2 border-orange-500/20 overflow-hidden shadow-2xl p-1 mb-6 relative group">
                <img
                  src={
                    profile.profileImage ||
                    `https://ui-avatars.com/api/?name=${user.firstName}&background=orange&color=fff`
                  }
                  className="w-full h-full object-cover rounded-md grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt="profile"
                />
              </div>

              <h1 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">
                {user.firstName} <span className="text-orange-500">{user.lastName}</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.4em] uppercase mt-1">
                @{user.username}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Tag
                  label={user.role}
                  color={
                    user.role === 'creator'
                      ? 'text-purple-500 border-purple-500/20 bg-purple-500/5'
                      : 'text-orange-500 border-orange-500/20 bg-orange-500/5'
                  }
                />
                <Tag
                  label={profile.customerType}
                  color="text-blue-500 border-blue-500/20 bg-blue-500/5"
                />
              </div>
            </div>

            <div className="mt-10 space-y-4 border-t dark:border-white/5 pt-8">
              <InfoItem icon={FiMail} label="MASTER_EMAIL" value={user.email} />
              <InfoItem
                icon={FiCalendar}
                label="JOINED_ON"
                value={new Date(user.createdAt).toLocaleString()}
              />
              <InfoItem
                icon={FiMapPin}
                label="LOCATION"
                value={`${profile.city || 'N/A'}, ${profile.country || 'N/A'} (${profile.countryCode || ''})`}
              />
              <InfoItem icon={FiGlobe} label="LANGUAGE" value={profile.language || 'English'} />
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-md p-8 relative overflow-hidden shadow-2xl group">
            <div className="absolute -right-4 -top-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Wallet size={120} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 relative">
              Active_Wallet_Balance
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter text-white mt-2 flex items-baseline gap-2 relative">
              <span className="text-orange-500 text-xl font-sans">€</span>
              {user.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* 🔹 RIGHT COLUMN: DEEP DATA */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION: CREATOR PROTOCOL */}
          {user.role === 'creator' && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-md p-8 relative">
              <div className="absolute top-8 right-8 text-purple-500 opacity-20">
                <Award size={40} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-purple-500 mb-8 flex items-center gap-3">
                <Award size={18} /> Creator_Protocol_Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailBox
                  label="Account Status"
                  value={creatorData.status}
                  icon={FiCheckCircle}
                  highlight={creatorData.status === 'approved'}
                />
                <DetailBox
                  label="Approval Timestamp"
                  value={
                    creatorData.appliedAt ? new Date(creatorData.appliedAt).toLocaleString() : 'N/A'
                  }
                  icon={FiClock}
                />
              </div>
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-md">
                <p className="text-[8px] font-black uppercase text-purple-400 mb-1">
                  Admin_Review_Note
                </p>
                <p className="text-[11px] italic text-purple-200">
                  {creatorData.adminComment || 'No admin notes available.'}
                </p>
              </div>
            </div>
          )}

          {/* SECTION: BUSINESS & PROFILE INFO */}
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 rounded-md p-8 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white mb-10 flex items-center gap-3">
              <FiBriefcase className="text-orange-500" /> Professional_Profile_Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <DetailBox label="Display Name" value={profile.displayName} icon={FiUser} />
              <DetailBox
                label="Business/Brand Name"
                value={profile.businessName}
                icon={FiActivity}
              />
              <DetailBox
                label="VAT Identification"
                value={profile.vatNumber || 'UNREGISTERED'}
                icon={CreditCard}
              />
              <DetailBox
                label="VAT Validation"
                value={profile.isVatValid ? 'VALIDATED' : 'NOT_VALID'}
                icon={ShieldCheck}
                highlight={profile.isVatValid}
              />
              <DetailBox label="Website" value={profile.websiteLink} icon={FiGlobe} isLink />
              <DetailBox
                label="Social Hub"
                value={profile.socialLink}
                icon={FiExternalLink}
                isLink
              />
            </div>
            <div className="mt-8 pt-8 border-t dark:border-white/5">
              <p className="text-[8px] font-black uppercase text-gray-500 mb-2 tracking-widest">
                Public_Bio_Manifest
              </p>
              <p className="text-[12px] italic dark:text-gray-400 leading-relaxed">
                {profile.bio || 'NO_BIO_PROVIDED'}
              </p>
            </div>
          </div>

          {/* SECTION: REAL PLATFORM METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              label="Total_Listings"
              value={stats.totalListings || 0}
              icon={FiHash}
              color="text-blue-500"
            />
            <MetricCard
              label="Total_Platform_Views"
              value={stats.totalViews || 0}
              icon={FiEye}
              color="text-orange-500"
            />
            <MetricCard
              label="Total_Clicks"
              value={stats.totalClicks || 0}
              icon={FiMousePointer}
              color="text-pink-500"
            />
            <MetricCard
              label="Active_Promotions"
              value={stats.totalActivePromoted || 0}
              icon={FiCheckCircle}
              color="text-emerald-500"
            />
            <MetricCard
              label="Monthly_Spend"
              value={`€${stats.totalMonthlySpend || '0.00'}`}
              icon={FiDollarSign}
              color="text-yellow-500"
            />
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 p-6 rounded-md flex flex-col justify-center">
              <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-2">
                LAST_METRIC_SYNC
              </p>
              <p className="text-[11px] font-bold dark:text-white uppercase">
                {user.dashboardStats?.lastUpdated
                  ? new Date(user.dashboardStats.lastUpdated).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* SECTION: HAZARD PROTOCOL */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-md p-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500 mb-8 flex items-center gap-2">
              <FiAlertCircle /> Hazard_Protocol_Action_Center
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleToggleAction(user._id, 'suspend')}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 ${user.status === 'suspended' ? 'bg-emerald-600' : 'bg-orange-500'} text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:scale-[1.02] transition-all shadow-lg`}
              >
                {user.status === 'suspended' ? (
                  <>
                    <FiCheckCircle /> Reactivate_Access
                  </>
                ) : (
                  <>
                    <FiSlash /> Suspend_Account
                  </>
                )}
              </button>
              <button
                onClick={() => handleToggleAction(user._id, 'block')}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 ${user.status === 'blocked' ? 'bg-emerald-600' : 'bg-red-600'} text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:scale-[1.02] transition-all shadow-lg`}
              >
                {user.status === 'blocked' ? (
                  <>
                    <FiCheckCircle /> Lift_Blockade
                  </>
                ) : (
                  <>
                    <FiLock /> Block_Protocol
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ATOMIC COMPONENTS ---
const Tag = ({ label, color }) => (
  <span
    className={`px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest border ${color}`}
  >
    {label}
  </span>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="p-2.5 rounded-md bg-gray-50 dark:bg-white/5 text-gray-400 border border-white/5">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[7px] font-black uppercase text-gray-500 tracking-[0.2em]">{label}</p>
      <p className="text-[11px] font-bold dark:text-white truncate max-w-[200px]">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const DetailBox = ({ label, value, icon: Icon, highlight, isLink }) => (
  <div className="flex gap-4 group">
    <div className="mt-1 text-orange-500 opacity-40 group-hover:opacity-100 transition-opacity">
      <Icon size={18} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">{label}</p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-black italic uppercase tracking-tight text-blue-500 hover:underline flex items-center gap-1"
        >
          {value.replace('https://', '')} <FiExternalLink size={10} />
        </a>
      ) : (
        <p
          className={`text-[13px] font-black italic uppercase tracking-tight truncate ${highlight ? 'text-emerald-500' : 'dark:text-white'}`}
        >
          {value || 'N/A'}
        </p>
      )}
    </div>
  </div>
);

const MetricCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/10 p-6 rounded-md shadow-sm hover:border-orange-500/30 transition-all group">
    <div
      className={`p-3 rounded-md bg-gray-50 dark:bg-white/5 w-fit mb-4 ${color} group-hover:scale-110 transition-transform`}
    >
      <Icon size={20} />
    </div>
    <p className="text-[22px] font-black italic tracking-tighter dark:text-white">{value}</p>
    <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest mt-1">
      {label.replace(/_/g, ' ')}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
    suspended: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };
  return (
    <div
      className={`px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-[0.2em] border ${config[status] || config.active}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {status}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-10 animate-pulse space-y-6">
    <div className="h-16 bg-white/5 rounded-md w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 h-[600px] bg-white/5 rounded-md" />
      <div className="lg:col-span-8 space-y-6">
        <div className="h-[300px] bg-white/5 rounded-md" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
