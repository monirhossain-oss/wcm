import { SOURCE_LOCALE } from './index';

// Country and language are fixed profile fields: they are never sent through the
// translation engine, so their stored English values are localized at display time only.

const LANGUAGE_NAMES = {
  fr: { English: 'Anglais', French: 'Français' },
};

export const localizeCountry = (name, countryCode, locale) => {
  if (!locale || locale === SOURCE_LOCALE || !countryCode) return name || '';

  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode) || name || '';
  } catch {
    return name || '';
  }
};

export const localizeLanguageName = (value, locale) =>
  LANGUAGE_NAMES[locale]?.[value] || value || '';
