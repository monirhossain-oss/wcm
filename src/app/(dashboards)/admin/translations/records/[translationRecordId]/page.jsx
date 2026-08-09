'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRecord, runAction } from '../../_services/translationCentreApi';

export default function TranslationRecordDetailsPage() {
  const { translationRecordId } = useParams(); const router = useRouter();
  const [data, setData] = useState(null); const [error, setError] = useState('');
  const load = async () => { try { setData((await getRecord(translationRecordId)).data.data); } catch (e) { setError(e.response?.data?.message || 'Unable to load translation record.'); } };
  useEffect(() => { load(); }, [translationRecordId]);
  const action = async (name, method, body = {}) => { try { await runAction(translationRecordId, name, method, { expectedVersion: data.record.versionNumber, ...body }); await load(); } catch (e) { setError(e.response?.data?.message || 'Action failed.'); } };
  if (error && !data) return <p className="text-red-700">{error}</p>;
  if (!data) return <p>Loading translation record…</p>;
  const { record, master } = data;
  return <section className="space-y-6"><button onClick={() => router.back()} className="text-sm text-orange-600">← Back to Translation Centre</button><div><h1 className="text-2xl font-bold">Translation Record</h1><p className="text-sm text-gray-500">{master?.label || record.businessObjectId} · {record.languageCode}</p></div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="flex flex-wrap gap-2"><button onClick={() => action('approve', 'post')} className="rounded bg-green-600 px-3 py-2 text-sm text-white">Approve</button><button onClick={() => action('verify', 'patch')} className="rounded bg-blue-600 px-3 py-2 text-sm text-white">Verify</button><button onClick={() => action('unpublish', 'patch', { reason: 'Admin action from Translation Centre' })} className="rounded border px-3 py-2 text-sm">Unpublish</button><button onClick={() => action('archive', 'patch')} className="rounded border px-3 py-2 text-sm">Archive</button></div>
    <Panel title="Overview"><pre className="overflow-auto text-xs">{JSON.stringify({ ...record, master }, null, 2)}</pre></Panel>
    <Panel title="Metadata and SEO"><pre className="overflow-auto text-xs">{JSON.stringify({ metadata: record.metadata, seo: record.seo }, null, 2)}</pre></Panel>
    <List title="Versions" values={data.versions} /><List title="Audit" values={data.audit} /><List title="Jobs and AI Usage" values={[...data.jobs, ...data.usage]} /><List title="Proposals" values={data.proposals} />
  </section>;
}
function Panel({ title, children }) { return <div className="rounded border bg-white p-4 dark:bg-black"><h2 className="mb-3 font-semibold">{title}</h2>{children}</div>; }
function List({ title, values }) { return <Panel title={title}>{values.length ? <div className="space-y-2">{values.map((value) => <pre key={value._id} className="overflow-auto rounded bg-gray-50 p-3 text-xs dark:bg-gray-900">{JSON.stringify(value, null, 2)}</pre>)}</div> : <p className="text-sm text-gray-500">No entries.</p>}</Panel>; }
