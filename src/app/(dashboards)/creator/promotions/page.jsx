'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiZap, FiX, FiActivity, FiInfo, FiEye } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import CreatorWallet from '@/components/creator/CreatorWallet';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { formatCurrency } from '@/lib/i18n/formatters';
import { getApiErrorMessage } from '@/lib/apiError';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// `id`, `price` and `days` mirror `wcm-server/src/constants/promotion.js` and are validated there
// on purchase, so they stay literal. Only the reader-facing name and description are localized.
const BOOST_PACKAGES = [
  { id: 'starter', price: 12, days: 7 },
  { id: 'standard', price: 29, days: 14 },
  { id: 'premium', price: 79, days: 30 },
];

/**
 * Returns the display status of a listing based on its promotion state.
 *
 * Logic:
 * - 'live'    → at least one campaign (boost or ppc) is active AND not paused
 * - 'paused'  → at least one campaign exists (boost or ppc) but ALL active ones are paused
 * - 'organic' → no campaigns at all
 */
function getListingStatus(listing) {
  const boost = listing.activePromoTypes?.boost;
  const ppc = listing.activePromoTypes?.ppc;
  const boostPaused = listing.promoMeta?.boostPaused;
  const ppcPaused = listing.promoMeta?.ppcPaused;

  const hasAny = boost || ppc;
  if (!hasAny) return 'organic';

  // If at least one is active and NOT paused → live
  const boostLive = boost && !boostPaused;
  const ppcLive = ppc && !ppcPaused;
  if (boostLive || ppcLive) return 'live';

  // Has campaigns but all are paused
  return 'paused';
}

export default function PromotionsPage() {
  const { isBusinessRestricted } = useAuth();
  const { locale, localize, t, tf } = useLocale();
  const [listings, setListings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Promo States
  const [promoType, setPromoType] = useState('boost');
  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const pathname = usePathname();
  const currentCost = promoType === 'boost' ? Number(boostBudget) : Number(ppcAmount);

  const PPC_COST_PER_CLICK = 0.3;

  const hasActiveBoost = selectedListing?.activePromoTypes?.boost || false;
  const hasActivePpc = selectedListing?.activePromoTypes?.ppc || false;

  const estimatedClicks = Math.floor(ppcAmount / PPC_COST_PER_CLICK);

  useEffect(() => {
    initData();
    // Bootstrap only. `initData` became reactive once its error toast started reading the catalog,
    // but the rows it loads are API data that do not change with the reader's language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initData = async () => {
    try {
      const [listRes, userRes] = await Promise.all([
        api.get('/api/listings/my-listings'),
        api.get('/api/users/me'),
      ]);

      const normalizedListings = listRes.data
        .filter((l) => l.status === 'approved')
        .map((listing) => {
          const boostActive =
            listing.activePromoTypes?.boost ??
            (listing.promotion?.boost?.isActive &&
              listing.promotion?.boost?.expiresAt &&
              new Date(listing.promotion.boost.expiresAt) > new Date());

          const ppcActive =
            listing.activePromoTypes?.ppc ??
            (listing.promotion?.ppc?.isActive &&
              Number(listing.promotion?.ppc?.ppcBalance || 0) > 0);

          // Read isPaused from the promotion object (from mongoose schema)
          const boostPaused = listing.promotion?.boost?.isPaused ?? false;
          const ppcPaused = listing.promotion?.ppc?.isPaused ?? false;

          return {
            ...listing,
            isPromoted: boostActive || ppcActive,
            activePromoTypes: {
              boost: !!boostActive,
              ppc: !!ppcActive,
            },
            // Store pause state separately so getListingStatus can use it
            promoMeta: {
              boostPaused,
              ppcPaused,
            },
          };
        });

      setListings(normalizedListings);
      setWalletBalance(userRes.data.walletBalance || 0);
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('creator.promotions.syncFailed'), t));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (promoType === 'boost') {
      setBoostBudget(BOOST_PACKAGES[0].price);
      setBoostDays(BOOST_PACKAGES[0].days);
    }
  }, [promoType]);

  // মডাল খুললে: চলমান ক্যাম্পেইন অনুযায়ী ট্যাব বাছাই + সম্মতি রিসেট
  useEffect(() => {
    if (!selectedListing) return;

    const boostBusy = !!selectedListing.activePromoTypes?.boost;
    const ppcBusy = !!selectedListing.activePromoTypes?.ppc;

    setPromoType(boostBusy && !ppcBusy ? 'ppc' : 'boost');
    setAgreedToTerms(false);
  }, [selectedListing]);

  // মডাল খোলা অবস্থায় background scroll বন্ধ, আর Escape দিয়ে বন্ধ করা
  useEffect(() => {
    if (!selectedListing) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !actionLoading) setSelectedListing(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedListing, actionLoading]);

  const handlePurchase = async () => {
    if (isBusinessRestricted) return toast.error(t('creator.restricted.action'));
    if (walletBalance < currentCost) return toast.error(t('creator.promotions.insufficientCredits'));
    setActionLoading(true);
    const toastId = toast.loading(t('creator.promotions.executing'));
    try {
      const selectedPkgId =
        promoType === 'boost' ? BOOST_PACKAGES.find((pkg) => pkg.price === boostBudget)?.id : null;
      const payload = {
        listingId: selectedListing._id,
        packageType: promoType,
        packageId: selectedPkgId,
        amountInEUR: currentCost,
        days: promoType === 'boost' ? Number(boostDays) : 0,
        totalClicks: promoType === 'ppc' ? Number(targetClicks) : 0,
      };
      const res = await api.post('/api/payments/purchase-promotion', payload);
      setWalletBalance(res.data.newBalance);
      toast.success(t('creator.promotions.launched'), { id: toastId });
      setSelectedListing(null);
      initData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('creator.promotions.transactionFailed'), t), { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const isBoostActive = (listing) => !!listing?.activePromoTypes?.boost;
  const isPpcActive = (listing) => !!listing?.activePromoTypes?.ppc;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] animate-pulse" />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-20">
      <Toaster position="top-center" />
      {/* Wallet Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreatorWallet walletBalance={walletBalance} pathname={pathname} />

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
            {t('creator.promotions.managedAssets')}
          </p>
          <p className="text-4xl font-black dark:text-white mt-1 tracking-tighter">
            {listings.length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
            <FiActivity className="text-orange-500" size={16} />{' '}
            {t('creator.promotions.assetList')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-zinc-400 font-black border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
                <th className="px-8 py-5">{t('creator.promotions.columnItem')}</th>
                <th className="px-8 py-5">{t('creator.promotions.columnStatus')}</th>
                <th className="px-8 py-5">{t('creator.promotions.columnPromotions')}</th>
                <th className="px-8 py-5 text-right">{t('creator.promotions.columnActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {currentItems.map((item) => {
                const boost = isBoostActive(item);
                const ppc = isPpcActive(item);
                const isFullyPromoted = boost && ppc;

                // ✅ Derive the correct status using the helper
                const listingStatus = getListingStatus(item);

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <img
                          src={getImageUrl(item.image)}
                          className="w-14 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm tracking-tight mb-1">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest italic">
                            {item.category?.title || t('creator.promotions.assetFallback')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ✅ Status Badge — now uses getListingStatus() */}
                    <td className="px-8 py-5">
                      {listingStatus === 'live' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          {t('creator.promoStatus.live')}
                        </span>
                      )}
                      {listingStatus === 'paused' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <span className="w-1 h-1 rounded-full bg-yellow-500" />
                          {t('creator.promoStatus.paused')}
                        </span>
                      )}
                      {listingStatus === 'organic' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                          {t('creator.promoStatus.organic')}
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        {boost && (
                          <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-[8px] font-black border border-orange-500/10">
                            {t('creator.packageType.boost')}
                          </span>
                        )}
                        {ppc && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[8px] font-black border border-blue-500/10">
                            {t('creator.packageType.ppc')}
                          </span>
                        )}
                        {!boost && !ppc && (
                          <span className="text-[10px] text-zinc-400 italic opacity-40">
                            {t('creator.common.empty')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <Link
                          href={`/creator/promotions/${item._id}`}
                          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                        >
                          <FiEye size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {t('creator.promotions.insights')}
                          </span>
                        </Link>
                        <button
                          disabled={isFullyPromoted || isBusinessRestricted}
                          onClick={() => setSelectedListing(item)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            isFullyPromoted
                              ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800 cursor-not-allowed opacity-50'
                              : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-600 shadow-md'
                          }`}
                        >
                          <FiZap size={14} />
                          {isFullyPromoted
                            ? t('creator.promotions.active')
                            : t('creator.promotions.promote')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 gap-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest order-2 sm:order-1">
              {tf('creator.promotions.showing', {
                from: indexOfFirstItem + 1,
                to: Math.min(indexOfLastItem, listings.length),
                total: listings.length,
              })}
            </p>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase disabled:opacity-20 dark:text-white hover:border-orange-500/50 transition-all active:scale-95"
              >
                {t('creator.common.prev')}
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all border ${
                        currentPage === pageNum
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase disabled:opacity-20 dark:text-white hover:border-orange-500/50 transition-all active:scale-95"
              >
                {t('creator.common.next')}
              </button>

              {totalPages > 2 && currentPage !== totalPages && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="ml-1 p-2.5 text-[10px] font-black uppercase text-zinc-400 hover:text-orange-500 transition-colors"
                  title={t('creator.common.goToLastPage')}
                >
                  {tf('creator.common.last', { count: totalPages })}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Promotion Modal */}
      {selectedListing && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !actionLoading) setSelectedListing(null);
          }}
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-modal-title"
            className="animate-creatorFade bg-white dark:bg-zinc-950 w-full sm:max-w-md flex flex-col max-h-[92dvh] sm:max-h-[88dvh] rounded-t-2xl sm:rounded-md shadow-2xl border border-zinc-200 dark:border-white/10"
          >
            {/* Drag handle — mobile bottom sheet affordance */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <span className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center gap-4 bg-zinc-50/50 dark:bg-white/5">
              <div className="min-w-0">
                <h3
                  id="promo-modal-title"
                  className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 dark:text-white"
                >
                  <FiZap className="text-orange-500 shrink-0" size={16} />{' '}
                  {t('creator.promotions.modal.title')}
                </h3>
                <p className="mt-1.5 truncate text-[10px] font-bold text-zinc-500 tracking-tight">
                  {selectedListing.title}
                </p>
              </div>
              <button
                type="button"
                aria-label={t('creator.promotions.modal.close')}
                onClick={() => setSelectedListing(null)}
                className="shrink-0 p-2 -mr-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
              <div className="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-md">
                <button
                  disabled={hasActiveBoost}
                  onClick={() => setPromoType('boost')}
                  className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    promoType === 'boost'
                      ? 'bg-white dark:bg-zinc-800 shadow-sm text-orange-600'
                      : 'text-zinc-500'
                  } ${hasActiveBoost ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {hasActiveBoost
                    ? t('creator.promotions.modal.boostActive')
                    : t('creator.promotions.modal.boostTab')}
                </button>
                <button
                  disabled={hasActivePpc}
                  onClick={() => setPromoType('ppc')}
                  className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    promoType === 'ppc'
                      ? 'bg-white dark:bg-zinc-800 shadow-sm text-orange-600'
                      : 'text-zinc-500'
                  } ${hasActivePpc ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {hasActivePpc
                    ? t('creator.promotions.modal.ppcActive')
                    : t('creator.promotions.modal.ppcTab')}
                </button>
              </div>

              {promoType === 'boost' ? (
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    {t('creator.promotions.modal.selectPackage')}
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {BOOST_PACKAGES.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setBoostBudget(pkg.price);
                          setBoostDays(pkg.days);
                        }}
                        className={`p-4 rounded-md border text-left transition-all ${
                          boostBudget === pkg.price
                            ? 'border-orange-500 bg-orange-500/5 ring-1 ring-orange-500'
                            : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                            {t(`creator.promotions.packages.${pkg.id}`)}
                          </span>
                          <span className="text-sm font-black text-orange-600">
                            {formatCurrency(pkg.price, locale)}
                          </span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter leading-tight">
                          {tf('creator.promotions.packages.summary', {
                            days: pkg.days,
                            description: t(`creator.promotions.packages.${pkg.id}Desc`),
                          })}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                      {t('creator.promotions.modal.budgetLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        value={ppcAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPpcAmount(val);
                          setTargetClicks(Math.floor(val / PPC_COST_PER_CLICK));
                        }}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-orange-500 p-4 rounded-md text-sm font-black outline-none dark:text-white transition-all"
                        placeholder={t('creator.promotions.modal.budgetPlaceholder')}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">
                        {t('creator.promotions.modal.currency')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-md border border-zinc-100 dark:border-white/5">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        {t('creator.promotions.modal.costPerClick')}
                      </p>
                      <p className="text-sm font-black dark:text-white">
                        {formatCurrency(PPC_COST_PER_CLICK, locale)}
                      </p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-md border border-zinc-100 dark:border-white/5">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        {t('creator.promotions.modal.estimatedClicks')}
                      </p>
                      <p className="text-sm font-black text-blue-500">~ {estimatedClicks}</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-500 font-medium italic">
                    {tf('creator.promotions.modal.clickRateNote', {
                      rate: PPC_COST_PER_CLICK.toFixed(2),
                    })}
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-white/5">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    {t('creator.promotions.modal.nonRefundable')}
                  </p>
                  <Link
                    href={localize('/boost-terms-and-ppc')}
                    className="text-[10px] font-black text-orange-500 uppercase tracking-tight flex items-center gap-1"
                  >
                    {t('creator.promotions.modal.learnMore')}{' '}
                    <span className="underline">{t('creator.promotions.modal.learnMoreLink')}</span>
                    <FiInfo size={12} />
                  </Link>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-orange-500 focus:ring-orange-500 bg-white dark:bg-zinc-900 transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {t('creator.promotions.modal.agree')}
                  </span>
                </label>
              </div>
            </div>

            {/* Footer — total ও action সবসময় দৃশ্যমান থাকে, স্ক্রল করলেও */}
            <div className="shrink-0 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950 px-5 sm:px-8 py-4 sm:py-5 space-y-4 rounded-b-none sm:rounded-b-md pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {t('creator.promotions.modal.total')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-orange-600 italic tracking-tighter">
                  {formatCurrency(currentCost, locale)}
                </span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={
                  actionLoading ||
                  isBusinessRestricted ||
                  walletBalance < currentCost ||
                  currentCost < 5 ||
                  !agreedToTerms
                }
                className="w-full py-4 sm:py-5 px-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-md font-black uppercase text-[10px] tracking-[0.2em] sm:tracking-[0.4em] transition-all hover:bg-orange-600 hover:text-white active:scale-[0.98] shadow-2xl disabled:opacity-20 disabled:hover:bg-zinc-900"
              >
                {actionLoading
                  ? t('creator.promotions.modal.initializing')
                  : walletBalance < currentCost
                    ? t('creator.promotions.modal.insufficient')
                    : t('creator.promotions.modal.launch')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
