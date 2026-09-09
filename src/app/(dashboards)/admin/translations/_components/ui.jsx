'use client';

// Shared building blocks for the Translation Centre pages. They reuse the admin shell's language:
// off-white surface, hairline borders, orange accent, black uppercase micro-labels.
import { Loader2 } from 'lucide-react';

export const cx = (...values) => values.filter(Boolean).join(' ');

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none transition-all focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 disabled:opacity-50';

export const selectClass = cx(inputClass, 'cursor-pointer appearance-none pr-9');

export const textareaClass = cx(inputClass, 'resize-y leading-6');

export const monoClass =
  'font-mono text-[11px] leading-5 text-gray-700 dark:text-gray-300';

const buttonVariants = {
  primary:
    'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 border border-transparent',
  secondary:
    'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-orange-500/40 hover:text-orange-500 bg-white dark:bg-white/5',
  success:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 border border-transparent',
  danger:
    'border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-white dark:bg-transparent',
  ghost:
    'text-gray-500 hover:text-orange-500 border border-transparent',
};

export function Button({ variant = 'primary', size = 'md', className, children, loading, ...props }) {
  const sizing = size === 'sm' ? 'px-3 py-2 text-[10px]' : 'px-4 py-2.5 text-[11px]';
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        sizing,
        buttonVariants[variant],
        className
      )}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

export function PageHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-5">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/20 flex-shrink-0">
        {Icon && <Icon size={20} className="text-white" />}
      </div>
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white">{title}</h1>
        {description && <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }) {
  return (
    <section
      className={cx(
        'bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden',
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="px-5 md:px-6 py-4 md:py-5 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-3">
      {Icon && (
        <span className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
          <Icon size={16} />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">{title}</h2>
        {description && <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const CardBody = ({ className, children }) => (
  <div className={cx('p-5 md:p-6', className)}>{children}</div>
);

const metricTones = {
  default: 'text-gray-900 dark:text-white',
  orange: 'text-orange-500',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-500',
  danger: 'text-red-500',
};

export function Metric({ label, value, hint, tone = 'default' }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0d0d] p-4 md:p-5">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className={cx('mt-2 text-2xl font-black tracking-tight', metricTones[tone])}>{value}</p>
      {hint && <p className="mt-1 text-[11px] font-medium text-gray-400">{hint}</p>}
    </div>
  );
}

const badgeTones = {
  neutral: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
  info: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

// One vocabulary for every status the Translation Centre shows, so a colour always means the same
// thing across the records table, the job monitor and the language lifecycle.
export const statusTone = (value) => {
  const key = String(value || '').toLowerCase();
  if (['published', 'completed', 'ready', 'approved', 'success', 'verified', 'active', 'resolved'].includes(key)) return 'success';
  if (['draft', 'queued', 'processing', 'retry_scheduled', 'pending', 'assigned', 'in_review', 'backfilling', 'warning', 'acknowledged'].includes(key)) return 'warning';
  if (['failed', 'dead_letter', 'rejected', 'outdated', 'critical', 'returned_for_modification'].includes(key)) return 'danger';
  if (['ai_generated', 'admin_reviewed', 'creator_reviewed', 'registered'].includes(key)) return 'info';
  return 'neutral';
};

export function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap',
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export const StatusBadge = ({ value, className }) =>
  value ? <Badge tone={statusTone(value)} className={className}>{String(value).replace(/_/g, ' ')}</Badge> : <span className="text-gray-400">—</span>;

const bannerTones = {
  error: 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
  success: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  info: 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300',
  neutral: 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300',
};

export function Banner({ tone = 'info', icon: Icon, children, className }) {
  if (!children) return null;
  return (
    <div className={cx('flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium', bannerTones[tone], className)}>
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
        <span className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center">
          <Icon size={20} />
        </span>
      )}
      <p className="text-sm font-black uppercase tracking-widest text-gray-500">{title}</p>
      {description && <p className="max-w-md text-xs font-medium text-gray-400">{description}</p>}
      {action}
    </div>
  );
}

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 px-6 py-14 text-gray-400">
    <Loader2 size={16} className="animate-spin" />
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);

export const TableShell = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">{children}</table>
  </div>
);

export const Th = ({ children, className }) => (
  <th className={cx('px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap', className)}>
    {children}
  </th>
);

export const Td = ({ children, className }) => (
  <td className={cx('px-5 py-4 align-middle text-gray-700 dark:text-gray-200', className)}>{children}</td>
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

// Read-only JSON viewer used wherever a record, version or log entry is shown verbatim.
export const JsonBlock = ({ value, className }) => (
  <pre className={cx('overflow-auto rounded-xl bg-gray-50 dark:bg-white/5 p-4 max-h-80', monoClass, className)}>
    {JSON.stringify(value ?? null, null, 2)}
  </pre>
);
