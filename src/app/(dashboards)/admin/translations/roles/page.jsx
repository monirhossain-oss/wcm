'use client';

import { useEffect, useState } from 'react';
import { createTranslationRole, getTranslationPermissions, getTranslationRoles, updateTranslationRole } from '../_services/translationCentreApi';

export default function TranslationRolesPage() {
  const [roles, setRoles] = useState([]); const [permissions, setPermissions] = useState([]); const [name, setName] = useState(''); const [error, setError] = useState('');
  const load = async () => { try { const [roleResponse, permissionResponse] = await Promise.all([getTranslationRoles(), getTranslationPermissions()]); setRoles(roleResponse.data.data); setPermissions(permissionResponse.data.data.availablePermissions); } catch (e) { setError(e.response?.data?.message || 'Unable to load translation roles.'); } };
  useEffect(() => { load(); }, []);
  const create = async () => { try { await createTranslationRole({ name, permissions: [] }); setName(''); load(); } catch (e) { setError(e.response?.data?.message || 'Unable to create role.'); } };
  const toggle = async (role, permission) => { const next = role.permissions.includes(permission) ? role.permissions.filter((item) => item !== permission) : [...role.permissions, permission]; await updateTranslationRole(role._id, { permissions: next }); load(); };
  return <section className="space-y-5"><div><h1 className="text-2xl font-bold">Translation roles</h1><p className="text-sm text-gray-500">Marketplace account roles are not changed here.</p></div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" className="rounded border px-3 py-2" /><button onClick={create} disabled={!name} className="rounded bg-orange-500 px-3 py-2 text-sm text-white disabled:opacity-50">Create role</button></div>{roles.map((role) => <article key={role._id} className="rounded border bg-white p-4 dark:bg-black"><h2 className="font-semibold">{role.name}</h2><div className="mt-3 grid gap-2 md:grid-cols-2">{permissions.map((permission) => <label key={permission} className="text-sm"><input type="checkbox" checked={role.permissions.includes(permission)} onChange={() => toggle(role, permission)} /> {permission}</label>)}</div><p className="mt-3 text-xs text-gray-500">Members: {(role.members || []).map((member) => member.email).join(', ') || 'None'}. Update member IDs through the role API.</p></article>)}</section>;
}
