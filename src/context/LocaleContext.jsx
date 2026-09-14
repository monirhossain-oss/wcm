'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import en from '@/lib/i18n/catalogs/en';
import fr from '@/lib/i18n/catalogs/fr';
import { format } from '@/lib/i18n/format';
import { localizedRoutePath } from '@/lib/seo/publicPageRegistry';

const catalogs = { en, fr };
// Exported so DashboardLocaleProvider can fill the same context: the dashboards resolve their
// language from a stored preference rather than the path, but every consumer still calls
// `useLocale()` and a shared component must work on both sides.
export const LocaleContext = createContext(null);
const COOKIE = 'wcm_locale';
const STORAGE = 'wcm_locale';

const read = (value, key) => key.split('.').reduce((current, part) => current?.[part], value);
const pathLocale = (pathname) => pathname.split('/').filter(Boolean)[0] === 'fr' ? 'fr' : 'en';

export function LocaleProvider({ children }) {
  const pathname = usePathname(); const router = useRouter();
  const locale = pathLocale(pathname); const [languages, setLanguages] = useState([]);
  const preferenceApplied = useRef(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/translations/languages`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setLanguages(payload?.data || []))
      .catch(() => setLanguages([{ code: 'en', nativeName: 'English', direction: 'ltr', isSource: true }]));
  }, []);
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = languages.find(({ code }) => code === locale)?.direction || 'ltr'; }, [locale, languages]);
  const localize = useCallback((path, target = locale) => {
    if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
    // Registry routes whose languages differ by more than a prefix (FAQ: /faqUs ↔ /fr/faq) map directly,
    // so internal links point at the canonical URL instead of relying on a redirect.
    const mapped = localizedRoutePath(path.split(/[?#]/)[0], target);
    if (mapped) return `${mapped}${path.slice(path.split(/[?#]/)[0].length)}`;
    const clean = path.replace(/^\/(?:fr|en)(?=\/|$)/, '') || '/';
    return target === 'en' ? clean : `/${target}${clean === '/' ? '' : clean}`;
  }, [locale]);
  const switchLocale = useCallback(async (target) => {
    localStorage.setItem(STORAGE, target); document.cookie = `${COOKIE}=${target}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const parts = pathname.split('/').filter(Boolean); const offset = parts[0] === 'fr' ? 1 : 0;
    const typeBySection = { listings: 'listing', blogs: 'blog', profile: 'creatorProfile' };
    const type = typeBySection[parts[offset]]; const slug = parts[offset + 1];
    if (type && slug) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/translations/url/${locale}/${type}/${encodeURIComponent(slug)}`);
        const payload = response.ok ? await response.json() : null;
        const equivalent = payload?.data?.metadata?.languages?.[target];
        if (equivalent) return router.push(new URL(equivalent, window.location.origin).pathname);
      } catch { /* fall through to the equivalent structural path */ }
    }
    router.push(`${localize(pathname, target)}${window.location.search}${window.location.hash}`);
  }, [locale, localize, pathname, router]);
  useEffect(() => {
    if (preferenceApplied.current || languages.length === 0) return;
    preferenceApplied.current = true;
    const saved = localStorage.getItem(STORAGE) || document.cookie.match(/(?:^|; )wcm_locale=([^;]+)/)?.[1];
    if (saved && saved !== locale && languages.some(({ code }) => code === saved)) switchLocale(saved);
  }, [languages, locale, switchLocale]);
  const t = useCallback((key, fallback) => read(catalogs[locale], key) ?? read(en, key) ?? fallback ?? key, [locale]);
  // `tf` is `t` plus the `{token}` substitution counted phrases need. Both providers expose it so
  // the context shape stays identical on the public site and in the dashboards.
  const tf = useCallback((key, values, fallback) => format(t(key, fallback), values), [t]);
  const value = useMemo(() => ({ locale, languages, localize, switchLocale, t, tf }), [locale, languages, localize, switchLocale, t, tf]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext) || { locale: 'en', languages: [], localize: (path) => path, switchLocale: () => {}, t: (key, fallback) => fallback || key, tf: (key, values, fallback) => format(fallback || key, values) };
