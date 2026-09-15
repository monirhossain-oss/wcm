'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  CheckCircle2,
  ListChecks,
  PencilLine,
  RefreshCw,
  Save,
  Search,
  X,
} from 'lucide-react';
import {
  archiveMemory,
  archiveStaleMemory,
  getMemory,
  regenerateMemory,
  restoreMemory,
  updateMemory,
} from '../_services/translationCentreApi';
import {
  Badge,
  Banner,
  Button,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Spinner,
  StatusBadge,
  TableShell,
  Td,
  Th,
  inputClass,
  relativeTime,
  selectClass,
} from '../_components/ui';

// Every translation is filed: AI output, a creator's wording and Admin work. An Admin edit is always
// filed at an Admin level.
const ALL_LEVELS = ['ai_generated', 'creator_reviewed', 'admin_reviewed', 'verified'];
const ADMIN_LEVELS = ['admin_reviewed', 'verified'];
const ORIGINS = ['ai', 'creator', 'admin'];
const label = (value) => String(value).replace(/_/g, ' ');
const asText = (value) => (typeof value === 'string' ? value : JSON.stringify(value));
// Memory holds every translation the site has made, so the list is loaded a page at a time.
const PAGE_SIZE = 50;

export default function MemoryPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ archived: false, approvalLevel: '', origin: '', search: '', stale: false });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [searchDraft, setSearchDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ targetValue: '', approvalLevel: 'admin_reviewed' });
  // Regenerate preview per entry: { entryId, suggestedValue, promptVersion }.
  const [preview, setPreview] = useState(null);

  const load = useCallback(async (current, currentPage) => {
    try {
      setLoading(true);
      const response = await getMemory({
        ...(current.archived ? { isArchived: 'true' } : { isArchived: 'false' }),
        ...(current.approvalLevel ? { approvalLevel: current.approvalLevel } : {}),
        ...(current.origin ? { origin: current.origin } : {}),
        ...(current.search ? { search: current.search } : {}),
        ...(current.stale ? { stale: 'true' } : {}),
        page: currentPage,
        limit: PAGE_SIZE,
      });
      const rows = response.data.data || [];
      const nextPagination = response.data.pagination || { page: currentPage, pages: 1, total: rows.length, limit: PAGE_SIZE };
      // An archive or restore can empty the last page; step back instead of showing nothing.
      if (!rows.length && currentPage > 1 && nextPagination.total > 0) {
        setPage(nextPagination.pages);
        return;
      }
      setEntries(rows);
      setPagination(nextPagination);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation memory.');
      setEntries([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(() => load(filters, page), 0); return () => clearTimeout(timer); }, [load, filters, page]);

  const run = async (entryId, action, successMessage) => {
    setBusy(entryId); setError(''); setNotice('');
    try {
      await action();
      if (successMessage) setNotice(successMessage);
      await load(filters, page);
      return true;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The memory action failed.');
      return false;
    } finally { setBusy(''); }
  };

  const save = async (entryId) => {
    const saved = await run(
      entryId,
      () => updateMemory(entryId, { targetValue: draft.targetValue, approvalLevel: draft.approvalLevel }),
      'Memory entry updated. Future translations reuse the new value.'
    );
    if (saved) setEditingId(null);
  };

  const regenerate = async (entryId) => {
    setBusy(entryId); setError(''); setNotice(''); setPreview(null);
    try {
      const response = await regenerateMemory(entryId);
      setPreview(response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to regenerate this entry.');
    } finally { setBusy(''); }
  };

  const acceptPreview = async () => {
    if (!preview) return;
    const accepted = await run(
      preview.entryId,
      () => updateMemory(preview.entryId, { targetValue: preview.suggestedValue, approvalLevel: 'admin_reviewed' }),
      'New wording saved to memory. Translations that already used the old wording are not changed — regenerate those in the Translation Centre.'
    );
    if (accepted) setPreview(null);
  };

  const archiveStale = async () => {
    setBusy('stale'); setError(''); setNotice('');
    try {
      const response = await archiveStaleMemory();
      setNotice(`${response.data.data.archivedCount} AI entries from older prompts archived.`);
      setPage(1);
      await load(filters, 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to archive stale entries.');
    } finally { setBusy(''); }
  };

  // A new filter starts again from the first page.
  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="Translation memory"
        description="Every translation the site has produced — by AI, by creators and by administrators. The pipeline reuses these instead of calling the provider; a memory hit costs nothing."
        actions={
          <Button variant="secondary" onClick={() => setFilter('archived', !filters.archived)}>
            {filters.archived ? 'Show reusable' : 'Show archived'}
          </Button>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader
          icon={ListChecks}
          title={filters.archived ? 'Archived entries' : 'Reusable entries'}
          description="A lower level never replaces a higher one. AI entries made with an older prompt, or containing a word whose dictionary rule changed, stop being reused automatically."
          actions={<Badge tone="neutral">{pagination.total} entr{pagination.total === 1 ? 'y' : 'ies'}</Badge>}
        />

        <div className="flex flex-wrap items-center gap-3 px-5 md:px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => { event.preventDefault(); setFilter('search', searchDraft.trim()); }}
          >
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search source or translation"
              className={`${inputClass} w-56`}
            />
            <Button type="submit" variant="secondary" size="sm"><Search size={12} /> Search</Button>
          </form>
          <select value={filters.approvalLevel} onChange={(event) => setFilter('approvalLevel', event.target.value)} className={selectClass}>
            <option value="">All levels</option>
            {ALL_LEVELS.map((level) => <option key={level} value={level}>{label(level)}</option>)}
          </select>
          <select value={filters.origin} onChange={(event) => setFilter('origin', event.target.value)} className={selectClass}>
            <option value="">All origins</option>
            {ORIGINS.map((origin) => <option key={origin} value={origin}>{origin}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={filters.stale} onChange={(event) => setFilter('stale', event.target.checked)} />
            Older prompt only
          </label>
          {filters.stale && !filters.archived && entries.length > 0 && (
            <Button variant="danger" size="sm" onClick={archiveStale} loading={busy === 'stale'}>
              <Archive size={12} /> Archive all shown
            </Button>
          )}
        </div>

        {loading ? <Spinner label="Loading memory" /> : entries.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Source</Th><Th>Translation</Th><Th>Field</Th><Th>Level</Th><Th>Updated</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {entries.map((entry) => {
                const isEditing = editingId === entry._id;
                const displayValue = asText(entry.targetValue);
                const entryPreview = preview?.entryId === entry._id ? preview : null;
                return (
                  <tr key={entry._id} className="align-top">
                    <Td className="max-w-xs">
                      <span className="block text-sm text-gray-700 dark:text-gray-200 break-words">{asText(entry.sourceText ?? '')}</span>
                    </Td>
                    <Td className="max-w-sm">
                      {isEditing ? (
                        <input value={draft.targetValue} onChange={(event) => setDraft((current) => ({ ...current, targetValue: event.target.value }))} className={inputClass} />
                      ) : (
                        <span className="block text-sm break-words">{displayValue}</span>
                      )}
                      {entryPreview && (
                        <div className="mt-3 space-y-2 rounded-lg border border-orange-300/60 bg-orange-500/5 p-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Suggested ({entryPreview.promptVersion})</p>
                          <p className="text-sm break-words">{entryPreview.suggestedValue}</p>
                          <div className="flex gap-1.5">
                            <Button size="sm" onClick={acceptPreview} loading={busy === entry._id}><Save size={12} /> Use this</Button>
                            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}><X size={12} /> Discard</Button>
                          </div>
                        </div>
                      )}
                    </Td>
                    <Td>
                      <span className="block font-bold text-gray-900 dark:text-white">{entry.fieldName}</span>
                      <Badge tone="info">{entry.sourceLanguageCode} → {entry.targetLanguageCode}</Badge>
                      {entry.businessObjectType && <span className="block mt-1 text-[10px] text-gray-400">{entry.businessObjectType}</span>}
                    </Td>
                    <Td>
                      {isEditing ? (
                        <select value={draft.approvalLevel} onChange={(event) => setDraft((current) => ({ ...current, approvalLevel: event.target.value }))} className={selectClass}>
                          {ADMIN_LEVELS.map((level) => <option key={level} value={level}>{label(level)}</option>)}
                        </select>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge value={entry.approvalLevel} />
                          <Badge tone="neutral">{entry.origin || 'admin'}</Badge>
                          {entry.isStale && <Badge tone="warning">older prompt</Badge>}
                        </div>
                      )}
                    </Td>
                    <Td className="text-xs font-medium text-gray-400 whitespace-nowrap">{relativeTime(entry.updatedAt)}</Td>
                    <Td>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={() => save(entry._id)} loading={busy === entry._id}><Save size={12} /> Save</Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X size={12} /></Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingId(entry._id);
                                setDraft({
                                  targetValue: displayValue,
                                  approvalLevel: ADMIN_LEVELS.includes(entry.approvalLevel) ? entry.approvalLevel : 'admin_reviewed',
                                });
                              }}
                            >
                              <PencilLine size={12} /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => regenerate(entry._id)} loading={busy === entry._id && !entryPreview}>
                              <RefreshCw size={12} /> Regenerate
                            </Button>
                            {entry.isArchived ? (
                              <Button variant="secondary" size="sm" onClick={() => run(entry._id, () => restoreMemory(entry._id), 'Entry restored. It is reused again.')} loading={busy === entry._id}>
                                <ArchiveRestore size={12} /> Restore
                              </Button>
                            ) : (
                              <Button variant="danger" size="sm" onClick={() => run(entry._id, () => archiveMemory(entry._id), 'Entry archived. It is no longer reused by the pipeline.')} loading={busy === entry._id}>
                                <Archive size={12} /> Archive
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        ) : null}
        {!loading && entries.length > 0 && pagination.pages > 1 && (
          <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-gray-100 dark:border-white/5">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Page {pagination.page} of {pagination.pages} · {pagination.total} entries
            </span>
            <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
        {!loading && !entries.length && (
          <EmptyState
            icon={ListChecks}
            title={filters.archived ? 'Nothing archived' : 'No memory entries match'}
            description="Every translation the site produces is filed here automatically."
          />
        )}
      </Card>
    </section>
  );
}
