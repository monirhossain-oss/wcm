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

// The dashboard chart's day labels arrive from the API already formatted in English (the API has no
// language parameter). They are rebuilt here from each row's `fullDate` reporting key so the axis
// follows the reader's language; midday UTC is the instant the API itself derives that key from.
// French gives "ven.", so the first letter is raised to match the rest of the axis.
export const formatReportingWeekday = (dateKey, locale) => {
  const label = new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: 'UTC',
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00.000Z`));
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatReportingTime = (value, locale) =>
  new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: REPORTING_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
