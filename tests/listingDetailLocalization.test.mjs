import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The listing text arrives translated from the API; these checks cover the page around it — every
// string from the catalog, every link in the reader's language, and the SEO text phrased per locale.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const read = (...segments) => readFileSync(path.join(SRC, ...segments), 'utf8');
const client = () => read('app', '(public)', 'listings', 'ListingDetailsClient.jsx');
const page = () => read('app', '(public)', 'listings', '[id]', 'page.jsx');

const ENGLISH_UI = [
  'Saved to Favorites', 'Save to Favorites', 'Top Ranked', 'Key Features', 'Follow on Social',
  'Visit Creator Website', 'You might also like', 'More from', 'View all', 'Please login!',
];

test('the listing page carries no hardcoded English interface text', () => {
  const source = client();
  for (const text of ENGLISH_UI) {
    assert.ok(!source.includes(`>${text}`) && !source.includes(`'${text}'`), `hardcoded: ${text}`);
  }
  assert.match(source, /useLocale\(\)/);
  for (const key of ['back', 'about', 'keyFeatures', 'visitWebsite', 'moreFrom', 'loginRequired', 'views', 'byCreator']) {
    assert.match(source, new RegExp(`listingDetail\\.${key}`), key);
  }
});

test('links on the listing page keep the reader’s language', () => {
  const source = client();
  assert.match(source, /localize\(`\/profile\/\$\{creatorUsername\}`\)/);
  assert.match(source, /<Link href=\{localize\('\/explore'\)\}/);
  assert.doesNotMatch(source, /href=\{`\/profile\//, 'profile links are never unprefixed');
});

test('the server page phrases its SEO text and fallbacks for the locale', () => {
  const source = page();
  assert.match(source, /generateMetaDescription\(product, locale\)/);
  assert.match(source, /listingDetail\.seoHeading/);
  assert.match(source, /translate\(locale, 'listingDetail\.notFound'\)/);
  assert.match(source, /translate\(locale, 'listingDetail\.metaFallbackTitle'\)/);
  assert.match(source, /inLanguage: locale/);
  assert.doesNotMatch(source, /Asset not found/);
});

test('both catalogs define the same listing page keys', async () => {
  const { default: en } = await import('../src/lib/i18n/catalogs/en.js');
  const { default: fr } = await import('../src/lib/i18n/catalogs/fr.js');
  assert.deepEqual(Object.keys(fr.listingDetail).sort(), Object.keys(en.listingDetail).sort());
  assert.equal(fr.listingDetail.views.includes('{count}'), true);
  assert.equal(fr.listingDetail.seoHeading.includes('{country}'), true);
});
