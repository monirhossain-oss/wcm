'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiClock,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiLink2,
  FiRefreshCw,
  FiRotateCw,
  FiSave,
  FiXCircle,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import {
  AvailabilityBadge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Field,
  Spinner,
  formatDateTime,
  inputClass,
  textareaClass,
} from '../../_components/ui';
import {
  acceptProposal,
  changeLocalizedSlug,
  discardProposal,
  getPublishedLanguages,
  getVersions,
  getWorkspace,
  requestRegeneration,
  saveImprovement,
} from '../../_services/creatorTranslationApi';
import { getTranslationErrorMessage } from '../../_services/translationErrors';

// Only the two object types the backend lets a Creator own reach this page. Anything else is an
// Admin-managed object and `assertCreatorOwnsBusinessObject()` would reject it anyway.
const SUPPORTED_OBJECT_TYPES = {
  listing: 'Listing',
  creatorProfile: 'Creator profile',
};

const FIELD_LABELS = {
  title: 'Title',
  description: 'Description',
  name: 'Display name',
  bio: 'Biography',
};

const SHORT_FIELDS = new Set(['title', 'name']);

// A regeneration is queued, not immediate, so the page watches for the suggestion to land instead of
// asking the Creator to keep pressing refresh.
const POLL_INTERVAL_MS = 6000;
const POLL_ATTEMPTS = 10;

const labelFor = (field) => FIELD_LABELS[field] || field;

const sameContent = (left, right) =>
  JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

export default function CreatorTranslationWorkspacePage() {
  const { objectType, objectId } = useParams();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState('');
  const [draft, setDraft] = useState({});
  const [slugDraft, setSlugDraft] = useState('');
  const [versions, setVersions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [waitingForSuggestion, setWaitingForSuggestion] = useState(false);
  const pollRef = useRef(null);

  const isSupported = Boolean(SUPPORTED_OBJECT_TYPES[objectType]);
  const canEdit = user?.status === 'active';

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setWaitingForSuggestion(false);
  }, []);

  const fetchWorkspace = useCallback(async () => {
    const response = await getWorkspace(objectType, objectId);
    const data = response.data?.data;
    setWorkspace(data);
    return data;
  }, [objectType, objectId]);

  useEffect(() => {
    if (!isSupported) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [data, languagesResponse] = await Promise.all([fetchWorkspace(), getPublishedLanguages()]);
        if (cancelled) return;
        const published = (languagesResponse.data?.data || []).filter((language) => !language.isSource);
        setLanguages(published);
        setActiveLanguage((current) => current || published[0]?.code || '');
        if (!data) setError('This item has no translation workspace yet.');
      } catch (requestError) {
        if (!cancelled) {
          setError(getTranslationErrorMessage(requestError, 'Could not open this translation workspace.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchWorkspace, isSupported]);

  useEffect(() => stopPolling, [stopPolling]);

  const sourceContent = useMemo(() => workspace?.sourceContent || {}, [workspace]);
  const fields = useMemo(() => Object.keys(sourceContent), [sourceContent]);

  const record = useMemo(
    () => (workspace?.translations || []).find((row) => row.languageCode === activeLanguage) || null,
    [workspace, activeLanguage]
  );

  const proposal = useMemo(
    () => (workspace?.proposals || []).find((row) => row.languageCode === activeLanguage) || null,
    [workspace, activeLanguage]
  );

  // The backend names the English fields that moved since this translation was written.
  const outdatedFields = useMemo(() => new Set(record?.outdatedFields || []), [record]);

  // Switching language reloads the editor from the stored translation, so an unsaved draft never
  // leaks into another language.
  useEffect(() => {
    setDraft(record?.content ? { ...record.content } : {});
    setSlugDraft(record?.slug || '');
    setVersions(null);
  }, [record]);

  useEffect(() => {
    if (proposal) stopPolling();
  }, [proposal, stopPolling]);

  const runAction = async (key, action, successMessage) => {
    setBusy(key);
    try {
      await action();
      await fetchWorkspace();
      if (successMessage) toast.success(successMessage);
      return true;
    } catch (requestError) {
      toast.error(getTranslationErrorMessage(requestError, 'That did not work.'));
      return false;
    } finally {
      setBusy('');
    }
  };

  const handleSave = () =>
    runAction(
      'save',
      () =>
        saveImprovement(objectType, objectId, {
          targetLanguageCode: activeLanguage,
          sourceVersion: record?.metadata?.sourceVersion,
          translatedContent: draft,
          expectedVersion: record?.versionNumber,
        }),
      'Your translation is live.'
    );

  const handleRegenerate = async () => {
    const started = await runAction(
      'regenerate',
      () =>
        requestRegeneration(objectType, objectId, {
          targetLanguageCode: activeLanguage,
          sourceVersion: record?.metadata?.sourceVersion,
        }),
      'Working on a new suggestion.'
    );
    if (!started) return;
    setWaitingForSuggestion(true);
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const data = await fetchWorkspace();
        const arrived = (data?.proposals || []).some((row) => row.languageCode === activeLanguage);
        if (arrived || attempts >= POLL_ATTEMPTS) stopPolling();
      } catch {
        stopPolling();
      }
    }, POLL_INTERVAL_MS);
  };

  const handleAccept = (action) =>
    runAction(
      `accept-${action}`,
      () =>
        acceptProposal(proposal._id, {
          action,
          mergedContent: action === 'manual_merge' ? draft : undefined,
          expectedVersion: proposal.expectedTranslationVersion,
        }),
      'The suggestion is live.'
    );

  const handleDiscard = () =>
    runAction('discard', () => discardProposal(proposal._id), 'Suggestion discarded.');

  const handleSlug = () =>
    runAction(
      'slug',
      () =>
        changeLocalizedSlug(objectType, objectId, {
          languageCode: activeLanguage,
          slug: slugDraft,
          expectedVersion: record?.versionNumber,
        }),
      'Web address updated.'
    );

  const handleVersions = async () => {
    if (!record?._id) return;
    setBusy('versions');
    try {
      const response = await getVersions(objectType, objectId, record._id);
      setVersions(response.data?.data || []);
    } catch (requestError) {
      toast.error(getTranslationErrorMessage(requestError, 'Could not load the history.'));
    } finally {
      setBusy('');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <EmptyState
          icon={FiXCircle}
          title="Not available"
          description="Only your listings and your creator profile have a translation workspace."
          action={
            <Link href="/creator/translations">
              <Button variant="secondary">Back to translations</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  if (loading) return <Spinner label="Opening workspace…" />;

  if (error) {
    return (
      <div className="space-y-4">
        <Banner tone="error" icon={FiAlertCircle}>
          {error}
        </Banner>
        <Link href="/creator/translations">
          <Button variant="secondary">
            <FiArrowLeft size={13} /> Back to translations
          </Button>
        </Link>
      </div>
    );
  }

  const dirty = !sameContent(draft, record?.content);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/creator/translations"
          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500/40 transition-all"
        >
          <FiArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {SUPPORTED_OBJECT_TYPES[objectType]} translation
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            English stays the original. Your edits change only the language you pick here.
          </p>
        </div>
        <Button
          variant="secondary"
          className="ml-auto"
          loading={busy === 'refresh'}
          onClick={() => runAction('refresh', async () => {}, '')}
        >
          <FiRefreshCw size={13} /> Refresh
        </Button>
      </div>

      {!canEdit && (
        <Banner tone="error" icon={FiAlertCircle}>
          Your account is restricted right now, so translations are read only.
        </Banner>
      )}

      {languages.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiGlobe}
            title="No other language is published"
            description="Once another language goes live, its translation will appear here."
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => {
              const isActive = language.code === activeLanguage;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setActiveLanguage(language.code)}
                  className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'border border-gray-200 dark:border-white/10 text-gray-500 hover:text-orange-500 hover:border-orange-500/40'
                  }`}
                >
                  {language.nativeName || language.code}
                </button>
              );
            })}
          </div>

          {!record ? (
            <Card>
              <EmptyState
                icon={FiGlobe}
                title="Nothing translated yet"
                description="This language has no translation for this item so far. It appears here once it has been prepared."
              />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader
                  icon={FiFileText}
                  title="Text"
                  description="English on the left, your language on the right"
                  actions={
                    <AvailabilityBadge
                      languageCode={activeLanguage}
                      state={record.publicationStatus === 'published' ? 'Available' : 'Not available'}
                    />
                  }
                />
                <CardBody className="space-y-5">
                  {outdatedFields.size > 0 && (
                    <Banner tone="error" icon={FiAlertCircle}>
                      The English text changed after this translation was written. The fields marked
                      in red below are out of date, so please update them.
                    </Banner>
                  )}
                  {fields.map((field) => {
                    const isOutdated = outdatedFields.has(field);
                    return (
                      <div key={field} className="grid gap-4 md:grid-cols-2">
                        <Field label={`${labelFor(field)} · English`}>
                          <div
                            className={`rounded-lg border px-4 py-2.5 text-sm whitespace-pre-wrap min-h-[44px] ${
                              isOutdated
                                ? 'border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
                                : 'border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/5 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {sourceContent[field] || '—'}
                          </div>
                        </Field>
                        <Field label={`${labelFor(field)} · ${activeLanguage.toUpperCase()}`}>
                          {SHORT_FIELDS.has(field) ? (
                            <input
                              value={draft[field] ?? ''}
                              disabled={!canEdit}
                              onChange={(event) =>
                                setDraft((current) => ({ ...current, [field]: event.target.value }))
                              }
                              className={`${inputClass} ${
                                isOutdated ? 'border-red-300 dark:border-red-500/40' : ''
                              }`}
                            />
                          ) : (
                            <textarea
                              rows={6}
                              value={draft[field] ?? ''}
                              disabled={!canEdit}
                              onChange={(event) =>
                                setDraft((current) => ({ ...current, [field]: event.target.value }))
                              }
                              className={`${textareaClass} ${
                                isOutdated ? 'border-red-300 dark:border-red-500/40' : ''
                              }`}
                            />
                          )}
                          {isOutdated && (
                            <p className="flex items-start gap-2 text-[11px] font-semibold text-red-600 dark:text-red-400">
                              <FiAlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                              The English {labelFor(field).toLowerCase()} has changed. Please update
                              this translation to match.
                            </p>
                          )}
                        </Field>
                      </div>
                    );
                  })}
                </CardBody>
                <div className="flex flex-wrap items-center gap-3 px-5 md:px-6 py-4 border-t border-gray-100 dark:border-white/5">
                  <Button
                    loading={busy === 'save'}
                    disabled={!canEdit || !dirty}
                    onClick={handleSave}
                  >
                    <FiSave size={13} /> Save changes
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!dirty}
                    onClick={() => setDraft(record.content ? { ...record.content } : {})}
                  >
                    Undo edits
                  </Button>
                  <Button
                    variant="secondary"
                    className="ml-auto"
                    loading={busy === 'regenerate' || waitingForSuggestion}
                    disabled={!canEdit || Boolean(proposal)}
                    onClick={handleRegenerate}
                  >
                    <FiRotateCw size={13} />
                    {waitingForSuggestion ? 'Preparing…' : 'Suggest a new translation'}
                  </Button>
                </div>
              </Card>

              {proposal && (
                <Card>
                  <CardHeader
                    icon={FiEdit3}
                    title="New suggestion"
                    description="Compare it with what is live, then choose"
                  />
                  <CardBody className="space-y-5">
                    {fields.map((field) => (
                      <div key={field} className="grid gap-4 md:grid-cols-2">
                        <Field label={`${labelFor(field)} · live now`}>
                          <div className="rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap min-h-[44px]">
                            {record.content?.[field] || '—'}
                          </div>
                        </Field>
                        <Field label={`${labelFor(field)} · suggested`}>
                          <div className="rounded-lg border border-orange-200 dark:border-orange-500/30 bg-orange-50/60 dark:bg-orange-500/10 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap min-h-[44px]">
                            {proposal.proposedContent?.[field] || '—'}
                          </div>
                        </Field>
                      </div>
                    ))}
                  </CardBody>
                  <div className="flex flex-wrap items-center gap-3 px-5 md:px-6 py-4 border-t border-gray-100 dark:border-white/5">
                    <Button
                      loading={busy === 'accept-replace'}
                      disabled={!canEdit}
                      onClick={() => handleAccept('replace')}
                    >
                      Use the suggestion
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!canEdit}
                      onClick={() =>
                        setDraft(proposal.proposedContent ? { ...proposal.proposedContent } : {})
                      }
                    >
                      Copy into the editor
                    </Button>
                    <Button
                      variant="secondary"
                      loading={busy === 'accept-manual_merge'}
                      disabled={!canEdit || !dirty}
                      onClick={() => handleAccept('manual_merge')}
                    >
                      Use my edited version
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-auto"
                      loading={busy === 'discard'}
                      disabled={!canEdit}
                      onClick={handleDiscard}
                    >
                      Discard
                    </Button>
                  </div>
                </Card>
              )}

              {/* A localized slug only exists once one has been assigned. Until then this language
                  is served under the English address, and the change endpoint would refuse. */}
              {record.slug ? (
              <Card>
                <CardHeader
                  icon={FiLink2}
                  title="Web address"
                  description="The part of the link that belongs to this language"
                />
                <CardBody className="flex flex-wrap items-end gap-3">
                  <Field label={`Slug · ${activeLanguage.toUpperCase()}`} className="flex-1 min-w-[240px]">
                    <input
                      value={slugDraft}
                      disabled={!canEdit}
                      onChange={(event) => setSlugDraft(event.target.value)}
                      className={inputClass}
                      placeholder="vase-fait-main"
                    />
                  </Field>
                  <Button
                    loading={busy === 'slug'}
                    disabled={!canEdit || !slugDraft || slugDraft === record.slug}
                    onClick={handleSlug}
                  >
                    Update address
                  </Button>
                </CardBody>
              </Card>
              ) : null}

              <Card>
                <CardHeader
                  icon={FiClock}
                  title="History"
                  description="Every earlier version of this translation"
                  actions={
                    <Button variant="secondary" size="sm" loading={busy === 'versions'} onClick={handleVersions}>
                      {versions ? 'Reload' : 'Show history'}
                    </Button>
                  }
                />
                {versions === null ? (
                  <CardBody className="text-xs font-medium text-gray-400">
                    Earlier versions are kept for reference. Only an administrator can restore one.
                  </CardBody>
                ) : versions.length === 0 ? (
                  <EmptyState icon={FiClock} title="No earlier versions" />
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-white/5">
                    {versions.map((version) => (
                      <li key={version.versionNumber} className="px-5 md:px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Version {version.versionNumber}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            {version.authorType}
                          </span>
                          <span className="ml-auto text-[11px] font-medium text-gray-400">
                            {formatDateTime(version.createdAt)}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {fields.map((field) => (
                            <p
                              key={field}
                              className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
                            >
                              <span className="font-black uppercase tracking-widest text-[9px] text-gray-400 mr-2">
                                {labelFor(field)}
                              </span>
                              {version.newContent?.[field] || '—'}
                            </p>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
