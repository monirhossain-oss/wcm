// The one place the published-language list is read. `LanguageConfiguration` in the database is
// runtime truth for which languages are live, so this list can only come from the API — never from
// the code registry, which merely says which languages are approved.
//
// The distinction this module exists to preserve: "the API says English only" and "the lookup
// failed" are different answers. Collapsing them, as the previous inline helper did, silently
// dropped every French URL from hreflang and from the sitemap whenever the backend hiccuped.
// `ok` is false only when the lookup itself failed, and callers decide what that means for them.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const SOURCE_LOCALE = 'en';
const ATTEMPTS = 2;
const RETRY_DELAY_MS = 300;

// Kept for the life of the server process. A later failure reuses the last confirmed answer rather
// than pretending the site lost every language it had a moment ago.
let lastConfirmed = null;

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// English is the source language and is always published, so it is unioned in rather than used as
// a gate: a payload that omits it must not discard the languages it does list.
const readCodes = (payload) => [...new Set([
  SOURCE_LOCALE,
  ...(payload?.data || []).map((language) => language?.code).filter(Boolean),
])];

export const getPublishedLanguages = async () => {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/translations/languages`, { next: { revalidate: 300 } });
      if (response.ok) {
        lastConfirmed = readCodes(await response.json());
        return { locales: lastConfirmed, ok: true, stale: false };
      }
    } catch {
      // Falls through to the retry, then to the degraded answer below.
    }
    if (attempt < ATTEMPTS) await wait(RETRY_DELAY_MS);
  }
  return { locales: lastConfirmed || [SOURCE_LOCALE], ok: false, stale: Boolean(lastConfirmed) };
};

// Convenience for callers that only need the codes and have their own degradation rule.
export const getPublishedLanguageCodes = async () => (await getPublishedLanguages()).locales;
