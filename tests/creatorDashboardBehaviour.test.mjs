import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Source checks for Creator Dashboard behaviour that the rendered page cannot show without a running
// backend: which numbers come from the server, what the forms send, how often the page polls.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const read = (...segments) => readFileSync(path.join(SRC, ...segments), 'utf8');
const creator = (...segments) => read('app', '(dashboards)', 'creator', ...segments);

test('the cancel confirmation shows the refund the server will credit, not a local estimate', () => {
  const insights = creator('promotions', '[id]', 'page.jsx');
  assert.match(insights, /\/api\/payments\/refund-preview/);
  assert.doesNotMatch(insights, /refundRatio|totalDurationMs/);
});

test('every money-moving request tells the server which language the creator is working in', () => {
  const wallet = read('components', 'creator', 'CreatorWallet.jsx');
  const promotions = creator('promotions', 'page.jsx');
  const insights = creator('promotions', '[id]', 'page.jsx');

  assert.match(wallet, /create-checkout-session[\s\S]{0,400}\blocale,/);
  assert.match(promotions, /const payload = \{[\s\S]{0,300}\blocale,/);
  assert.match(insights, /cancel-promotion[\s\S]{0,300}\blocale,/);
  assert.match(insights, /const payload = \{[\s\S]{0,200}\blocale,/);
});

test('the overview refreshes in the background without forcing a rebuild', () => {
  const overview = creator('page.jsx');
  assert.match(overview, /const AUTO_REFRESH_MS = 5 \* 60 \* 1000;/);
  assert.match(overview, /document\.visibilityState === 'visible'/);

  const interval = overview.slice(overview.indexOf('setInterval('), overview.indexOf('AUTO_REFRESH_MS);'));
  assert.doesNotMatch(interval, /force/);
  assert.match(overview, /fetchDashboardData\(\{ force: true \}\)/);
});

test('the listing edit form saves tag titles, a country code and category-scoped taxonomy', () => {
  const listings = creator('listings', 'page.jsx');
  assert.match(listings, /const MAX_TAGS = 10;/);
  assert.doesNotMatch(listings, />= 5\b|count: 5\b/);
  assert.match(listings, /\/api\/admin\/category-assets\//);
  assert.match(listings, /data\.append\('countryIsoCode'/);
  assert.match(listings, /data\.append\('culturalTags', tag\)/);
  assert.doesNotMatch(listings, /tag\._id\)/, 'tags are never sent as ids');
});

// The stored title and description are the English master; a French reader has to see — and edit —
// their own French version, and every page has to reload when the language changes.
test('listing titles follow the dashboard language on every page that shows them', () => {
  const listings = creator('listings', 'page.jsx');
  assert.match(listings, /const listingTitle = \(item\) => item\.localizedText\?\.title \|\| item\.title/);
  assert.match(listings, /\{listingTitle\(item\)\}/);
  assert.match(listings, /listingTitle\(item\)\.toLowerCase\(\)/, 'search matches the shown title');
  assert.match(listings, /title: item\.localizedText\?\.title \?\? item\.title/);
  assert.match(listings, /description: item\.localizedText\?\.description \?\?/);
  assert.match(listings, /!editingItem\.localizedText\.hasTranslation[\s\S]{0,400}noTranslationYet/);
  assert.match(listings, /setEditingItem\(null\);[\s\S]*?\}, \[locale\]\);/);

  const promotions = creator('promotions', 'page.jsx');
  assert.match(promotions, /\{item\.localizedText\?\.title \|\| item\.title\}/);
  assert.match(promotions, /selectedListing\.localizedText\?\.title \|\| selectedListing\.title/);
  assert.match(promotions, /initData\(\);[\s\S]*?\}, \[locale\]\);/);

  const insights = creator('promotions', '[id]', 'page.jsx');
  assert.match(insights, /promotion-insights\/\$\{id\}`, \{ params: \{ language: locale \} \}/);
  assert.match(insights, /\}, \[id, locale, t\]\);/);

  const hub = creator('translations', 'page.jsx');
  const hubApi = creator('translations', '_services', 'creatorTranslationApi.js');
  assert.match(hubApi, /my-listings', \{ params: \{ language \} \}/);
  assert.match(hub, /getMyListings\(locale\)/);
  assert.match(hub, /listing\.localizedText\?\.title \|\| listing\.title/);
});

// A catalog string that also carries the symbol printed it twice once the formatter added its own:
// "€€4.00" in English, "€4,00 €" in French.
test('messages with an amount let the formatter place the currency symbol', () => {
  for (const file of ['en.js', 'fr.js']) {
    const source = read('lib', 'i18n', 'catalogs', 'creator', file);
    assert.doesNotMatch(source, /lowBalance:\s*'[^']*€/, file);
    assert.doesNotMatch(source, /clickRateNote:\s*'[^']*€/, file);
  }
});
