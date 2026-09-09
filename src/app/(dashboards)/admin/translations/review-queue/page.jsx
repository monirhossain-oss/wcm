'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Languages, Send } from 'lucide-react';
import {
  getStaticPageEditor,
  getStaticPages,
  publishStaticPage,
} from '../_services/translationCentreApi';
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  PageHeader,
  Spinner,
  StatusBadge,
  formatDateTime,
  selectClass,
  textareaClass,
} from '../_components/ui';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaticPages()
      .then(({ data: response }) => {
        setPages(response.data);
        setPageKey(response.data[0]?.pageKey || '');
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load static pages.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!pageKey) return;
    setError(''); setNotice(''); setData(null); setLoading(true);
    getStaticPageEditor(pageKey)
      .then(({ data: response }) => {
        setData(response.data);
        setFrench(structuredClone(response.data.translatedContent || response.data.sourceContent));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load this static page.'))
      .finally(() => setLoading(false));
  }, [pageKey]);

  const fields = useMemo(() => collectTextFields(data?.sourceContent || {}), [data]);
  const untranslated = useMemo(
    () => fields.filter((field) => valueAt(french, field.path) === field.english).length,
    [fields, french]
  );

  const publish = async () => {
    try {
      setPublishing(true); setError(''); setNotice('');
      await publishStaticPage(pageKey, french);
      setNotice('French page published. The public route serves it immediately.');
      const response = await getStaticPageEditor(pageKey);
      setData(response.data.data);
      setFrench(structuredClone(response.data.data.translatedContent));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to publish the French page.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Static page translation"
        description="Legal and information pages are translated here, paragraph by paragraph. They never enter the AI queue."
        actions={data && <StatusBadge value={data.status} />}
      />

      <Banner tone="error" icon={AlertTriangle}>{error}</Banner>
      <Banner tone="success" icon={CheckCircle2}>{notice}</Banner>

      <Card>
        <CardHeader
          icon={Languages}
          title="Choose a page"
          description={data?.updatedAt ? `French copy last published ${formatDateTime(data.updatedAt)}` : 'No French copy published yet for this page.'}
          actions={fields.length > 0 && (
            <Badge tone={untranslated ? 'warning' : 'success'}>
              {untranslated ? `${untranslated} of ${fields.length} still English` : `${fields.length} fields translated`}
            </Badge>
          )}
        />
        <CardBody>
          <Field label="Static page" hint="The English source is read-only; it is owned by the seeded record.">
            <select value={pageKey} onChange={(event) => setPageKey(event.target.value)} className={`${selectClass} max-w-md`}>
              {pages.map((page) => <option key={page.pageKey} value={page.pageKey}>{page.label}</option>)}
            </select>
          </Field>
        </CardBody>
      </Card>

      {loading && <Card><Spinner label="Loading page content" /></Card>}

      {data && french && !loading && (
        <>
          <Card>
            <CardHeader
              icon={FileText}
              title="English source and French copy"
              description="Structure, ordering and fixed values such as the brand name and address must stay identical."
            />
            <CardBody className="space-y-3">
              {fields.map((field) => {
                const isSame = valueAt(french, field.path) === field.english;
                return (
                  <div key={field.path.join('.')} className="grid gap-3 rounded-xl border border-gray-200 dark:border-white/10 p-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {fieldLabel(field.path)}
                        {isSame && <Badge tone="warning">same as English</Badge>}
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300">{field.english}</p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500">French</p>
                      <textarea
                        value={valueAt(french, field.path) || ''}
                        onChange={(event) => setFrench((current) => updateAt(current, field.path, event.target.value))}
                        rows={Math.max(2, Math.ceil(String(valueAt(french, field.path) || '').length / 80))}
                        className={textareaClass}
                      />
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <div className="sticky bottom-4 flex justify-end">
            <Button variant="success" onClick={publish} loading={publishing} className="shadow-2xl">
              <Send size={13} /> Publish French page
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
