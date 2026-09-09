'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, Power, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import {
  activateConfigurationVersion,
  createConfigurationVersion,
  getConfiguration,
  getConfigurationVersions,
} from '../_services/translationCentreApi';
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Field,
  Metric,
  PageHeader,
  Spinner,
  formatDateTime,
  inputClass,
} from '../_components/ui';

const DEFAULT_DRAFT = {
  providerName: 'openai',
  timeoutMs: 60000,
  maxAttempts: 3,
  queuedOrRetryThreshold: 25,
  rollingFailureRatePercent: 10,
};

export default function ConfigurationPage() {
  const [active, setActive] = useState(null);
  const [versions, setVersions] = useState([]);
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [activeResponse, versionResponse] = await Promise.all([getConfiguration(), getConfigurationVersions()]);
      setActive(activeResponse.data.data);
      setVersions(versionResponse.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load the translation configuration.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const create = async (event) => {
    event.preventDefault();
    setBusy('create'); setError(''); setNotice('');
    try {
      await createConfigurationVersion({
        provider: { name: draft.providerName.trim() || 'openai', metadata: {} },
        queue: { timeoutMs: Number(draft.timeoutMs), maxAttempts: Number(draft.maxAttempts) },
        alerts: {
          queuedOrRetryThreshold: Number(draft.queuedOrRetryThreshold),
          rollingFailureRatePercent: Number(draft.rollingFailureRatePercent),
        },
      });
      setNotice('Configuration version created. Activate it to apply the new values.');
      setCreating(false);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the configuration version.');
    } finally { setBusy(''); }
  };

  const activate = async (configurationId) => {
    setBusy(configurationId); setError(''); setNotice('');
    try {
      await activateConfigurationVersion(configurationId);
      setNotice('Configuration activated.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to activate the configuration version.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={SlidersHorizontal}
        title="Configuration"
        description="Provider selection, queue behaviour and alert thresholds, stored as activatable versions."
        actions={
          <Button onClick={() => setCreating((value) => !value)}>
            <Plus size={13} /> {creating ? 'Close' : 'New version'}
          </Button>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>
      <Banner tone="neutral" icon={ShieldCheck}>
        Provider API keys stay in deployment environment variables. Any key-shaped metadata is rejected by the API, so no secret can be stored here or shown on this page.
      </Banner>

      {loading && !active ? <Card><Spinner label="Loading configuration" /></Card> : active && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active version" value={active.isDefault ? 'Built-in default' : `v${active.version}`} hint={active.isDefault ? 'No stored version activated' : undefined} />
          <Metric label="Provider" value={active.provider?.name || '—'} tone="orange" />
          <Metric label="Job timeout" value={`${Math.round((active.queue?.timeoutMs || 0) / 1000)} s`} hint={`${active.queue?.maxAttempts || 0} attempts`} />
          <Metric label="Alert thresholds" value={`${active.alerts?.queuedOrRetryThreshold ?? '—'} / ${active.alerts?.rollingFailureRatePercent ?? '—'}%`} hint="Backlog / failure rate" />
        </div>
      )}

      {creating && (
        <Card>
          <CardHeader icon={Plus} title="New configuration version" description="Creating a version does not change behaviour until you activate it." />
          <form onSubmit={create}>
            <CardBody className="grid gap-4 md:grid-cols-3">
              <Field label="Provider name" hint="Must be a registered provider.">
                <input value={draft.providerName} onChange={(event) => setDraft((current) => ({ ...current, providerName: event.target.value }))} className={inputClass} />
              </Field>
              <Field label="Job timeout (ms)">
                <input type="number" min="1000" value={draft.timeoutMs} onChange={(event) => setDraft((current) => ({ ...current, timeoutMs: event.target.value }))} className={inputClass} />
              </Field>
              <Field label="Max attempts" hint="Attempts before a job is dead-lettered.">
                <input type="number" min="1" max="10" value={draft.maxAttempts} onChange={(event) => setDraft((current) => ({ ...current, maxAttempts: event.target.value }))} className={inputClass} />
              </Field>
              <Field label="Backlog alert threshold">
                <input type="number" min="1" value={draft.queuedOrRetryThreshold} onChange={(event) => setDraft((current) => ({ ...current, queuedOrRetryThreshold: event.target.value }))} className={inputClass} />
              </Field>
              <Field label="Failure rate alert (%)">
                <input type="number" min="1" max="100" value={draft.rollingFailureRatePercent} onChange={(event) => setDraft((current) => ({ ...current, rollingFailureRatePercent: event.target.value }))} className={inputClass} />
              </Field>
              <div className="flex items-end gap-2">
                <Button type="submit" loading={busy === 'create'}>Create version</Button>
                <Button type="button" variant="secondary" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </CardBody>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader icon={SlidersHorizontal} title="Versions" description="Only one version is active at a time." />
        {loading ? <Spinner label="Loading versions" /> : versions.length ? (
          <CardBody className="space-y-3">
            {versions.map((version) => (
              <div key={version._id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Version {version.version}</p>
                  <p className="text-[11px] font-medium text-gray-400">
                    {version.provider?.name} · timeout {Math.round((version.queue?.timeoutMs || 0) / 1000)}s · {version.queue?.maxAttempts} attempts · created {formatDateTime(version.createdAt)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {version.isActive ? <Badge tone="success">Active</Badge> : (
                    <Button variant="secondary" size="sm" onClick={() => activate(version._id)} loading={busy === version._id}>
                      <Power size={12} /> Activate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        ) : (
          <EmptyState
            icon={SlidersHorizontal}
            title="No stored versions"
            description="The built-in default configuration is in use: OpenAI provider, 60 second timeout, three attempts."
          />
        )}
      </Card>
    </section>
  );
}
