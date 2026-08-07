export const REPORTING_TIME_ZONE = 'Europe/Paris';

export const formatReportingDate = (value, options = {}) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: REPORTING_TIME_ZONE,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  }).format(new Date(value));

export const formatReportingTime = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: REPORTING_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
