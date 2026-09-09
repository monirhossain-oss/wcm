'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, Power, ShieldCheck } from 'lucide-react';
import {
  activatePublishingPolicy,
  createPublishingPolicy,
  getPublishingPolicies,
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
  PageHeader,
  Spinner,
  TableShell,
  Td,
  Th,
  inputClass,
  selectClass,
} from '../_components/ui';

const OBJECT_TYPES = ['listing', 'creatorProfile', 'category', 'blog', 'faq', 'cms'];

const MODE_HELP = {
  manual_review: 'A draft is created and an administrator must approve it before it goes live.',
  automatic: 'The translation publishes as soon as it passes validation.',
  master_approval_gated: 'Publishes only once the English object reaches its required status.',
};

const DEFAULTS = [
  ['listing', 'master_approval_gated', 'Publishes when the listing is approved'],
  ['creatorProfile', 'automatic', 'Publishes for active, approved creators'],
  ['category', 'manual_review', 'Admin approves each translation'],
  ['blog', 'manual_review', 'Admin approves each translation'],
  ['faq', 'manual_review', 'Admin approves each translation'],
  ['cms', 'manual_review', 'Admin approves each translation'],
];

export default function TranslationPublishingPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    businessObjectType: 'category',
    languageCode: 'fr',
    publicationMode: 'manual_review',
    requiredMasterStatus: '',
    creatorImprovementMode: 'manual_review',
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setPolicies((await getPublishingPolicies()).data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load publishing policies.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const create = async (event) => {
    event.preventDefault();
    setBusy('create'); setError(''); setNotice('');
    try {
      await createPublishingPolicy({ ...form, requiredMasterStatus: form.requiredMasterStatus || null });
      setNotice('Policy version created. Activate it to apply the new rule.');
      setCreating(false);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the publishing policy.');
    } finally { setBusy(''); }
  };

  const activate = async (policyId) => {
    setBusy(policyId); setError(''); setNotice('');
    try {
      await activatePublishingPolicy(policyId);
      setNotice('Policy activated.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to activate the publishing policy.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Publishing policies"
        description="How a finished translation reaches visitors. Only manual review exposes the approval buttons on a record."
        actions={<Button onClick={() => setCreating((value) => !value)}><Plus size={13} /> {creating ? 'Close' : 'New version'}</Button>}
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader icon={ShieldCheck} title="Built-in defaults" description="Used whenever no stored policy version is active for a type and language." />
        <CardBody className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {DEFAULTS.map(([type, mode, hint]) => (
            <div key={type} className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{type}</p>
              <Badge tone={mode === 'automatic' ? 'success' : 'warning'} className="mt-2">{mode.replace(/_/g, ' ')}</Badge>
              <p className="mt-2 text-[11px] font-medium text-gray-400">{hint}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      {creating && (
        <Card>
          <CardHeader icon={Plus} title="New policy version" description={MODE_HELP[form.publicationMode]} />
          <form onSubmit={create}>
            <CardBody className="grid gap-4 md:grid-cols-3">
              <Field label="Business object">
                <select value={form.businessObjectType} onChange={(event) => set('businessObjectType', event.target.value)} className={selectClass}>
                  {OBJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </Field>
              <Field label="Language code">
                <input value={form.languageCode} onChange={(event) => set('languageCode', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Publication mode">
                <select value={form.publicationMode} onChange={(event) => set('publicationMode', event.target.value)} className={selectClass}>
                  <option value="manual_review">manual_review</option>
                  <option value="automatic">automatic</option>
                  <option value="master_approval_gated">master_approval_gated</option>
                </select>
              </Field>
              <Field label="Required master status" hint="Only for gated publication, e.g. approved.">
                <input value={form.requiredMasterStatus} onChange={(event) => set('requiredMasterStatus', event.target.value)} placeholder="approved" className={inputClass} />
              </Field>
              <Field label="Creator improvement mode">
                <select value={form.creatorImprovementMode} onChange={(event) => set('creatorImprovementMode', event.target.value)} className={selectClass}>
                  <option value="manual_review">manual_review</option>
                  <option value="immediate_publish">immediate_publish</option>
                </select>
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
        <CardHeader icon={ShieldCheck} title="Stored policy versions" description="A newer version does nothing until it is activated." />
        {loading ? <Spinner label="Loading policies" /> : policies.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Object</Th><Th>Language</Th><Th>Version</Th><Th>Mode</Th><Th>Active</Th><Th>Action</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {policies.map((policy) => (
                <tr key={policy._id}>
                  <Td className="font-bold text-gray-900 dark:text-white">{policy.businessObjectType}</Td>
                  <Td><Badge tone="info">{policy.languageCode}</Badge></Td>
                  <Td className="text-xs font-medium text-gray-500">v{policy.version}</Td>
                  <Td><Badge tone={policy.publicationMode === 'automatic' ? 'success' : 'warning'}>{policy.publicationMode.replace(/_/g, ' ')}</Badge></Td>
                  <Td>{policy.isActive ? <Badge tone="success">Active</Badge> : <span className="text-xs font-medium text-gray-400">—</span>}</Td>
                  <Td>
                    {!policy.isActive && (
                      <Button variant="secondary" size="sm" onClick={() => activate(policy._id)} loading={busy === policy._id}>
                        <Power size={12} /> Activate
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : (
          <EmptyState icon={ShieldCheck} title="No stored policy versions" description="The built-in defaults above are in force." />
        )}
      </Card>
    </section>
  );
}
