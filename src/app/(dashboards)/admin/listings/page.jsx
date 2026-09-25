'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiCheck,
  FiX,
  FiEye,
  FiGlobe,
  FiTag,
  FiExternalLink,
  FiClock,
  FiShield,
  FiLayers,
  FiSend,
  FiLink,
  FiAward,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiShieldOff,
  FiSearch,
  FiAlertTriangle,
  FiUser,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// The last list fetched, shown straight away on the next visit while a fresh one loads behind it.
const LISTINGS_CACHE_KEY = 'wcm_admin_listings_cache';
const ITEMS_PER_PAGE = 8;

// One source for every place a status is drawn — the summary cards, the table and the review modal —
// so a status always has the same colour.
const STATUS_STYLES = {
  pending: {
    label: 'Pending',
    icon: FiClock,
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    tone: 'text-orange-500 bg-orange-500/10',
  },
  approved: {
    label: 'Approved',
    icon: FiShield,
    badge: 'bg-green-500/10 text-green-600 dark:text-green-400',
    tone: 'text-green-500 bg-green-500/10',
  },
  rejected: {
    label: 'Rejected',
    icon: FiX,
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    tone: 'text-pink-500 bg-pink-500/10',
  },
  blocked: {
    label: 'Blocked',
    icon: FiShieldOff,
    badge: 'bg-red-600/10 text-red-600 dark:text-red-400',
    tone: 'text-red-600 bg-red-600/10',
  },
};
const statusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.pending;
const FILTERS = ['all', 'pending', 'approved', 'rejected', 'blocked'];

// The codes are what the API stores; the labels are only what the Admin reads.
const REASON_LABELS = {
  ILLEGAL_CONTENT: 'Illegal content',
  HATE_OR_EXTREMISM: 'Hate or extremism',
  CULTURAL_MISREPRESENTATION: 'Cultural misrepresentation',
  COPYRIGHT_ISSUE: 'Copyright issue',
  COUNTERFEIT_OR_FRAUD: 'Counterfeit or fraud',
  QUALITY_ISSUE: 'Quality issue',
  MISLEADING_LINK: 'Misleading link',
  SPAM: 'Spam',
  ADMIN_DECISION: 'Admin decision',
  NOT_RELEVANT_TO_OUR_BUSINESS_MODEL: 'Not relevant to our marketplace',
};
const REASON_CODES = Object.keys(REASON_LABELS);

const LANGUAGE_NAMES = { en: 'English', fr: 'French' };
const languageName = (code) => LANGUAGE_NAMES[code] || String(code).toUpperCase();

// Where the text of a language version came from, in the Admin's words.
const ORIGIN_LABELS = {
  creator_reviewed: "The creator's own words",
  ai_generated: 'AI translation',
  admin_reviewed: 'Reviewed by an admin',
  verified: 'Verified by an admin',
};

// Links are typed by creators. Only http(s) addresses become links, and the address is shown so the
// Admin can judge it before opening it.
const toSafeLink = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const raw = value.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const path = url.pathname === '/' ? '' : url.pathname;
    return { href: url.href, label: `${url.host.replace(/^www\./, '')}${path}` };
  } catch {
    return null;
  }
};

// 1 … 4 5 6 … 20 rather than every page number.
const pageItems = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? [`gap-${page}`, page] : [page]
  );
};

const StatusBadge = ({ status }) => {
  const style = statusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${style.badge}`}>
      <style.icon size={11} aria-hidden="true" />
      {style.label}
    </span>
  );
};

const readCache = () => {
  try {
    const cached = localStorage.getItem(LISTINGS_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(LISTINGS_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // A full or blocked storage only costs the instant display next time.
  }
};

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState(null);

  // Every language version of the listing under review, loaded when the modal opens.
  const [translations, setTranslations] = useState(null);
  const [translationsError, setTranslationsError] = useState('');
  const [translationsReload, setTranslationsReload] = useState(0);

  // Reject / block form.
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrictionType, setRestrictionType] = useState('rejected');
  const [reasonCode, setReasonCode] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [blockConfirmed, setBlockConfirmed] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Which language version the Admin is reading. Approving sends it along, so the version the Admin
  // actually read is published as their own decision; every other ready language follows.
  const [reviewLanguage, setReviewLanguage] = useState('en');

  // The cached list is shown at once, but a fresh one is always fetched behind it: a status changed
  // elsewhere must not stay hidden until the cache expires.
  const fetchListings = useCallback(async ({ force = false } = {}) => {
    let showedCache = false;
    if (!force) {
      const cached = readCache();
      if (Array.isArray(cached?.data)) {
        setListings(cached.data);
        setLastSynced(cached.timestamp);
        setLoading(false);
        showedCache = true;
      }
    }
    if (force) setRefreshing(true);
    else if (!showedCache) setLoading(true);
    try {
      const res = await api.get('/api/admin/listings');
      if (Array.isArray(res.data)) {
        setListings(res.data);
        setLastSynced(Date.now());
        writeCache(res.data);
        if (force) toast.success('Listings refreshed');
      }
    } catch {
      if (force || !showedCache) toast.error('Could not load listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const closeReview = useCallback(() => setViewItem(null), []);

  const closeRestriction = useCallback(() => {
    if (actionLoading) return;
    setShowRestrictionModal(false);
    setReasonCode('');
    setAdditionalNotes('');
    setBlockConfirmed(false);
  }, [actionLoading]);

  const openRestriction = (type) => {
    setRestrictionType(type);
    setReasonCode('');
    setAdditionalNotes('');
    setBlockConfirmed(false);
    setShowRestrictionModal(true);
  };

  const handleStatusUpdate = async (id, newStatus, code, notes) => {
    setActionLoading(true);
    try {
      await api.put(`/api/admin/update-status/${id}`, {
        status: newStatus,
        reasonCode: code,
        additionalReason: notes,
        languageCode: newStatus === 'approved' ? reviewLanguage : undefined,
      });

      const changes =
        newStatus === 'approved'
          ? { status: newStatus, rejectionReason: '', additionalReason: '' }
          : { status: newStatus, rejectionReason: code, additionalReason: notes || '' };
      const updated = listings.map((l) => (l._id === id ? { ...l, ...changes } : l));
      setListings(updated);
      writeCache(updated);
      if (viewItem?._id === id) setViewItem({ ...viewItem, ...changes });
      // Approval publishes language versions, so their live markers have to be read again.
      if (newStatus === 'approved') setTranslationsReload((n) => n + 1);

      toast.success(`Listing ${statusStyle(newStatus).label.toLowerCase()}`);
      setShowRestrictionModal(false);
      setReasonCode('');
      setAdditionalNotes('');
      setBlockConfirmed(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    setReviewLanguage('en');
  }, [viewItem?._id]);

  // Record search accepts an object id in `search`, so one call returns every language for this
  // listing; the search projection carries only a preview, so each language is then read in full.
  useEffect(() => {
    if (!viewItem?._id) {
      setTranslations(null);
      setTranslationsError('');
      return undefined;
    }
    let cancelled = false;
    setTranslationsError('');
    api
      .get('/api/translations/admin/records', {
        params: { businessObjectType: 'listing', search: viewItem._id, limit: 20 },
      })
      .then(async (res) => {
        const rows = (res.data?.data?.records || []).filter((row) => row.languageCode !== 'en');
        const details = await Promise.all(
          rows.map((row) =>
            api
              .get(`/api/translations/admin/records/${row.translationRecordId}`)
              .then(({ data }) => data?.data?.record || null)
              .catch(() => null)
          )
        );
        if (!cancelled) setTranslations(details.filter(Boolean));
      })
      .catch((err) => {
        if (!cancelled) {
          setTranslationsError(
            err?.response?.data?.message || 'Could not load the translations of this listing.'
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [viewItem?._id, translationsReload]);

  // Only a different listing starts from an empty list; a reload after approval keeps the current
  // versions on screen until the new ones arrive.
  useEffect(() => {
    setTranslations(null);
  }, [viewItem?._id]);

  // Esc closes the top-most layer. The reject/block form never closes while it is submitting.
  useEffect(() => {
    if (!viewItem) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (showRestrictionModal) closeRestriction();
      else closeReview();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [viewItem, showRestrictionModal, closeRestriction, closeReview]);

  const changeFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const changeSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const counts = Object.fromEntries(
    FILTERS.map((f) => [f, f === 'all' ? listings.length : listings.filter((l) => l.status === f).length])
  );

  const query = search.trim().toLowerCase();
  const filteredListings = listings.filter(
    (l) =>
      (filter === 'all' || l.status === filter) &&
      (!query ||
        [l.title, l.creatorName, l.creatorId?.username, l.categoryName].some((value) =>
          String(value || '').toLowerCase().includes(query)
        ))
  );
  const totalPages = Math.max(Math.ceil(filteredListings.length / ITEMS_PER_PAGE), 1);
  const page = Math.min(currentPage, totalPages);
  const currentItems = filteredListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── The version under review ────────────────────────────────────────────
  const sourceLanguage = viewItem?.sourceLanguage || 'en';
  const reviewLanguages = viewItem
    ? [...new Set(['en', sourceLanguage, ...(translations || []).map((r) => r.languageCode)])]
    : [];
  const selectedRecord =
    reviewLanguage === 'en'
      ? null
      : (translations || []).find((row) => row.languageCode === reviewLanguage) || null;
  const reviewed =
    reviewLanguage === 'en'
      ? { title: viewItem?.title, description: viewItem?.description }
      : selectedRecord
        ? { title: selectedRecord.content?.title, description: selectedRecord.content?.description }
        : null;
  const isLanguageLive = (code) => {
    if (code === 'en') return viewItem?.status === 'approved';
    return (translations || []).some(
      (row) => row.languageCode === code && row.publicationStatus === 'published'
    );
  };
  const origin =
    reviewLanguage === 'en'
      ? sourceLanguage === 'en'
        ? ORIGIN_LABELS.creator_reviewed
        : `AI translation of the creator's ${languageName(sourceLanguage)}`
      : ORIGIN_LABELS[selectedRecord?.reviewLevel] || null;
  const liveLabel =
    reviewLanguage === 'en' || selectedRecord?.publicationStatus !== 'unpublished'
      ? isLanguageLive(reviewLanguage)
        ? 'Live on the site'
        : 'Not live yet'
      : 'Held back from the site';

  const websiteLink = toSafeLink(viewItem?.websiteLink);
  const referenceLinks = (viewItem?.externalUrls || []).map(toSafeLink).filter(Boolean);
  const isApproved = viewItem?.status === 'approved';
  const isBlocked = viewItem?.status === 'blocked';

  if (loading && !refreshing)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <Toaster position="top-right" />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { key: 'all', label: 'All listings', icon: FiLayers, tone: 'text-blue-500 bg-blue-500/10' },
          ...['pending', 'approved', 'rejected', 'blocked'].map((key) => ({
            key,
            label: STATUS_STYLES[key].label,
            icon: STATUS_STYLES[key].icon,
            tone: STATUS_STYLES[key].tone,
          })),
        ].map((stat) => (
          <button
            key={stat.key}
            type="button"
            onClick={() => changeFilter(stat.key)}
            className={`text-left bg-white dark:bg-white/5 border p-5 rounded-lg shadow-sm transition-all ${
              filter === stat.key
                ? 'border-orange-500'
                : 'border-gray-100 dark:border-white/10 hover:border-orange-500/30'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black dark:text-white leading-none">{counts[stat.key]}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.tone}`}>
                <stat.icon size={18} aria-hidden="true" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black dark:text-white">Listing review</h2>
            <button
              type="button"
              onClick={() => fetchListings({ force: true })}
              disabled={refreshing}
              aria-label="Refresh listings"
              title="Refresh listings"
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 transition-all hover:bg-orange-500 hover:text-white disabled:opacity-60"
            >
              <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative">
              <span className="sr-only">Search listings</span>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search title, creator, category"
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-transparent focus:border-orange-500 outline-none text-xs dark:text-white"
              />
            </label>
            <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => changeFilter(f)}
                  aria-pressed={filter === f}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filter === f ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:text-orange-500'
                  }`}
                >
                  {f === 'all' ? 'All' : STATUS_STYLES[f].label}
                  <span className="ml-1.5 opacity-70">{counts[f]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-3">Listing</th>
                <th className="px-6 py-3">Creator</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-all">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getImageUrl(item.image)}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover border border-black/10 dark:border-white/10"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold dark:text-white truncate max-w-64">{item.title}</p>
                        <p className="text-[11px] text-orange-500 font-semibold">{item.categoryName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-[12px] font-semibold dark:text-white">{item.creatorName}</p>
                    <p className="text-[11px] text-gray-400">@{item.creatorId?.username || 'unknown'}</p>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setViewItem(item)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-gray-600 dark:text-gray-300 text-[11px] font-semibold"
                    >
                      <FiEye size={14} aria-hidden="true" /> Review
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-sm text-gray-400">
                    {query ? 'No listing matches this search.' : 'No listings with this status.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-white/5">
          <p className="text-[11px] text-gray-400 flex items-center gap-2">
            <FiClock size={11} className="text-orange-500" aria-hidden="true" />
            Last updated {lastSynced ? new Date(lastSynced).toLocaleTimeString() : '—'}
          </p>
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 disabled:opacity-30 transition-all"
            >
              <FiChevronLeft className="dark:text-white" />
            </button>
            {pageItems(page, totalPages).map((item) =>
              typeof item === 'string' ? (
                <span key={item} className="w-8 text-center text-gray-400">…</span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrentPage(item)}
                  aria-current={page === item ? 'page' : undefined}
                  className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                    page === item
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-orange-500'
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 disabled:opacity-30 transition-all"
            >
              <FiChevronRight className="dark:text-white" />
            </button>
          </nav>
        </div>
      </div>

      {/* Review modal */}
      {viewItem && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeReview} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-review-title"
            className="relative w-full max-w-4xl max-h-[100dvh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-[#0f0f0f] sm:rounded-2xl rounded-t-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="shrink-0 flex items-start gap-4 p-5 border-b border-gray-100 dark:border-white/10">
              <img
                src={getImageUrl(viewItem.image)}
                className="h-12 w-12 shrink-0 rounded-lg object-cover border border-black/10 dark:border-white/10"
                alt=""
              />
              <div className="min-w-0 flex-1">
                <h3 id="listing-review-title" className="text-base sm:text-lg font-black dark:text-white leading-snug break-words">
                  {reviewed?.title || viewItem.title}
                </h3>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                  <span className="inline-flex items-center gap-1">
                    <FiUser size={11} aria-hidden="true" /> {viewItem.creatorName}
                    {viewItem.creatorId?.username && <span className="text-gray-400">@{viewItem.creatorId.username}</span>}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{viewItem.categoryName}</span>
                  {viewItem.country && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{viewItem.country}</span>
                    </>
                  )}
                </p>
              </div>
              <StatusBadge status={viewItem.status} />
              <button
                type="button"
                onClick={closeReview}
                aria-label="Close"
                className="p-1.5 -mr-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                {/* Facts */}
                <div className="space-y-4">
                  <img
                    src={getImageUrl(viewItem.image)}
                    className="w-full aspect-square rounded-xl object-cover bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10"
                    alt={viewItem.title || ''}
                  />
                  <dl className="grid grid-cols-2 md:grid-cols-1 gap-3 text-[12px]">
                    {[
                      { label: 'Tradition', value: viewItem.tradition, icon: FiAward },
                      { label: 'Culture', value: viewItem.region, icon: FiMapPin },
                      { label: 'Country', value: viewItem.country, icon: FiGlobe },
                    ].map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-[11px] text-gray-400">{fact.label}</dt>
                        <dd className="font-semibold dark:text-white flex items-center gap-1.5">
                          <fact.icon className="text-orange-500 shrink-0" size={12} aria-hidden="true" />
                          {fact.value || '—'}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400">Links</p>
                    {!websiteLink && referenceLinks.length === 0 && (
                      <p className="text-[12px] text-gray-400">No links</p>
                    )}
                    {[
                      ...(websiteLink ? [{ ...websiteLink, kind: 'Website', icon: FiLink }] : []),
                      ...referenceLinks.map((link) => ({ ...link, kind: 'Reference', icon: FiExternalLink })),
                    ].map((link, i) => (
                      <a
                        key={`${link.href}-${i}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.href}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-orange-500 transition-all"
                      >
                        <link.icon className="text-orange-500 shrink-0" size={13} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-[10px] text-gray-400">{link.kind}</span>
                          <span className="block text-[12px] font-semibold dark:text-white truncate">{link.label}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* The text under review */}
                <div className="space-y-5 min-w-0">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-2">Language</p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Language version">
                      {reviewLanguages.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setReviewLanguage(code)}
                          aria-pressed={reviewLanguage === code}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                            reviewLanguage === code
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-orange-500/50'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${isLanguageLive(code) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            aria-hidden="true"
                          />
                          {languageName(code)}
                          {code === sourceLanguage && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                reviewLanguage === code ? 'bg-white/20' : 'bg-orange-500/10 text-orange-500'
                              }`}
                            >
                              Original
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 align-middle" aria-hidden="true" />
                      Live on the site ·{' '}
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mr-1 align-middle" aria-hidden="true" />
                      Not live yet
                    </p>
                  </div>

                  {translationsError && reviewLanguage !== 'en' ? (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-500">
                      {translationsError}
                    </div>
                  ) : reviewLanguage !== 'en' && translations === null ? (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 text-[12px] text-gray-400">
                      Loading the {languageName(reviewLanguage)} version…
                    </div>
                  ) : reviewed ? (
                    <div className="rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[11px]">
                        <span className="font-bold dark:text-white">{languageName(reviewLanguage)} version</span>
                        {origin && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">{origin}</span>}
                        <span
                          className={`px-2 py-0.5 rounded ${
                            isLanguageLive(reviewLanguage)
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {liveLabel}
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-[11px] text-gray-400 mb-0.5">Title</p>
                          <p className="text-[15px] font-bold dark:text-white break-words">{reviewed.title || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 mb-0.5">Description</p>
                          <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
                            {reviewed.description || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 text-[12px] text-gray-500">
                      There is no {languageName(reviewLanguage)} translation yet. {languageName(reviewLanguage)}{' '}
                      visitors see the English text until one is ready.
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1.5">
                      <FiTag size={11} aria-hidden="true" /> Cultural tags
                    </p>
                    {viewItem.culturalTags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {viewItem.culturalTags.map((tag, idx) => (
                          <span
                            key={tag._id || idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/5 border border-orange-500/20 rounded-lg text-[11px] font-semibold text-orange-600 dark:text-orange-400"
                          >
                            {tag.image && (
                              <img src={getImageUrl(tag.image)} className="w-4 h-4 rounded-full object-cover" alt="" />
                            )}
                            {tag.title || tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-gray-400">No tags</p>
                    )}
                  </div>

                  {(viewItem.status === 'rejected' || isBlocked) && viewItem.rejectionReason && (
                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-[12px]">
                      <p className="font-bold text-red-500">
                        {isBlocked ? 'Blocked' : 'Rejected'}: {REASON_LABELS[viewItem.rejectionReason] || viewItem.rejectionReason}
                      </p>
                      {viewItem.additionalReason && (
                        <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">{viewItem.additionalReason}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions — always in view, whatever the screen height */}
            <div className="shrink-0 border-t border-gray-100 dark:border-white/10 p-4 sm:px-6 bg-white dark:bg-[#0f0f0f] space-y-3">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {isBlocked
                  ? 'This listing is permanently blocked. No further action is possible.'
                  : isApproved
                    ? 'This listing is live in every language that has a translation ready.'
                    : 'Approving publishes this listing in every language that has a translation ready.'}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(viewItem._id, 'approved')}
                  disabled={isApproved || isBlocked || actionLoading}
                  className="h-11 bg-green-600 text-white rounded-lg font-bold text-[12px] hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiCheck size={16} aria-hidden="true" />
                  {isApproved
                    ? 'Approved'
                    : actionLoading && !showRestrictionModal
                      ? 'Saving…'
                      : 'Approve listing'}
                </button>
                <button
                  type="button"
                  onClick={() => openRestriction('rejected')}
                  disabled={viewItem.status === 'rejected' || isBlocked || actionLoading}
                  className="h-11 bg-orange-600 text-white rounded-lg font-bold text-[12px] hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiX size={16} aria-hidden="true" />
                  {viewItem.status === 'rejected' ? 'Rejected' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => openRestriction('blocked')}
                  disabled={isBlocked || actionLoading}
                  className="h-11 bg-red-600 text-white rounded-lg font-bold text-[12px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiShieldOff size={16} aria-hidden="true" />
                  {isBlocked ? 'Blocked' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject / block form. It does not close on an outside click, so typed notes are not lost. */}
      {showRestrictionModal && viewItem && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="restriction-title"
            className="relative w-full max-w-md bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-2xl"
          >
            <h3 id="restriction-title" className="text-lg font-black dark:text-white mb-1">
              {restrictionType === 'blocked' ? 'Block listing' : 'Reject listing'}
            </h3>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-5 break-words">{viewItem.title}</p>

            {restrictionType === 'blocked' ? (
              <div className="flex gap-3 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-600 dark:text-red-400">
                <FiAlertTriangle className="shrink-0 mt-0.5" aria-hidden="true" />
                <p>Blocking is permanent. The listing is taken off the site and can never be approved or changed again.</p>
              </div>
            ) : (
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-5">
                The listing is taken off the site. The creator sees the reason and can edit and resubmit it.
              </p>
            )}

            <label htmlFor="restriction-reason" className="text-[11px] font-semibold text-gray-500 mb-1.5 block">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              id="restriction-reason"
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-lg p-3 text-[13px] dark:text-white mb-4 outline-none focus:border-orange-500"
            >
              <option value="">Select a reason</option>
              {REASON_CODES.map((c) => (
                <option key={c} value={c}>
                  {REASON_LABELS[c]}
                </option>
              ))}
            </select>

            <label htmlFor="restriction-notes" className="text-[11px] font-semibold text-gray-500 mb-1.5 block">
              Note to the creator (optional)
            </label>
            <textarea
              id="restriction-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Explain what needs to change"
              className="w-full h-28 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-[13px] dark:text-white outline-none focus:border-orange-500 transition-all mb-4 resize-none"
            />

            {restrictionType === 'blocked' && (
              <label className="flex items-start gap-2 mb-5 text-[12px] text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockConfirmed}
                  onChange={(e) => setBlockConfirmed(e.target.checked)}
                  className="mt-0.5 accent-red-600"
                />
                I understand this cannot be undone.
              </label>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeRestriction}
                disabled={actionLoading}
                className="flex-1 h-11 rounded-lg text-[12px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate(viewItem._id, restrictionType, reasonCode, additionalNotes)}
                disabled={!reasonCode || actionLoading || (restrictionType === 'blocked' && !blockConfirmed)}
                className={`flex-1 h-11 ${
                  restrictionType === 'blocked' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                } text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
              >
                <FiSend aria-hidden="true" />
                {actionLoading ? 'Saving…' : restrictionType === 'blocked' ? 'Block listing' : 'Reject listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
