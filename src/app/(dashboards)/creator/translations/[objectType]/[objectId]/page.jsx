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
import { useLocale } from '@/context/LocaleContext';
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
const SUPPORTED_OBJECT_TYPES = new Set(['listing', 'creatorProfile']);

// Field names come from the backend's source content, so the catalog is keyed by that same name and
// an unknown field falls back to showing the raw key rather than nothing.
const FIELD_KEYS = new Set(['title', 'description', 'name', 'bio']);

const SHORT_FIELDS = new Set(['title', 'name']);

// A regeneration is queued, not immediate, so the page watches for the suggestion to land instead of
// asking the Creator to keep pressing refresh.
const POLL_INTERVAL_MS = 6000;
const POLL_ATTEMPTS = 10;

const sameContent = (left, right) =>
  JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

export default function CreatorTranslationWorkspacePage() {
  const { objectType, objectId } = useParams();
  const { user } = useAuth();
  const { locale, localize, t, tf } = useLocale();

  const labelFor = useCallback(
    (field) => (FIELD_KEYS.has(field) ? t(`creator.workspace.fields.${field}`) : field),
    [t]
  );

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

  const isSupported = SUPPORTED_OBJECT_TYPES.has(objectType);
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
        if (!data) setError(t('creator.workspace.noWorkspace'));
      } catch (requestError) {
        if (!cancelled) {
          setError(getTranslationErrorMessage(requestError, t, 'creator.workspace.openFailed'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchWorkspace, isSupported, t]);

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
      toast.error(getTranslationErrorMessage(requestError, t, 'creator.workspace.actionFailed'));
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
      t('creator.workspace.saved')
    );

  const handleRegenerate = async () => {
    const started = await runAction(
      'regenerate',
      () =>
        requestRegeneration(objectType, objectId, {
          targetLanguageCode: activeLanguage,
          sourceVersion: record?.metadata?.sourceVersion,
        }),
      t('creator.workspace.regenerateQueued')
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
      t('creator.workspace.proposalAccepted')
    );

  const handleDiscard = () =>
    runAction('discard', () => discardProposal(proposal._id), t('creator.workspace.proposalDiscarded'));

  const handleSlug = () =>
    runAction(
      'slug',
      () =>
        changeLocalizedSlug(objectType, objectId, {
          languageCode: activeLanguage,
          slug: slugDraft,
          expectedVersion: record?.versionNumber,
        }),
      t('creator.workspace.slugUpdated')
    );

  const handleVersions = async () => {
    if (!record?._id) return;
    setBusy('versions');
    try {
      const response = await getVersions(objectType, objectId, record._id);
      setVersions(response.data?.data || []);
    } catch (requestError) {
      toast.error(getTranslationErrorMessage(requestError, t, 'creator.workspace.historyFailed'));
    } finally {
      setBusy('');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <EmptyState
          icon={FiXCircle}
          title={t('creator.workspace.unsupportedTitle')}
          description={t('creator.workspace.unsupportedDescription')}
          action={
            <Link href={localize('/creator/translations')}>
              <Button variant="secondary">{t('creator.workspace.backToTranslations')}</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  if (loading) return <Spinner label={t('creator.workspace.opening')} />;

  if (error) {
    return (
      <div className="space-y-4">
        <Banner tone="error" icon={FiAlertCircle}>
          {error}
        </Banner>
        <Link href={localize('/creator/translations')}>
          <Button variant="secondary">
            <FiArrowLeft size={13} /> {t('creator.workspace.backToTranslations')}
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
          href={localize('/creator/translations')}
          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500/40 transition-all"
        >
          <FiArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {tf('creator.workspace.heading', {
              objectType: t(`creator.workspace.objectType.${objectType}`),
            })}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {t('creator.workspace.subtitle')}
          </p>
        </div>
        <Button
          variant="secondary"
          className="ml-auto"
          loading={busy === 'refresh'}
          onClick={() => runAction('refresh', async () => {}, '')}
        >
          <FiRefreshCw size={13} /> {t('creator.common.refresh')}
        </Button>
      </div>

      {!canEdit && (
        <Banner tone="error" icon={FiAlertCircle}>
          {t('creator.workspace.readOnly')}
        </Banner>
      )}

      {languages.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiGlobe}
            title={t('creator.workspace.noLanguageTitle')}
            description={t('creator.workspace.noLanguageDescription')}
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
                title={t('creator.workspace.nothingTranslatedTitle')}
                description={t('creator.workspace.nothingTranslatedDescription')}
              />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader
                  icon={FiFileText}
                  title={t('creator.workspace.textHeading')}
                  description={t('creator.workspace.textDescription')}
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
                      {t('creator.workspace.outdatedBanner')}
                    </Banner>
                  )}
                  {fields.map((field) => {
                    const isOutdated = outdatedFields.has(field);
                    return (
                      <div key={field} className="grid gap-4 md:grid-cols-2">
                        <Field label={tf('creator.workspace.sourceLabel', { field: labelFor(field) })}>
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
                        <Field
                          label={tf('creator.workspace.targetLabel', {
                            field: labelFor(field),
                            language: activeLanguage.toUpperCase(),
                          })}
                        >
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
                              {tf('creator.workspace.outdatedField', {
                                field: labelFor(field).toLowerCase(),
                              })}
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
                    <FiSave size={13} /> {t('creator.workspace.save')}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!dirty}
                    onClick={() => setDraft(record.content ? { ...record.content } : {})}
                  >
                    {t('creator.workspace.undo')}
                  </Button>
                  <Button
                    variant="secondary"
                    className="ml-auto"
                    loading={busy === 'regenerate' || waitingForSuggestion}
                    disabled={!canEdit || Boolean(proposal)}
                    onClick={handleRegenerate}
                  >
                    <FiRotateCw size={13} />
                    {waitingForSuggestion
                      ? t('creator.workspace.preparing')
                      : t('creator.workspace.regenerate')}
                  </Button>
                </div>
              </Card>

              {proposal && (
                <Card>
                  <CardHeader
                    icon={FiEdit3}
                    title={t('creator.workspace.proposalHeading')}
                    description={t('creator.workspace.proposalDescription')}
                  />
                  <CardBody className="space-y-5">
                    {fields.map((field) => (
                      <div key={field} className="grid gap-4 md:grid-cols-2">
                        <Field label={tf('creator.workspace.proposalLiveLabel', { field: labelFor(field) })}>
                          <div className="rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap min-h-[44px]">
                            {record.content?.[field] || '—'}
                          </div>
                        </Field>
                        <Field label={tf('creator.workspace.proposalSuggestedLabel', { field: labelFor(field) })}>
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
                      {t('creator.workspace.acceptReplace')}
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!canEdit}
                      onClick={() =>
                        setDraft(proposal.proposedContent ? { ...proposal.proposedContent } : {})
                      }
                    >
                      {t('creator.workspace.copyToEditor')}
                    </Button>
                    <Button
                      variant="secondary"
                      loading={busy === 'accept-manual_merge'}
                      disabled={!canEdit || !dirty}
                      onClick={() => handleAccept('manual_merge')}
                    >
                      {t('creator.workspace.acceptMerge')}
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-auto"
                      loading={busy === 'discard'}
                      disabled={!canEdit}
                      onClick={handleDiscard}
                    >
                      {t('creator.workspace.discard')}
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
                  title={t('creator.workspace.slugHeading')}
                  description={t('creator.workspace.slugDescription')}
                />
                <CardBody className="flex flex-wrap items-end gap-3">
                  <Field
                    label={tf('creator.workspace.slugLabel', {
                      language: activeLanguage.toUpperCase(),
                    })}
                    className="flex-1 min-w-[240px]"
                  >
                    <input
                      value={slugDraft}
                      disabled={!canEdit}
                      onChange={(event) => setSlugDraft(event.target.value)}
                      className={inputClass}
                      placeholder={t('creator.workspace.slugPlaceholder')}
                    />
                  </Field>
                  <Button
                    loading={busy === 'slug'}
                    disabled={!canEdit || !slugDraft || slugDraft === record.slug}
                    onClick={handleSlug}
                  >
                    {t('creator.workspace.slugSubmit')}
                  </Button>
                </CardBody>
              </Card>
              ) : null}

              <Card>
                <CardHeader
                  icon={FiClock}
                  title={t('creator.workspace.historyHeading')}
                  description={t('creator.workspace.historyDescription')}
                  actions={
                    <Button variant="secondary" size="sm" loading={busy === 'versions'} onClick={handleVersions}>
                      {versions
                        ? t('creator.workspace.reloadHistory')
                        : t('creator.workspace.showHistory')}
                    </Button>
                  }
                />
                {versions === null ? (
                  <CardBody className="text-xs font-medium text-gray-400">
                    {t('creator.workspace.historyNote')}
                  </CardBody>
                ) : versions.length === 0 ? (
                  <EmptyState icon={FiClock} title={t('creator.workspace.noVersions')} />
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-white/5">
                    {versions.map((version) => (
                      <li key={version.versionNumber} className="px-5 md:px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {tf('creator.workspace.version', { number: version.versionNumber })}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            {version.authorType}
                          </span>
                          <span className="ml-auto text-[11px] font-medium text-gray-400">
                            {formatDateTime(version.createdAt, locale)}
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
