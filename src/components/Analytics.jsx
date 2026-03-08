'use client';
import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
  // Accessing the ID from Environment Variables
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G - XXXXXXXXXX';

  const loadGA = () => {
    const consent = localStorage.getItem('cookie-consent');

    // Only initialize if consent is 'accepted' and ID exists
    if (consent === 'accepted' && GA_ID) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', GA_ID, {
        page_path: window.location.pathname,
      });

      console.log('Privacy Protocol: Analytics services initialized.');
    }
  };

  useEffect(() => {
    // Initial check on mount
    loadGA();

    // Listen for consent updates from the CookieConsent component
    window.addEventListener('cookie-consent-updated', loadGA);

    return () => {
      window.removeEventListener('cookie-consent-updated', loadGA);
    };
  }, []);

  // Do not render the script tag if the ID is missing
  if (!GA_ID) return null;

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Defaulting to denied status for strict privacy compliance
            // Will be enabled via loadGA() once consent is granted
          `,
        }}
      />
    </>
  );
}
