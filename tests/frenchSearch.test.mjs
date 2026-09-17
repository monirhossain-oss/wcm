// French search on the public pages: the Explore route slug must carry accented words through to
// the API, and the Creators filter must look at every name the card can show.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');

function load(path, mocks = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded, exports: loaded.exports, React, URL, console,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const { toRouteSlug, slugsMatch } = load('src/lib/exploreSlug.js');

// What the Explore page does with the slug it reads back out of the URL.
const slugToText = (slug) => decodeURIComponent(slug).replace(/-/g, ' ').trim();

test('an accented word survives the round trip to the API as a searchable word', () => {
  // The ASCII filter used to delete accented characters instead of transliterating them, so
  // "céramique" reached the API as "cramique" — a word that matches nothing anywhere.
  assert.equal(toRouteSlug('céramique'), 'ceramique');
  assert.equal(toRouteSlug('Écharpe tissée'), 'echarpe-tissee');
  assert.equal(toRouteSlug('artisanat français'), 'artisanat-francais');
  assert.equal(toRouteSlug('thé'), 'the');
  assert.equal(slugToText(toRouteSlug('Art Céramique')), 'art ceramique');
});

test('the slug stays ASCII and keeps its existing rules', () => {
  assert.ok(/^[a-z0-9-]+$/.test(toRouteSlug('Écharpe tissée')));
  assert.equal(toRouteSlug('Home & Decor'), 'home-and-decor');
  assert.equal(toRouteSlug('  Middle East '), 'middle-east');
  for (const empty of ['All', 'all regions', '', null, undefined]) assert.equal(toRouteSlug(empty), null);
  assert.ok(slugsMatch('Home & Decor', 'home-and-decor'));
  // Two different words stay two different routes; folding accents must not collapse them.
  assert.ok(!slugsMatch('Pottery', 'poterie'));
});

test('an accented and an unaccented spelling reach the same route', () => {
  assert.equal(toRouteSlug('céramique'), toRouteSlug('ceramique'));
  assert.ok(slugsMatch('Céramique', 'ceramique'));
});

// ── Creators ────────────────────────────────────────────────────────────────
// The filter is inline in the client component, so the assertions are on the source that decides
// it, in the same style as the other client-component tests here.
const creatorsClient = source('src/app/(public)/creators/CreatorsClient.jsx');

test('the creators filter searches every name the card can show', () => {
  // The card's heading is `profile.displayName` when there is one, and display and business name
  // are the two fields a creator's published translation replaces. Searching only first/last name
  // meant the name on screen could not be typed into the box — in English as well as French.
  for (const field of ['displayName', 'businessName', 'country', 'bio']) {
    assert.match(creatorsClient, new RegExp(`creator\\.profile\\?\\.${field}`), field);
  }
  assert.match(creatorsClient, /firstName \|\| ''/);
  assert.match(creatorsClient, /haystack\.some/);
});

test('the creators filter folds accents on both sides of the comparison', () => {
  assert.match(creatorsClient, /normalizeForSearch/);
  assert.match(creatorsClient, /normalize\('NFD'\)/);
  assert.match(creatorsClient, /\[\\u0300-\\u036f\]/);
  // An empty box must not filter anything out.
  assert.match(creatorsClient, /!searchTerm/);
});
