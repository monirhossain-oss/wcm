import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The Translation Centre names object types the way the rest of the admin does. The API's `region`
// is managed under "Manage Culture", so it must never reach the screen as "region" or "Region".
const ADMIN = fileURLToPath(new URL('../src/app/(dashboards)/admin/', import.meta.url));
const read = (...segments) => readFileSync(path.join(ADMIN, ...segments), 'utf8');

const PAGES = [
  ['translations', 'page.jsx'],
  ['translations', 'review-tasks', 'page.jsx'],
  ['translations', 'prompts', 'page.jsx'],
  ['translations', 'publishing-policies', 'page.jsx'],
  ['translations', 'bulk', '[bulkOperationId]', 'page.jsx'],
  ['translations', 'memory', 'page.jsx'],
  ['translations', 'records', '[translationRecordId]', 'page.jsx'],
];

test('a region is called a Culture', async () => {
  const { OBJECT_TYPE_LABELS, OBJECT_TYPES, objectTypeLabel } = await import(
    new URL('../src/app/(dashboards)/admin/translations/_components/objectTypes.js', import.meta.url)
  );
  assert.equal(objectTypeLabel('region'), 'Culture');
  assert.equal(objectTypeLabel('creatorProfile'), 'Creator profile');
  assert.equal(objectTypeLabel('unknownType'), 'unknownType');
  assert.deepEqual(Object.keys(OBJECT_TYPE_LABELS).sort(), [...OBJECT_TYPES].sort());
});

test('no Translation Centre page prints a raw object type or keeps its own type list', () => {
  for (const segments of PAGES) {
    const source = read(...segments);
    const name = segments.join('/');
    assert.doesNotMatch(source, /\{(task|notification|job|entry|policy|record)\.businessObjectType\}/, name);
    assert.doesNotMatch(source, /\$\{record\.businessObjectType\}/, name);
    assert.doesNotMatch(source, /region: 'Region'/, name);
    assert.doesNotMatch(source, /const (OBJECT_)?TYPES = \[/, name);
    assert.match(source, /objectTypeLabel/, name);
  }
});

test('a review task shows the name of what it is about', () => {
  assert.match(read('translations', 'review-tasks', 'page.jsx'), /\{task\.objectLabel && /);
});

test('the listing review screen calls the region field Culture', () => {
  const source = read('listings', 'page.jsx');
  assert.match(source, /\{ label: 'Culture', value: viewItem\.region/);
  assert.doesNotMatch(source, /label: 'Region'/);
});
