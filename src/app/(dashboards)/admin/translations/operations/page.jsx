'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, BellOff, CheckCircle2, RefreshCw, ScrollText } from 'lucide-react';
import {
  getOperationalAlerts,
  getOperationalHealth,
  getOperationalLogs,
  updateOperationalAlert,
} from '../_services/translationCentreApi';
import {
  Badge,
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
  formatDateTime,
  relativeTime,
  selectClass,
} from '../_components/ui';

const OUTCOMES = ['', 'success', 'failure', 'info'];

export default function OperationsPage() {
  const [health, setHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [outcome, setOutcome] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async (selectedOutcome) => {
    try {
      setLoading(true);
      const [healthResponse, alertResponse, logResponse] = await Promise.all([
        getOperationalHealth(),
        getOperationalAlerts(),
        getOperationalLogs(selectedOutcome ? { outcome: selectedOutcome, limit: 60 } : { limit: 60 }),
      ]);
      setHealth(healthResponse.data.data);
      setAlerts(alertResponse.data.data || []);
      setLogs(logResponse.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation operations.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(() => load(outcome), 0); return () => clearTimeout(timer); }, [load, outcome]);

  const acknowledge = async (alertId, status) => {
    setBusy(alertId); setError(''); setNotice('');
    try {
      await updateOperationalAlert(alertId, status);
      setNotice(`Alert ${status}.`);
      await load(outcome);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the alert.');
    } finally { setBusy(''); }
  };

  const queueCount = (status) => health?.queue?.find((item) => item._id === status)?.count || 0;
  const openAlerts = alerts.filter((alert) => alert.status === 'open');

  return (
    <section className="space-y-6">
      <PageHeader
        icon={Activity}
        title="Operations"
        description="Queue health, provider availability, alerts and the diagnostic log. Secrets are stripped before anything is written here."
        actions={<Button variant="secondary" onClick={() => load(outcome)} loading={loading}><RefreshCw size={13} /> Refresh</Button>}
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Provider"
          value={health?.provider?.available ? 'Available' : 'Unavailable'}
          tone={health?.provider?.available ? 'success' : 'danger'}
          hint={health?.provider?.active}
        />
        <Metric label="Queued" value={queueCount('queued') + queueCount('retry_scheduled')} tone={queueCount('queued') ? 'warning' : 'default'} hint="Including scheduled retries" />
        <Metric label="Processing" value={queueCount('processing')} hint="Claimed by a worker" />
        <Metric label="Dead letter" value={queueCount('dead_letter')} tone={queueCount('dead_letter') ? 'danger' : 'default'} hint="Attempts exhausted" />
        <Metric
          label="Failure rate"
          value={`${Math.round(health?.rollingFailureRatePercent || 0)}%`}
          tone={(health?.rollingFailureRatePercent || 0) > 10 ? 'danger' : 'success'}
          hint="Rolling one-hour window"
        />
      </div>

      <Card>
        <CardHeader
          icon={AlertTriangle}
          title="Alerts"
          description="Raised automatically from queue backlog, dead letters, failure rate and provider availability."
          actions={<Badge tone={openAlerts.length ? 'danger' : 'success'}>{openAlerts.length} open</Badge>}
        />
        {loading && !alerts.length ? <Spinner label="Loading alerts" /> : alerts.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Alert</Th><Th>Severity</Th><Th>Status</Th><Th>Raised</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <Td>
                    <p className="font-bold text-gray-900 dark:text-white">{alert.summary || alert.alertType}</p>
                    <p className="text-[11px] font-medium text-gray-400">{alert.alertType}</p>
                  </Td>
                  <Td><StatusBadge value={alert.severity} /></Td>
                  <Td><StatusBadge value={alert.status} /></Td>
                  <Td className="text-xs font-medium text-gray-400 whitespace-nowrap">{relativeTime(alert.createdAt)}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.status === 'open' && (
                        <Button variant="secondary" size="sm" onClick={() => acknowledge(alert._id, 'acknowledged')} loading={busy === alert._id}>
                          <BellOff size={12} /> Acknowledge
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button variant="ghost" size="sm" onClick={() => acknowledge(alert._id, 'resolved')} loading={busy === alert._id}>
                          <CheckCircle2 size={12} /> Resolve
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={CheckCircle2} title="No alerts" description="The queue, provider and failure rate are all inside their thresholds." />}
      </Card>

      <Card>
        <CardHeader
          icon={ScrollText}
          title="Diagnostic log"
          description="Job level events. Content, prompts and anything key-shaped are redacted before storage."
          actions={
            <select value={outcome} onChange={(event) => setOutcome(event.target.value)} className={`${selectClass} w-40`}>
              {OUTCOMES.map((value) => <option key={value || 'all'} value={value}>{value ? value : 'All outcomes'}</option>)}
            </select>
          }
        />
        {loading && !logs.length ? <Spinner label="Loading log" /> : logs.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Event</Th><Th>Outcome</Th><Th>Job</Th><Th>Detail</Th><Th>When</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {logs.map((log) => (
                <tr key={log._id}>
                  <Td className="font-bold text-gray-900 dark:text-white whitespace-nowrap">{log.eventType}</Td>
                  <Td><StatusBadge value={log.outcome} /></Td>
                  <Td className="font-mono text-[11px] text-gray-400">{log.jobId || '—'}</Td>
                  <Td className="max-w-sm">
                    <span className="block truncate font-mono text-[11px] text-gray-500">
                      {log.metadata && Object.keys(log.metadata).length ? JSON.stringify(log.metadata) : '—'}
                    </span>
                  </Td>
                  <Td className="text-xs font-medium text-gray-400 whitespace-nowrap" title={formatDateTime(log.createdAt)}>{relativeTime(log.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={ScrollText} title="No log entries" description="Events appear once translation jobs start running." />}
      </Card>

      {health && (
        <Card>
          <CardHeader icon={Activity} title="Attempt outcomes" description="Provider attempts recorded in the last hour." />
          <CardBody className="flex flex-wrap gap-2">
            {health.attempts?.length ? health.attempts.map((item) => (
              <Badge key={item._id} tone={item._id === 'failure' ? 'danger' : 'success'}>
                {item._id} · {item.count}
                {item.averageLatencyMs ? ` · ${Math.round(item.averageLatencyMs)} ms` : ''}
              </Badge>
            )) : <p className="text-xs font-medium text-gray-400">No attempts in the last hour.</p>}
          </CardBody>
        </Card>
      )}
    </section>
  );
}
