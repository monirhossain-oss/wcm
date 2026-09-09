'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Bell, BellOff, CheckCircle2, ClipboardList, Hand, RefreshCw, UserPlus } from 'lucide-react';
import api, {
  assignReviewTask,
  claimReviewTask,
  getAdminNotifications,
  getReviewQueue,
  markAdminNotificationRead,
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
  StatusBadge,
  TableShell,
  Td,
  Th,
  inputClass,
  relativeTime,
  selectClass,
} from '../_components/ui';

const STATUS_OPTIONS = ['', 'pending', 'assigned', 'in_review', 'returned_for_modification'];

const personName = (person) =>
  person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.email || String(person) : null;

export default function ReviewTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('');
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [assignFor, setAssignFor] = useState(null);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const load = useCallback(async (currentStatus, currentIncludeCompleted) => {
    try {
      setLoading(true);
      const params = {
        ...(currentStatus ? { status: currentStatus } : {}),
        ...(currentIncludeCompleted ? { includeCompleted: 'true' } : {}),
      };
      const [taskResponse, notificationResponse] = await Promise.all([
        getReviewQueue(params),
        getAdminNotifications({ unreadOnly: 'true' }),
      ]);
      setTasks(taskResponse.data.data || []);
      setNotifications(notificationResponse.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load the review queue.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(status, includeCompleted), 0);
    return () => clearTimeout(timer);
  }, [load, status, includeCompleted]);

  useEffect(() => {
    const term = assigneeSearch.trim();
    if (!assignFor || term.length < 2) { setAssigneeOptions([]); return undefined; }
    const timeout = setTimeout(async () => {
      try {
        const response = await api.get('/api/admin/users', { params: { search: term, limit: 5 } });
        setAssigneeOptions(response.data.users || []);
      } catch { setAssigneeOptions([]); }
    }, 250);
    return () => clearTimeout(timeout);
  }, [assigneeSearch, assignFor]);

  const claim = async (taskId) => {
    setBusy(taskId); setError(''); setNotice('');
    try {
      await claimReviewTask(taskId);
      setNotice('Task claimed. It is now assigned to you and in review.');
      await load(status, includeCompleted);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to claim the task.');
    } finally { setBusy(''); }
  };

  const assign = async (taskId, assigneeId) => {
    setBusy(taskId); setError(''); setNotice('');
    try {
      await assignReviewTask(taskId, assigneeId);
      setNotice('Task assigned. The assignee receives an in-app notification.');
      setAssignFor(null); setAssigneeSearch(''); setAssigneeOptions([]);
      await load(status, includeCompleted);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to assign the task.');
    } finally { setBusy(''); }
  };

  const markRead = async (notificationId) => {
    setBusy(notificationId);
    try {
      await markAdminNotificationRead(notificationId);
      await load(status, includeCompleted);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to mark the notification as read.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Review tasks"
        description="Translations waiting for a decision. A task opens automatically whenever a manual-review object gets a new translation."
        actions={<Button variant="secondary" onClick={() => load(status, includeCompleted)} loading={loading}><RefreshCw size={13} /> Refresh</Button>}
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader
          icon={ClipboardList}
          title="Queue"
          description="Open the record to approve, return or reject the translation."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <select value={status} onChange={(event) => setStatus(event.target.value)} className={`${selectClass} w-44`}>
                {STATUS_OPTIONS.map((value) => <option key={value || 'all'} value={value}>{value ? value.replace(/_/g, ' ') : 'All open statuses'}</option>)}
              </select>
              <Button variant="secondary" size="sm" onClick={() => setIncludeCompleted((value) => !value)}>
                {includeCompleted ? 'Hide completed' : 'Include completed'}
              </Button>
            </div>
          }
        />

        {loading && !tasks.length ? <Spinner label="Loading review tasks" /> : tasks.length ? (
          <TableShell>
            <thead className="border-b border-gray-100 dark:border-white/5">
              <tr><Th>Object</Th><Th>Language</Th><Th>Status</Th><Th>Assignee</Th><Th>Updated</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {tasks.map((task) => (
                <tr key={task._id} className="align-top">
                  <Td>
                    <p className="font-bold text-gray-900 dark:text-white">{task.businessObjectType}</p>
                    <p className="font-mono text-[10px] text-gray-400">{String(task.businessObjectId)}</p>
                  </Td>
                  <Td><Badge tone="info">{task.languageCode}</Badge></Td>
                  <Td><StatusBadge value={task.status} /></Td>
                  <Td className="text-xs font-medium text-gray-500">{personName(task.assignee) || 'Unassigned'}</Td>
                  <Td className="text-xs font-medium text-gray-400 whitespace-nowrap">{relativeTime(task.updatedAt)}</Td>
                  <Td>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <Link href={`/admin/translations/records/${task.translationRecordId}`}>
                          <Button size="sm">Open record</Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={() => claim(task._id)} loading={busy === task._id}>
                          <Hand size={12} /> Claim
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setAssignFor(assignFor === task._id ? null : task._id); setAssigneeSearch(''); setAssigneeOptions([]); }}
                        >
                          <UserPlus size={12} /> Assign
                        </Button>
                      </div>

                      {assignFor === task._id && (
                        <div className="w-64 space-y-1.5">
                          <input
                            value={assigneeSearch}
                            onChange={(event) => setAssigneeSearch(event.target.value)}
                            placeholder="Search a reviewer by name or email"
                            className={inputClass}
                          />
                          {assigneeOptions.map((person) => (
                            <button
                              key={person._id}
                              type="button"
                              onClick={() => assign(task._id, person._id)}
                              className="block w-full rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-left text-xs hover:border-orange-500/40"
                            >
                              <span className="font-bold text-gray-800 dark:text-gray-100">{personName(person)}</span>
                              <span className="block font-mono text-[10px] text-gray-400">{person.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="Nothing waiting for review"
            description="Manual-review translations appear here as soon as a job produces new content."
          />
        )}
      </Card>

      <Card>
        <CardHeader
          icon={Bell}
          title="Your unread notifications"
          description="In-app events addressed to your account: review requests, outcomes and failures."
          actions={<Badge tone={notifications.length ? 'warning' : 'success'}>{notifications.length} unread</Badge>}
        />
        {notifications.length ? (
          <CardBody className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification._id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3">
                <Badge tone="info">{String(notification.eventType).replace(/_/g, ' ')}</Badge>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {notification.businessObjectType} · {notification.languageCode}
                </span>
                <span className="text-[11px] font-medium text-gray-400">{relativeTime(notification.createdAt)}</span>
                <div className="ml-auto flex items-center gap-2">
                  {notification.translationRecordId && (
                    <Link href={`/admin/translations/records/${notification.translationRecordId}`}>
                      <Button variant="ghost" size="sm">Open</Button>
                    </Link>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => markRead(notification._id)} loading={busy === notification._id}>
                    <BellOff size={12} /> Mark read
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        ) : (
          <EmptyState icon={BellOff} title="No unread notifications" />
        )}
      </Card>
    </section>
  );
}
