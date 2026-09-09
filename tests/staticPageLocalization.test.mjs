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
function load(path, mocks = {}, env = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports, React, URL, console,
    process: { env },
    require: (name) => name in mocks ? mocks[name] : require(name),
  });
  return loadedModule.exports;
}

const { buildTranslationMap, localizeValue } = load('src/lib/staticPageLocalization.js');

// The stored English record: one paragraph the page splits across an inline <strong>, plus a list.
const englishContent = {
  intro: 'These Advertising & Sponsored Content Rules',
  body: 'govern the purchase, submission, display, and management of advertising',
  note: 'Updates take effect upon publication on the platform.',
  items: ['Advertiser eligibility', 'Approval & review process'],
};
const frenchContent = {
  intro: 'Ces règles publicitaires et de contenu sponsorisé',
  body: 'régissent l’achat, la soumission, l’affichage et la gestion de la publicité',
  note: 'Les modifications prennent effet dès leur publication sur la plateforme.',
  items: ['Éligibilité des annonceurs', 'Processus d’approbation et d’examen'],
};

test('translation map pairs every English string with its French counterpart', () => {
  const map = buildTranslationMap(englishContent, frenchContent);
  assert.equal(map.size, 5);
  assert.equal(map.get(englishContent.note), frenchContent.note);
  assert.equal(map.get('Approval & review process'), 'Processus d’approbation et d’examen');
  // A French record whose shape does not match contributes nothing rather than a wrong pairing.
  assert.equal(buildTranslationMap(englishContent, { intro: 42 }).size, 0);
});

test('text nodes adjacent to inline elements keep their spacing and still localize', () => {
  const map = buildTranslationMap(englishContent, frenchContent);
  // Exactly what JSX produces around <strong>: the separating space stays on the text node.
  assert.equal(localizeValue('These Advertising & Sponsored Content Rules ', map), 'Ces règles publicitaires et de contenu sponsorisé ');
  assert.equal(localizeValue(' govern the purchase, submission, display, and management of advertising', map), ' régissent l’achat, la soumission, l’affichage et la gestion de la publicité');
  assert.equal(localizeValue('\n  Updates take effect upon publication on the platform.\n  ', map), '\n  Les modifications prennent effet dès leur publication sur la plateforme.\n  ');
});

test('unknown, empty and whitespace-only strings are left untouched', () => {
  const map = buildTranslationMap(englishContent, frenchContent);
  assert.equal(localizeValue('Section 04', map), 'Section 04');
  assert.equal(localizeValue('  ', map), '  ');
  assert.equal(localizeValue('', map), '');
  assert.equal(localizeValue(' Section 04 ', map), ' Section 04 ');
});

test('a rendered element tree is localized through children, props and arrays', () => {
  const map = buildTranslationMap(englishContent, frenchContent);
  const tree = React.createElement('div', null,
    React.createElement('p', { title: englishContent.note },
      'These Advertising & Sponsored Content Rules ',
      React.createElement('strong', null, '("Advertising Terms")'),
      ' govern the purchase, submission, display, and management of advertising'),
    englishContent.items.map((item, index) => React.createElement('li', { key: index }, item)));
  const markup = renderToStaticMarkup(localizeValue(tree, map));
  assert.ok(markup.includes('Ces règles publicitaires et de contenu sponsorisé <strong>'));
  assert.ok(markup.includes('régissent l’achat'));
  assert.ok(markup.includes('Éligibilité des annonceurs'));
  assert.ok(markup.includes(`title="${frenchContent.note}"`));
  assert.ok(!markup.includes('These Advertising'));
  assert.ok(!markup.includes('govern the purchase'));
});
