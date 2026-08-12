'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLanguageBackfill, getLanguages, registerLanguage, runLanguageAction } from '../_services/translationCentreApi';

const actionsFor = (language) => {
  if (language.isSource) return [];
  if (['registered', 'disabled'].includes(language.status)) return ['enable'];
  if (language.status === 'backfilling') return ['retry'];
  if (language.status === 'ready') return ['publish', 'disable'];
  if (language.status === 'published') return ['unpublish', 'disable'];
  return [];
};

export default function TranslationLanguagesPage() {
  const [languages, setLanguages] = useState([]); const [progress, setProgress] = useState({});
  const [error, setError] = useState(''); const [busy, setBusy] = useState('');
  const load = useCallback(async () => {
    try {
      const { data } = await getLanguages(); setLanguages(data.data || []);
      const backfills = await Promise.all((data.data || []).filter((language) => language.backfillOperationId).map(async (language) => [language.code, (await getLanguageBackfill(language.code)).data.data.progress]));
      setProgress(Object.fromEntries(backfills)); setError('');
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load languages.'); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const act = async (code, action) => { setBusy(`${code}:${action}`); try { await runLanguageAction(code, action); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Language action failed.'); } finally { setBusy(''); } };
  const addFrench = async () => { setBusy('register'); try { await registerLanguage({ code: 'fr', catalogVersion: '1' }); await load(); } catch (requestError) { setError(requestError.response?.data?.message || 'Registration failed.'); } finally { setBusy(''); } };
  const hasFrench = languages.some(({ code }) => code === 'fr');
  return <section className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Languages</h1><p className="text-sm text-gray-500">Register, backfill and publish approved language catalogs.</p></div>{!hasFrench && <button disabled={Boolean(busy)} onClick={addFrench} className="rounded bg-orange-500 px-4 py-2 text-white disabled:opacity-50">Register French</button>}</div>{error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="overflow-x-auto rounded border bg-white dark:bg-black"><table className="min-w-full text-sm"><thead className="border-b text-left text-gray-500"><tr><th className="p-3">Language</th><th>Status</th><th>Catalog</th><th>Backfill</th><th>Actions</th></tr></thead><tbody>{languages.map((language) => { const state = progress[language.code]; return <tr key={language.code} className="border-b"><td className="p-3"><span className="font-medium">{language.name}</span><div className="text-xs text-gray-500">{language.code} · {language.direction}{language.isSource ? ' · source' : ''}</div></td><td>{language.status}</td><td>v{language.catalogVersion}</td><td>{state ? `${state.completed}/${state.total} complete · ${state.failed} failed` : '—'}</td><td><div className="flex flex-wrap gap-2">{actionsFor(language).map((action) => <button key={action} disabled={Boolean(busy)} onClick={() => act(language.code, action)} className="rounded border px-2 py-1 capitalize disabled:opacity-50">{action}</button>)}</div></td></tr>;})}</tbody></table></div></section>;
}
