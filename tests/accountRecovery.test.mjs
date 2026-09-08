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
const importSource = (path) => import(`data:text/javascript;base64,${Buffer.from(source(path)).toString('base64')}`);
const { createEmailVerifier, recoveryError } = await importSource('src/lib/accountRecovery.js');
const registry = await importSource('src/lib/seo/publicPageRegistry.js');
const en = (await importSource('src/lib/i18n/catalogs/en.js')).default;
const fr = (await importSource('src/lib/i18n/catalogs/fr.js')).default;
const translate = (locale) => (key) => key.split('.').reduce((value, part) => value?.[part], locale === 'fr' ? fr : en);

function loadPage(path, mocks, globals = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [[require.resolve('next/babel'), {
      'preset-env': { targets: { node: 'current' }, modules: 'commonjs' },
      'preset-react': { runtime: 'classic' },
    }]],
  });
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, process: { env: { NEXT_PUBLIC_API_BASE_URL: 'https://api.example.test' } },
    require: (name) => name in mocks ? mocks[name] : require(name), ...globals,
  });
  return module.exports.default || module.exports.LocaleProvider;
}

function nodes(element) {
  if (!element || typeof element !== 'object') return [];
  return [element, ...React.Children.toArray(element.props?.children).flatMap(nodes)];
}

test('verification shares in-flight and completed requests across locale remounts', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return { ok: true, status: 200, json: async () => ({ message: 'Verified' }), headers: new Headers() };
  };
  try {
    const verify = createEmailVerifier();
    const first = verify('a+b&c', 'https://api.example.test');
    assert.equal(verify('a+b&c', 'https://api.example.test'), first);
    assert.equal((await first).ok, true);
    assert.equal(verify('a+b&c', 'https://api.example.test'), first);
    assert.equal(calls.length, 1);
    assert.equal(calls[0], 'https://api.example.test/api/users/verify-email?token=a%2Bb%26c');
    await verify('another-token', 'https://api.example.test');
    assert.equal(calls.length, 2);
  } finally { globalThis.fetch = original; }
});

test('French feedback covers expired tokens, unknown failures and exact rate-limit wait', () => {
  const t = translate('fr');
  assert.equal(recoveryError({ data: { message: 'Invalid or expired token' } }, t, 'resetError'), fr.accountRecovery.invalidReset);
  assert.equal(recoveryError({ data: { message: 'Invalid or expired verification link.' } }, t, 'verificationError'), fr.accountRecovery.invalidVerification);
  assert.equal(recoveryError({ data: { message: 'Internal English error' } }, t, 'resetError'), fr.accountRecovery.resetError);
  assert.equal(recoveryError({ status: 429, retryAfter: '61' }, t, 'resetError'), fr.accountRecovery.rateLimited.replace('{minutes}', '2'));
  assert.deepEqual(Object.keys(fr.accountRecovery).sort(), Object.keys(en.accountRecovery).sort());
});

test('localized dispatcher passes reset token and rejects malformed recovery URLs', async () => {
  const sourceText = source('src/app/(public)/[locale]/[[...segments]]/page.jsx');
  const mocks = Object.fromEntries([...sourceText.matchAll(/from '([^']+)'/g)].map(([, name]) => [name, () => null]));
  const Reset = () => null;
  const Verify = () => null;
  mocks['../../reset-password/[token]/page'] = Reset;
  mocks['../../verify-email/page'] = Verify;
  mocks.react = React;
  mocks['next/navigation'] = { notFound: () => { throw new Error('404'); } };
  const Page = loadPage('src/app/(public)/[locale]/[[...segments]]/page.jsx', mocks, { React });
  const render = (segments) => Page({ params: Promise.resolve({ locale: 'fr', segments }) });
  const reset = await render(['reset-password', 'abc']);
  assert.equal(reset.type, Reset);
  assert.equal(reset.props.token, 'abc');
  assert.equal((await render(['verify-email'])).type, Verify);
  for (const segments of [['reset-password'], ['reset-password', 'abc', 'extra'], ['verify-email', 'extra']]) {
    await assert.rejects(render(segments), /404/);
  }
});

test('reset form preserves validation, API payload and localized success navigation', async () => {
  for (const locale of ['en', 'fr']) {
    const states = [];
    const rules = {};
    const calls = [];
    const timers = [];
    const location = { href: '' };
    let index = 0;
    let failure;
    const hookReact = { ...React, useState: (initial) => {
      const slot = index++;
      if (!(slot in states)) states[slot] = initial;
      return [states[slot], (value) => { states[slot] = value; }];
    } };
    const Page = loadPage('src/app/(public)/reset-password/[token]/page.jsx', {
      react: hookReact,
      'react-hook-form': { useForm: () => ({
        register: (name, config) => { rules[name] = config; return { name }; },
        handleSubmit: (fn) => fn, watch: () => 'Strong1!', formState: { errors: {}, isSubmitting: false },
      }) },
      'next/navigation': { useParams: () => ({ token: 'english-token' }), useRouter: () => ({ push: (path) => { location.href = path; } }) },
      '@/context/LocaleContext': { useLocale: () => ({ t: translate(locale), localize: () => locale === 'fr' ? '/fr' : '/' }) },
      '@/lib/accountRecovery': { recoveryError },
      axios: { put: async (...args) => { calls.push(args); if (failure) throw failure; return { data: { success: true } }; } },
      'next/image': () => null,
    }, { window: { location }, setTimeout: (fn) => { timers.push(fn); } });
    const render = () => { index = 0; return Page(locale === 'fr' ? { token: 'french-token' } : {}); };
    const submit = nodes(render()).find(({ type }) => type === 'form').props.onSubmit;
    assert.equal(rules.confirmPassword.validate('wrong'), translate(locale)('accountRecovery.mismatch'));
    assert.equal(rules.confirmPassword.validate('Strong1!'), true);
    assert.equal(rules.password.required, translate(locale)('accountRecovery.required'));
    await submit({ password: 'weak' });
    assert.equal(calls.length, 0);
    await submit({ password: 'Strong1!' });
    assert.equal(calls[0][0], `https://api.example.test/api/users/reset-password/${locale === 'fr' ? 'french-token' : 'english-token'}`);
    assert.equal(calls[0][1].password, 'Strong1!');
    timers[0]();
    assert.equal(location.href, locale === 'fr' ? '/fr' : '/');
    failure = { response: { status: 400, data: { message: 'Invalid or expired token' } } };
    await submit({ password: 'Strong1!' });
    assert.ok(states.includes(translate(locale)('accountRecovery.invalidReset')));
  }
});

test('verification renders loading, missing/expired token, network failure and successful login', async () => {
  for (const scenario of ['missing', 'success', 'expired', 'network']) {
    const states = [];
    const effects = [];
    let index = 0;
    let calls = 0;
    const Login = () => null;
    const t = translate('fr');
    const Page = loadPage('src/app/(public)/verify-email/page.jsx', {
      react: { ...React, useEffect: (fn) => effects.push(fn), useState: (initial) => {
        const slot = index++;
        if (!(slot in states)) states[slot] = initial;
        return [states[slot], (value) => { states[slot] = value; }];
      } },
      'next/navigation': { useSearchParams: () => new URLSearchParams(scenario === 'missing' ? '' : 'token=test'), useRouter: () => ({ push() {} }) },
      '@/context/LocaleContext': { useLocale: () => ({ t, localize: () => '/fr' }) },
      '@/components/LoginModal': Login, '@/components/RegistationModal': () => null,
      '@/lib/accountRecovery': { recoveryError, createEmailVerifier: () => async () => {
        calls++;
        if (scenario === 'network') throw new Error('Network failure');
        return { ok: scenario === 'success', status: scenario === 'success' ? 200 : 400, data: { message: 'Invalid or expired verification link.' } };
      } },
    });
    const Content = nodes(Page()).find(({ type }) => type?.name === 'VerifyEmailContent').type;
    const render = () => { index = 0; return Content(); };
    const text = (tree) => nodes(tree).flatMap((node) => React.Children.toArray(node.props?.children)).filter((child) => typeof child === 'string').join(' ');
    assert.ok(text(render()).includes(t(`accountRecovery.${scenario === 'missing' ? 'missingToken' : 'verifying'}`)));
    effects[0]();
    await new Promise((resolve) => setImmediate(resolve));
    const tree = render();
    const key = { missing: 'missingToken', success: 'verificationSuccess', expired: 'invalidVerification', network: 'networkError' }[scenario];
    assert.ok(text(tree).includes(t(`accountRecovery.${key}`)));
    assert.equal(calls, scenario === 'missing' ? 0 : 1);
    assert.equal(nodes(tree).find(({ type }) => type === Login).props.isOpen, scenario === 'success');
  }
});

test('manual and saved-language switches preserve verification query and reset path tokens', async () => {
  for (const pathname of ['/verify-email', '/reset-password/abc', '/fr/verify-email']) {
    const effects = [];
    const pushed = [];
    const target = pathname.startsWith('/fr/') ? 'en' : 'fr';
    const Provider = loadPage('src/context/LocaleContext.jsx', {
      react: { ...React, useEffect: (fn) => effects.push(fn), useState: () => [[{ code: 'en' }, { code: 'fr' }], () => {}], useRef: () => ({ current: false }), useCallback: (fn) => fn, useMemo: (fn) => fn() },
      'next/navigation': { usePathname: () => pathname, useRouter: () => ({ push: (url) => pushed.push(url) }) },
      '@/lib/i18n/catalogs/en': en, '@/lib/i18n/catalogs/fr': fr,
      '@/lib/seo/publicPageRegistry': registry,
    }, {
      window: { location: { search: '?token=a%2Bb&source=email', hash: '#notice' } },
      localStorage: { getItem: () => target, setItem() {} }, document: { cookie: '' },
    });
    const tree = Provider({ children: null });
    await tree.props.value.switchLocale(target);
    effects[2](); // Saved preference uses the same switch path.
    const expected = `${target === 'fr' ? '/fr' : ''}${pathname.replace(/^\/fr/, '')}?token=a%2Bb&source=email#notice`;
    assert.deepEqual(pushed, [expected, expected]);
  }
});

test('localized layout rejects unpublished French and accepts published French', async () => {
  let published = false;
  const Layout = loadPage('src/app/(public)/[locale]/layout.jsx', {
    'next/navigation': { notFound: () => { throw new Error('404'); } },
    '@/lib/i18n/languages': { getPublishedLocale: async () => published ? { code: 'fr', direction: 'ltr', isSource: false } : null },
  }, { React });
  await assert.rejects(Layout({ params: Promise.resolve({ locale: 'fr' }) }), /404/);
  published = true;
  assert.equal((await Layout({ params: Promise.resolve({ locale: 'fr' }), children: 'page' })).props.lang, 'fr');
});
