'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, Ban, Layers, RefreshCw, RotateCw } from 'lucide-react';
import {
  cancelJob,
  getBulkJobs,
  getBulkSummary,
  retryJob,
} from '../../_services/translationCentreApi';
import {
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Metric,
  PageHeader,
  Spinner,
  StatusBadge,
  TableShell,
  Td,
  Th,
  relativeTime,
} from '../../_components/ui';

export default function BulkTranslationOperationPage() {
  const { bulkOperationId } = useParams();
  const [summary, setSummary] = useState(null);
  const [result, setResult] = useState({ jobs: [], pagination: {} });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [summaryResponse, jobsResponse] = await Promise.all([
        getBulkSummary(bulkOperationId),
        getBulkJobs(bulkOperationId, { limit: 50 }),
      ]);
      setSummary(summaryResponse.data.data);
      setResult(jobsResponse.data.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load bulk translation operation.');
    } finally { setLoading(false); }
  }, [bulkOperationId]);

  useEffect(() => {
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 5_000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [load]);

  const statusCount = (status) => summary?.byStatus?.find((item) => item._id === status)?.count || 0;

  const mutateJob = async (jobId, operation) => {
    setBusy(jobId); setError('');
    try {
      if (operation === 'retry') await retryJob(jobId); else await cancelJob(jobId);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the translation job.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <Link href="/admin/translations" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors">
        <ArrowLeft size={13} /> Translation Centre
      </Link>

      <PageHeader
        icon={Layers}
        title="Bulk operation"
        description={String(bulkOperationId)}
        actions={<Button variant="secondary" onClick={load}><RefreshCw size={13} /> Refresh</Button>}
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total" value={summary?.total || 0} hint="Jobs enqueued by this operation" />
        <Metric label="Queued" value={statusCount('queued') + statusCount('retry_scheduled')} tone="warning" />
        <Metric label="Processing" value={statusCount('processing')} />
        <Metric label="Completed" value={statusCount('completed')} tone="success" hint={`${statusCount('dead_letter')} dead letter`} />
      </div>

      {summary?.failures?.length > 0 && (
        <Card>
          <CardHeader icon={AlertTriangle} title="Failure reasons" description="Grouped by the failure code stored on each job." />
          <CardBody className="space-y-2">
            {summary.failures.map((failure) => (
              <div key={failure._id || 'unknown'} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{failure._id || 'Unknown'}</span>
                <span className="text-xs font-black text-red-500">{failure.count}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={Layers} title="Jobs" description="Refreshes every five seconds while this page is open." />
        {loading && !result.jobs.length ? <Spinner label="Loading jobs" /> : result.jobs.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Job</Th><Th>Language</Th><Th>Status</Th><Th>Attempts</Th><Th>Failure</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {result.jobs.map((job) => (
                <tr key={job._id}>
                  <Td>
                    <p className="font-bold text-gray-900 dark:text-white">{job.businessObjectType}</p>
                    <p className="max-w-xs truncate font-mono text-[10px] text-gray-400">{job.jobId}</p>
                  </Td>
                  <Td><StatusBadge value={job.targetLanguageCode} /></Td>
                  <Td><StatusBadge value={job.status} /></Td>
                  <Td className="text-xs font-medium text-gray-500 whitespace-nowrap">{job.attemptCount}/{job.maxAttempts}</Td>
                  <Td className="max-w-xs">
                    <span className="block truncate text-[11px] font-medium text-red-500">{job.failure?.message || '—'}</span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {job.status === 'dead_letter' && (
                        <Button variant="secondary" size="sm" onClick={() => mutateJob(job.jobId, 'retry')} loading={busy === job.jobId}>
                          <RotateCw size={12} /> Retry
                        </Button>
                      )}
                      {['queued', 'retry_scheduled'].includes(job.status) && (
                        <Button variant="danger" size="sm" onClick={() => mutateJob(job.jobId, 'cancel')} loading={busy === job.jobId}>
                          <Ban size={12} /> Cancel
                        </Button>
                      )}
                      {!['dead_letter', 'queued', 'retry_scheduled'].includes(job.status) && <span className="text-xs font-medium text-gray-400">—</span>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={Layers} title="No jobs in this operation" description="A bulk regeneration only queues work for translation records that already exist." />}
      </Card>
    </section>
  );
}
