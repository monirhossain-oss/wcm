'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Coins,
  Download,
  FileSearch,
  Gauge,
  Layers,
  RefreshCw,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import api, {
  enqueueBulkOperation,
  exportTranslationOperations,
  getDashboard,
  getOperationalAlerts,
  getOperationalHealth,
  getRecords,
} from './_services/translationCentreApi';
import {
  Badge,
  Banner,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Metric,
  PageHeader,
  Spinner,
  StatusBadge,
  TableShell,
  Td,
  Th,
  inputClass,
  relativeTime,
  selectClass,
} from './_components/ui';
import { OBJECT_TYPES, objectTypeLabel } from './_components/objectTypes';

const TRANSLATION_STATUSES = ['ai_generated', 'creator_reviewed', 'admin_reviewed', 'outdated', 'failed'];
const PUBLICATION_STATUSES = ['published', 'draft', 'unpublished', 'archived'];
const EMPTY_FILTERS = {
  businessObjectType: '',
  languageCode: '',
  translationStatus: '',
  publicationStatus: '',
  creatorId: '',
  search: '',
};


export default function TranslationCentrePage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [result, setResult] = useState({ records: [], pagination: {} });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatorSuggestions, setCreatorSuggestions] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const loadRef = useRef(null);

  const load = async (page = 1) => {
    setLoading(true); setError('');
    try {
      const params = Object.fromEntries(Object.entries({ ...filters, page, limit: 20 }).filter(([, value]) => value));
      const [dashboardResponse, recordsResponse, healthResponse, alertsResponse] = await Promise.all([getDashboard(), getRecords(params), getOperationalHealth(), getOperationalAlerts()]);
      setDashboard(dashboardResponse.data.data); setResult(recordsResponse.data.data); setHealth(healthResponse.data.data); setAlerts(alertsResponse.data.data || []);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load Translation Centre.'); }
    finally { setLoading(false); }
  };
  loadRef.current = load;
  useEffect(() => {
    const initial = setTimeout(() => loadRef.current?.(), 0);
    return () => clearTimeout(initial);
  }, []);
  useEffect(() => {
    const term = filters.creatorId.trim();
    if (term.length < 2 || /^[a-f\d]{24}$/i.test(term)) { setCreatorSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const response = await api.get('/api/admin/users', { params: { role: 'creator', search: term, limit: 5 } });
        setCreatorSuggestions(response.data.users || []);
      } catch { setCreatorSuggestions([]); }
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters.creatorId]);

  const submit = (event) => { event.preventDefault(); load(); };
  const set = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const count = (items, name) => items?.find((item) => item._id === name)?.count || 0;
  const activeFilters = () => Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const openAlerts = alerts.filter((alert) => alert.status === 'open');

  const startBulkRegeneration = async () => {
    setBulkLoading(true); setError('');
    try {
      const response = await enqueueBulkOperation({ operation: 'regenerate', filters: activeFilters() });
      router.push(`/admin/translations/bulk/${response.data.data.bulkOperationId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to enqueue the bulk regeneration.');
    } finally { setBulkLoading(false); }
  };

  const exportOperations = async () => {
    setExporting(true); setError('');
    try {
      const response = await exportTranslationOperations(activeFilters());
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'WCM_Translation_Operations.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to export translation operations.');
    } finally { setExporting(false); }
  };

  const totalTokens = dashboard?.usage?.reduce((total, item) => total + (item.totalTokens || 0), 0) || 0;
  const queued = count(dashboard?.jobs, 'queued') + count(dashboard?.jobs, 'retry_scheduled');
  const needsAttention = count(dashboard?.records?.byStatus, 'outdated') + count(dashboard?.records?.byStatus, 'failed');
  const deadLetter = count(dashboard?.jobs, 'dead_letter');

  return (
    <section className="space-y-6">
      <PageHeader
        icon={Gauge}
        title="Translation Centre"
        description="Operational view of every multilingual record, job and review. Administrative labels stay in English."
        actions={
          <>
            <Button variant="secondary" onClick={() => load(result.pagination.page || 1)} loading={loading}>
              <RefreshCw size={13} /> Refresh
            </Button>
            <Button variant="secondary" onClick={exportOperations} loading={exporting}>
              <Download size={13} /> Export Excel
            </Button>
            <Button onClick={startBulkRegeneration} loading={bulkLoading}>
              <RotateCw size={13} /> Bulk regenerate
            </Button>
          </>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>

      {openAlerts.length > 0 && (
        <Banner tone="error" icon={AlertTriangle}>
          <span className="font-black uppercase tracking-widest text-[11px]">{openAlerts.length} open alert{openAlerts.length > 1 ? 's' : ''}</span>
          <span className="mx-2 opacity-50">·</span>
          {openAlerts.slice(0, 2).map((alert) => alert.summary).join(' · ')}
          <Link href="/admin/translations/operations" className="ml-2 underline font-bold">Open operations</Link>
        </Banner>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Published" value={count(dashboard?.records?.byPublication, 'published')} tone="success" hint="Live in a non-source language" />
        <Metric label="Needs attention" value={needsAttention} tone={needsAttention ? 'danger' : 'default'} hint="Outdated or failed records" />
        <Metric label="Queued jobs" value={queued} tone={queued ? 'warning' : 'default'} hint={`${deadLetter} in dead letter`} />
        <Metric label="AI tokens" value={totalTokens.toLocaleString()} hint="Reported by the provider" />
        <Metric
          label="Provider"
          value={health?.provider?.available ? 'Available' : 'Unavailable'}
          tone={health?.provider?.available ? 'success' : 'danger'}
          hint={health?.provider?.active ? `${health.provider.active} · config v${health.configurationVersion ?? 0}` : undefined}
        />
      </div>

      <Card>
        <CardHeader
          icon={Search}
          title="Find translation records"
          description="Filter by object, language and state. The same filters drive bulk regeneration and the Excel export."
          actions={
            activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { setFilters(EMPTY_FILTERS); setCreatorSuggestions([]); }}>
                <X size={12} /> Clear {activeFilterCount}
              </Button>
            )
          }
        />
        <form onSubmit={submit} className="p-5 md:p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Search" className="md:col-span-2" hint="Text, record ID or business object ID">
            <input value={filters.search} onChange={(e) => set('search', e.target.value)} placeholder="Masque, 69ec7f56b5aac…" className={inputClass} />
          </Field>

          <Field label="Creator" hint="Listing and creator profile records only">
            <div className="relative">
              <input value={filters.creatorId} onChange={(e) => set('creatorId', e.target.value)} placeholder="Search creator" className={inputClass} />
              {creatorSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl overflow-hidden">
                  {creatorSuggestions.map((creator) => (
                    <button
                      type="button"
                      key={creator._id}
                      onClick={() => { set('creatorId', creator._id); setCreatorSuggestions([]); }}
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-orange-500/5"
                    >
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {creator.profile?.displayName || creator.profile?.businessName || `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || 'Unnamed creator'}
                      </span>
                      <span className="block text-[10px] font-mono text-gray-400">{creator._id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Business object">
            <select value={filters.businessObjectType} onChange={(e) => set('businessObjectType', e.target.value)} className={selectClass}>
              <option value="">All business objects</option>
              {OBJECT_TYPES.map((type) => <option key={type} value={type}>{objectTypeLabel(type)}</option>)}
            </select>
          </Field>

          <Field label="Language">
            <select value={filters.languageCode} onChange={(e) => set('languageCode', e.target.value)} className={selectClass}>
              <option value="">All languages</option>
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </Field>

          <Field label="Translation status">
            <select value={filters.translationStatus} onChange={(e) => set('translationStatus', e.target.value)} className={selectClass}>
              <option value="">All translation statuses</option>
              {TRANSLATION_STATUSES.map((value) => <option key={value} value={value}>{value.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>

          <Field label="Publication status">
            <select value={filters.publicationStatus} onChange={(e) => set('publicationStatus', e.target.value)} className={selectClass}>
              <option value="">All publication statuses</option>
              {PUBLICATION_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </Field>

          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={loading}>
              <Search size={13} /> Search records
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader
          icon={Layers}
          title="Translation records"
          description={`${result.pagination.total || 0} record${(result.pagination.total || 0) === 1 ? '' : 's'} match the current filters`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled={(result.pagination.page || 1) <= 1} onClick={() => load((result.pagination.page || 1) - 1)}>Previous</Button>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {result.pagination.page || 1} / {result.pagination.pages || 1}
              </span>
              <Button variant="secondary" size="sm" disabled={(result.pagination.page || 1) >= (result.pagination.pages || 1)} onClick={() => load((result.pagination.page || 1) + 1)}>Next</Button>
            </div>
          }
        />

        {loading && !result.records.length ? (
          <Spinner label="Loading records" />
        ) : result.records.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr>
                <Th>Object</Th>
                <Th>Language</Th>
                <Th>Translation</Th>
                <Th>Publication</Th>
                <Th>Translated text</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {result.records.map((record) => (
                <tr key={record.translationRecordId} className="hover:bg-orange-500/[0.03] transition-colors">
                  <Td>
                    <Link className="font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors" href={`/admin/translations/records/${record.translationRecordId}`}>
                      {record.master?.label || record.businessObjectId}
                    </Link>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {objectTypeLabel(record.businessObjectType)}
                      {record.master?.cmsKey ? ` · ${record.master.cmsKey}` : ''}
                    </span>
                  </Td>
                  <Td><Badge tone="info">{record.languageCode}</Badge></Td>
                  <Td><StatusBadge value={record.translationStatus} /></Td>
                  <Td><StatusBadge value={record.publicationStatus} /></Td>
                  <Td className="max-w-xs"><span className="block truncate text-sm">{record.displayText || '—'}</span></Td>
                  <Td className="text-xs font-medium text-gray-400 whitespace-nowrap">{relativeTime(record.updatedAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : (
          <EmptyState
            icon={FileSearch}
            title="No translation records match these filters"
            description="A record appears once a translation job has produced content. Save the source object again to queue a fresh job, or widen the filters."
          />
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={Sparkles} title="Queue breakdown" description="Durable job states across every language" />
          <div className="p-5 md:p-6 flex flex-wrap gap-2">
            {(dashboard?.jobs || []).length ? dashboard.jobs.map((item) => (
              <Badge key={item._id} tone={statusToneForJob(item._id)}>
                {String(item._id).replace(/_/g, ' ')} · {item.count}
              </Badge>
            )) : <p className="text-xs font-medium text-gray-400">No jobs recorded yet.</p>}
          </div>
        </Card>

        <Card>
          <CardHeader icon={ShieldCheck} title="Review levels" description="How much human review the current records carry" />
          <div className="p-5 md:p-6 flex flex-wrap gap-2">
            {(dashboard?.records?.byStatus || []).length ? dashboard.records.byStatus.map((item) => (
              <Badge key={item._id} tone={statusToneForJob(item._id)}>
                {String(item._id).replace(/_/g, ' ')} · {item.count}
              </Badge>
            )) : <p className="text-xs font-medium text-gray-400">No records yet.</p>}
            <span className="w-full" />
            <Badge tone="neutral"><Coins size={11} /> {totalTokens.toLocaleString()} tokens billed</Badge>
          </div>
        </Card>
      </div>
    </section>
  );
}

const statusToneForJob = (value) => {
  const key = String(value || '').toLowerCase();
  if (['completed', 'published', 'admin_reviewed', 'verified'].includes(key)) return 'success';
  if (['queued', 'processing', 'retry_scheduled', 'draft', 'ai_generated'].includes(key)) return 'warning';
  if (['dead_letter', 'failed', 'outdated'].includes(key)) return 'danger';
  return 'neutral';
};
