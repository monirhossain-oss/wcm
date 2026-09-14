'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { catalogs, localePath, translate } from '@/lib/i18n';
import { format } from '@/lib/i18n/format';
import {
  DEFAULT_LOCALE,
  dashboardPath,
  resolvePreferredLocale,
  splitDashboardPath,
  writeStoredLocale,
} from '@/lib/localePreference';
import { LocaleContext } from './LocaleContext';

// The dashboards' half of the locale system. It fills the same `LocaleContext` as the public
// `LocaleProvider` — `useLocale()` behaves identically on both sides — but resolves the language
// from the dashboard's own URL shape (`/creator` vs `/fr/creator`) rather than the public one.
//
// The public provider cannot be reused: its `switchLocale` looks up a translated slug for listing,
// blog and profile detail pages, and its saved-preference effect navigates on mount. Neither
// applies here.
//
// `initialLocale` comes from the request header the proxy set, and only covers the first render
// before `usePathname()` is available.
export default function DashboardLocaleProvider({ initialLocale, children }) {
  const pathname = usePathname();
  const [languages, setLanguages] = useState([]);

  // The URL is the single source of truth, so there is no locale state to drift out of sync.
  //
  // `usePathname()` reports the browser URL on some Next versions and the rewritten target on
  // others, so a visible `/fr` prefix is taken as proof of French, and its absence proves nothing —
  // it could be a genuine `/creator` or a `/fr/creator` we are seeing post-rewrite. In that case
  // the server's header, which the proxy derived from the real URL, is the reliable answer.
  const current = splitDashboardPath(pathname);
  const locale =
    current && current.locale !== DEFAULT_LOCALE
      ? current.locale
      : resolvePreferredLocale(initialLocale);
  // Either reading of `usePathname()` yields the same language-free route, so this is unambiguous.
  const basePath = current?.path ?? pathname;

  // Which languages a reader may pick is runtime state in `LanguageConfiguration`, never the static
  // registry — so the switcher asks the API, exactly as the public one does. A language that has no
  // UI catalog is dropped: the dashboard would render it entirely in English fallback.
  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/translations/languages`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (cancelled) return;
        setLanguages((payload?.data || []).filter(({ code }) => code in catalogs));
      })
      .catch(() => {
        if (!cancelled) setLanguages([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The server already stamped `<html lang>` from the same URL; this keeps it correct across a
  // client-side navigation between languages.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const switchLocale = useCallback(
    (target) => {
      // The cookie is no longer what picks the dashboard's language, but writing it keeps the
      // public site on the language the reader just chose here.
      const next = writeStoredLocale(target);
      if (next === locale) return;
      const { search, hash } = window.location;
      // A full load rather than `router.push`. The dashboards share one server layout across both
      // languages, so a client-side navigation is not guaranteed to re-render it — and that layout
      // is what reads the language for the first paint. A language switch is a rare, deliberate
      // action, so paying for one page load here buys a result that is always right.
      window.location.assign(`${dashboardPath(next, basePath)}${search}${hash}`);
    },
    [basePath, locale]
  );

  // A dashboard link keeps the reader in their language; a link out to the public site goes through
  // the public rules, which know about registry routes such as /faqUs ↔ /fr/faq.
  const localize = useCallback(
    (path) => {
      if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
      const [pathOnly] = path.split(/[?#]/);
      const suffix = path.slice(pathOnly.length);
      const dashboard = splitDashboardPath(pathOnly);
      if (dashboard) return `${dashboardPath(locale, dashboard.path)}${suffix}`;
      return `${localePath(locale, pathOnly)}${suffix}`;
    },
    [locale]
  );

  const t = useCallback((key, fallback) => translate(locale, key, fallback), [locale]);
  const tf = useCallback((key, values, fallback) => format(t(key, fallback), values), [t]);

  const value = useMemo(
    () => ({ locale, languages, localize, switchLocale, t, tf }),
    [locale, languages, localize, switchLocale, t, tf]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
