'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';

export default function LanguageSuggestion() {
  const { locale, languages, switchLocale } = useLocale(); const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('wcm_locale') || document.cookie.match(/(?:^|; )wcm_locale=([^;]+)/)?.[1];
    const timeoutId = window.setTimeout(() => setVisible(!saved && locale === 'en' && navigator.language?.toLowerCase().startsWith('fr') && languages.some(({ code }) => code === 'fr')), 0);
    return () => window.clearTimeout(timeoutId);
  }, [languages, locale]);
  if (!visible) return null;
  const stay = () => { localStorage.setItem('wcm_locale', 'en'); document.cookie = 'wcm_locale=en; Path=/; Max-Age=31536000; SameSite=Lax'; setVisible(false); };
  return <div role="dialog" aria-live="polite" className="fixed bottom-4 left-1/2 z-[500] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-wrap items-center justify-between gap-3 rounded-xl bg-black p-4 text-sm text-white shadow-2xl">
    <span>Votre navigateur est en français. Voulez-vous afficher le site en français&nbsp;?</span>
    <span className="flex gap-2"><button onClick={stay} className="rounded border px-3 py-1.5">Stay in English</button><button onClick={() => switchLocale('fr')} className="rounded bg-orange-500 px-3 py-1.5 font-semibold">Passer en français</button></span>
  </div>;
}
