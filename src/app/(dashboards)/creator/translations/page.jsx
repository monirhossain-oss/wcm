'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBell,
  FiGlobe,
  FiLayers,
  FiRefreshCw,
  FiSearch,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import {
  AvailabilityBadge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Spinner,
  inputClass,
  relativeTime,
} from './_components/ui';
import {
  getAvailability,
  getMyListings,
  getNotifications,
  markNotificationRead,
} from './_services/creatorTranslationApi';
import { getTranslationErrorMessage } from './_services/translationErrors';

const PAGE_SIZE = 8;

// Availability is a per-object endpoint, so only the rows actually on screen are asked for. A
// creator with hundreds of listings never triggers hundreds of requests.
const loadAvailability = async (entries) => {
  const results = await Promise.allSettled(
    entries.map(({ businessObjectType, businessObjectId }) =>
      getAvailability(businessObjectType, businessObjectId)
    )
  );
  return results.reduce((map, result, index) => {
    if (result.status === 'fulfilled') {
      map[entries[index].key] = result.value.data?.data || [];
    }
    return map;
  }, {});
};

export default function CreatorTranslationsPage() {
  const { user } = useAuth();
  const { locale, localize, t, tf } = useLocale();
  const [listings, setListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const [listingsResponse, notificationsResponse] = await Promise.all([
        getMyListings(locale),
        getNotifications({ unreadOnly: 'false' }),
      ]);
      const rows = Array.isArray(listingsResponse.data)
        ? listingsResponse.data
        : listingsResponse.data?.data || [];
      setListings(rows);
      setNotifications(notificationsResponse.data?.data || []);
      setError('');
    } catch (requestError) {
      setError(getTranslationErrorMessage(requestError, t, 'creator.translations.loadFailed'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locale, t]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return listings;
    return listings.filter((listing) =>
      String(listing.localizedText?.title || listing.title || '').toLowerCase().includes(term)
    );
  }, [listings, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  // The profile row plus the listings on this page are the only objects whose availability is needed.
  useEffect(() => {
    if (!user?._id) return undefined;
    const entries = [
      { key: 'profile', businessObjectType: 'creatorProfile', businessObjectId: user._id },
      ...visible.map((listing) => ({
        key: String(listing._id),
        businessObjectType: 'listing',
        businessObjectId: listing._id,
      })),
    ];
    let cancelled = false;
    loadAvailability(entries).then((map) => {
      if (!cancelled) setAvailability((previous) => ({ ...previous, ...map }));
    });
    return () => {
      cancelled = true;
    };
  }, [user?._id, visible]);

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((rows) =>
        rows.map((row) =>
          String(row._id) === String(notificationId)
            ? { ...row, readAt: new Date().toISOString() }
            : row
        )
      );
    } catch (requestError) {
      toast.error(getTranslationErrorMessage(requestError, t, 'creator.translations.notificationFailed'));
    }
  };

  const unreadCount = notifications.filter((row) => !row.readAt).length;

  const renderBadges = (key) => {
    const states = availability[key];
    if (!states) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">…</span>
      );
    }
    if (states.length === 0) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {t('creator.translations.noOtherLanguage')}
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {states.map(({ languageCode, state, needsUpdate }) => (
          <span key={languageCode} className="inline-flex items-center gap-1.5">
            <AvailabilityBadge languageCode={languageCode} state={state} />
            {needsUpdate && (
              <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400">
                <FiAlertCircle size={11} /> {t('creator.translations.updateNeeded')}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <Spinner label={t('creator.translations.loading')} />;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <FiGlobe size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {t('creator.translations.heading')}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {t('creator.translations.subtitle')}
          </p>
        </div>
        <Button
          variant="secondary"
          className="ml-auto"
          loading={refreshing}
          onClick={() => load({ silent: true })}
        >
          <FiRefreshCw size={13} /> {t('creator.common.refresh')}
        </Button>
      </div>

      {error && (
        <Banner tone="error" icon={FiAlertCircle}>
          {error}
        </Banner>
      )}

      <Card>
        <CardHeader
          icon={FiBell}
          title={t('creator.translations.notifications')}
          description={
            unreadCount
              ? tf('creator.translations.unread', { count: unreadCount })
              : t('creator.translations.nothingNew')
          }
        />
        {notifications.length === 0 ? (
          <EmptyState
            icon={FiBell}
            title={t('creator.translations.noNotifications')}
            description={t('creator.translations.noNotificationsDescription')}
          />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {notifications.slice(0, 6).map((row) => (
              <li key={row._id} className="flex flex-wrap items-center gap-3 px-5 md:px-6 py-4">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    row.readAt ? 'bg-gray-300' : 'bg-orange-500'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {t(`creator.notificationEvent.${row.eventType}`, row.eventType)}
                    {row.languageCode ? ` · ${row.languageCode.toUpperCase()}` : ''}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                    {relativeTime(row.createdAt, t)}
                  </p>
                </div>
                {!row.readAt && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleMarkRead(row._id)}
                  >
                    {t('creator.translations.markRead')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader
          icon={FiUser}
          title={t('creator.translations.profile')}
          description={t('creator.translations.profileDescription')}
        />
        <CardBody className="flex flex-wrap items-center gap-4">
          {renderBadges('profile')}
          {user?._id && (
            <Link
              href={localize(`/creator/translations/creatorProfile/${user._id}`)}
              className="ml-auto inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
            >
              {t('creator.common.open')} <FiArrowRight size={13} />
            </Link>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={FiLayers}
          title={t('creator.translations.listings')}
          description={tf(
            filtered.length === 1
              ? 'creator.translations.listingCountSingular'
              : 'creator.translations.listingCountPlural',
            { count: filtered.length }
          )}
          actions={
            <div className="relative">
              <FiSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder={t('creator.translations.searchPlaceholder')}
                className={`${inputClass} pl-9 w-56`}
              />
            </div>
          }
        />
        {visible.length === 0 ? (
          <EmptyState
            icon={FiLayers}
            title={t('creator.translations.noListings')}
            description={t('creator.translations.noListingsDescription')}
          />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {visible.map((listing) => (
              <li key={listing._id} className="flex flex-wrap items-center gap-4 px-5 md:px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {listing.localizedText?.title || listing.title}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    {t(`creator.status.${listing.status}`, listing.status)}
                  </p>
                </div>
                {renderBadges(String(listing._id))}
                <Link
                  href={localize(`/creator/translations/listing/${listing._id}`)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-orange-500/40 hover:text-orange-500 transition-all"
                >
                  {t('creator.common.open')} <FiArrowRight size={12} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {pageCount > 1 && (
          <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-gray-100 dark:border-white/5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              {t('creator.common.previous')}
            </Button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {tf('creator.common.pageOf', { page: currentPage, pages: pageCount })}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              {t('creator.common.next')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
