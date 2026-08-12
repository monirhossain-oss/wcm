import { NextResponse } from 'next/server';
import { buildFrenchHostRedirect } from '@/lib/hostRedirect';

export function proxy(request) {
  const target = buildFrenchHostRedirect(request.url, request.headers.get('host'));
  return target ? NextResponse.redirect(target, 301) : NextResponse.next();
}

export const config = { matcher: '/:path*' };
