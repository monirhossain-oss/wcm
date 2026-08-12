'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { assignReviewTask, claimReviewTask, getReviewQueue } from '../_services/translationCentreApi';

export default function ReviewQueuePage() {
  const [tasks, setTasks] = useState([]); const [error, setError] = useState(''); const [assignees, setAssignees] = useState({});
  const load = () => getReviewQueue().then((response) => setTasks(response.data.data)).catch((e) => setError(e.response?.data?.message || 'Unable to load review queue.'));
  useEffect(() => { load(); }, []);
  const claim = async (id) => { try { await claimReviewTask(id); load(); } catch (e) { setError(e.response?.data?.message || 'Unable to claim task.'); } };
  const assign = async (id) => { try { await assignReviewTask(id, assignees[id]); load(); } catch (e) { setError(e.response?.data?.message || 'Unable to assign task.'); } };
  return <section className="space-y-5"><div><h1 className="text-2xl font-bold">Manual Review Queue</h1><p className="text-sm text-gray-500">Only records governed by a manual-review policy appear here.</p></div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="space-y-3">{tasks.map((task) => <article key={task._id} className="rounded border bg-white p-4 dark:bg-black"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{task.businessObjectType} · {task.languageCode}</p><p className="text-xs text-gray-500">{task.status} · policy v{task.policySnapshot?.version}</p>{task.assignee && <p className="text-xs">Assignee: {task.assignee.email}</p>}</div><div className="flex gap-2"><Link href={`/admin/translations/records/${task.translationRecordId}`} className="rounded border px-3 py-2 text-sm">Open record</Link><button onClick={() => claim(task._id)} className="rounded bg-orange-500 px-3 py-2 text-sm text-white">Claim</button></div></div><div className="mt-3 flex gap-2"><input value={assignees[task._id] || ''} onChange={(e) => setAssignees({ ...assignees, [task._id]: e.target.value })} placeholder="Assignee user ID" className="rounded border px-2 py-1 text-sm" /><button onClick={() => assign(task._id)} disabled={!assignees[task._id]} className="rounded border px-3 py-1 text-sm disabled:opacity-40">Assign</button></div></article>)}{!tasks.length && <p className="text-sm text-gray-500">No manual-review tasks.</p>}</div></section>;
}
