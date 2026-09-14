export const REPORTING_TIME_ZONE = 'Europe/Paris';

// Reporting dates were always rendered in en-GB. The Creator Dashboard now follows the reader's
// language, so both helpers take an optional locale; the default keeps every existing caller
// (public pages, admin) on exactly the output they had before.
const REPORTING_INTL_LOCALE = { en: 'en-GB', fr: 'fr-FR' };

const resolveLocale = (locale) => REPORTING_INTL_LOCALE[locale] || locale || 'en-GB';

export const formatReportingDate = (value, options = {}, locale) =>
  new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: REPORTING_TIME_ZONE,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  }).format(new Date(value));

export const formatReportingTime = (value, locale) =>
  new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: REPORTING_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
