import BecomeCreatorClient from './BecomeCreatorClient';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { translate } from '@/lib/i18n';

export async function generateMetadata({ locale = 'en' } = {}) {
  return buildPageMetadata({ pageId: 'become-creator', locale });
}

// The application form is auth-gated and client-only: it renders nothing until it has mounted and
// nothing but a login modal for a signed-out visitor. A crawler is always signed out, so the page
// heading and its explanatory copy live here, server-rendered for everyone at every breakpoint.
// This is the page's only H1 — the form's photo panel carries decorative text, not a heading.
export default function BecomeCreatorPage({ locale = 'en' }) {
  const t = (key) => translate(locale, `becomeCreator.${key}`);
  const requirements = translate(locale, 'becomeCreator.requirements');

  return (
    <div className="bg-[#fafafa] dark:bg-[#050505]">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-4">
        <span className="inline-block px-4 py-1 rounded-full border border-orange-200 dark:border-orange-500/30 text-orange-600 text-[10px] font-black uppercase tracking-widest">
          {t('badge')}
        </span>
        <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white max-w-3xl">
          {t('heading')}
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
          {t('lead')}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {t('requirementsHeading')}
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
              {(Array.isArray(requirements) ? requirements : []).map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {t('reviewHeading')}
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
              {t('review')}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 italic">
              {t('signInNote')}
            </p>
          </div>
        </div>
      </section>

      <BecomeCreatorClient />
    </div>
  );
}
