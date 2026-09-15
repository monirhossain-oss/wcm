import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';

// Same loader the other suites use: the catalogs are ESM with `@/` aliases, which `node --test`
// cannot resolve on its own.
const require = createRequire(import.meta.url);
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);

function load(path, mocks = {}) {
  const { code } = transformSync(readFileSync(new URL(path, root), 'utf8'), {
    filename: path,
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('next/dist/compiled/babel/preset-env'),
        { targets: { node: 'current' }, modules: 'commonjs' },
      ],
    ],
  });
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, {
    module: loadedModule,
    exports: loadedModule.exports,
    console,
    Intl,
    String,
    Object,
    Array,
    Number,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loadedModule.exports;
}

const esm = (value) => ({ __esModule: true, default: value });

const creatorEn = load('src/lib/i18n/catalogs/creator/en.js').default;
const creatorFr = load('src/lib/i18n/catalogs/creator/fr.js').default;
const { CATALOG_LOCALES, resolvePreferredLocale } = load('src/lib/localePreference.js');
const { catalogs, format, translate } = load('src/lib/i18n/index.js', {
  './catalogs/en': esm(load('src/lib/i18n/catalogs/en.js').default),
  './catalogs/fr': esm(load('src/lib/i18n/catalogs/fr.js').default),
  './format': load('src/lib/i18n/format.js'),
  './catalogs/creator/en': esm(creatorEn),
  './catalogs/creator/fr': esm(creatorFr),
  '@/lib/seo/publicPageRegistry': { localizedRoutePath: () => null },
});

// A missing French key silently falls back to English at runtime, so nothing breaks and nobody
// notices — the page just stays half translated. These tests are the only thing that reports it.
const flatten = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) return flatten(entry, path);
    return [[path, entry]];
  });

const enEntries = new Map(flatten(creatorEn));
const frEntries = new Map(flatten(creatorFr));

test('every English creator key exists in French', () => {
  const missing = [...enEntries.keys()].filter((key) => !frEntries.has(key));
  assert.deepEqual(missing, [], `missing French keys: ${missing.join(', ')}`);
});

test('the French creator catalog carries no key English does not have', () => {
  const extra = [...frEntries.keys()].filter((key) => !enEntries.has(key));
  assert.deepEqual(extra, [], `French-only keys: ${extra.join(', ')}`);
});

test('every creator catalog entry is a string', () => {
  for (const [name, entries] of [
    ['en', enEntries],
    ['fr', frEntries],
  ]) {
    for (const [key, value] of entries) {
      assert.equal(typeof value, 'string', `${name}.${key} is ${typeof value}, expected a string`);
    }
  }
});

// A `{token}` the translator dropped or renamed would print the literal token to the user, so the
// placeholder set has to survive translation even though the word order does not.
test('French keeps the same placeholders as English', () => {
  const placeholders = (value) =>
    [...String(value).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  const mismatched = [];
  for (const [key, value] of enEntries) {
    const french = frEntries.get(key);
    if (french === undefined) continue;
    const expected = placeholders(value);
    const actual = placeholders(french);
    if (expected.join('|') !== actual.join('|')) {
      mismatched.push(`${key} (en: ${expected.join(',') || '-'} / fr: ${actual.join(',') || '-'})`);
    }
  }
  assert.deepEqual(mismatched, [], `placeholder mismatch: ${mismatched.join('; ')}`);
});

// Catches the copy-paste that leaves an English sentence sitting in the French catalog. Entries
// that are legitimately identical in both languages (brand names, currency codes, punctuation) are
// listed explicitly so a genuinely untranslated string cannot hide among them.
const IDENTICAL_BY_DESIGN = new Set([
  // Words French spells exactly as English does. They are correct French, not missed translations.
  'nav.navigation',
  'overview.metrics.engagement',
  'overview.ledger.protocol',
  'add.tradition',
  'add.sources',
  'listings.columnActions',
  'listings.edit.tradition',
  'listings.edit.description',
  'promotions.columnPromotions',
  'promotions.columnActions',
  'insights.budget',
  'insights.columnDate',
  'insights.columnType',
  'transactions.columnVerification',
  'transactions.columnProtocol',
  'translations.notifications',
  'workspace.fields.description',
  'workspace.version',
  // Names, codes and examples that are the same in every language.
  'nav.logoAlt',
  'packageType.boost',
  'packageType.ppc',
  'promotions.modal.currency',
  'workspace.slugPlaceholder',
  // Pure structure around two placeholders.
  'workspace.targetLabel',
]);

test('French creator entries are actually translated', () => {
  const untranslated = [];
  for (const [key, value] of enEntries) {
    if (!/[A-Za-z]{3}/.test(value)) continue;
    if (IDENTICAL_BY_DESIGN.has(key)) continue;
    if (frEntries.get(key) === value) untranslated.push(key);
  }
  assert.deepEqual(untranslated, [], `still English in creator/fr.js: ${untranslated.join(', ')}`);
});

test('format fills placeholders and leaves unknown tokens alone', () => {
  assert.equal(format('Page {page} of {pages}', { page: 2, pages: 5 }), 'Page 2 of 5');
  assert.equal(format('Total {total} Records', {}), 'Total {total} Records');
  assert.equal(format('{count} listing', { count: 0 }), '0 listing');
});

test('translate reaches the creator namespace and falls back when a key is missing', () => {
  assert.equal(translate('fr', 'creator.nav.overview'), creatorFr.nav.overview);
  assert.equal(translate('en', 'creator.nav.overview'), creatorEn.nav.overview);
  assert.equal(translate('fr', 'creator.does.not.exist', 'fallback'), 'fallback');
});

// `proxy.js` cannot import the catalogs, so it validates the locale cookie against a literal list.
// This is what keeps that list from drifting once a third language is added.
test('CATALOG_LOCALES lists exactly the locales that have a catalog', () => {
  assert.deepEqual([...CATALOG_LOCALES].sort(), Object.keys(catalogs).sort());
});

test('a locale is only honoured when a catalog backs it', () => {
  assert.equal(resolvePreferredLocale('fr'), 'fr');
  assert.equal(resolvePreferredLocale('de'), 'en');
  assert.equal(resolvePreferredLocale(undefined), 'en');
  assert.equal(resolvePreferredLocale('../../etc/passwd'), 'en');
});

// Dashboard URL shape and the proxy rewrite live in tests/dashboardLocaleRouting.test.mjs.
