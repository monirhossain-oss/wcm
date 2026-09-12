import { NOINDEX } from '@/lib/seo/indexing';

// Every admin and creator dashboard route. The two layouts below this one are client components,
// so neither can export metadata — this group layout is the only place the rule can live.
// Crawling stays open on purpose: a `noindex` tag only removes a URL if the crawler is allowed to
// read it. Nothing is exposed by that, because the auth guard runs in the browser and the server
// sends these routes as an empty shell — no menu, no route name and no record reaches the HTML.
export const metadata = { robots: NOINDEX };

export default function DashboardsLayout({ children }) {
  return children;
}
