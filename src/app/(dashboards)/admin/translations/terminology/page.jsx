'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, BookMarked, CheckCircle2, Plus, ShieldOff, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  createDictionary,
  createProtectedTerm,
  getDictionary,
  getProtectedTerms,
  updateDictionary,
  updateProtectedTerm,
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
  TableShell,
  Td,
  Th,
  inputClass,
  selectClass,
} from '../_components/ui';

const LANGUAGES = ['en', 'fr'];
const EMPTY_TERM = { languageCode: 'en', term: '', caseSensitive: true, notes: '' };
const EMPTY_ENTRY = { sourceLanguageCode: 'en', targetLanguageCode: 'fr', sourceTerm: '', targetTerm: '', notes: '' };

export default function TerminologyPage() {
  const [dictionary, setDictionary] = useState([]);
  const [protectedTerms, setProtectedTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [termDraft, setTermDraft] = useState(EMPTY_TERM);
  const [entryDraft, setEntryDraft] = useState(EMPTY_ENTRY);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [dictionaryResponse, protectedResponse] = await Promise.all([getDictionary(), getProtectedTerms()]);
      setDictionary(dictionaryResponse.data.data || []);
      setProtectedTerms(protectedResponse.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load terminology.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const addProtectedTerm = async (event) => {
    event.preventDefault();
    setBusy('term'); setError(''); setNotice('');
    try {
      await createProtectedTerm({ ...termDraft, term: termDraft.term.trim(), notes: termDraft.notes.trim() || null });
      setNotice('Protected term added. The validator now rejects any translation that drops it.');
      setTermDraft(EMPTY_TERM);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add the protected term.');
    } finally { setBusy(''); }
  };

  const addDictionaryEntry = async (event) => {
    event.preventDefault();
    setBusy('entry'); setError(''); setNotice('');
    try {
      await createDictionary({
        ...entryDraft,
        sourceTerm: entryDraft.sourceTerm.trim(),
        targetTerm: entryDraft.targetTerm.trim(),
        notes: entryDraft.notes.trim() || null,
      });
      setNotice('Dictionary entry added. The model is asked to use it and the validator enforces it.');
      setEntryDraft(EMPTY_ENTRY);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add the dictionary entry.');
    } finally { setBusy(''); }
  };

  const toggle = async (kind, item) => {
    setBusy(item._id); setError(''); setNotice('');
    try {
      const update = kind === 'term' ? updateProtectedTerm : updateDictionary;
      await update(item._id, { isActive: !item.isActive });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the entry.');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={BookMarked}
        title="Terminology"
        description="Terms the model must keep untouched, and preferred translations it must reuse. Both are enforced by the validator."
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader
          icon={ShieldOff}
          title="Protected terms"
          description="Brand names, legal identifiers and anything that must survive translation unchanged."
          actions={<Badge tone="neutral">{protectedTerms.filter((term) => term.isActive).length} active</Badge>}
        />
        <form onSubmit={addProtectedTerm}>
          <CardBody className="grid gap-4 md:grid-cols-4">
            <Field label="Term" className="md:col-span-2">
              <input value={termDraft.term} onChange={(event) => setTermDraft((current) => ({ ...current, term: event.target.value }))} placeholder="World Culture Marketplace" className={inputClass} required />
            </Field>
            <Field label="Source language">
              <select value={termDraft.languageCode} onChange={(event) => setTermDraft((current) => ({ ...current, languageCode: event.target.value }))} className={selectClass}>
                {LANGUAGES.map((code) => <option key={code} value={code}>{code.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="Matching">
              <select value={String(termDraft.caseSensitive)} onChange={(event) => setTermDraft((current) => ({ ...current, caseSensitive: event.target.value === 'true' }))} className={selectClass}>
                <option value="true">Case sensitive</option>
                <option value="false">Case insensitive</option>
              </select>
            </Field>
            <Field label="Notes (optional)" className="md:col-span-3">
              <input value={termDraft.notes} onChange={(event) => setTermDraft((current) => ({ ...current, notes: event.target.value }))} className={inputClass} />
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full" loading={busy === 'term'}><Plus size={13} /> Add term</Button>
            </div>
          </CardBody>
        </form>

        {loading ? <Spinner label="Loading terminology" /> : protectedTerms.length ? (
          <TableShell>
            <thead className="border-y border-gray-100 dark:border-white/5">
              <tr><Th>Term</Th><Th>Language</Th><Th>Matching</Th><Th>Notes</Th><Th>State</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {protectedTerms.map((term) => (
                <tr key={term._id}>
                  <Td className="font-bold text-gray-900 dark:text-white">{term.term}</Td>
                  <Td><Badge tone="info">{term.languageCode}</Badge></Td>
                  <Td className="text-xs font-medium text-gray-500">{term.caseSensitive ? 'Case sensitive' : 'Case insensitive'}</Td>
                  <Td className="text-xs font-medium text-gray-500">{term.notes || '—'}</Td>
                  <Td>
                    <Button variant="ghost" size="sm" onClick={() => toggle('term', term)} loading={busy === term._id}>
                      {term.isActive ? <><ToggleRight size={14} className="text-emerald-500" /> Active</> : <><ToggleLeft size={14} /> Inactive</>}
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={ShieldOff} title="No protected terms" description="Add one to stop the model translating a brand or legal name." />}
      </Card>

      <Card>
        <CardHeader
          icon={BookMarked}
          title="Dictionary"
          description="Preferred wording per language pair. A translation that ignores an entry fails validation."
          actions={<Badge tone="neutral">{dictionary.filter((entry) => entry.isActive).length} active</Badge>}
        />
        <form onSubmit={addDictionaryEntry}>
          <CardBody className="grid gap-4 md:grid-cols-4">
            <Field label="Source term">
              <input value={entryDraft.sourceTerm} onChange={(event) => setEntryDraft((current) => ({ ...current, sourceTerm: event.target.value }))} placeholder="heritage" className={inputClass} required />
            </Field>
            <Field label="Target term">
              <input value={entryDraft.targetTerm} onChange={(event) => setEntryDraft((current) => ({ ...current, targetTerm: event.target.value }))} placeholder="patrimoine" className={inputClass} required />
            </Field>
            <Field label="Source language">
              <select value={entryDraft.sourceLanguageCode} onChange={(event) => setEntryDraft((current) => ({ ...current, sourceLanguageCode: event.target.value }))} className={selectClass}>
                {LANGUAGES.map((code) => <option key={code} value={code}>{code.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="Target language">
              <select value={entryDraft.targetLanguageCode} onChange={(event) => setEntryDraft((current) => ({ ...current, targetLanguageCode: event.target.value }))} className={selectClass}>
                {LANGUAGES.map((code) => <option key={code} value={code}>{code.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="Notes (optional)" className="md:col-span-3">
              <input value={entryDraft.notes} onChange={(event) => setEntryDraft((current) => ({ ...current, notes: event.target.value }))} className={inputClass} />
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full" loading={busy === 'entry'}><Plus size={13} /> Add entry</Button>
            </div>
          </CardBody>
        </form>

        {loading ? <Spinner label="Loading dictionary" /> : dictionary.length ? (
          <TableShell>
            <thead className="border-y border-gray-100 dark:border-white/5">
              <tr><Th>Source</Th><Th>Target</Th><Th>Pair</Th><Th>Notes</Th><Th>State</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {dictionary.map((entry) => (
                <tr key={entry._id}>
                  <Td className="font-bold text-gray-900 dark:text-white">{entry.sourceTerm}</Td>
                  <Td className="font-bold text-orange-500">{entry.targetTerm}</Td>
                  <Td><Badge tone="info">{entry.sourceLanguageCode} → {entry.targetLanguageCode}</Badge></Td>
                  <Td className="text-xs font-medium text-gray-500">{entry.notes || '—'}</Td>
                  <Td>
                    <Button variant="ghost" size="sm" onClick={() => toggle('entry', entry)} loading={busy === entry._id}>
                      {entry.isActive ? <><ToggleRight size={14} className="text-emerald-500" /> Active</> : <><ToggleLeft size={14} /> Inactive</>}
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ) : <EmptyState icon={BookMarked} title="No dictionary entries" description="Add the wording you want reused across every translation of this language pair." />}
      </Card>
    </section>
  );
}
