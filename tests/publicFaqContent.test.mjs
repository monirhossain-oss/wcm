// The FAQ page is almost entirely question and answer text, and it used to fetch all of it in the
// browser: the served HTML carried five category buttons and a spinner, so 1,147 words reached no
// crawler. These tests hold the two rules that fixed it — the answers are in the server markup, and
// every category is in there, not just the tab that happens to be open.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');
const env = { NEXT_PUBLIC_SITE_URL: 'https://site.test', NEXT_PUBLIC_API_BASE_URL: 'https://api.test' };

function load(path, mocks = {}, globals = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded, exports: loaded.exports, React, URL, Headers, console, setTimeout, clearTimeout,
    process: { env }, ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

// axios must never be reached when the server already supplied the list.
const forbiddenAxios = { get: () => { throw new Error('the browser fetch ran even though initialFaqs was given'); } };
const faqSection = load('src/components/faq/FaqSection.jsx', { axios: forbiddenAxios });

const faqs = [
  { _id: 'g1', category: 'General', question: 'What is World Culture Marketplace?', answer: '<p>A place to <b>discover</b> cultural creators.</p>' },
  { _id: 'c1', category: 'Creators', question: 'How do I apply as a creator?', answer: '<p>Open the become a creator form.</p>' },
  { _id: 'a1', category: 'Artists', question: 'Can I keep my own copyright?', answer: '<p>Yes, creators keep their rights.</p>' },
  { _id: 't1', category: 'Technical', question: 'Which browsers are supported?', answer: '<p>Every current browser.</p>' },
  { _id: 'p1', category: 'Platform', question: 'How is content moderated?', answer: '<p>By the moderation team.</p>' },
];

const render = (props) => renderToStaticMarkup(React.createElement(faqSection.default, props));

test('every question and answer is in the server markup, not only the open tab', () => {
  const html = render({ initialFaqs: faqs });
  for (const faq of faqs) {
    assert.ok(html.includes(faq.question), `missing question: ${faq.question}`);
  }
  // The answers are the bulk of the text and the reason the page had nothing to index.
  assert.ok(html.includes('A place to'), 'the General answer is served');
  assert.ok(html.includes('Every current browser'), 'a hidden tab still ships its answer');
  assert.ok(html.includes('By the moderation team'), 'a hidden tab still ships its answer');
  // No spinner: the list was ready before the page was sent.
  assert.ok(!html.includes('animate-spin'), 'a server-supplied list must not render the loading state');
});

test('a record still stored under the old Artists value appears under the creators tab', () => {
  const html = render({ initialFaqs: faqs });
  assert.ok(html.includes('Can I keep my own copyright?'), 'the legacy category still has a tab');
  // Both values land in one group, so nothing is stranded while records are re-categorised.
  const creatorsGroup = html.split('How do I apply as a creator?')[1] || '';
  assert.ok(creatorsGroup.includes('Can I keep my own copyright?'), 'Creators and Artists render together');
});

test('the five tabs render in both languages and only one group is visible', () => {
  for (const [language, label] of [['en', 'For Creators and Artists'], ['fr', 'Pour les créateurs et artistes']]) {
    const html = render({ language, initialFaqs: faqs });
    assert.ok(html.includes(label), `${language}: the creators tab is labelled`);
    // Four of the five category groups carry the hidden class; the default General tab does not.
    assert.equal((html.match(/class="hidden"/g) || []).length, 4, `${language}: exactly one visible group`);
  }
});

test('without a server list the page still renders its loading state', () => {
  const html = renderToStaticMarkup(React.createElement(
    load('src/components/faq/FaqSection.jsx', { axios: { get: async () => ({ data: [] }) } }).default,
    {},
  ));
  assert.ok(html.includes('animate-spin'), 'the browser fallback is intact');
});

// ── FAQPage structured data ────────────────────────────────────────────────────────────────────

const structuredData = load('src/lib/seo/structuredData.js', {
  './siteConfig': load('src/lib/seo/siteConfig.js'),
  './publicPageRegistry': load('src/lib/seo/publicPageRegistry.js'),
  './pageMetadata': { BRAND_NAME: 'World Culture Marketplace', resolvePageSeo: async () => ({}) },
  '@/lib/i18n': { translate: () => 'text' },
});

test('FAQ structured data carries text, never the stored markup', () => {
  const schema = structuredData.buildFaqPageSchema({ faqs, locale: 'fr', url: 'https://site.test/fr/faq' });
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema['@id'], 'https://site.test/fr/faq#faq');
  assert.equal(schema.inLanguage, 'fr');
  assert.equal(schema.mainEntity.length, faqs.length);
  const [first] = schema.mainEntity;
  assert.equal(first['@type'], 'Question');
  assert.equal(first.name, 'What is World Culture Marketplace?');
  assert.equal(first.acceptedAnswer.text, 'A place to discover cultural creators.');
  assert.ok(!JSON.stringify(schema).includes('<'), 'no markup may reach the JSON-LD');
});

test('FAQ structured data is omitted rather than claiming an empty page', () => {
  assert.equal(structuredData.buildFaqPageSchema({ faqs: [], url: 'https://site.test/faqUs' }), null);
  assert.equal(structuredData.buildFaqPageSchema({ url: 'https://site.test/faqUs' }), null);
  // A record with no answer text contributes nothing.
  const partial = structuredData.buildFaqPageSchema({
    faqs: [{ question: 'Only a question', answer: '   ' }, faqs[0]],
    url: 'https://site.test/faqUs',
  });
  assert.equal(partial.mainEntity.length, 1);
});

// ── One heading, one source ────────────────────────────────────────────────────────────────────

// The page had three sources for its own heading: a hardcoded French string in the /fr/faq route,
// a language ternary in the English page, and two catalog keys nothing read. The French route
// rendered "Questions fréquentes" while every other path to the same page rendered something else.
test('the FAQ heading comes from the catalog, not from a branch inside the page', () => {
  const page = source('src/app/(public)/faqUs/page.jsx');
  assert.ok(!page.includes('isFrench'), 'no language branch may choose the heading');
  assert.ok(page.includes("translate(locale, 'faq.heading')"), 'the heading comes from the catalog');
  assert.ok(page.includes("translate(locale, 'faq.badge')"), 'so does the badge above it');

  const catalogs = {
    en: load('src/lib/i18n/catalogs/en.js').default,
    fr: load('src/lib/i18n/catalogs/fr.js').default,
  };
  assert.equal(catalogs.fr.faq.heading, 'Questions fréquentes');
  assert.equal(catalogs.en.faq.heading, 'Frequently Asked Questions');
  // The French heading matches the French SEO title, so the page and the search result agree.
  assert.equal(catalogs.fr.seo.faq.title, catalogs.fr.faq.heading);
});

test('the French route renders the same page component rather than a second copy', () => {
  const french = source('src/app/(public)/fr/faq/page.jsx');
  assert.ok(french.includes("from '../../faqUs/page'"), 'it reuses the English page component');
  assert.ok(french.includes('locale="fr"'), 'rendered in French');
  // Everything that used to be duplicated here now lives in one file.
  for (const duplicated of ['getFaqs', 'buildFaqPageSchema', '<h1', 'FaqSection']) {
    assert.ok(!french.includes(duplicated), `${duplicated} must not be duplicated in the French route`);
  }
});
