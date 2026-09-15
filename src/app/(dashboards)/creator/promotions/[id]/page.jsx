'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiZap,
  FiArrowLeft,
  FiActivity,
  FiTrendingUp,
  FiEye,
  FiFileText,
  FiCreditCard,
  FiPauseCircle,
  FiPlayCircle,
  FiXCircle,
  FiRefreshCcw,
  FiEdit3,
  FiSave,
  FiX,
} from 'react-icons/fi';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { formatReportingDate } from '@/lib/reportingTime';
import { useLocale } from '@/context/LocaleContext';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import { getApiErrorMessage } from '@/lib/apiError';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function PromotionInsightsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { locale, t, tf } = useLocale();
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Edit States
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ days: 7, budget: 20, clicks: 50 });

  const fetchStats = useCallback(async () => {
    try {
      const [insightsRes, transRes] = await Promise.all([
        // The listing title comes back in the reader's language.
        api.get(`/api/creator/promotion-insights/${id}`, { params: { language: locale } }),
        api.get(`/api/creator/my-transactions`),
      ]);
      if (insightsRes.data.success) setData(insightsRes.data.data);
      const filteredTrans =
        transRes.data.transactions?.filter((tx) => (tx.listing?._id || tx.listing) === id) || [];
      setTransactions(filteredTrans);
    } catch (err) {
      toast.error(t('creator.insights.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [id, locale, t]);

  useEffect(() => {
    if (id) fetchStats();
  }, [id, fetchStats]);

  const handleTogglePause = async (packageType) => {
    setActionLoading(`${packageType}_pause`);
    try {
      const res = await api.post('/api/payments/toggle-pause-promotion', {
        listingId: id,
        packageType,
      });
      if (res.data.success) {
        toast.success(
          res.data.isPaused ? t('creator.insights.paused') : t('creator.insights.resumed')
        );
        fetchStats();
      }
    } catch (err) {
      toast.error(t('creator.insights.actionFailed'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (packageType) => {
    // The refund shown comes from the server, which runs the same calculation cancelPromotion then
    // credits (utils/promotionRefund.js). The dashboard used to estimate it with its own proportional
    // formula and could promise more than the wallet received.
    setActionLoading(`${packageType}_cancel`);
    let previewAmount;
    try {
      const { data: preview } = await api.get('/api/payments/refund-preview', {
        params: { listingId: id, packageType },
      });
      previewAmount = preview.refundAmount;
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('creator.insights.refundPreviewFailed'), t));
      return;
    } finally {
      setActionLoading(null);
    }

    const confirmMessage = tf('creator.insights.cancelConfirm', {
      type: t(`creator.packageType.${packageType}`, packageType).toUpperCase(),
      amount: formatCurrency(previewAmount, locale),
    });

    if (!window.confirm(confirmMessage)) return;

    setActionLoading(`${packageType}_cancel`);
    try {
      const res = await api.post('/api/payments/cancel-promotion', {
        listingId: id,
        packageType,
        // The refund's invoice is issued in the language this page is showing.
        locale,
      });

      if (res.data.success) {
        toast.success(
          tf('creator.insights.refunded', {
            amount: formatCurrency(res.data.refundAmount, locale),
          })
        );
        fetchStats(); // ডাটা রিফ্রেশ
      }
    } catch (err) {
      console.error('Cancel Error:', err);
      toast.error(getApiErrorMessage(err, t('creator.insights.cancelFailed'), t));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSubmit = async (packageType) => {
    setActionLoading(`${packageType}_edit`);
    try {
      const payload = {
        listingId: id,
        packageType,
        locale,
        amountInEUR: Number(editData.budget),
        days: packageType === 'boost' ? Number(editData.days) : 0,
        totalClicks: packageType === 'ppc' ? Number(editData.clicks) : 0,
      };
      await api.post('/api/payments/purchase-promotion', payload);
      toast.success(t('creator.insights.updated'));
      setEditMode(null);
      fetchStats();
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('creator.insights.updateFailed'), t));
    } finally {
      setActionLoading(null);
    }
  };

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
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(t('creator.insights.downloadFailed'));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!data) return null;
  const { ppc, boost } = data;
  const boostIsLive =
    !!boost?.isActive &&
    !!boost?.expiresAt &&
    new Date(boost.expiresAt).getTime() > Date.now() &&
    Number(boost.hoursRemaining || 0) > 0;
  const ppcIsLive = !!ppc?.isActive && Number(ppc.balance || 0) > 0;
  const statusLabel = (isLive, isPaused) =>
    isLive
      ? t(isPaused ? 'creator.promoStatus.paused' : 'creator.promoStatus.live')
      : t('creator.promoStatus.ended');
  const ppcStatusLabel = statusLabel(ppcIsLive, ppc.isPaused);
  const boostStatusLabel = statusLabel(boostIsLive, boost.isPaused);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 dark:border-white/5 pb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white dark:bg-white/5 hover:bg-orange-500 hover:text-white rounded-xl border border-black/10 dark:border-white/5 shadow-sm transition-all"
          >
            <FiArrowLeft size={20} aria-label={t('creator.insights.back')} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
              {t('creator.insights.headingLead')}{' '}
              <span className="text-orange-600 italic">{t('creator.insights.headingAccent')}</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
              {t('creator.insights.asset')} <span className="text-orange-500">{data.title}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <QuickStat
            icon={FiTrendingUp}
            label={t('creator.insights.rankScore')}
            value={tf('creator.insights.level', { level: data.level })}
            color="text-orange-500"
          />
          <QuickStat
            icon={FiEye}
            label={t('creator.insights.organicReach')}
            value={data.views}
            color="text-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PPC ENGINE */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c0c0c] rounded-2xl p-6 border border-black/10 dark:border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <FiActivity className="text-blue-500" size={20} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                {t('creator.insights.ppcHeading')}
              </h2>
            </div>

            {editMode === 'ppc' ? (
              <EditPanel
                type="ppc"
                values={editData}
                setValues={setEditData}
                onClose={() => setEditMode(null)}
                onSubmit={() => handleEditSubmit('ppc')}
                loading={actionLoading === 'ppc_edit'}
                locale={locale}
                t={t}
                tf={tf}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <MetricBox
                    label={t('creator.insights.inQueue')}
                    value={ppc.clicksRemaining}
                    sub={t('creator.insights.clicksLeft')}
                  />
                  <MetricBox
                    label={t('creator.insights.delivered')}
                    value={ppc.clicksUsed}
                    sub={t('creator.insights.totalSent')}
                  />
                  <MetricBox
                    label={t('creator.insights.budget')}
                    value={formatCurrency(ppc.balance, locale)}
                    sub={t('creator.insights.remaining')}
                  />
                  <MetricBox
                    label={t('creator.insights.status')}
                    value={ppcStatusLabel}
                    sub={t('creator.insights.currentState')}
                  />
                </div>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      {t('creator.insights.deliveryProgress')}
                    </p>
                    <p className="text-sm font-black text-blue-500 italic">
                      {formatPercent(ppc.consumptionRate, locale)}%
                    </p>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${ppc.isPaused ? 'bg-zinc-400' : 'bg-blue-600 shadow-lg'}`}
                      style={{ width: `${ppc.consumptionRate}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons at Bottom */}
          {ppcIsLive && editMode !== 'ppc' && (
            <div className="flex items-center pt-6 border-t border-black/5 dark:border-white/5">
              <ControlBtn
                icon={ppc.isPaused ? FiPlayCircle : FiPauseCircle}
                label={ppc.isPaused ? t('creator.insights.resume') : t('creator.insights.pause')}
                onClick={() => handleTogglePause('ppc')}
                loading={actionLoading === 'ppc_pause'}
              />
              <ControlBtn
                icon={FiEdit3}
                label={t('creator.insights.extend')}
                onClick={() => setEditMode('ppc')}
              />
              <ControlBtn
                icon={FiXCircle}
                label={t('creator.insights.refund')}
                onClick={() => handleCancel('ppc')}
                color="text-red-500 hover:bg-red-500/10"
                loading={actionLoading === 'ppc_cancel'}
              />
            </div>
          )}
        </div>

        {/* BOOST CARD */}
        <div
          className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative shadow-sm ${boostIsLive ? 'bg-white dark:bg-[#0c0c0c] border-orange-500/20' : 'bg-zinc-50 dark:bg-white/2 opacity-60'}`}
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-orange-500/10 rounded-lg">
                <FiZap className="text-orange-500" size={20} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-widest">
                {t('creator.insights.boostHeading')}
              </h2>
            </div>

            {editMode === 'boost' ? (
              <EditPanel
                type="boost"
                values={editData}
                setValues={setEditData}
                onClose={() => setEditMode(null)}
                onSubmit={() => handleEditSubmit('boost')}
                loading={actionLoading === 'boost_edit'}
                locale={locale}
                t={t}
                tf={tf}
              />
            ) : (
              <div className="text-center py-6 mb-10">
                <div
                  className={`text-7xl font-black tracking-tighter mb-2 ${boost.isPaused ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}
                >
                  {boostIsLive
                    ? boost.isExpiringSoon
                      ? boost.hoursRemaining
                      : boost.daysRemaining
                    : '0'}
                </div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                  {boostIsLive
                    ? boost.isPaused
                      ? t('creator.promoStatus.paused')
                      : boost.isExpiringSoon
                        ? t('creator.insights.hoursLeft')
                        : t('creator.insights.daysLeft')
                    : t('creator.promoStatus.ended')}
                </p>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-orange-500">
                  {boostStatusLabel}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons at Bottom */}
          {boostIsLive && editMode !== 'boost' && (
            <div className="flex items-center pt-6 border-t border-black/5 dark:border-white/5">
              <ControlBtn
                icon={boost.isPaused ? FiPlayCircle : FiPauseCircle}
                label={
                  boost.isPaused ? t('creator.insights.resume') : t('creator.insights.pause')
                }
                onClick={() => handleTogglePause('boost')}
                loading={actionLoading === 'boost_pause'}
              />
              {/* <ControlBtn icon={FiEdit3} label="Extend" onClick={() => setEditMode('boost')} /> */}
              <ControlBtn
                icon={FiXCircle}
                label={t('creator.insights.refund')}
                onClick={() => handleCancel('boost')}
                color="text-red-500 hover:bg-red-500/10"
                loading={actionLoading === 'boost_cancel'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-black/5 dark:border-white/5 flex items-center gap-3">
          <FiCreditCard className="text-orange-500" />
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-400">
            {t('creator.insights.paymentHistory')}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="px-8 py-5">{t('creator.insights.columnDate')}</th>
                <th className="px-8 py-5">{t('creator.insights.columnType')}</th>
                <th className="px-8 py-5">{t('creator.insights.columnAmount')}</th>
                <th className="px-8 py-5 text-right">{t('creator.insights.columnInvoice')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {transactions.map((tx, idx) => (
                <tr key={tx._id || idx} className="hover:bg-zinc-50 dark:hover:bg-white/2 transition-all">
                  <td className="px-8 py-4 text-[10px] font-bold text-zinc-500">
                    {formatReportingDate(tx.createdAt, {}, locale)}
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm ${tx.packageType === 'boost' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}
                    >
                      {t(`creator.packageType.${tx.packageType}`, tx.packageType)}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-[12px] font-black dark:text-white">
                    {formatCurrency(tx.amountPaid, locale, tx.currency)}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => downloadInvoice(tx._id)}
                      className="p-2 text-zinc-400 hover:text-orange-500 transition-colors"
                    >
                      <FiFileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- New Control Button Component ---
const ControlBtn = ({
  icon: Icon,
  label,
  onClick,
  loading,
  color = 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5',
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${color}`}
  >
    {loading ? <FiRefreshCcw className="animate-spin" size={14} /> : <Icon size={14} />}
    {label}
  </button>
);

const QuickStat = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 shadow-sm">
    <Icon size={18} className={color} />
    <div>
      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  </div>
);

const MetricBox = ({ label, value, sub }) => (
  <div className="bg-zinc-50 dark:bg-white/2 border border-black/5 dark:border-white/5 p-5 rounded-xl transition-all hover:border-blue-500/30">
    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
      {value}
    </div>
    <p className="text-[7px] text-zinc-500 uppercase font-bold italic mt-1">{sub}</p>
  </div>
);

const PPC_RATE = 0.3;

const EditPanel = ({ type, values, setValues, onClose, onSubmit, loading, locale, t, tf }) => {
  const extraClicks = type === 'ppc' ? Math.floor(Number(values.budget || 0) / PPC_RATE) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border border-orange-500/10 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
          <FiEdit3 />{' '}
          {type === 'boost'
            ? t('creator.insights.editBoostTitle')
            : t('creator.insights.editPpcTitle')}
        </h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-red-500">
          <FiX size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {type === 'boost' ? (
          <InputBox
            label={t('creator.insights.addDays')}
            value={values.days}
            onChange={(v) => setValues({ ...values, days: v })}
            placeholder="e.g. 7"
          />
        ) : (
          <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-xl border border-black/5 dark:border-white/5">
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
              {t('creator.insights.estimatedGrowth')}
            </p>
            <p className="text-xl font-black text-blue-500 tracking-tighter">
              {tf('creator.insights.extraClicks', { count: extraClicks })}
            </p>
          </div>
        )}

        <InputBox
          label={t('creator.insights.addBudget')}
          value={values.budget}
          onChange={(v) => {
            setValues({
              ...values,
              budget: v,
              clicks: type === 'ppc' ? Math.floor(Number(v) / PPC_RATE) : values.clicks,
            });
          }}
          placeholder="Min €5"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-300 transition-all"
        >
          {t('creator.common.cancel')}
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || Number(values.budget) < 1}
          className="flex-[2] py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-lg disabled:opacity-30"
        >
          {loading ? <FiRefreshCcw className="animate-spin" /> : <FiSave />}
          {tf('creator.insights.confirmAndPay', {
            amount: formatCurrency(values.budget, locale),
          })}
        </button>
      </div>
    </div>
  );
};

const InputBox = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 p-3 rounded-xl text-xs font-black outline-none focus:ring-1 ring-orange-500/50 dark:text-white"
    />
  </div>
);
