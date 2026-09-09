'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Archive, CheckCircle2, ListChecks, PencilLine, Save, X } from 'lucide-react';
import { archiveMemory, getMemory, updateMemory } from '../_services/translationCentreApi';
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

const APPROVAL_LEVELS = ['admin_reviewed', 'verified'];

export default function MemoryPage() {
  const [entries, setEntries] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ targetValue: '', approvalLevel: 'admin_reviewed' });

  const load = useCallback(async (archived) => {
    try {
      setLoading(true);
      const response = await getMemory(archived ? { isArchived: 'true' } : {});
      setEntries(response.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation memory.');
      setEntries([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(() => load(showArchived), 0); return () => clearTimeout(timer); }, [load, showArchived]);

  const save = async (entryId) => {
    setBusy(entryId); setError(''); setNotice('');
    try {
      await updateMemory(entryId, { targetValue: draft.targetValue, approvalLevel: draft.approvalLevel });
      setNotice('Memory entry updated. Future jobs reuse the new value.');
      setEditingId(null);
      await load(showArchived);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the memory entry.');
    } finally { setBusy(''); }
  };

  const archive = async (entryId) => {
    setBusy(entryId); setError(''); setNotice('');
    try {
      await archiveMemory(entryId);
      setNotice('Entry archived. It is no longer reused by the pipeline.');
      await load(showArchived);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to archive the memory entry.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="Translation memory"
        description="Approved translations the pipeline reuses instead of calling the provider. A memory hit costs nothing and returns instantly."
        actions={
          <Button variant="secondary" onClick={() => setShowArchived((value) => !value)}>
            {showArchived ? 'Show reusable' : 'Show archived'}
          </Button>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader
          icon={ListChecks}
          title={showArchived ? 'Archived entries' : 'Reusable entries'}
          description="Entries are created automatically when an administrator approves or verifies a translation."
          actions={<Badge tone="neutral">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'}</Badge>}
        />

        {loading ? <Spinner label="Loading memory" /> : entries.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Field</Th><Th>Pair</Th><Th>Stored translation</Th><Th>Approval</Th><Th>Updated</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {entries.map((entry) => {
                const isEditing = editingId === entry._id;
                const displayValue = typeof entry.targetValue === 'string' ? entry.targetValue : JSON.stringify(entry.targetValue);
                return (
                  <tr key={entry._id}>
                    <Td className="font-bold text-gray-900 dark:text-white">{entry.fieldName}</Td>
                    <Td><Badge tone="info">{entry.sourceLanguageCode} → {entry.targetLanguageCode}</Badge></Td>
                    <Td className="max-w-sm">
                      {isEditing ? (
                        <input value={draft.targetValue} onChange={(event) => setDraft((current) => ({ ...current, targetValue: event.target.value }))} className={inputClass} />
                      ) : (
                        <span className="block truncate text-sm">{displayValue}</span>
                      )}
                    </Td>
                    <Td>
                      {isEditing ? (
                        <select value={draft.approvalLevel} onChange={(event) => setDraft((current) => ({ ...current, approvalLevel: event.target.value }))} className={selectClass}>
                          {APPROVAL_LEVELS.map((level) => <option key={level} value={level}>{level.replace(/_/g, ' ')}</option>)}
                        </select>
                      ) : <StatusBadge value={entry.approvalLevel} />}
                    </Td>
                    <Td className="text-xs font-medium text-gray-400 whitespace-nowrap">{relativeTime(entry.updatedAt)}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
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
                                setDraft({ targetValue: displayValue, approvalLevel: entry.approvalLevel });
                              }}
                            >
                              <PencilLine size={12} /> Edit
                            </Button>
                            {!entry.isArchived && (
                              <Button variant="danger" size="sm" onClick={() => archive(entry._id)} loading={busy === entry._id}>
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
        ) : (
          <EmptyState
            icon={ListChecks}
            title={showArchived ? 'Nothing archived' : 'No reusable memory yet'}
            description="Approve or verify a translation and its wording becomes reusable for identical source text."
          />
        )}
      </Card>
    </section>
  );
}
