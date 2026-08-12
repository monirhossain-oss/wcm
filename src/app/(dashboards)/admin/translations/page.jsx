'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import api, {
  enqueueBulkOperation,
  exportTranslationOperations,
  getDashboard,
  getOperationalAlerts,
  getOperationalHealth,
  getRecords,
} from './_services/translationCentreApi';

const TYPES = ['listing', 'creatorProfile', 'category', 'blog', 'faq', 'cms'];

export default function TranslationCentrePage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [result, setResult] = useState({ records: [], pagination: {} });
  const [filters, setFilters] = useState({ businessObjectType: '', languageCode: '', translationStatus: '', publicationStatus: '', creatorId: '', search: '' });
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
  const activeFilters = () => Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value)
  );
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

  return <section className="space-y-6 text-gray-900 dark:text-gray-100">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold">Translation Centre</h1><p className="text-sm text-gray-500">English-only operational view of multilingual records and jobs.</p></div><div className="flex flex-wrap gap-2"><Link href="/admin/translations/publishing-policies" className="rounded border px-3 py-2 text-sm">Publishing policies</Link><button onClick={exportOperations} disabled={exporting} className="rounded border px-3 py-2 text-sm disabled:opacity-50">{exporting ? 'Exporting…' : 'Export Excel'}</button><button onClick={startBulkRegeneration} disabled={bulkLoading} className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{bulkLoading ? 'Queueing…' : 'Bulk regenerate current filters'}</button></div></div>
    <div className="grid gap-3 md:grid-cols-4">
      <Metric label="Published" value={count(dashboard?.records?.byPublication, 'published')} />
      <Metric label="Needs attention" value={count(dashboard?.records?.byStatus, 'outdated') + count(dashboard?.records?.byStatus, 'failed')} />
      <Metric label="Queued jobs" value={count(dashboard?.jobs, 'queued') + count(dashboard?.jobs, 'retry_scheduled')} />
      <Metric label="AI tokens" value={dashboard?.usage?.reduce((total, item) => total + (item.totalTokens || 0), 0) || 0} />
      <Metric label="High confidence" value={count(dashboard?.records?.confidence, 0.8)} />
      <Metric label="Provider" value={health?.provider?.available ? 'Available' : 'Unavailable'} />
      <Metric label="Open alerts" value={alerts.filter((alert) => alert.status === 'open').length} />
    </div>
    <form onSubmit={submit} className="grid gap-3 rounded border bg-white p-4 dark:bg-black md:grid-cols-4">
      <input value={filters.search} onChange={(e) => set('search', e.target.value)} placeholder="Search text, record ID, or object ID" className="rounded border p-2 md:col-span-2" />
      <div className="relative"><input value={filters.creatorId} onChange={(e) => set('creatorId', e.target.value)} placeholder="Search creator" className="w-full rounded border p-2" />{creatorSuggestions.length > 0 && <div className="absolute z-10 mt-1 w-full rounded border bg-white shadow dark:bg-black">{creatorSuggestions.map((creator) => <button type="button" key={creator._id} onClick={() => { set('creatorId', creator._id); setCreatorSuggestions([]); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800">{creator.profile?.displayName || creator.profile?.businessName || `${creator.firstName || ''} ${creator.lastName || ''}`.trim()} <span className="text-xs text-gray-500">{creator._id}</span></button>)}</div>}</div>
      <select value={filters.businessObjectType} onChange={(e) => set('businessObjectType', e.target.value)} className="rounded border p-2"><option value="">All business objects</option>{TYPES.map((type) => <option key={type}>{type}</option>)}</select>
      <select value={filters.languageCode} onChange={(e) => set('languageCode', e.target.value)} className="rounded border p-2"><option value="">All languages</option><option value="en">English</option><option value="fr">French</option></select>
      <select value={filters.translationStatus} onChange={(e) => set('translationStatus', e.target.value)} className="rounded border p-2"><option value="">All translation statuses</option>{['ai_generated', 'creator_reviewed', 'admin_reviewed', 'outdated', 'failed'].map((value) => <option key={value}>{value}</option>)}</select>
      <select value={filters.publicationStatus} onChange={(e) => set('publicationStatus', e.target.value)} className="rounded border p-2"><option value="">All publication statuses</option>{['published', 'draft', 'unpublished', 'archived'].map((value) => <option key={value}>{value}</option>)}</select>
      <button className="rounded bg-orange-500 px-4 py-2 font-semibold text-white">Search records</button>
    </form>
    {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded border bg-white dark:bg-black"><table className="min-w-full text-sm"><thead className="border-b text-left text-gray-500"><tr><th className="p-3">Object</th><th>Language</th><th>Status</th><th>Publication</th><th>Translated display text</th><th>Updated</th></tr></thead><tbody>
      {result.records.map((record) => <tr key={record.translationRecordId} className="border-b"><td className="p-3"><Link className="font-medium text-orange-600" href={`/admin/translations/records/${record.translationRecordId}`}>{record.master?.label || record.businessObjectId}</Link><div className="text-xs text-gray-500">{record.businessObjectType}{record.master?.cmsKey ? ` · ${record.master.cmsKey}` : ''}</div></td><td>{record.languageCode}</td><td>{record.translationStatus}</td><td>{record.publicationStatus}</td><td className="max-w-xs truncate">{record.displayText || '—'}</td><td>{record.updatedAt ? new Date(record.updatedAt).toLocaleString() : '—'}</td></tr>)}
      {!loading && !result.records.length && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No translation records match these filters.</td></tr>}
    </tbody></table></div>
    <div className="flex items-center justify-between text-sm"><span>{result.pagination.total || 0} records</span><div className="space-x-2"><button disabled={(result.pagination.page || 1) <= 1} onClick={() => load((result.pagination.page || 1) - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button><button disabled={(result.pagination.page || 1) >= (result.pagination.pages || 1)} onClick={() => load((result.pagination.page || 1) + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next</button></div></div>
  </section>;
}

function Metric({ label, value }) { return <div className="rounded border bg-white p-4 dark:bg-black"><p className="text-xs uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>; }
