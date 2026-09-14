// Locale-aware number and money formatting for the Creator Dashboard.
//
// English renders "€12.00" and French "12,00 €" — the symbol moves, the decimal separator changes,
// and a narrow no-break space appears before the symbol. Hand-built `€${value}` strings cannot do
// that, so every amount the dashboard shows goes through here.
//
// Amounts reach the client both as numbers and as `.toFixed(2)` strings (the backend sends
// `walletBalance` as a string), so each helper coerces and falls back instead of printing "NaN".

const INTL_LOCALE = { en: 'en-GB', fr: 'fr-FR' };

const resolve = (locale) => INTL_LOCALE[locale] || INTL_LOCALE.en;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatCurrency = (value, locale = 'en', currency = 'EUR') => {
  const amount = toNumber(value);
  if (amount === null) return '';
  try {
    return new Intl.NumberFormat(resolve(locale), {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // An unsupported currency code would throw; the amount still has to reach the screen.
    return `${amount.toFixed(2)} ${currency}`;
  }
};

export const formatNumber = (value, locale = 'en') => {
  const amount = toNumber(value);
  if (amount === null) return '0';
  return new Intl.NumberFormat(resolve(locale)).format(amount);
};

// Percentages are shown next to progress bars, where the trailing "%" belongs to the number.
export const formatPercent = (value, locale = 'en', fractionDigits = 1) => {
  const amount = toNumber(value);
  if (amount === null) return '';
  return new Intl.NumberFormat(resolve(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
};

export const intlLocale = resolve;
