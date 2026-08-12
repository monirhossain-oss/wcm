'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getStaticPageEditor,
  getStaticPages,
  publishStaticPage,
} from '../_services/translationCentreApi';

const collectTextFields = (value, path = [], fields = []) => {
  if (typeof value === 'string') fields.push({ path, english: value });
  else if (Array.isArray(value)) value.forEach((item, index) => collectTextFields(item, [...path, index], fields));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => collectTextFields(item, [...path, key], fields));
  return fields;
};

const valueAt = (value, path) => path.reduce((current, key) => current?.[key], value);

const updateAt = (value, path, nextText) => {
  const copy = structuredClone(value);
  let current = copy;
  path.slice(0, -1).forEach((key) => { current = current[key]; });
  current[path.at(-1)] = nextText;
  return copy;
};

const fieldLabel = (path) => {
  const lastNamed = [...path].reverse().find((part) => typeof part === 'string');
  const index = [...path].reverse().find((part) => typeof part === 'number');
  if (lastNamed === 'segments') return `Paragraph ${Number(index) + 1}`;
  return String(lastNamed || 'Text').replace(/([A-Z])/g, ' $1').replace(/^./, (text) => text.toUpperCase());
};

export default function StaticPageReviewPage() {
  const [pages, setPages] = useState([]);
  const [pageKey, setPageKey] = useState('');
  const [data, setData] = useState(null);
  const [french, setFrench] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    getStaticPages()
      .then(({ data: response }) => {
        setPages(response.data);
        setPageKey(response.data[0]?.pageKey || '');
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load static pages.'));
  }, []);

  useEffect(() => {
    if (!pageKey) return;
    setError(''); setNotice(''); setData(null);
    getStaticPageEditor(pageKey)
      .then(({ data: response }) => {
        setData(response.data);
        setFrench(structuredClone(response.data.translatedContent || response.data.sourceContent));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load this static page.'));
  }, [pageKey]);

  const fields = useMemo(() => collectTextFields(data?.sourceContent || {}), [data]);

  const publish = async () => {
    try {
      setPublishing(true); setError(''); setNotice('');
      await publishStaticPage(pageKey, french);
      setNotice('French page published successfully.');
      const response = await getStaticPageEditor(pageKey);
      setData(response.data.data);
      setFrench(structuredClone(response.data.data.translatedContent));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to publish the French page.');
    } finally {
      setPublishing(false);
    }
  };

  return <section className="space-y-5">
    <div>
      <h1 className="text-2xl font-bold">Static Page Translation</h1>
      <p className="text-sm text-gray-500">Compare English with French, correct the French text, then publish.</p>
    </div>

    <label className="block max-w-md text-sm font-medium">Static page
      <select value={pageKey} onChange={(event) => setPageKey(event.target.value)} className="mt-1 w-full rounded border bg-white px-3 py-2 dark:bg-black">
        {pages.map((page) => <option key={page.pageKey} value={page.pageKey}>{page.label}</option>)}
      </select>
    </label>

    {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
    {notice && <p className="rounded bg-green-50 p-3 text-green-700">{notice}</p>}

    {data && french && <>
      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <div className="rounded bg-gray-100 p-3 dark:bg-gray-900">English</div>
        <div className="rounded bg-gray-100 p-3 dark:bg-gray-900">French</div>
      </div>
      <div className="space-y-3">
        {fields.map((field) => <div key={field.path.join('.')} className="grid gap-3 rounded border bg-white p-3 dark:bg-black md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-gray-400">{fieldLabel(field.path)}</p>
            <p className="whitespace-pre-wrap text-sm leading-6">{field.english}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">{fieldLabel(field.path)}</p>
            <textarea
              value={valueAt(french, field.path) || ''}
              onChange={(event) => setFrench((current) => updateAt(current, field.path, event.target.value))}
              rows={Math.max(2, Math.ceil(String(valueAt(french, field.path) || '').length / 80))}
              className="w-full resize-y rounded border px-3 py-2 text-sm leading-6 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>)}
      </div>
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={publish} disabled={publishing} className="rounded bg-green-600 px-5 py-3 font-semibold text-white shadow disabled:opacity-50">
          {publishing ? 'Publishing…' : 'Publish French Page'}
        </button>
      </div>
    </>}
  </section>;
}
