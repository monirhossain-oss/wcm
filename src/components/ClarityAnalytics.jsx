'use client';

import Script from 'next/script';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';

// Microsoft Clarity records the session: clicks, scrolling, pointer movement and page content, and
// it sets an identifying cookie the moment it starts. That is non-essential tracking, so nothing is
// loaded until the visitor has actually accepted. Rejecting, or not answering yet, loads nothing at
// all — the tag is never fetched, so no cookie can be set and no recording can begin.
const CLARITY_PROJECT_ID = 'xgch337gyo';

export default function ClarityAnalytics() {
  const accepted = useAnalyticsConsent();
  if (!accepted) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
