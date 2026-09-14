import { headers } from 'next/headers';
import { NOINDEX } from '@/lib/seo/indexing';
import DashboardLocaleProvider from '@/context/DashboardLocaleProvider';
import { resolvePreferredLocale } from '@/lib/localePreference';
import { REQUEST_LOCALE_HEADER } from '@/lib/seo/siteConfig';

// Every admin and creator dashboard route. The two layouts below this one are client components,
// so neither can export metadata — this group layout is the only place the rule can live.
// Crawling stays open on purpose: a `noindex` tag only removes a URL if the crawler is allowed to
// read it. Nothing is exposed by that, because the auth guard runs in the browser and the server
// sends these routes as an empty shell — no menu, no route name and no record reaches the HTML.
export const metadata = { robots: NOINDEX };

export default async function DashboardsLayout({ children }) {
  // The proxy resolved the language from the URL (`/creator` vs `/fr/creator`) and rewrote the
  // prefixed form onto this single route tree. Reading its header here is what puts the first
  // server render in the right language; the root layout is already dynamic, so this costs nothing.
  const requestHeaders = await headers();
  const locale = resolvePreferredLocale(requestHeaders.get(REQUEST_LOCALE_HEADER));

  return <DashboardLocaleProvider initialLocale={locale}>{children}</DashboardLocaleProvider>;
}
