'use client';

import { useEffect, useState } from 'react';

// One rule for every non-essential tracker on the site: load nothing until the visitor has actually
// pressed Accept. Not answering yet and pressing Reject are the same answer here — no.
//
// CookieConsent writes the choice to localStorage and fires `cookie-consent-updated` on the same
// tick, which is what lets an acceptance start a tracker without a page reload.
export const CONSENT_KEY = 'cookie-consent';

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    // A blocked or unavailable storage is treated as "no consent given".
    return null;
  }
};

// Returns false on the server and on the first client render, so a tracker gated on it contributes
// nothing to the served HTML and cannot run before the stored choice has been read.
export const useAnalyticsConsent = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const sync = () => setAccepted(readConsent() === 'accepted');
    sync();
    window.addEventListener('cookie-consent-updated', sync);
    // A choice made in another tab arrives as a storage event, not as our custom one.
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cookie-consent-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return accepted;
};
