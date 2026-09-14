import { NextResponse } from 'next/server';
import { buildFrenchHostRedirect } from '@/lib/hostRedirect';
import { canonicalRoutePath } from '@/lib/seo/publicPageRegistry';
import { getPathLocale, REQUEST_LOCALE_HEADER, REQUEST_PATH_HEADER } from '@/lib/seo/siteConfig';
import { splitDashboardPath } from '@/lib/localePreference';

export function proxy(request) {
  const target = buildFrenchHostRedirect(request.url, request.headers.get('host'));
  if (target) return NextResponse.redirect(target, 301);

  const { pathname } = request.nextUrl;

  // Dashboards. The language is in the URL exactly as it is on the public site, but the route tree
  // is not duplicated per language: `/fr/creator/...` is rewritten onto the real `/creator/...`
  // route, so the browser keeps the prefixed URL and Next renders the single existing tree.
  //
  // This runs before the alias redirect below so a dashboard path can never be matched against the
  // public page registry, which describes public routes only.
  const dashboard = splitDashboardPath(pathname);
  if (dashboard) {
    const dashboardHeaders = new Headers(request.headers);
    dashboardHeaders.set(REQUEST_LOCALE_HEADER, dashboard.locale);
    dashboardHeaders.set(REQUEST_PATH_HEADER, pathname);

    if (dashboard.path === pathname) {
      return NextResponse.next({ request: { headers: dashboardHeaders } });
    }
    const destination = new URL(request.nextUrl);
    destination.pathname = dashboard.path;
    return NextResponse.rewrite(destination, { request: { headers: dashboardHeaders } });
  }

  // Registry aliases (currently /fr/faqUs) redirect once to the canonical route for their language,
  // keeping query and hash. The English /faqUs route is canonical and is never redirected.
  const canonical = canonicalRoutePath(pathname);
  if (canonical) {
    const destination = new URL(request.nextUrl);
    destination.pathname = canonical;
    return NextResponse.redirect(destination, 301);
  }

  const requestHeaders = new Headers(request.headers);
  // Overwrite caller-supplied values: the requested path owns the document language.
  requestHeaders.set(REQUEST_LOCALE_HEADER, getPathLocale(pathname));
  requestHeaders.set(REQUEST_PATH_HEADER, pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: '/:path*' };
