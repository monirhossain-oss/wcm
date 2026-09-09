'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, ShieldCheck, Users } from 'lucide-react';
import {
  createTranslationRole,
  getTranslationPermissions,
  getTranslationRoles,
  updateTranslationRole,
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
  inputClass,
} from '../_components/ui';

export default function TranslationRolesPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [roleResponse, permissionResponse] = await Promise.all([getTranslationRoles(), getTranslationPermissions()]);
      setRoles(roleResponse.data.data || []);
      setPermissions(permissionResponse.data.data.availablePermissions || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation roles.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const create = async (event) => {
    event.preventDefault();
    setBusy('create'); setError(''); setNotice('');
    try {
      await createTranslationRole({ name: name.trim(), permissions: [] });
      setNotice('Role created. Tick the permissions it should carry.');
      setName('');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the role.');
    } finally { setBusy(''); }
  };

  const toggle = async (role, permission) => {
    setBusy(role._id); setError(''); setNotice('');
    try {
      const next = role.permissions.includes(permission)
        ? role.permissions.filter((item) => item !== permission)
        : [...role.permissions, permission];
      await updateTranslationRole(role._id, { permissions: next });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the role.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={Users}
        title="Translation roles"
        description="Extra Translation Centre access for non-admin accounts. Marketplace account roles are never changed here."
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>
      <Banner tone="neutral" icon={ShieldCheck}>
        An administrator already holds every translation permission. These roles exist to grant a subset to reviewers and translators.
      </Banner>

      <Card>
        <CardHeader icon={Plus} title="Create a role" description="Start with no permissions, then grant exactly what the role needs." />
        <form onSubmit={create}>
          <CardBody className="flex flex-wrap items-end gap-3">
            <Field label="Role name" className="flex-1 min-w-[240px]">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="French reviewer" className={inputClass} required />
            </Field>
            <Button type="submit" disabled={!name.trim()} loading={busy === 'create'}><Plus size={13} /> Create role</Button>
          </CardBody>
        </form>
      </Card>

      {loading ? <Card><Spinner label="Loading roles" /></Card> : roles.length ? (
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role._id}>
              <CardHeader
                icon={Users}
                title={role.name}
                description={`${role.permissions.length} permission${role.permissions.length === 1 ? '' : 's'} · ${(role.members || []).length} member${(role.members || []).length === 1 ? '' : 's'}`}
                actions={role.isActive === false ? <Badge tone="neutral">Inactive</Badge> : <Badge tone="success">Active</Badge>}
              />
              <CardBody className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {permissions.map((permission) => {
                    const checked = role.permissions.includes(permission);
                    return (
                      <label
                        key={permission}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-bold cursor-pointer transition-all ${
                          checked
                            ? 'border-orange-500/40 bg-orange-500/5 text-orange-600 dark:text-orange-400'
                            : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-orange-500/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={busy === role._id}
                          onChange={() => toggle(role, permission)}
                          className="accent-orange-500 w-4 h-4"
                        />
                        {permission}
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium text-gray-400">
                  Members: {(role.members || []).map((member) => member.email || member).join(', ') || 'None'}. Membership is managed through the role API.
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={Users} title="No translation roles" description="Administrators can already use every Translation Centre feature without a role." /></Card>
      )}
    </section>
  );
}
