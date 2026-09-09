'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookMarked,
  Braces,
  CheckCircle2,
  ClipboardList,
  FileText,
  History,
  Languages,
  Link2,
  Lock,
  PencilLine,
  RotateCw,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';
import {
  acceptProposal,
  acquireEditLock,
  changeLocalizedSlug,
  discardProposal,
  editContentSeo,
  getRecord,
  refreshEditLock,
  releaseEditLock,
  requestRegeneration,
  runAction,
} from '../../_services/translationCentreApi';
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Field,
  JsonBlock,
  PageHeader,
  Spinner,
  StatusBadge,
  formatDateTime,
  inputClass,
  relativeTime,
  textareaClass,
} from '../../_components/ui';

const SEO_FIELDS = [
  ['title', 'Meta title'],
  ['description', 'Meta description'],
  ['imageAlt', 'Social image alt'],
  ['openGraphTitle', 'Open Graph title'],
  ['openGraphDescription', 'Open Graph description'],
];

// A flat object of strings (listing, category, blog, FAQ) can be edited field by field. Nested CMS
// content keeps the JSON editor, which is the only safe way to preserve its shape.
const isFlatStringContent = (content) =>
  Boolean(content) &&
  typeof content === 'object' &&
  !Array.isArray(content) &&
  Object.keys(content).length > 0 &&
  Object.values(content).every((value) => typeof value === 'string');

const seoDraftFrom = (seo = {}) => ({
  title: seo?.title || '',
  description: seo?.description || '',
  imageAlt: seo?.imageAlt || '',
  openGraphTitle: seo?.openGraphTitle || '',
  openGraphDescription: seo?.openGraphDescription || '',
  keywords: (seo?.keywords || []).join(', '),
});

const seoPayloadFrom = (draft) => ({
  title: draft.title.trim() || null,
  description: draft.description.trim() || null,
  imageAlt: draft.imageAlt.trim() || null,
  openGraphTitle: draft.openGraphTitle.trim() || null,
  openGraphDescription: draft.openGraphDescription.trim() || null,
  keywords: draft.keywords.split(',').map((word) => word.trim()).filter(Boolean),
});

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
  const [fields, setFields] = useState({});
  const [contentText, setContentText] = useState('{}');
  const [rawMode, setRawMode] = useState(false);
  const [seoDraft, setSeoDraft] = useState(seoDraftFrom());
  const [slugDraft, setSlugDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [comment, setComment] = useState('');

  const load = async () => {
    try {
      const nextData = (await getRecord(translationRecordId)).data.data;
      setData(nextData);
      if (!editing) {
        setContentText(JSON.stringify(nextData.record.content || {}, null, 2));
        setFields({ ...(nextData.record.content || {}) });
        setSeoDraft(seoDraftFrom(nextData.record.seo));
        setSlugDraft(nextData.record.slug || '');
        setRawMode(!isFlatStringContent(nextData.record.content));
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
      setBusyAction(name); setError(''); setNotice('');
      await runAction(translationRecordId, name, method, { expectedVersion: data.record.versionNumber, ...body });
      setNotice('Translation state updated.');
      setComment('');
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Action failed.'); }
    finally { setBusyAction(''); }
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
      const content = rawMode ? JSON.parse(contentText) : fields;
      await editContentSeo(translationRecordId, {
        content,
        seo: seoPayloadFrom(seoDraft),
        expectedVersion: data.record.versionNumber,
        lockToken: lock?.lockToken,
      });
      setNotice('Translation content and SEO saved as a new version.');
      await stopEditing();
      await load();
    } catch (requestError) {
      setError(requestError instanceof SyntaxError ? 'Content must be valid JSON.' : requestError.response?.data?.message || 'Unable to save translation changes.');
    } finally { setSaving(false); }
  };

  const saveSlug = async () => {
    try {
      setBusyAction('slug'); setError(''); setNotice('');
      await changeLocalizedSlug(translationRecordId, { slug: slugDraft.trim(), expectedVersion: data.record.versionNumber });
      setNotice('Localized slug updated. The previous address now redirects.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to change the localized slug.');
    } finally { setBusyAction(''); }
  };

  const regenerate = async () => {
    try {
      setBusyAction('regenerate'); setError(''); setNotice('');
      await requestRegeneration(translationRecordId);
      setNotice('Regeneration job queued. Refresh shortly to review the AI proposal.');
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to queue regeneration.'); }
    finally { setBusyAction(''); }
  };

  const resolveProposal = async (proposalId, resolution) => {
    try {
      setBusyAction(resolution); setError('');
      if (resolution === 'accept') {
        await acceptProposal(proposalId, { action: 'replace', expectedVersion: data.record.versionNumber });
        setNotice('AI proposal accepted and stored as a new version.');
      } else {
        await discardProposal(proposalId);
        setNotice('AI proposal discarded.');
      }
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to resolve proposal.'); }
    finally { setBusyAction(''); }
  };

  const activeProposal = useMemo(
    () => data?.proposals?.find((proposal) => proposal.status === 'active') || null,
    [data]
  );

  if (error && !data) return <Banner tone="error" icon={AlertTriangle}>{error}</Banner>;
  if (!data) return <Card><Spinner label="Loading translation record" /></Card>;

  const { record, master, policy, editLock, terminology, sourceContent, reviewTasks = [] } = data;
  const canApprove = policy?.publicationMode === 'manual_review';
  const isLockedByOther = editLock && !lock?.lockToken;
  const openTask = reviewTasks.find((task) => ['pending', 'assigned', 'in_review', 'returned_for_modification'].includes(task.status));
  const sourceFields = sourceContent && typeof sourceContent === 'object' ? sourceContent : {};

  return (
    <section className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
        <ArrowLeft size={13} /> Back
      </button>

      <PageHeader
        icon={Languages}
        title={master?.label || String(record.businessObjectId)}
        description={`${record.businessObjectType} · ${record.languageCode.toUpperCase()} · version ${record.versionNumber} · ${policy?.publicationMode?.replace(/_/g, ' ') || 'policy unavailable'}`}
        actions={
          <>
            <StatusBadge value={record.translationStatus} />
            <StatusBadge value={record.publicationStatus} />
          </>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>
      {isLockedByOther && (
        <Banner tone="info" icon={Lock}>
          Another administrator is editing this translation until {formatDateTime(editLock.expiresAt)}.
        </Banner>
      )}

      <Card>
        <CardHeader
          icon={ClipboardList}
          title="Review decision"
          description={canApprove
            ? 'This object type publishes only after an administrator approves it.'
            : 'This object type publishes automatically; approval is not applicable.'}
        />
        <CardBody className="space-y-4">
          {canApprove && (
            <Field label="Decision comment (optional)" hint="Stored on the review task and the audit trail.">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Why is this approved, returned or rejected?" className={inputClass} />
            </Field>
          )}
          <div className="flex flex-wrap gap-2">
            {canApprove && (
              <>
                <Button variant="success" onClick={() => action('approve', 'post', { comment: comment || null })} loading={busyAction === 'approve'} disabled={!openTask}>
                  <CheckCircle2 size={13} /> Approve &amp; publish
                </Button>
                <Button variant="secondary" onClick={() => action('return-for-modification', 'post', { comment: comment || null })} loading={busyAction === 'return-for-modification'} disabled={!openTask}>
                  <Undo2 size={13} /> Return for modification
                </Button>
                <Button variant="danger" onClick={() => action('reject', 'post', { comment: comment || null })} loading={busyAction === 'reject'} disabled={!openTask}>
                  <X size={13} /> Reject
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => action('verify', 'patch')} loading={busyAction === 'verify'}>
              <BadgeCheck size={13} /> Mark verified
            </Button>
            <Button variant="secondary" onClick={regenerate} loading={busyAction === 'regenerate'}>
              <Sparkles size={13} /> Generate AI proposal
            </Button>
            <Button variant="secondary" onClick={() => action('unpublish', 'patch', { reason: 'Admin action from Translation Centre' })} loading={busyAction === 'unpublish'}>
              Unpublish
            </Button>
            <Button variant="secondary" onClick={() => action('archive', 'patch')} loading={busyAction === 'archive'}>
              Archive
            </Button>
          </div>
          {canApprove && !openTask && (
            <p className="text-[11px] font-medium text-gray-400">
              No open review task, so the decision buttons are disabled. A task opens automatically when a new translation is generated.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={FileText}
          title="English source and translation"
          description="The stored English values on the left, the current translation on the right."
        />
        <CardBody className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">English source</p>
            <JsonBlock value={sourceContent} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {record.languageCode === 'fr' ? 'French translation' : 'Current translation'}
            </p>
            <JsonBlock value={record.content} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={PencilLine}
          title="Edit translation"
          description="Edits are append-only: a new version is written and the publication state is preserved."
          actions={
            editing ? (
              <>
                {isFlatStringContent(record.content) && (
                  <Button variant="ghost" size="sm" onClick={() => setRawMode((value) => !value)}>
                    <Braces size={12} /> {rawMode ? 'Field editor' : 'Raw JSON'}
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={stopEditing}>Cancel</Button>
                <Button size="sm" onClick={saveEdit} loading={saving}>Save edit</Button>
              </>
            ) : (
              <Button size="sm" onClick={beginEditing} disabled={Boolean(isLockedByOther)}>
                <PencilLine size={12} /> Start editing
              </Button>
            )
          }
        />
        <CardBody className="space-y-5">
          {!editing ? (
            <p className="text-xs font-medium text-gray-500">
              Start editing to take an edit lock. The lock refreshes automatically while this page stays open and is released when you cancel or leave.
            </p>
          ) : (
            <>
              <Banner tone="info" icon={Lock}>
                Edit lock held until {formatDateTime(lock?.expiresAt)} and refreshed automatically.
              </Banner>

              {rawMode ? (
                <Field label="Translated content (JSON)" hint="Keys must match the English source exactly.">
                  <textarea value={contentText} onChange={(event) => setContentText(event.target.value)} rows={10} className={`${textareaClass} font-mono text-xs`} />
                </Field>
              ) : (
                <div className="space-y-4">
                  {Object.keys(fields).map((key) => (
                    <div key={key} className="grid gap-3 md:grid-cols-2">
                      <Field label={`${key} · English`}>
                        <p className="rounded-xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 px-4 py-2.5 text-sm text-gray-500 whitespace-pre-wrap">
                          {sourceFields[key] || '—'}
                        </p>
                      </Field>
                      <Field label={`${key} · ${record.languageCode.toUpperCase()}`}>
                        <textarea
                          value={fields[key]}
                          onChange={(event) => setFields((current) => ({ ...current, [key]: event.target.value }))}
                          rows={Math.min(6, Math.max(2, Math.ceil(String(fields[key] || '').length / 70)))}
                          className={textareaClass}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-white/5 pt-5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Localized SEO (optional)</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {SEO_FIELDS.map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input value={seoDraft[key]} onChange={(event) => setSeoDraft((current) => ({ ...current, [key]: event.target.value }))} className={inputClass} />
                    </Field>
                  ))}
                  <Field label="Keywords" hint="Comma separated" className="md:col-span-2">
                    <input value={seoDraft.keywords} onChange={(event) => setSeoDraft((current) => ({ ...current, keywords: event.target.value }))} className={inputClass} />
                  </Field>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={Link2}
          title="Localized address"
          description="Changing a published slug keeps the previous address as a redirect."
        />
        <CardBody className="flex flex-wrap items-end gap-3">
          <Field label="Localized slug" className="flex-1 min-w-[240px]" hint={record.slug ? `Current: ${record.slug}` : 'No localized slug stored yet.'}>
            <input value={slugDraft} onChange={(event) => setSlugDraft(event.target.value)} placeholder="textiles-culturels" className={inputClass} />
          </Field>
          <Button variant="secondary" onClick={saveSlug} loading={busyAction === 'slug'} disabled={!slugDraft.trim() || slugDraft.trim() === (record.slug || '')}>
            Update slug
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Sparkles} title="AI proposal" description="Regeneration never overwrites the current translation until you accept it." />
        {activeProposal ? (
          <CardBody className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">English source</p>
                <JsonBlock value={activeProposal.sourceContent || sourceContent} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current translation</p>
                <JsonBlock value={record.content} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">New AI proposal</p>
                <JsonBlock value={activeProposal.proposedContent} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="success" onClick={() => resolveProposal(activeProposal._id, 'accept')} loading={busyAction === 'accept'}>Accept proposal</Button>
              <Button variant="secondary" onClick={() => resolveProposal(activeProposal._id, 'discard')} loading={busyAction === 'discard'}>Discard proposal</Button>
            </div>
          </CardBody>
        ) : (
          <EmptyState icon={Sparkles} title="No active proposal" description="Generate one to compare a fresh AI translation against the current text before replacing it." />
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={History} title="Versions" description="Every accepted change is stored append-only." />
          {data.versions.length ? (
            <CardBody className="space-y-3 max-h-[28rem] overflow-y-auto">
              {data.versions.map((version) => (
                <div key={version._id} className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">Version {version.versionNumber}</p>
                      <p className="text-[11px] font-medium text-gray-400">{version.modificationSource} · {relativeTime(version.createdAt)}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => action('rollback', 'post', { versionNumber: version.versionNumber })}
                      disabled={version.versionNumber === record.versionNumber}
                      loading={busyAction === 'rollback'}
                    >
                      <RotateCw size={12} /> Roll back
                    </Button>
                  </div>
                  <JsonBlock value={version.newValue} className="mt-3 max-h-40" />
                </div>
              ))}
            </CardBody>
          ) : (
            <EmptyState icon={History} title="No versions yet" />
          )}
        </Card>

        <Card>
          <CardHeader icon={ClipboardList} title="Review tasks and audit" description="Who decided what, and when." />
          <CardBody className="space-y-4 max-h-[28rem] overflow-y-auto">
            {reviewTasks.length ? reviewTasks.map((task) => (
              <div key={task._id} className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge value={task.status} />
                  <span className="text-[11px] font-medium text-gray-400">{relativeTime(task.updatedAt)}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-500">
                  Assignee: {task.assignee ? `${task.assignee.firstName || ''} ${task.assignee.lastName || ''}`.trim() || task.assignee.email : 'Unassigned'}
                </p>
              </div>
            )) : <p className="text-xs font-medium text-gray-400">No review task recorded.</p>}

            {data.audit.slice(0, 8).map((entry) => (
              <div key={entry._id} className="flex items-start gap-3 text-xs">
                <Badge tone="neutral">{entry.eventType?.replace('translation.', '')}</Badge>
                <span className="text-gray-400 font-medium">{relativeTime(entry.createdAt)}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={BookMarked} title="Terminology in force" description="Applied to this language pair when the model runs." />
          <CardBody className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Protected terms</p>
              {terminology?.protectedTerms?.length
                ? terminology.protectedTerms.map((term) => <Badge key={term._id} tone="neutral" className="mr-1.5 mb-1.5">{term.term}</Badge>)
                : <p className="text-xs font-medium text-gray-400">None</p>}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dictionary</p>
              {terminology?.dictionaryEntries?.length
                ? terminology.dictionaryEntries.map((entry) => (
                  <Badge key={entry._id} tone="neutral" className="mr-1.5 mb-1.5">{entry.sourceTerm} → {entry.targetTerm}</Badge>
                ))
                : <p className="text-xs font-medium text-gray-400">None</p>}
            </div>
            <Link href="/admin/translations/terminology" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline md:col-span-2">
              Manage terminology
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Braces} title="Jobs and AI usage" description="Provider attempts behind this record." />
          <CardBody className="space-y-3 max-h-[28rem] overflow-y-auto">
            {data.jobs.length ? data.jobs.map((job) => (
              <div key={job._id} className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={job.status} />
                  <span className="text-[11px] font-medium text-gray-400">{job.operation} · attempt {job.attemptCount}/{job.maxAttempts} · {relativeTime(job.createdAt)}</span>
                </div>
                {job.failure?.message && (
                  <p className="text-[11px] font-medium text-red-500">{job.failure.code}: {job.failure.message}</p>
                )}
              </div>
            )) : <p className="text-xs font-medium text-gray-400">No jobs recorded.</p>}

            {data.usage.slice(0, 5).map((event) => (
              <p key={event._id} className="text-[11px] font-medium text-gray-400">
                {event.outcome} · {event.model || 'no model'} · {event.totalTokens ?? 0} tokens · {relativeTime(event.createdAt)}
              </p>
            ))}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
