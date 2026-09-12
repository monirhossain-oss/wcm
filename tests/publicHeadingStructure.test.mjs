// One H1 per page. The home hero is the case that regressed: HeroSection owns the page heading,
// and the rotating slider caption underneath it must never be a second H1. Everything is mocked —
// no network, no context providers, no live slider record.
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
    module: loaded, exports: loaded.exports, React, URL, Headers, console, process: { env }, ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const catalogs = { en: load('src/lib/i18n/catalogs/en.js').default, fr: load('src/lib/i18n/catalogs/fr.js').default };
const read = (catalog, key) => key.split('.').reduce((value, part) => value?.[part], catalog);
const i18n = { translate: (locale, key, fallback) => read(catalogs[locale] || catalogs.en, key) ?? read(catalogs.en, key) ?? fallback ?? key };

// next/image renders an <img>; the alt text and src are all this suite cares about.
const nextImage = { __esModule: true, default: ({ src, alt }) => React.createElement('img', { src: String(src), alt }) };
// The slider reads `t` from the locale context; outside a provider the catalog answers directly.
const localeContext = { useLocale: () => ({ t: (key, fallback) => i18n.translate('en', key, fallback), localize: (path) => path }) };

const slides = [
  { _id: 's1', title: 'Handwoven Textiles of West Africa', subTitle: 'Loom traditions carried across generations', imageUrl: '/africa.png' },
  { _id: 's2', title: 'Ceramics of the Andes', subTitle: 'Clay, fire and highland technique', imageUrl: '/rug.jpg' },
];

const heroSlider = load('src/components/HeroSlider.jsx', {
  'next/image': nextImage,
  '@/lib/imageHelper': load('src/lib/imageHelper.js'),
  '@/context/LocaleContext': localeContext,
});

// HeroActions pulls the auth context and the login/register modals, none of which contribute a
// heading; stubbing it keeps this suite to the heading question.
const heroSection = load('src/components/HeroSection.jsx', {
  './HeroSlider': heroSlider,
  './HeroActions': { __esModule: true, default: () => null },
  '@/lib/i18n': i18n,
}, { fetch: async () => ({ ok: true, json: async () => slides }) });

const countTag = (html, tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;

test('the home hero renders exactly one H1 in both languages', async () => {
  for (const locale of ['en', 'fr']) {
    const html = renderToStaticMarkup(await heroSection.default({ locale }));
    assert.equal(countTag(html, 'h1'), 1, `${locale}: expected a single H1 in the home hero`);
    assert.ok(html.includes(i18n.translate(locale, 'homeHero.headingLead')), `${locale}: the H1 carries the localized page heading`);
  }
});

test('the slider caption is a subordinate heading, not a second page heading', () => {
  const html = renderToStaticMarkup(React.createElement(heroSlider.default, { initialSliders: slides }));
  assert.equal(countTag(html, 'h1'), 0, 'the slider must not emit an H1');
  assert.equal(countTag(html, 'h2'), 1, 'only the active slide contributes a caption heading');
  assert.ok(html.includes(slides[0].title), 'the active slide title is the caption');
});

// The form is auth-gated and client-only, so it is stubbed exactly as a crawler experiences it:
// contributing nothing to the served markup.
const becomeCreator = load('src/app/(public)/become-creator/page.jsx', {
  './BecomeCreatorClient': { __esModule: true, default: () => null },
  '@/lib/seo/pageMetadata': { buildPageMetadata: async () => ({}) },
  '@/lib/i18n': i18n,
});

test('Become a Creator serves one H1 and its intro copy without a signed-in user', () => {
  for (const locale of ['en', 'fr']) {
    const html = renderToStaticMarkup(becomeCreator.default({ locale }));
    assert.equal(countTag(html, 'h1'), 1, `${locale}: expected exactly one H1`);
    assert.ok(html.includes(i18n.translate(locale, 'becomeCreator.heading')), `${locale}: the H1 text is served`);
    assert.ok(html.includes(i18n.translate(locale, 'becomeCreator.lead')), `${locale}: the lead paragraph is served`);
    for (const item of i18n.translate(locale, 'becomeCreator.requirements')) {
      assert.ok(html.includes(item), `${locale}: requirement "${item.slice(0, 30)}…" is served`);
    }
    // The heading must not sit inside a breakpoint-hidden container the way the old one did.
    assert.ok(!/class="[^"]*\bhidden\b[^"]*"[^>]*>(?:(?!<\/div>)[\s\S])*?<h1/.test(html), `${locale}: the H1 is not inside a hidden container`);
  }
});

test('the slider falls back to a placeholder that exists in public/', () => {
  const html = renderToStaticMarkup(React.createElement(heroSlider.default, { initialSliders: [{ _id: 'x', title: 'No image', subTitle: '' }] }));
  const src = /<img[^>]*src="([^"]*)"/.exec(html)?.[1];
  assert.ok(src, 'the slide renders an image');
  assert.ok(!/[\s()]/.test(src), `the placeholder path must be URL-safe for the image optimizer, got ${src}`);
  readFileSync(new URL(`public${src}`, root));
});
