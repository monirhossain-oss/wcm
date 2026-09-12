'use client';

// Building blocks for the Creator translation pages. They follow the creator shell's language:
// white / #0c0c0c surfaces, hairline borders, orange accent and black uppercase micro-labels.
import { FiLoader } from 'react-icons/fi';

export const cx = (...values) => values.filter(Boolean).join(' ');

export const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 disabled:opacity-50';

export const textareaClass = cx(inputClass, 'resize-y leading-6');

const buttonVariants = {
  primary: 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 border border-transparent',
  secondary:
    'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-orange-500/40 hover:text-orange-500 bg-white dark:bg-white/5',
  danger:
    'border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-white dark:bg-transparent',
};

export function Button({ variant = 'primary', size = 'md', className, children, loading, ...props }) {
  const sizing = size === 'sm' ? 'px-3 py-2 text-[10px]' : 'px-4 py-2.5 text-[11px]';
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        sizing,
        buttonVariants[variant],
        className
      )}
    >
      {loading && <FiLoader size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, children }) {
  return (
    <section
      className={cx(
        'bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden',
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="px-5 md:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-3">
      {Icon && (
        <span className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
          <Icon size={15} />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{title}</h2>
        {description && <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const CardBody = ({ className, children }) => (
  <div className={cx('p-5 md:p-6', className)}>{children}</div>
);

// The four states `resolveCreatorAvailabilityState()` returns are the only translation states a
// Creator ever sees. Internal review level, confidence, provider and queue detail stay in the
// Translation Centre.
const availabilityTones = {
  Available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Processing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'Needs attention': 'bg-red-500/10 text-red-600 dark:text-red-400',
  'Not available': 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400',
};

export function AvailabilityBadge({ languageCode, state, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap',
        availabilityTones[state] || availabilityTones['Not available'],
        className
      )}
    >
      {languageCode && <span className="opacity-60">{languageCode}</span>}
      {state}
    </span>
  );
}

const bannerTones = {
  error: 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
  success: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  info: 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300',
};

export function Banner({ tone = 'info', icon: Icon, children, className }) {
  if (!children) return null;
  return (
    <div className={cx('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium', bannerTones[tone], className)}>
      {Icon && <Icon size={16} className="mt-0.5 flex-shrink-0" />}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Field({ label, hint, htmlFor, children, className }) {
  return (
    <div className={cx('space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-[11px] font-medium text-gray-400">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {Icon && (
        <span className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center">
          <Icon size={20} />
        </span>
      )}
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">{title}</p>
      {description && <p className="max-w-md text-xs font-medium text-gray-400">{description}</p>}
      {action}
    </div>
  );
}

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 px-6 py-14 text-gray-400">
    <FiLoader size={16} className="animate-spin" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export const relativeTime = (value) => {
  if (!value) return '—';
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60_000);
  if (Number.isNaN(minutes)) return '—';
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
};
