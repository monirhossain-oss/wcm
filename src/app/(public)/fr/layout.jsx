import { notFound } from 'next/navigation';
import { getPublishedLocale } from '@/lib/i18n/languages';

export default async function FrenchCompatibilityLayout({ children }) {
  const language = await getPublishedLocale('fr');
  if (!language || language.isSource) notFound();
  return <div lang="fr" dir={language.direction}>{children}</div>;
}
