'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  activatePublishingPolicy,
  createPublishingPolicy,
  getPublishingPolicies,
} from '../_services/translationCentreApi';

const OBJECT_TYPES = ['listing', 'creatorProfile', 'category', 'blog', 'faq', 'cms'];

export default function TranslationPublishingPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ businessObjectType: 'category', languageCode: 'fr', publicationMode: 'manual_review', requiredMasterStatus: '', creatorImprovementMode: 'manual_review' });

  const load = useCallback(async () => {
    try { setPolicies((await getPublishingPolicies()).data.data); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load publishing policies.'); }
  }, []);
  useEffect(() => {
    const initial = setTimeout(load, 0);
    return () => clearTimeout(initial);
  }, [load]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const create = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await createPublishingPolicy({ ...form, requiredMasterStatus: form.requiredMasterStatus || null });
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create publishing policy.'); }
  };
  const activate = async (policyId) => {
    try { setError(''); await activatePublishingPolicy(policyId); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to activate publishing policy.'); }
  };

  return <section className="space-y-6"><div><Link href="/admin/translations" className="text-sm text-orange-600">← Translation Centre</Link><h1 className="mt-2 text-2xl font-bold">Translation publishing policies</h1><p className="text-sm text-gray-500">Only manual-review policies expose the Translation Centre approval action.</p></div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    <form onSubmit={create} className="grid gap-3 rounded border bg-white p-4 dark:bg-black md:grid-cols-3"><select value={form.businessObjectType} onChange={(event) => set('businessObjectType', event.target.value)} className="rounded border p-2">{OBJECT_TYPES.map((type) => <option key={type}>{type}</option>)}</select><input value={form.languageCode} onChange={(event) => set('languageCode', event.target.value)} className="rounded border p-2" aria-label="Language code" /><select value={form.publicationMode} onChange={(event) => set('publicationMode', event.target.value)} className="rounded border p-2"><option value="manual_review">manual_review</option><option value="automatic">automatic</option><option value="master_approval_gated">master_approval_gated</option></select><input value={form.requiredMasterStatus} onChange={(event) => set('requiredMasterStatus', event.target.value)} placeholder="Required master status (optional)" className="rounded border p-2" /><select value={form.creatorImprovementMode} onChange={(event) => set('creatorImprovementMode', event.target.value)} className="rounded border p-2"><option value="manual_review">manual_review</option><option value="immediate_publish">immediate_publish</option></select><button className="rounded bg-orange-500 px-4 py-2 font-semibold text-white">Create policy version</button></form>
    <div className="overflow-x-auto rounded border bg-white dark:bg-black"><table className="min-w-full text-sm"><thead className="border-b text-left text-gray-500"><tr><th className="p-3">Type</th><th>Language</th><th>Version</th><th>Mode</th><th>Active</th><th>Action</th></tr></thead><tbody>{policies.map((policy) => <tr key={policy._id} className="border-b"><td className="p-3">{policy.businessObjectType}</td><td>{policy.languageCode}</td><td>{policy.version}</td><td>{policy.publicationMode}</td><td>{policy.isActive ? 'Yes' : 'No'}</td><td>{!policy.isActive && <button onClick={() => activate(policy._id)} className="rounded border px-2 py-1 text-xs">Activate</button>}</td></tr>)}{!policies.length && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No policy versions found.</td></tr>}</tbody></table></div>
  </section>;
}
