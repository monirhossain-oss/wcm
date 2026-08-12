'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  acceptProposal,
  acquireEditLock,
  discardProposal,
  editContentSeo,
  getRecord,
  refreshEditLock,
  releaseEditLock,
  requestRegeneration,
  runAction,
} from '../../_services/translationCentreApi';

export default function TranslationRecordDetailsPage() {
  const { translationRecordId } = useParams();
  const router = useRouter();
  const lockRef = useRef(null);
  const loadRef = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [lock, setLock] = useState(null);
  const [editing, setEditing] = useState(false);
  const [contentText, setContentText] = useState('{}');
  const [seoText, setSeoText] = useState('{}');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const nextData = (await getRecord(translationRecordId)).data.data;
      setData(nextData);
      if (!editing) {
        setContentText(JSON.stringify(nextData.record.content || {}, null, 2));
        setSeoText(JSON.stringify(nextData.record.seo || {}, null, 2));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation record.');
    }
  };

  loadRef.current = load;
  useEffect(() => {
    const initial = setTimeout(() => loadRef.current?.(), 0);
    return () => clearTimeout(initial);
  }, [translationRecordId]);
  useEffect(() => () => {
    if (lockRef.current) releaseEditLock(translationRecordId, lockRef.current).catch(() => {});
  }, [translationRecordId]);
  useEffect(() => {
    if (!lock?.lockToken) return undefined;
    const interval = setInterval(async () => {
      try {
        const response = await refreshEditLock(translationRecordId, lock.lockToken);
        setLock(response.data.data);
        lockRef.current = response.data.data.lockToken;
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Your edit lock expired. Reload before editing again.');
        setEditing(false); setLock(null); lockRef.current = null;
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [lock, translationRecordId]);

  const action = async (name, method, body = {}) => {
    try {
      setError(''); setNotice('');
      await runAction(translationRecordId, name, method, { expectedVersion: data.record.versionNumber, ...body });
      setNotice('Translation state updated.');
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Action failed.'); }
  };

  const beginEditing = async () => {
    try {
      setError('');
      const response = await acquireEditLock(translationRecordId);
      setLock(response.data.data);
      lockRef.current = response.data.data.lockToken;
      setEditing(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'This translation is locked by another administrator.');
    }
  };

  const stopEditing = async () => {
    if (lockRef.current) {
      try { await releaseEditLock(translationRecordId, lockRef.current); } catch {}
    }
    lockRef.current = null; setLock(null); setEditing(false);
  };

  const saveEdit = async () => {
    try {
      setSaving(true); setError(''); setNotice('');
      const content = JSON.parse(contentText);
      const seo = JSON.parse(seoText);
      await editContentSeo(translationRecordId, {
        content,
        seo,
        expectedVersion: data.record.versionNumber,
        lockToken: lock?.lockToken,
      });
      setNotice('Translation content and SEO saved.');
      await stopEditing();
      await load();
    } catch (requestError) {
      setError(requestError instanceof SyntaxError ? 'Content and SEO must be valid JSON.' : requestError.response?.data?.message || 'Unable to save translation changes.');
    } finally { setSaving(false); }
  };

  const regenerate = async () => {
    try {
      setError(''); setNotice('');
      await requestRegeneration(translationRecordId);
      setNotice('Regeneration job queued. Refresh this record shortly to review the AI proposal.');
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to queue regeneration.'); }
  };

  const resolveProposal = async (proposalId, resolution) => {
    try {
      setError('');
      if (resolution === 'accept') {
        await acceptProposal(proposalId, { action: 'replace', expectedVersion: data.record.versionNumber });
        setNotice('AI proposal accepted.');
      } else {
        await discardProposal(proposalId);
        setNotice('AI proposal discarded.');
      }
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to resolve proposal.'); }
  };

  const activeProposal = useMemo(
    () => data?.proposals?.find((proposal) => proposal.status === 'active') || null,
    [data]
  );

  if (error && !data) return <p className="text-red-700">{error}</p>;
  if (!data) return <p>Loading translation record…</p>;
  const { record, master, policy, editLock, terminology } = data;
  const canApprove = policy?.publicationMode === 'manual_review';
  const isLockedByOther = editLock && !lock?.lockToken;

  return <section className="space-y-6">
    <button onClick={() => router.back()} className="text-sm text-orange-600">← Back to Translation Centre</button>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold">Translation Record</h1><p className="text-sm text-gray-500">{master?.label || record.businessObjectId} · {record.languageCode}</p></div><div className="text-right text-xs text-gray-500"><p>Version {record.versionNumber}</p><p>{policy?.publicationMode || 'Policy unavailable'}</p></div></div>
    {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    {notice && <p className="rounded bg-green-50 p-3 text-green-700">{notice}</p>}
    {isLockedByOther && <p className="rounded bg-amber-50 p-3 text-amber-800">Editing is currently locked by another administrator until {new Date(editLock.expiresAt).toLocaleTimeString()}.</p>}
    <div className="flex flex-wrap gap-2">
      {canApprove && <button onClick={() => action('approve', 'post')} className="rounded bg-green-600 px-3 py-2 text-sm text-white">Approve</button>}
      <button onClick={() => action('verify', 'patch')} className="rounded bg-blue-600 px-3 py-2 text-sm text-white">Verify</button>
      <button onClick={regenerate} className="rounded bg-violet-600 px-3 py-2 text-sm text-white">Generate AI proposal</button>
      <button onClick={() => action('unpublish', 'patch', { reason: 'Admin action from Translation Centre' })} className="rounded border px-3 py-2 text-sm">Unpublish</button>
      <button onClick={() => action('archive', 'patch')} className="rounded border px-3 py-2 text-sm">Archive</button>
    </div>

    <Panel title="Translation editing">
      {!editing ? <div className="flex flex-wrap items-center gap-3"><p className="text-sm text-gray-600">Content and SEO edits create an append-only version and preserve the current publication state.</p><button onClick={beginEditing} disabled={Boolean(isLockedByOther)} className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Start editing</button></div> : <div className="space-y-4"><p className="text-sm text-green-700">Your edit lock expires at {new Date(lock.expiresAt).toLocaleTimeString()} and refreshes automatically.</p><label className="block text-sm font-medium">Translated content (JSON)<textarea value={contentText} onChange={(event) => setContentText(event.target.value)} className="mt-1 h-56 w-full rounded border p-3 font-mono text-xs" /></label><label className="block text-sm font-medium">Localized SEO (JSON)<textarea value={seoText} onChange={(event) => setSeoText(event.target.value)} className="mt-1 h-44 w-full rounded border p-3 font-mono text-xs" /></label><div className="flex gap-2"><button onClick={saveEdit} disabled={saving} className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save edit'}</button><button onClick={stopEditing} className="rounded border px-3 py-2 text-sm">Cancel editing</button></div></div>}
    </Panel>

    <Panel title="Regeneration comparison">
      {activeProposal ? <div className="space-y-3"><div className="grid gap-3 lg:grid-cols-3"><Comparison title="English source" value={activeProposal.sourceContent || data.sourceContent} /><Comparison title="Current translation" value={record.content} /><Comparison title="New AI proposal" value={activeProposal.proposedContent} /></div><div className="flex gap-2"><button onClick={() => resolveProposal(activeProposal._id, 'accept')} className="rounded bg-green-600 px-3 py-2 text-sm text-white">Accept proposal</button><button onClick={() => resolveProposal(activeProposal._id, 'discard')} className="rounded border px-3 py-2 text-sm">Discard proposal</button></div></div> : <p className="text-sm text-gray-500">No active AI proposal. Generate one to compare it before replacing the current translation.</p>}
    </Panel>

    <Panel title="Terminology (read-only)"><div className="grid gap-3 md:grid-cols-2"><Comparison title="Protected terms" value={terminology?.protectedTerms || []} /><Comparison title="Dictionary entries" value={terminology?.dictionaryEntries || []} /></div></Panel>
    <Panel title="Overview"><pre className="overflow-auto text-xs">{JSON.stringify({ ...record, master, policy }, null, 2)}</pre></Panel>
    <Panel title="Versions">{data.versions.length ? <div className="space-y-2">{data.versions.map((version) => <div key={version._id} className="rounded border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">Version {version.versionNumber} · {version.modificationSource}</p><button onClick={() => action('rollback', 'post', { versionNumber: version.versionNumber })} disabled={version.versionNumber === record.versionNumber} className="rounded border px-2 py-1 text-xs disabled:opacity-40">Rollback</button></div><pre className="mt-2 overflow-auto text-xs">{JSON.stringify(version.newValue, null, 2)}</pre></div>)}</div> : <p className="text-sm text-gray-500">No versions.</p>}</Panel>
    <List title="Audit history" values={data.audit} />
    <List title="Jobs and AI usage" values={[...data.jobs, ...data.usage]} />
    <List title="Proposal history" values={data.proposals} />
  </section>;
}

function Panel({ title, children }) { return <div className="rounded border bg-white p-4 dark:bg-black"><h2 className="mb-3 font-semibold">{title}</h2>{children}</div>; }
function Comparison({ title, value }) { return <div className="rounded border bg-gray-50 p-3 dark:bg-gray-900"><h3 className="mb-2 text-sm font-medium">{title}</h3><pre className="overflow-auto text-xs">{JSON.stringify(value, null, 2)}</pre></div>; }
function List({ title, values }) { return <Panel title={title}>{values.length ? <div className="space-y-2">{values.map((value) => <pre key={value._id} className="overflow-auto rounded bg-gray-50 p-3 text-xs dark:bg-gray-900">{JSON.stringify(value, null, 2)}</pre>)}</div> : <p className="text-sm text-gray-500">No entries.</p>}</Panel>; }
