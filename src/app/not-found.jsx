import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { localePath, translate } from '@/lib/i18n';
import { REQUEST_LOCALE_HEADER, getDocumentLanguage } from '@/lib/seo/siteConfig';

export default async function NotFound() {
  // The proxy stamps the requested path's language, so a missing French URL answers in French and
  // sends the visitor back to the French home page instead of the English one.
  const { lang } = getDocumentLanguage((await headers()).get(REQUEST_LOCALE_HEADER));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#1a1a18] px-6 text-center">

      <div className="relative w-full max-w-md h-64 md:h-80 mb-6">
        <Image
          src="/not-found.png"
          alt={translate(lang, 'notFound.imageAlt')}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-contain"
          priority
        />
      </div>

      <h1 className="sr-only">{translate(lang, 'notFound.title')}</h1>

      <p className="text-zinc-500 dark:text-gray-400 mt-4 max-w-md leading-relaxed">
        {translate(lang, 'notFound.description')}
      </p>

      <Link
        href={localePath(lang, '/')}
        className="mt-8 px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 uppercase"
      >
        {translate(lang, 'notFound.back')}
      </Link>
    </div>
  );
}
