'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquareText, PencilLine, Plus, Power, Save, X } from 'lucide-react';
import {
  activatePrompt,
  createPrompt,
  getPrompts,
  updatePrompt,
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
  formatDateTime,
  inputClass,
  selectClass,
  textareaClass,
} from '../_components/ui';
import { OBJECT_TYPES, objectTypeLabel } from '../_components/objectTypes';


const AVAILABLE_VARIABLES = [
  'sourceLanguageCode',
  'targetLanguageCode',
  'businessObjectType',
  'sourceContent',
  'protectedTerms',
  'dictionaryEntries',
];

const EMPTY_DRAFT = {
  key: 'default',
  businessObjectType: '',
  systemTemplate:
    'You are a professional translator for World Culture Marketplace. Translate every value from {{sourceLanguageCode}} into {{targetLanguageCode}}. Reply with a JSON object that has exactly the same keys as the input and no extra keys. Never translate brand names or proper nouns, and keep the original capitalisation style.',
  userTemplate:
    'Protected terms (keep unchanged): {{protectedTerms}}\nPreferred translations: {{dictionaryEntries}}\nTranslate the values of this JSON object into {{targetLanguageCode}} and reply with JSON using the same keys:\n{{sourceContent}}',
  requiredVariables: 'sourceLanguageCode, targetLanguageCode, sourceContent',
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPrompts();
      setPrompts(response.data.data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load translation prompts.');
      setPrompts([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const submitCreate = async (event) => {
    event.preventDefault();
    setBusy('create'); setError(''); setNotice('');
    try {
      await createPrompt({
        key: draft.key.trim().toLowerCase() || 'default',
        businessObjectType: draft.businessObjectType || null,
        systemTemplate: draft.systemTemplate.trim(),
        userTemplate: draft.userTemplate.trim(),
        requiredVariables: draft.requiredVariables.split(',').map((value) => value.trim()).filter(Boolean),
      });
      setNotice('Prompt version created. Activate it to put it in use.');
      setCreating(false);
      setDraft(EMPTY_DRAFT);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the prompt version.');
    } finally { setBusy(''); }
  };

  const submitEdit = async (promptId) => {
    setBusy(promptId); setError(''); setNotice('');
    try {
      await updatePrompt(promptId, {
        systemTemplate: editDraft.systemTemplate.trim(),
        userTemplate: editDraft.userTemplate.trim(),
        requiredVariables: editDraft.requiredVariables.split(',').map((value) => value.trim()).filter(Boolean),
      });
      setNotice('Prompt updated.');
      setEditingId(null); setEditDraft(null);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the prompt.');
    } finally { setBusy(''); }
  };

  const activate = async (promptId) => {
    setBusy(promptId); setError(''); setNotice('');
    try {
      await activatePrompt(promptId);
      setNotice('Prompt activated. New jobs use it immediately.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to activate the prompt.');
    } finally { setBusy(''); }
  };

  const activeGeneric = prompts.find((prompt) => prompt.isActive && !prompt.businessObjectType);

  return (
    <section className="space-y-6">
      <PageHeader
        icon={MessageSquareText}
        title="Translation prompts"
        description="The instructions sent to the model with every job. One active version per key and scope."
        actions={
          <Button onClick={() => { setCreating((value) => !value); setNotice(''); setError(''); }}>
            {creating ? <><X size={13} /> Close</> : <><Plus size={13} /> New version</>}
          </Button>
        }
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>
      {!loading && !activeGeneric && (
        <Banner tone="error" icon={AlertTriangle}>
          No active generic prompt. Every translation job fails with “No active translation prompt is configured” until one is created and activated.
        </Banner>
      )}

      {creating && (
        <Card>
          <CardHeader icon={Plus} title="New prompt version" description="A scoped prompt overrides the generic one for that business object type." />
          <form onSubmit={submitCreate}>
            <CardBody className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Key" hint="The pipeline always resolves the key “default”.">
                  <input value={draft.key} onChange={(event) => setDraft((current) => ({ ...current, key: event.target.value }))} className={inputClass} required />
                </Field>
                <Field label="Scope" hint="Generic serves every object type.">
                  <select value={draft.businessObjectType} onChange={(event) => setDraft((current) => ({ ...current, businessObjectType: event.target.value }))} className={selectClass}>
                    <option value="">Generic (all object types)</option>
                    {OBJECT_TYPES.map((type) => <option key={type} value={type}>{objectTypeLabel(type)}</option>)}
                  </select>
                </Field>
                <Field label="Required variables" hint="Comma separated; composition fails if one is missing.">
                  <input value={draft.requiredVariables} onChange={(event) => setDraft((current) => ({ ...current, requiredVariables: event.target.value }))} className={inputClass} />
                </Field>
              </div>

              <Field label="System template">
                <textarea value={draft.systemTemplate} onChange={(event) => setDraft((current) => ({ ...current, systemTemplate: event.target.value }))} rows={5} className={textareaClass} required />
              </Field>
              <Field label="User template" hint="Must ask for JSON: the provider runs in JSON response mode and the validator requires exactly the source keys.">
                <textarea value={draft.userTemplate} onChange={(event) => setDraft((current) => ({ ...current, userTemplate: event.target.value }))} rows={6} className={`${textareaClass} font-mono text-xs`} required />
              </Field>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available variables</span>
                {AVAILABLE_VARIABLES.map((variable) => (
                  <Badge key={variable} tone="neutral">{`{{${variable}}}`}</Badge>
                ))}
              </div>
            </CardBody>
            <div className="px-5 md:px-6 pb-5 md:pb-6 flex gap-2">
              <Button type="submit" loading={busy === 'create'}><Save size={13} /> Create version</Button>
              <Button type="button" variant="secondary" onClick={() => { setCreating(false); setDraft(EMPTY_DRAFT); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <Card><Spinner label="Loading prompts" /></Card>
      ) : prompts.length ? (
        <div className="space-y-4">
          {prompts.map((prompt) => {
            const isEditing = editingId === prompt._id;
            return (
              <Card key={prompt._id}>
                <CardHeader
                  icon={MessageSquareText}
                  title={`${prompt.key} · v${prompt.version}`}
                  description={`${prompt.businessObjectType ? objectTypeLabel(prompt.businessObjectType) : 'Generic'} · created ${formatDateTime(prompt.createdAt)}${prompt.activatedAt ? ` · activated ${formatDateTime(prompt.activatedAt)}` : ''}`}
                  actions={
                    <>
                      {prompt.isActive ? <Badge tone="success">Active</Badge> : (
                        <Button variant="secondary" size="sm" onClick={() => activate(prompt._id)} loading={busy === prompt._id}>
                          <Power size={12} /> Activate
                        </Button>
                      )}
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={() => submitEdit(prompt._id)} loading={busy === prompt._id}><Save size={12} /> Save</Button>
                          <Button variant="secondary" size="sm" onClick={() => { setEditingId(null); setEditDraft(null); }}>Cancel</Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(prompt._id);
                            setEditDraft({
                              systemTemplate: prompt.systemTemplate,
                              userTemplate: prompt.userTemplate,
                              requiredVariables: (prompt.requiredVariables || []).join(', '),
                            });
                          }}
                        >
                          <PencilLine size={12} /> Edit
                        </Button>
                      )}
                    </>
                  }
                />
                <CardBody className="space-y-4">
                  {isEditing ? (
                    <>
                      <Field label="System template">
                        <textarea value={editDraft.systemTemplate} onChange={(event) => setEditDraft((current) => ({ ...current, systemTemplate: event.target.value }))} rows={5} className={textareaClass} />
                      </Field>
                      <Field label="User template">
                        <textarea value={editDraft.userTemplate} onChange={(event) => setEditDraft((current) => ({ ...current, userTemplate: event.target.value }))} rows={6} className={`${textareaClass} font-mono text-xs`} />
                      </Field>
                      <Field label="Required variables" hint="Comma separated">
                        <input value={editDraft.requiredVariables} onChange={(event) => setEditDraft((current) => ({ ...current, requiredVariables: event.target.value }))} className={inputClass} />
                      </Field>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">System</p>
                        <p className="whitespace-pre-wrap rounded-xl bg-gray-50 dark:bg-white/5 p-4 text-xs leading-6 text-gray-600 dark:text-gray-300">{prompt.systemTemplate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">User</p>
                        <p className="whitespace-pre-wrap rounded-xl bg-gray-50 dark:bg-white/5 p-4 font-mono text-[11px] leading-5 text-gray-600 dark:text-gray-300">{prompt.userTemplate}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(prompt.requiredVariables || []).map((variable) => <Badge key={variable} tone="info">{variable}</Badge>)}
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={MessageSquareText}
            title="No prompt versions"
            description="Translation jobs cannot run without an active prompt. Create the generic version and activate it."
            action={<Button onClick={() => setCreating(true)}><Plus size={13} /> New version</Button>}
          />
        </Card>
      )}
    </section>
  );
}
