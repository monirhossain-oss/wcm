'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  cancelJob,
  getBulkJobs,
  getBulkSummary,
  retryJob,
} from '../../_services/translationCentreApi';

export default function BulkTranslationOperationPage() {
  const { bulkOperationId } = useParams();
  const [summary, setSummary] = useState(null);
  const [result, setResult] = useState({ jobs: [], pagination: {} });
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [summaryResponse, jobsResponse] = await Promise.all([
        getBulkSummary(bulkOperationId),
        getBulkJobs(bulkOperationId, { limit: 50 }),
      ]);
      setSummary(summaryResponse.data.data);
      setResult(jobsResponse.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load bulk translation operation.');
    }
  }, [bulkOperationId]);

  useEffect(() => {
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 5_000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [load]);
  const statusCount = (status) => summary?.byStatus?.find((item) => item._id === status)?.count || 0;
  const mutateJob = async (jobId, operation) => {
    try {
      if (operation === 'retry') await retryJob(jobId); else await cancelJob(jobId);
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update translation job.'); }
  };

  return <section className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href="/admin/translations" className="text-sm text-orange-600">← Translation Centre</Link><h1 className="mt-2 text-2xl font-bold">Bulk translation operation</h1><p className="text-xs text-gray-500">{bulkOperationId}</p></div><button onClick={load} className="rounded border px-3 py-2 text-sm">Refresh</button></div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Total" value={summary?.total || 0} /><Metric label="Queued" value={statusCount('queued') + statusCount('retry_scheduled')} /><Metric label="Processing" value={statusCount('processing')} /><Metric label="Completed" value={statusCount('completed')} /></div>
    <div className="rounded border bg-white p-4 dark:bg-black"><h2 className="mb-2 font-semibold">Failures</h2>{summary?.failures?.length ? <ul className="space-y-1 text-sm">{summary.failures.map((failure) => <li key={failure._id || 'unknown'}>{failure._id || 'Unknown'}: {failure.count}</li>)}</ul> : <p className="text-sm text-gray-500">No failed jobs.</p>}</div>
    <div className="overflow-x-auto rounded border bg-white dark:bg-black"><table className="min-w-full text-sm"><thead className="border-b text-left text-gray-500"><tr><th className="p-3">Job</th><th>Language</th><th>Status</th><th>Attempts</th><th>Failure</th><th>Action</th></tr></thead><tbody>{result.jobs.map((job) => <tr key={job._id} className="border-b"><td className="p-3"><p>{job.businessObjectType}</p><p className="max-w-xs truncate text-xs text-gray-500">{job.jobId}</p></td><td>{job.targetLanguageCode}</td><td>{job.status}</td><td>{job.attemptCount}/{job.maxAttempts}</td><td className="max-w-xs truncate text-xs">{job.failure?.message || '—'}</td><td>{job.status === 'dead_letter' && <button onClick={() => mutateJob(job.jobId, 'retry')} className="rounded border px-2 py-1 text-xs">Retry</button>}{['queued', 'retry_scheduled'].includes(job.status) && <button onClick={() => mutateJob(job.jobId, 'cancel')} className="rounded border px-2 py-1 text-xs">Cancel</button>}</td></tr>)}{!result.jobs.length && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No jobs found.</td></tr>}</tbody></table></div>
  </section>;
}

function Metric({ label, value }) { return <div className="rounded border bg-white p-4 dark:bg-black"><p className="text-xs uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>; }
