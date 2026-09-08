import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
function load(path, mocks = {}, globals = {}) {
  const { code } = transformSync(readFileSync(new URL(path, root), 'utf8'), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded, exports: loaded.exports, React, URL, AbortController,
    process: { env: { NEXT_PUBLIC_API_BASE_URL: 'https://api.test', NEXT_PUBLIC_SITE_URL: 'https://site.test' } },
    require: (name) => name in mocks ? mocks[name] : require(name), ...globals,
  });
  return loaded.exports;
}
const registry = load('src/lib/seo/publicPageRegistry.js');
const site = load('src/lib/seo/siteConfig.js');
const helper = load('src/lib/seo/adminSeo.js', { './publicPageRegistry': registry, './siteConfig': site });
const path = 'src/app/(dashboards)/admin/seo-settings/page.jsx';
const tick = () => new Promise((resolve) => setImmediate(resolve));
function nodes(element) {
  if (!element || typeof element !== 'object') return [];
  return [element, ...React.Children.toArray(element.props?.children).flatMap(nodes)];
}
const find = (tree, predicate) => nodes(tree).find(predicate);
const label = (tree, value) => find(tree, (node) => node.props['aria-label'] === value);
const field = (tree, name) => find(tree, (node) => node.props.name === name);
const text = (tree) => nodes(tree).flatMap((node) => React.Children.toArray(node.props.children)).filter((child) => typeof child === 'string').join(' ');

function environment(get) {
  let current;
  const posts = [], deletes = [], errors = [], confirmations = [], switches = [];
  let rejectWrite = false;
  const hooks = {
    ...React,
    useState(initial) {
      const target = current, index = target.index++;
      if (!(index in target.state)) target.state[index] = typeof initial === 'function' ? initial() : initial;
      return [target.state[index], (value) => { target.state[index] = typeof value === 'function' ? value(target.state[index]) : value; }];
    },
    useEffect(fn, dependencies) {
      const target = current, index = target.index++;
      const prior = target.effects[index];
      if (!prior || dependencies.some((value, i) => value !== prior.dependencies[i])) {
        target.pending.push(() => { prior?.cleanup?.(); target.effects[index] = { dependencies, cleanup: fn() }; });
      }
    },
  };
  const Page = load(path, {
    react: hooks, '@/lib/seo/adminSeo': helper, '@/lib/seo/siteConfig': site,
    'next/image': () => null,
    axios: {
      get,
      post: async (...args) => { if (rejectWrite) throw { response: { status: 403, data: { message: 'Access denied.' } } }; posts.push(args); },
      delete: async (...args) => { deletes.push(args); },
    },
    'react-hot-toast': { toast: { success() {}, error: (value) => errors.push(value) } },
    sweetalert2: { fire: async (options) => { confirmations.push(options); return { isConfirmed: true }; } },
  }, {
    window: { confirm: () => true }, document: { documentElement: { classList: { contains: () => false } } },
  }).default;
  function mount(Component, props = {}) {
    const target = { state: [], effects: [], pending: [], index: 0 };
    return {
      render() {
        current = target; target.index = 0;
        const result = Component(props);
        const pending = target.pending.splice(0); pending.forEach((fn) => fn());
        return result;
      },
      unmount() { target.effects.forEach((effect) => effect.cleanup?.()); },
    };
  }
  const wrapper = mount(Page).render();
  assert.equal(wrapper.key, 'en');
  return { mount, workspace: (languageCode) => mount(wrapper.type, { languageCode, onLanguageChange: (value) => switches.push(value) }),
    posts, deletes, errors, confirmations, switches, denyWrites: () => { rejectWrite = true; } };
}

test('admin options and previews use real mapped URLs, including FAQ and legacy SEO keys', () => {
  assert.equal(helper.SEO_PAGE_OPTIONS.length, 15);
  // Previews are site-relative: Admin must never render an origin, least of all the localhost fallback.
  assert.equal(helper.seoPagePath('faq', 'en'), '/faqUs');
  assert.equal(helper.seoPagePath('faq', 'fr'), '/fr/faq');
  assert.equal(helper.seoPagePath('home', 'en'), '/');
  assert.equal(helper.seoPagePath('home', 'fr'), '/fr');
  assert.equal(helper.seoPagePath('privacy', 'fr'), '/fr/privacy-policy');
  assert.equal(helper.seoPagePath('faq', 'de'), '');
  assert.equal(helper.seoPageUrl, undefined);
  assert.ok(!helper.SEO_PAGE_OPTIONS.some(({ value }) => value === 'profile'));
  assert.throws(() => helper.seoPayload({ ...helper.seoDraft(), title: ' ', description: 'D' }, 'fr'), /required/);
  assert.throws(() => helper.seoPayload({ ...helper.seoDraft(), title: 'T', description: 'D', ogImage: 'javascript:test' }, 'fr'), /Social image/);
});

test('French creation sends explicit locale and social fields; English draft is loaded separately', async () => {
  const calls = [];
  const en = { _id: 'en-id', pageName: 'home', languageCode: 'en', title: 'Original English', description: 'English description' };
  const env = environment(async (url, options) => { calls.push(options); return { data: options.params.languageCode === 'en' ? [en] : [] }; });
  const french = env.workspace('fr');
  french.render(); await tick();
  let tree = french.render();
  assert.ok(text(tree).includes('0 of 15 pages configured'));
  assert.ok(text(tree).includes('No custom SEO'));
  for (const [name, value] of [['title', 'Titre français'], ['description', 'Description française'], ['keywords', ' culture, artisanat ']]) {
    field(tree, name).props.onChange({ target: { name, value } }); tree = french.render();
  }
  const social = find(tree, (node) => node.type?.name === 'SocialFields');
  social.props.onChange({ target: { name: 'ogImage', value: '/french.jpg' } });
  social.props.onChange({ target: { name: 'imageAlt', value: 'Artisan français' } });
  tree = french.render();
  await find(tree, (node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(env.posts[0][1].languageCode, 'fr');
  assert.equal(env.posts[0][1].title, 'Titre français');
  assert.equal(env.posts[0][1].ogImage, '/french.jpg');
  assert.equal(env.posts[0][1].imageAlt, 'Artisan français');
  assert.equal(env.posts[0][2].withCredentials, true);
  french.unmount();
  const english = env.workspace('en'); english.render(); await tick();
  assert.equal(field(english.render(), 'title').props.value, 'Original English');
  assert.equal(calls[0].params.languageCode, 'fr');
  assert.equal(calls.at(-1).params.languageCode, 'en');
});

test('editor loads fresh record, keeps its language on save and delete targets only selected ID', async () => {
  const record = { _id: 'fr-faq', pageName: 'faq', languageCode: 'fr', title: 'Questions', description: 'Réponses', ogImage: '/faq.jpg', imageAlt: 'FAQ' };
  const env = environment(async () => ({ data: [record] }));
  const workspace = env.workspace('fr'); workspace.render(); await tick();
  let tree = workspace.render();
  label(tree, 'Edit FAQ SEO').props.onClick();
  tree = workspace.render();
  const editorElement = find(tree, (node) => node.type?.name === 'EditModal');
  const editor = env.mount(editorElement.type, editorElement.props);
  const editorTree = editor.render();
  // Route preview is site-relative and no origin — least of all a localhost fallback — is rendered.
  assert.ok(text(editorTree).includes('/fr/faq'));
  assert.ok(!/https?:\/\//.test(text(editorTree)));
  assert.ok(!/https?:\/\//.test(text(tree)));
  assert.equal(find(editorTree, (node) => node.type === 'input' && node.props.required).props.value, 'Questions');
  await find(editorTree, (node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(env.posts[0][1].languageCode, 'fr');
  assert.equal(env.posts[0][1].ogImage, '/faq.jpg');
  workspace.render(); await tick(); tree = workspace.render();
  await label(tree, 'Delete FAQ SEO').props.onClick();
  assert.equal(env.deletes[0][0], 'https://api.test/api/seo/delete/fr-faq');
  assert.equal(env.deletes[0][1].withCredentials, true);
  assert.ok(env.confirmations[0].text.includes('French'));
});

test('preview modal shows the site-relative route and no origin', async () => {
  const record = { _id: 'fr-faq', pageName: 'faq', languageCode: 'fr', title: 'Questions', description: 'Réponses', ogImage: '', imageAlt: '' };
  const env = environment(async () => ({ data: [record] }));
  const workspace = env.workspace('fr'); workspace.render(); await tick();
  let tree = workspace.render();
  label(tree, 'Preview FAQ SEO').props.onClick();
  tree = workspace.render();
  const previewElement = find(tree, (node) => node.type?.name === 'ViewModal');
  const preview = env.mount(previewElement.type, previewElement.props).render();
  const rendered = text(preview);
  assert.ok(rendered.includes('/fr/faq'));
  // The deployed host is unknown to Admin, so no origin is printed — the development fallback
  // would otherwise tell an editor their pages live on localhost.
  assert.ok(!/https?:\/\//.test(rendered), rendered);
  assert.ok(!rendered.includes('localhost'));
  // The default social image is named by its site-relative path.
  assert.ok(rendered.includes('/og-image.jpg'));
});

test('late old-language response is ignored after switch; load failures are not shown as fallbacks', async () => {
  let resolveEnglish;
  const env = environment(async (url, options) => options.params.languageCode === 'en'
    ? new Promise((resolve) => { resolveEnglish = resolve; })
    : { data: [] });
  const english = env.workspace('en'); english.render(); english.unmount();
  const french = env.workspace('fr'); french.render(); await tick();
  resolveEnglish({ data: [{ pageName: 'home', languageCode: 'en', title: 'Late English', description: 'D' }] });
  await tick();
  assert.equal(field(french.render(), 'title').props.value, '');
  const failed = environment(async () => { throw new Error('Network unavailable'); });
  const workspace = failed.workspace('fr'); workspace.render(); await tick();
  const tree = workspace.render();
  assert.ok(text(tree).includes('Network unavailable'));
  assert.ok(!text(tree).includes('No custom SEO'));
  assert.ok(find(tree, (node) => node.type === 'fieldset').props.disabled);
});

test('authorization failure preserves draft and reports API error', async () => {
  const env = environment(async () => ({ data: [{ pageName: 'home', languageCode: 'en', title: 'Keep title', description: 'Keep description' }] }));
  const workspace = env.workspace('en'); workspace.render(); await tick();
  const tree = workspace.render(); env.denyWrites();
  await find(tree, (node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(env.errors[0], 'Access denied.');
  assert.equal(field(workspace.render(), 'title').props.value, 'Keep title');
});
