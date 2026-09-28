'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { detectTextLanguage } from '@/lib/i18n/detectTextLanguage';

// Asks the creator which language they wrote in when the text looks like the other language than
// the page. A listing or bio is filed in the language it is sent with (`sourceLanguage`), and the
// page's language is only a guess: French typed on the English page would otherwise become the
// English master, and English typed on the French page the creator's "French".
//
// `confirmAuthoringLanguage(text)` resolves to the language to send, or null when the creator went
// back to edit. It resolves to the page's language straight away — no dialog — whenever the text
// agrees with the page or is too short or mixed to tell.
export function useAuthoringLanguageCheck(pageLanguage) {
  const [detected, setDetected] = useState(null);
  const resolver = useRef(null);

  const confirmAuthoringLanguage = useCallback(
    (text) => {
      const language = detectTextLanguage(text);
      if (!language || language === pageLanguage) return Promise.resolve(pageLanguage);
      return new Promise((resolve) => {
        resolver.current = resolve;
        setDetected(language);
      });
    },
    [pageLanguage]
  );

  const settle = useCallback((choice) => {
    resolver.current?.(choice);
    resolver.current = null;
    setDetected(null);
  }, []);

  const languageDialog = detected ? (
    <LanguageMismatchDialog detected={detected} pageLanguage={pageLanguage} onChoose={settle} />
  ) : null;

  return { confirmAuthoringLanguage, languageDialog };
}

export default function LanguageMismatchDialog({ detected, pageLanguage, onChoose }) {
  const { t, tf } = useLocale();
  const name = (code) => t(`languageCheck.languages.${code}`, code);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onChoose(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onChoose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-check-title"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-2xl p-6"
      >
        <h3 id="language-check-title" className="text-lg font-bold text-gray-900 dark:text-white">
          {tf('languageCheck.title', { language: name(detected) })}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {tf('languageCheck.body', { page: name(pageLanguage), language: name(detected) })}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => onChoose(detected)}
            className="w-full py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
          >
            {tf('languageCheck.saveAs', { language: name(detected) })}
          </button>
          <button
            type="button"
            onClick={() => onChoose(pageLanguage)}
            className="w-full py-2.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {tf('languageCheck.saveAs', { language: name(pageLanguage) })}
          </button>
          <button
            type="button"
            onClick={() => onChoose(null)}
            className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {t('languageCheck.back')}
          </button>
        </div>
      </div>
    </div>
  );
}
