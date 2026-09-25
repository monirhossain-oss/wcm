import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

// The newsletter email fields on the blog page and in the footer: their placeholder and the hint the
// browser shows on hover or on submit must be in the page's language, not the browser's.
const require = createRequire(import.meta.url);
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');

const load = (path) => {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [[require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require });
  return loaded.exports;
};
const loadHook = () => load('src/hooks/useLocalizedEmailValidity.js');
const en = load('src/lib/i18n/catalogs/en.js').default;
const fr = load('src/lib/i18n/catalogs/fr.js').default;

// A stand-in for an <input type="email" required>: the built-in checks, plus the custom message.
const fakeInput = ({ missing = false, mismatch = false }) => {
  const input = {
    message: null,
    setCustomValidity(text) { this.message = text; },
    validity: { valueMissing: missing, typeMismatch: mismatch },
  };
  return input;
};

const messages = { required: fr.blog.newsletterEmailRequired, invalid: fr.blog.newsletterEmailInvalid };

test('an empty field says so in the page language', () => {
  const input = fakeInput({ missing: true });
  loadHook().applyEmailValidity(input, messages);
  assert.equal(input.message, 'Veuillez saisir votre adresse e-mail !');
});

test('a malformed address says so in the page language', () => {
  const input = fakeInput({ mismatch: true });
  loadHook().applyEmailValidity(input, messages);
  assert.equal(input.message, 'Veuillez saisir une adresse e-mail valide.');
});

test('a valid address clears the message, so the form can submit', () => {
  const input = fakeInput({});
  input.message = 'stale';
  loadHook().applyEmailValidity(input, messages);
  assert.equal(input.message, '');
});

test('the placeholder and messages exist in both languages', () => {
  assert.equal(en.blog.newsletterPlaceholder, 'your@email.com');
  assert.equal(fr.blog.newsletterPlaceholder, 'votre@email.com');
  for (const catalog of [en, fr]) {
    assert.ok(catalog.blog.newsletterEmailInvalid);
    assert.ok(catalog.footer.emailRequired);
    assert.ok(catalog.footer.emailInvalid);
  }
});

test('both newsletter fields use the localized placeholder and hints', () => {
  const blog = source('src/components/blog/BlogCard.jsx');
  assert.doesNotMatch(blog, /placeholder="your@email\.com"/);
  assert.match(blog, /placeholder=\{t\('blog\.newsletterPlaceholder'\)\}/);
  assert.match(blog, /required: t\('blog\.newsletterEmailRequired'\),\s+invalid: t\('blog\.newsletterEmailInvalid'\)/);
  assert.match(blog, /ref=\{emailRef\}/);

  const footer = source('src/components/Footer.jsx');
  assert.match(footer, /required: t\('footer\.emailRequired'\),\s+invalid: t\('footer\.emailInvalid'\)/);
  assert.match(footer, /ref=\{emailRef\}/);
});
