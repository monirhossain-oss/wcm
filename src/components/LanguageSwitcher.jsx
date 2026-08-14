'use client';
import { useLocale } from '@/context/LocaleContext';

export default function LanguageSwitcher() {
  const { locale, languages, switchLocale, t } = useLocale();
  const published = languages.filter(({ code }) => code === 'en' || code === 'fr');
  if (published.length < 2) return null;
  return <div>
    <span className="sr-only">{t('common.language')}</span>
    <select aria-label={t('common.language')} value={locale} onChange={(event) => switchLocale(event.target.value)} className="dark:bg-black px-1 py-1 text-sm">
      {published.map((language) => <option key={language.code} value={language.code}>{language.nativeName}</option>)}
    </select>
  </div>;
}
