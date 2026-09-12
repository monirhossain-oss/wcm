// Image hygiene for the public pages that are finished. Two rules cost real bandwidth when broken
// and neither shows up as a failure anywhere else, so they are asserted against the source:
//
//   1. `fill` without `sizes` makes the optimizer serve the largest configured device width (3840px)
//      for a box that may be 56px wide.
//   2. `unoptimized` on a stored image ships the original bytes: no resizing, no AVIF, no WebP. It is
//      legitimate only for a local blob: preview, which the optimizer cannot read, so it must be
//      conditional rather than always on.
//
// A third rule guards bundle weight: a data package imported at module scope lands in the initial
// chunk of every route that reaches the file, and the [locale] catch-all reaches almost all of them.
//
// Listing, blog and creator-profile pages are excluded while those sections are still being built.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { join, posix } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\//, '');
const DEFERRED = ['/blogs/', '/blog/', '/listings/', '/profile/[id]/', 'BlogBanner', 'BlogCard', 'ListingDetails', 'PublicProfile'];
const SCANNED = ['src/components', 'src/app/(public)', 'src/app/not-found.jsx'];

const walk = (path) => {
  const full = join(root, path);
  if (!statSync(full).isDirectory()) return [path];
  return readdirSync(full).flatMap((entry) => walk(posix.join(path, entry)));
};

const inScope = (path) => /\.jsx?$/.test(path) && !DEFERRED.some((part) => path.includes(part));
const files = SCANNED.flatMap(walk).filter(inScope);

// Reads one <Image …> tag whole, so a prop on any line of it counts. Brace depth keeps a `>` inside
// an expression such as `w > 0 ? a : b` from ending the tag early.
const imageTags = (source) => {
  const tags = [];
  for (const match of source.matchAll(/<Image\b/g)) {
    let index = match.index + match[0].length;
    let depth = 0;
    while (index < source.length) {
      const char = source[index];
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      else if (char === '>' && depth === 0) break;
      index += 1;
    }
    tags.push({ tag: source.slice(match.index, index + 1), line: source.slice(0, match.index).split('\n').length });
  }
  return tags;
};

test('the scan actually covers the public components', () => {
  assert.ok(files.length > 20, `expected the public tree, found ${files.length} files`);
  assert.ok(files.some((path) => path.endsWith('HeroSlider.jsx')));
  assert.ok(!files.some((path) => path.includes('BlogBanner')), 'deferred sections must stay excluded');
});

test('every fill image declares the width it is actually rendered at', () => {
  const offenders = [];
  for (const path of files) {
    for (const { tag, line } of imageTags(readFileSync(join(root, path), 'utf8'))) {
      if (/\bfill\b/.test(tag) && !tag.includes('sizes')) offenders.push(`${path}:${line}`);
    }
  }
  assert.deepEqual(offenders, [], `fill without sizes serves the largest device width:\n  ${offenders.join('\n  ')}`);
});

test('optimization is only ever bypassed for a local preview', () => {
  const offenders = [];
  for (const path of files) {
    for (const { tag, line } of imageTags(readFileSync(join(root, path), 'utf8'))) {
      // `unoptimized={…}` is a decision made per image; a bare `unoptimized` is always on.
      if (/\bunoptimized\b(?!\s*=)/.test(tag)) offenders.push(`${path}:${line}`);
    }
  }
  assert.deepEqual(offenders, [], `unoptimized ships the original bytes to every visitor:\n  ${offenders.join('\n  ')}`);
});

test('the home hero preloads its first slide and lazy-loads none of them', () => {
  // Every slide sits in the same above-the-fold box, so a lazy one arrives late and, if it becomes
  // the Largest Contentful Paint, drags the score down. Only the first slide is preloaded.
  const source = readFileSync(join(root, 'src/components/HeroSlider.jsx'), 'utf8');
  const [, slide] = imageTags(source);
  assert.ok(slide, 'the slide loop still renders an Image');
  assert.match(slide.tag, /priority=\{index === 0\}/);
  assert.match(slide.tag, /loading="eager"/);
  assert.ok(!/loading=\{[^}]*lazy/.test(slide.tag), 'no slide may be lazy-loaded');
  assert.match(slide.tag, /fetchPriority=\{index === 0 \? 'high' : 'low'\}/);
});

// Packages that are mostly data. Reaching one from a public client component at module scope puts
// its whole payload in the first chunk — `country-state-city` alone is 7.7 MB, and the [locale]
// catch-all statically imports every public page, so one such import weighs down every French URL.
const DATA_HEAVY = ['country-state-city'];

test('no public page pulls a bulk data package into its first chunk', () => {
  const offenders = [];
  for (const path of files) {
    const text = readFileSync(join(root, path), 'utf8');
    for (const pkg of DATA_HEAVY) {
      // A static `import … from 'pkg'`; the dynamic `import('pkg')` form is the supported way in.
      const statik = new RegExp(`import[^;]*\\sfrom\\s*['"]${pkg}['"]`);
      if (statik.test(text)) offenders.push(`${path} -> ${pkg}`);
    }
  }
  assert.deepEqual(offenders, [], `import these on demand instead:\n  ${offenders.join('\n  ')}`);
});

test('the country picker loads its data on demand and survives a failed load', () => {
  const helper = readFileSync(join(root, 'src/lib/countryData.js'), 'utf8');
  assert.match(helper, /import\('country-state-city'\)/, 'the package is reached through a dynamic import');
  assert.match(helper, /pending \|\|=/, 'the module is fetched once and reused');

  const form = readFileSync(join(root, 'src/app/(public)/become-creator/BecomeCreatorClient.jsx'), 'utf8');
  for (const fn of ['loadCountries', 'loadCitiesOfCountry', 'loadCountryByCode']) {
    assert.ok(form.includes(fn), `the form uses ${fn}`);
  }
  // An empty list must render an empty picker, never crash the page.
  assert.match(form, /useState\(\[\]\)/);
  assert.match(form, /\.catch\(\(\) => \{\}\)/, 'a failed chunk load must not reject unhandled');
});

// A host missing from the allowlist fails with HTTP 400 and nothing in the page says why, so the
// list is pinned here: changing it has to be deliberate. The `.co.com` check guards the specific
// mistake this replaced — two entries for `ibb.co.com`, a typo for ImgBB's `i.ibb.co` that also
// named a domain this project does not own. No stored image used either one.
test('the image host allowlist is exactly the hosts this site serves images from', async () => {
  const { default: config } = await import('../next.config.mjs');
  const hosts = config.images.remotePatterns.map(({ hostname }) => hostname);
  assert.deepEqual(hosts, [
    'res.cloudinary.com',
    'images.unsplash.com',
    'cdn-icons-png.flaticon.com',
    'placehold.co',
    'i.postimg.cc',
    'localhost',
    'wcm-server.onrender.com',
    'ui-avatars.com',
  ]);
  for (const host of hosts) {
    assert.ok(!host.endsWith('.co.com'), `${host} looks like the ibb.co.com typo again`);
  }
  // Both upload origins stay scoped to the uploads path rather than the whole host.
  for (const pattern of config.images.remotePatterns) {
    if (['localhost', 'wcm-server.onrender.com'].includes(pattern.hostname)) {
      assert.equal(pattern.pathname, '/uploads/**', `${pattern.hostname} must stay scoped to uploads`);
    }
  }
  assert.deepEqual(config.images.formats, ['image/avif', 'image/webp']);
});

// A budget for what ships in public/. The folder reached 159 MB of which 140 MB was referenced by
// nothing — not by the code, not by any stored CMS record — including seven source photos over
// 10 MB each. Nothing reports that: an unused file costs deploy size and nobody notices. A second
// rule catches the shape that actually reaches visitors, a file large enough to matter that no
// <Image> optimises, which is how a 1 MB CSS background sat on /become-creator.
test('public/ stays within its size budget', () => {
  const files = readdirSync(join(root, 'public'))
    .map((name) => ({ name, size: statSync(join(root, 'public', name)).size }))
    .filter(({ name }) => !statSync(join(root, 'public', name)).isDirectory() && !/\.(txt|xml|ico|json)$/i.test(name));

  const oversized = files.filter(({ size }) => size > 2 * 1024 * 1024);
  assert.deepEqual(oversized.map(({ name }) => name), [], 'no single asset may exceed 2 MB');

  const total = files.reduce((sum, { size }) => sum + size, 0);
  assert.ok(total < 25 * 1024 * 1024, `public/ is ${(total / 1048576).toFixed(1)} MB, over the 25 MB budget`);
});

test('a CSS background image is small enough to ship unoptimised', () => {
  // next/image never sees a CSS background, so the source file is what every visitor downloads.
  const sources = SCANNED.flatMap(walk).filter(inScope).map((path) => readFileSync(join(root, path), 'utf8'));
  const backgrounds = new Set();
  for (const text of sources) {
    for (const match of text.matchAll(/url\(['"]?(\/[^'")]+)['"]?\)/g)) backgrounds.add(match[1]);
  }
  assert.ok(backgrounds.size > 0, 'the scan still finds the background it is meant to guard');
  for (const src of backgrounds) {
    const size = statSync(join(root, 'public', decodeURIComponent(src))).size;
    assert.ok(size < 300 * 1024, `${src} is ${(size / 1024).toFixed(0)} KB and is downloaded in full`);
  }
});

// A data file imported at module scope lands in the first chunk of every route that reaches it,
// exactly like the bulk npm packages above. The contact page carried a 60 KB Lottie animation that
// way, for a panel its own CSS hides below 1024px — so phones downloaded it to show nothing.
test('no public component bundles a large data file at module scope', () => {
  const offenders = [];
  for (const path of files) {
    const text = readFileSync(join(root, path), 'utf8');
    for (const match of text.matchAll(/import\s+[\w{},\s]+\s+from\s+['"]([^'"]+\.json)['"]/g)) {
      const asset = match[1].replace(/^.*\/public\//, 'public/');
      let size = 0;
      try { size = statSync(join(root, asset)).size; } catch { size = 0; }
      if (size > 10 * 1024) offenders.push(`${path} -> ${match[1]} (${(size / 1024).toFixed(0)} KB)`);
    }
  }
  assert.deepEqual(offenders, [], `import these on demand instead:\n  ${offenders.join('\n  ')}`);
});

test('the contact animation is fetched on demand and only where it is visible', () => {
  const component = readFileSync(join(root, 'src/components/ContactAnimation.jsx'), 'utf8');
  assert.match(component, /import\('lottie-react'\)/, 'the player is loaded on demand');
  assert.match(component, /import\('\.\.\/\.\.\/public\/animation\/contact\.json'\)/, 'so is the animation');
  // The panel is hidden below lg, so the fetch must not happen there at all.
  assert.match(component, /min-width: 1024px/, 'the viewport gate matches the panel CSS');
  assert.match(component, /\.catch\(\(\) => \{\}\)/, 'a failed chunk load must not break the form');

  const client = readFileSync(join(root, 'src/components/ContactClient.jsx'), 'utf8');
  assert.ok(!client.includes('lottie-react'), 'the page must not pull the player in directly');
  assert.ok(!client.includes('contact.json'), 'nor the animation data');
  assert.ok(client.includes('<ContactAnimation />'));
});
