'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BookMarked,
  ClipboardList,
  FileText,
  Gauge,
  Globe2,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { cx } from './ui';

// Every Translation Centre surface in one place. Without this the sub-pages were only reachable by
// typing the URL, which is why several of them were never used.
export const TRANSLATION_SECTIONS = [
  { href: '/admin/translations', label: 'Overview', icon: Gauge, exact: true, hint: 'Records, jobs and health at a glance' },
  { href: '/admin/translations/review-tasks', label: 'Review tasks', icon: ClipboardList, hint: 'Translations waiting for a decision' },
  { href: '/admin/translations/review-queue', label: 'Static pages', icon: FileText, hint: 'Legal and info page French copy' },
  { href: '/admin/translations/languages', label: 'Languages', icon: Globe2, hint: 'Register, backfill and publish languages' },
  { href: '/admin/translations/publishing-policies', label: 'Policies', icon: ShieldCheck, hint: 'How each object type publishes' },
  { href: '/admin/translations/prompts', label: 'Prompts', icon: MessageSquareText, hint: 'The instructions sent to the model' },
  { href: '/admin/translations/terminology', label: 'Terminology', icon: BookMarked, hint: 'Protected terms and dictionary' },
  { href: '/admin/translations/memory', label: 'Memory', icon: ListChecks, hint: 'Reusable approved translations' },
  { href: '/admin/translations/configuration', label: 'Configuration', icon: SlidersHorizontal, hint: 'Provider, queue and alert thresholds' },
  { href: '/admin/translations/operations', label: 'Operations', icon: Activity, hint: 'Health, alerts and diagnostic log' },
  { href: '/admin/translations/roles', label: 'Roles', icon: Users, hint: 'Who may read, edit and decide' },
];

export default function TranslationNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 overflow-x-auto scrollbar-hide">
      <ul className="flex items-center gap-1.5 px-1 pb-1">
        {TRANSLATION_SECTIONS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                title={label}
                className={cx(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border',
                  isActive
                    ? 'bg-orange-500 text-white border-transparent shadow-lg shadow-orange-500/20'
                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] text-gray-500 hover:text-orange-500 hover:border-orange-500/40'
                )}
              >
                <Icon size={13} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
