'use client';

import Script from 'next/script';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';

// Google Analytics is non-essential tracking, held to the same rule as ClarityAnalytics: nothing is
// requested until the visitor has accepted. Previously gtag.js downloaded on every page load and
// only the `config` call waited for consent, so a visitor who pressed Reject still fetched Google's
// script and appeared to Google as a request from this origin.
//
// Read once at module scope: Next inlines NEXT_PUBLIC_* at build time. The old fallback was the
// placeholder string 'G - XXXXXXXXXX', which is truthy, so an unconfigured deployment requested a
// measurement id with spaces in it on every page. No id now simply means no analytics.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const accepted = useAnalyticsConsent();
  if (!GA_ID || !accepted) return null;

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
      </Script>
    </>
  );
}
