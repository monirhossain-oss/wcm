import { NextResponse } from 'next/server';
import { buildFrenchHostRedirect } from '@/lib/hostRedirect';
import { canonicalRoutePath } from '@/lib/seo/publicPageRegistry';
import { getPathLocale, REQUEST_LOCALE_HEADER, REQUEST_PATH_HEADER } from '@/lib/seo/siteConfig';

export function proxy(request) {
  const target = buildFrenchHostRedirect(request.url, request.headers.get('host'));
  if (target) return NextResponse.redirect(target, 301);

  // Registry aliases (currently /fr/faqUs) redirect once to the canonical route for their language,
  // keeping query and hash. The English /faqUs route is canonical and is never redirected.
  const canonical = canonicalRoutePath(request.nextUrl.pathname);
  if (canonical) {
    const destination = new URL(request.nextUrl);
    destination.pathname = canonical;
    return NextResponse.redirect(destination, 301);
  }

  const requestHeaders = new Headers(request.headers);
  // Overwrite caller-supplied values: the requested path owns the document language.
  requestHeaders.set(REQUEST_LOCALE_HEADER, getPathLocale(request.nextUrl.pathname));
  requestHeaders.set(REQUEST_PATH_HEADER, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: '/:path*' };
