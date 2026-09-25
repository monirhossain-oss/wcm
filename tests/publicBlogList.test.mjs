// The blog list used to arrive through a browser fetch, so the served HTML carried a spinner: no
// titles, no descriptions, and no link a crawler could follow to a single post. These tests hold
// the first page in the server markup and keep the browser fallback for a read that came back empty.
// The post pages themselves are out of scope while that section is still being built.
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
    module: loaded, exports: loaded.exports, React, URL, Headers, console, setTimeout, clearTimeout,
    process: { env }, ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const nextImage = { __esModule: true, default: ({ src, alt }) => React.createElement('img', { src: String(src), alt }) };
const nextLink = { __esModule: true, default: ({ href, children }) => React.createElement('a', { href: String(href) }, children) };
const localeContext = {
  useLocale: () => ({ locale: 'en', localize: (path) => path, t: (key) => key }),
};
// The component must never reach the network when the server already supplied the first page.
const forbiddenAxios = { create: () => ({ get: () => { throw new Error('the browser fetch ran even though initialBlogs was given'); } }) };
const allowedAxios = { create: () => ({ get: async () => ({ data: { blogs: [], pagination: { hasMore: false } } }) }) };

const blogModule = (axios) => load('src/components/blog/BlogCard.jsx', {
  axios,
  'next/image': nextImage,
  'next/link': nextLink,
  '@/context/LocaleContext': localeContext,
  // The validity hook only talks to a mounted input, which server rendering never has.
  '@/hooks/useLocalizedEmailValidity': { __esModule: true, default: () => null },
  '@emailjs/browser': { send: async () => ({}) },
  'react-hot-toast': { __esModule: true, default: { success() {}, error() {} }, Toaster: () => null },
});

const blogs = [
  { _id: 'b1', slug: 'traditional-jewelry', title: 'Traditional Jewelry and Its Meaning', description: 'Jewelry has always been more than decoration.', category: 'Artisan Jewelry', image: 'https://res.cloudinary.com/x/a.jpg' },
  { _id: 'b2', slug: 'loom-traditions', title: 'Loom Traditions of West Africa', description: 'Weavers carry patterns across generations.', category: 'Cultural Textiles', image: 'https://res.cloudinary.com/x/b.jpg' },
];

test('the first page of posts is in the server markup, links included', () => {
  const BlogCard = blogModule(forbiddenAxios).default;
  const html = renderToStaticMarkup(React.createElement(BlogCard, { initialBlogs: blogs, initialHasMore: false }));

  for (const blog of blogs) {
    assert.ok(html.includes(blog.title), `missing title: ${blog.title}`);
    assert.ok(html.includes(blog.description), `missing description: ${blog.title}`);
    assert.ok(html.includes(blog.category), `missing category: ${blog.title}`);
    // The link is the part a crawler needs; the sitemap alone left these posts unlinked in the page.
    assert.ok(html.includes(`/blogs/${blog.slug}`), `missing link: ${blog.slug}`);
  }
  assert.ok(!html.includes('animate-spin'), 'a server-supplied page must not render the loading state');
});

test('an empty or failed server read still falls back to the browser fetch', () => {
  const BlogCard = blogModule(allowedAxios).default;
  const html = renderToStaticMarkup(React.createElement(BlogCard, { initialBlogs: null }));
  assert.ok(html.includes('animate-spin'), 'the browser fallback is intact');

  // The page decides this: an empty list is passed as null so the component takes over.
  const page = source('src/app/(public)/blogs/page.jsx');
  assert.ok(page.includes('blogs.length ? blogs : null'), 'an empty server read must not be treated as a result');
  assert.ok(page.includes('getBlogs'), 'the page reads the first page on the server');
});

test('the missing placeholder image is no longer referenced', () => {
  const card = source('src/components/blog/BlogCard.jsx');
  // /placeholder-image.jpg was never in public/: a post without an image would fail to optimise.
  assert.ok(!card.includes('/placeholder-image.jpg'), 'that file has never existed');
  assert.ok(card.includes('/fallback-image.png'), 'the fallback points at a file that is there');
  readFileSync(new URL('public/fallback-image.png', root));
});
