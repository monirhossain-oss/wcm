'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEyeOff, FiGlobe, FiLoader, FiRefreshCw, FiSave } from 'react-icons/fi';
import {
  acquireEditLock,
  changeLocalizedSlug,
  editContentSeo,
  getRecord,
  getRecords,
  releaseEditLock,
  requestRegeneration,
  runAction,
} from '../../translations/_services/translationCentreApi';

// The French side of one blog, inside the blog pages themselves.
//
// It is the Translation Centre's record screen narrowed to a single article and laid out the way an
// editor reads: English on the left, French on the right, block by block. Every button here calls
// the same endpoints the Centre calls, so an approval made from this panel is a real approval —
// policy re-checked, review task completed, version and audit written, memory filed.
//
// The English text on the left is the server's own projection of the article (`sourceContent`), not
// the form's state. That is deliberate: it is exactly what was sent to the translator, so the two
// columns always line up, even when the form has unsaved edits.

const STATUS_STYLES = {
  Published: 'bg-green-500/10 text-green-500',
  Ready: 'bg-blue-500/10 text-blue-500',
  Outdated: 'bg-yellow-500/10 text-yellow-600',
  Processing: 'bg-zinc-500/10 text-zinc-400',
};

export const frenchStatusOf = (record) => {
  if (!record) return 'Processing';
  if (record.translationStatus === 'outdated') return 'Outdated';
  if (record.publicationStatus === 'published') return 'Published';
  return 'Ready';
};

const emptyTree = { blocks: [] };

export default function BlogFrenchPanel({ blogId }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [draft, setDraft] = useState(null);
  const [slugDraft, setSlugDraft] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // The record is found by the blog it belongs to: the search filter matches an id against
      // `businessObjectId`, so no new endpoint is needed for "the French version of this blog".
      const list = await getRecords({ search: blogId, businessObjectType: 'blog', languageCode: 'fr' });
      const summary = list.data?.data?.records?.[0] || null;
      if (!summary) {
        setDetails(null);
        setDraft(null);
        return;
      }
      // Search results are a projection: the record's own id arrives as `translationRecordId`.
      const full = await getRecord(summary.translationRecordId);
      const data = full.data?.data;
      setDetails(data);
      setDraft(structuredClone(data.record?.content || {}));
      setSlugDraft(data.record?.slug || '');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load the French version');
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    load();
  }, [load]);

  const record = details?.record;
  const source = details?.sourceContent;
  const status = frenchStatusOf(record);

  const setBlockText = (index, value) =>
    setDraft((previous) => {
      const next = structuredClone(previous || {});
      next.content = next.content || emptyTree;
      next.content.blocks = next.content.blocks || [];
      next.content.blocks[index] = { ...(next.content.blocks[index] || {}), text: value };
      return next;
    });

  const setBlockAlt = (index, altIndex, value) =>
    setDraft((previous) => {
      const next = structuredClone(previous || {});
      next.content = next.content || emptyTree;
      next.content.blocks = next.content.blocks || [];
      const block = { ...(next.content.blocks[index] || {}) };
      const imageAlts = [...(block.imageAlts || [])];
      imageAlts[altIndex] = value;
      block.imageAlts = imageAlts;
      next.content.blocks[index] = block;
      return next;
    });

  const withLock = async (action) => {
    // Editing takes the same lock the Translation Centre takes, so two admins cannot overwrite each
    // other from two different screens.
    const lock = await acquireEditLock(record._id);
    const lockToken = lock.data?.data?.lockToken;
    try {
      return await action(lockToken);
    } finally {
      await releaseEditLock(record._id, lockToken).catch(() => {});
    }
  };

  const save = async () => {
    setBusy('save');
    try {
      await withLock((lockToken) =>
        editContentSeo(record._id, { content: draft, lockToken, expectedVersion: record.versionNumber })
      );
      toast.success('French text saved');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setBusy('');
    }
  };

  const act = async (label, run) => {
    setBusy(label);
    try {
      await run();
      toast.success(`${label} done`);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || `${label} failed`);
    } finally {
      setBusy('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="border border-dashed dark:border-white/10 rounded-lg p-10 text-center space-y-4">
        <p className="text-xs font-bold uppercase text-gray-400">
          The French version is still being prepared.
        </p>
        <p className="text-[11px] text-gray-400">
          Translation runs in the background while the server is up. Check again in a moment.
        </p>
        <button
          type="button"
          onClick={load}
          className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:border-orange-500 hover:text-orange-500"
        >
          <FiRefreshCw className="inline mr-2" /> Refresh
        </button>
      </div>
    );
  }

  const sourceBlocks = source?.content?.blocks || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${STATUS_STYLES[status]}`}>
            {status}
          </span>
          {status === 'Outdated' && (
            <span className="text-[11px] text-gray-400">
              The English text changed after this translation. It stays live until you republish it.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={Boolean(busy)}
            className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:border-orange-500 hover:text-orange-500 disabled:opacity-50"
          >
            {busy === 'save' ? <FiLoader className="inline animate-spin" /> : <><FiSave className="inline mr-2" /> Save French</>}
          </button>
          <button
            type="button"
            onClick={() => act('Regenerate', () => requestRegeneration(record._id))}
            disabled={Boolean(busy)}
            className="px-5 py-2.5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:border-orange-500 hover:text-orange-500 disabled:opacity-50"
          >
            {busy === 'Regenerate' ? <FiLoader className="inline animate-spin" /> : <><FiRefreshCw className="inline mr-2" /> Regenerate</>}
          </button>
          {record.publicationStatus === 'published' ? (
            <button
              type="button"
              onClick={() => act('Unpublish', () => runAction(record._id, 'unpublish', 'patch'))}
              disabled={Boolean(busy)}
              className="px-5 py-2.5 text-xs font-bold uppercase border border-red-500/40 text-red-500 rounded-md hover:bg-red-500/10 disabled:opacity-50"
            >
              {busy === 'Unpublish' ? <FiLoader className="inline animate-spin" /> : <><FiEyeOff className="inline mr-2" /> Unpublish FR</>}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => act('Publish', () => runAction(record._id, 'approve', 'post', {}))}
              disabled={Boolean(busy)}
              className="px-6 py-2.5 bg-orange-600 text-white text-xs font-bold uppercase rounded-md disabled:opacity-50"
            >
              {busy === 'Publish' ? <FiLoader className="inline animate-spin" /> : <><FiGlobe className="inline mr-2" /> Publish FR</>}
            </button>
          )}
        </div>
      </div>

      <Row label="Title" english={source?.title}>
        <input
          value={draft?.title || ''}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-sm font-bold outline-none focus:border-orange-500"
        />
      </Row>

      <Row label="Summary" english={source?.description}>
        <textarea
          rows="3"
          value={draft?.description || ''}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-sm outline-none focus:border-orange-500 resize-none"
        />
      </Row>

      {source?.content?.imageAlt && (
        <Row label="Banner alt" english={source.content.imageAlt}>
          <input
            value={draft?.content?.imageAlt || ''}
            onChange={(event) =>
              setDraft({ ...draft, content: { ...(draft?.content || emptyTree), imageAlt: event.target.value } })
            }
            className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-sm outline-none focus:border-orange-500"
          />
        </Row>
      )}

      {sourceBlocks.map((block, index) => {
        if (typeof block?.text === 'string') {
          return (
            <Row key={index} label={`Block ${index + 1}`} english={block.text}>
              <textarea
                rows="3"
                value={draft?.content?.blocks?.[index]?.text || ''}
                onChange={(event) => setBlockText(index, event.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-sm outline-none focus:border-orange-500 resize-none"
              />
            </Row>
          );
        }

        if (Array.isArray(block?.imageAlts)) {
          return (
            <Row key={index} label={`Block ${index + 1} — image alts`} english={block.imageAlts.join('\n')}>
              <div className="space-y-2">
                {block.imageAlts.map((_, altIndex) => (
                  <input
                    key={altIndex}
                    value={draft?.content?.blocks?.[index]?.imageAlts?.[altIndex] || ''}
                    onChange={(event) => setBlockAlt(index, altIndex, event.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-3 text-sm outline-none focus:border-orange-500"
                  />
                ))}
              </div>
            </Row>
          );
        }

        // A block with nothing to translate — an image grid with no alts, or an empty paragraph.
        return null;
      })}

      <Row label="French URL" english={`/fr/blogs/${details?.master?.slug || ''}`}>
        <div className="flex gap-2">
          <input
            value={slugDraft}
            onChange={(event) => setSlugDraft(event.target.value)}
            placeholder="slug-en-francais"
            className="flex-1 bg-gray-50 dark:bg-white/5 border dark:border-white/10 rounded-lg p-4 text-sm outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={() => act('Slug', () => changeLocalizedSlug(record._id, { slug: slugDraft }))}
            disabled={Boolean(busy) || !slugDraft.trim() || slugDraft === record.slug}
            className="px-5 text-xs font-bold uppercase border dark:border-white/10 rounded-md hover:border-orange-500 hover:text-orange-500 disabled:opacity-40"
          >
            Change
          </button>
        </div>
      </Row>
    </div>
  );
}

function Row({ label, english, children }) {
  return (
    <section className="space-y-2">
      <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-lg p-4 text-sm text-gray-500 whitespace-pre-wrap">
          {english || <span className="italic text-gray-400">—</span>}
        </div>
        {children}
      </div>
    </section>
  );
}
