'use client';

import { FiGlobe } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';

// The dashboard's language control, in the header bar next to the account menu.
//
// Switching navigates: `/creator/listings` ⇄ `/fr/creator/listings`. The URL owns the language on
// the dashboards exactly as it does on the public site, so the choice survives a reload, a shared
// link and the back button. It also writes the `wcm_locale` preference so the public site follows.
//
// `languages` comes from `GET /api/translations/languages` via DashboardLocaleProvider — runtime
// publication state, never the static registry — already filtered to the languages that have a UI
// catalog. With fewer than two there is nothing to choose, so the control hides itself.
export default function CreatorLanguageSwitcher() {
  const { locale, languages, switchLocale, t } = useLocale();

  if (languages.length < 2) return null;

  return (
    <div className="flex items-center gap-2">
      <FiGlobe className="text-orange-500 shrink-0" size={14} aria-hidden="true" />
      <label htmlFor="creator-language" className="sr-only">
        {t('common.language')}
      </label>
      <select
        id="creator-language"
        value={locale}
        onChange={(event) => switchLocale(event.target.value)}
        className="bg-transparent border border-gray-200 dark:border-white/10 rounded-sm py-1.5 pl-2 pr-6 text-[10px] font-black uppercase tracking-widest text-black dark:text-white outline-none focus:border-orange-500 hover:border-orange-500/50 transition-colors cursor-pointer"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code} className="dark:bg-[#0c0c0c]">
            {language.nativeName || language.code}
          </option>
        ))}
      </select>
    </div>
  );
}
