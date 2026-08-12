import { notFound } from 'next/navigation';
import { getPublishedLocale } from '@/lib/i18n/languages';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (locale === 'en') notFound();
  const language = await getPublishedLocale(locale);
  if (!language || language.isSource) notFound();
  return <div lang={language.code} dir={language.direction}>{children}</div>;
}
