'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Globe2, Plus, RefreshCw } from 'lucide-react';
import { getLanguageBackfill, getLanguages, registerLanguage, runLanguageAction } from '../_services/translationCentreApi';
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
} from '../_components/ui';

const actionsFor = (language) => {
  if (language.isSource) return [];
  if (['registered', 'disabled'].includes(language.status)) return ['enable'];
  if (language.status === 'backfilling') return ['retry'];
  if (language.status === 'ready') return ['publish', 'disable'];
  if (language.status === 'published') return ['unpublish', 'disable'];
  return [];
};

const actionHelp = {
  enable: 'Queues a translation job for every existing object in this language.',
  retry: 'Retries the failed backfill jobs and resumes enumeration.',
  publish: 'Makes the language visible to visitors and to hreflang.',
  unpublish: 'Hides the language from visitors; stored translations are kept.',
  disable: 'Stops new translation work for this language.',
};

export default function TranslationLanguagesPage() {
  const [languages, setLanguages] = useState([]);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getLanguages();
      setLanguages(data.data || []);
      const backfills = await Promise.all((data.data || [])
        .filter((language) => language.backfillOperationId)
        .map(async (language) => [language.code, (await getLanguageBackfill(language.code)).data.data.progress]));
      setProgress(Object.fromEntries(backfills));
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load languages.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const act = async (code, action) => {
    setBusy(`${code}:${action}`); setError(''); setNotice('');
    try {
      await runLanguageAction(code, action);
      setNotice(`${code.toUpperCase()} ${action}d.`);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Language action failed.');
    } finally { setBusy(''); }
  };

  const addFrench = async () => {
    setBusy('register'); setError(''); setNotice('');
    try {
      await registerLanguage({ code: 'fr', catalogVersion: '1' });
      setNotice('French registered. Enable it to start the backfill.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed.');
    } finally { setBusy(''); }
  };

  const hasFrench = languages.some(({ code }) => code === 'fr');

  return (
    <section className="space-y-6">
      <PageHeader
        icon={Globe2}
        title="Languages"
        description="Lifecycle of every approved language: register, backfill existing content, then publish it to visitors."
        actions={
          <>
            <Button variant="secondary" onClick={load} loading={loading}><RefreshCw size={13} /> Refresh</Button>
            {!hasFrench && <Button onClick={addFrench} loading={busy === 'register'}><Plus size={13} /> Register French</Button>}
          </>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>
      <Banner tone="neutral">
        A published language cannot be backfilled again. Unpublishing to force a backfill would take the language off the public site, so add missing translations by saving the source object instead.
      </Banner>

      <Card>
        <CardHeader icon={Globe2} title="Registered languages" description="English is the source language and is never translated." />
        {loading && !languages.length ? <Spinner label="Loading languages" /> : languages.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Language</Th><Th>Status</Th><Th>Catalog</Th><Th>Backfill</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {languages.map((language) => {
                const state = progress[language.code];
                return (
                  <tr key={language.code}>
                    <Td>
                      <p className="font-bold text-gray-900 dark:text-white">{language.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        {language.code} · {language.direction}{language.isSource ? ' · source' : ''}
                      </p>
                    </Td>
                    <Td><StatusBadge value={language.status} /></Td>
                    <Td><Badge tone="neutral">v{language.catalogVersion}</Badge></Td>
                    <Td className="text-xs font-medium text-gray-500">
                      {state ? `${state.completed}/${state.total} complete · ${state.failed} failed` : '—'}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {actionsFor(language).map((action) => (
                          <Button
                            key={action}
                            variant={action === 'publish' ? 'success' : 'secondary'}
                            size="sm"
                            title={actionHelp[action]}
                            onClick={() => act(language.code, action)}
                            loading={busy === `${language.code}:${action}`}
                          >
                            {action}
                          </Button>
                        ))}
                        {!actionsFor(language).length && <span className="text-xs font-medium text-gray-400">—</span>}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={Globe2} title="No languages registered" />}
      </Card>
    </section>
  );
}
