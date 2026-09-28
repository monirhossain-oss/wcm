// A listing or bio typed in the other language than the page is caught before saving — and only
// when the text says so clearly; anything uncertain keeps the page's language, as before.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');

function load(path) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [[require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require });
  return loaded.exports;
}

const { detectTextLanguage } = load('src/lib/i18n/detectTextLanguage.js');

test('plain English is English', () => {
  assert.equal(
    detectTextLanguage('Handmade ceramic vase from Lyon, shaped and glazed by hand in our small studio.'),
    'en'
  );
});

test('plain French is French', () => {
  assert.equal(
    detectTextLanguage('Vase en céramique fait main, façonné et émaillé à la main dans notre petit atelier.'),
    'fr'
  );
});

test('French is recognised from its elisions and accents, not only its short words', () => {
  assert.equal(detectTextLanguage("L'atelier d'Anne crée des bols émaillés"), 'fr');
});

test('a borrowed accented word does not turn English into French', () => {
  assert.equal(detectTextLanguage('The café pottery is made by hand for every guest in the village.'), 'en');
});

test('a title too short to judge is left to the page', () => {
  assert.equal(detectTextLanguage('Vase bleu'), null);
  assert.equal(detectTextLanguage('Blue vase'), null);
  assert.equal(detectTextLanguage(''), null);
  assert.equal(detectTextLanguage(undefined), null);
});

test('text that mixes both languages evenly is left to the page', () => {
  assert.equal(detectTextLanguage('The vase and the bowl. Le vase et la coupe.'), null);
});

test('proper nouns alone carry no signal', () => {
  assert.equal(detectTextLanguage('Kente Ashanti Accra Kumasi Ghana'), null);
});
