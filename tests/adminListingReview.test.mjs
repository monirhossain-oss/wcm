import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The Admin listing review screen. Approval publishes the listing in every ready language, blocking is
// permanent, and creator links are untrusted — these checks keep the screen honest about all three.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const page = () =>
  readFileSync(path.join(SRC, 'app', '(dashboards)', 'admin', 'listings', 'page.jsx'), 'utf8');

test('approval is named for what it does and cannot be repeated on an approved listing', () => {
  const source = page();
  assert.match(source, /'Approve listing'/);
  assert.doesNotMatch(source, /`Approve \$\{reviewLanguage/, 'no per-language approve label');
  assert.match(source, /disabled=\{isApproved \|\| isBlocked \|\| actionLoading\}/);
  // The version the Admin read still goes along as their explicit decision.
  assert.match(source, /languageCode: newStatus === 'approved' \? reviewLanguage : undefined/);
  assert.match(source, /Approving publishes this listing in every language that has a translation ready\./);
});

test('a block needs an explicit acknowledgement that it is permanent', () => {
  const source = page();
  assert.match(source, /Blocking is permanent\./);
  assert.match(source, /I understand this cannot be undone\./);
  assert.match(source, /\(restrictionType === 'blocked' && !blockConfirmed\)/);
});

test('creator links are shown by address and opened safely', () => {
  const source = page();
  assert.match(source, /url\.protocol !== 'http:' && url\.protocol !== 'https:'/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.doesNotMatch(source, /target="_blank"(?![^>]*rel=)/);
});

test('the actions stay in view while the body scrolls', () => {
  const source = page();
  assert.match(source, /className="flex-1 min-h-0 overflow-y-auto/);
  assert.match(source, /className="shrink-0 border-t/);
  assert.doesNotMatch(source, /scrollbar-hide/);
});

test('each text is shown once, in the language being reviewed', () => {
  const source = page();
  assert.equal(source.match(/\{reviewed\.description \|\| '—'\}/g)?.length, 1);
  assert.doesNotMatch(source, /\{viewItem\.description\}/);
  assert.match(source, /\{reviewed\?\.title \|\| viewItem\.title\}/);
  assert.match(source, /whitespace-pre-line/);
});

test('one status palette serves the cards, the table and the modal', () => {
  const source = page();
  for (const status of ['pending', 'approved', 'rejected', 'blocked']) {
    assert.match(source, new RegExp(`\\r?\\n  ${status}: \\{\\r?\\n    label:`), status);
  }
  assert.match(source, /<StatusBadge status=\{item\.status\} \/>/);
  assert.match(source, /<StatusBadge status=\{viewItem\.status\} \/>/);
});

test('changing the filter or search goes back to the first page', () => {
  const source = page();
  assert.match(source, /const changeFilter = \(value\) => \{\r?\n    setFilter\(value\);\r?\n    setCurrentPage\(1\);/);
  assert.match(source, /const changeSearch = \(value\) => \{\r?\n    setSearch\(value\);\r?\n    setCurrentPage\(1\);/);
  assert.match(source, /const page = Math\.min\(currentPage, totalPages\)/);
});

test('the modal closes with Escape and the reject form keeps its notes on an outside click', () => {
  const source = page();
  assert.match(source, /event\.key !== 'Escape'/);
  assert.match(source, /aria-label="Close"/);
  assert.match(source, /<div className="absolute inset-0 bg-black\/60 backdrop-blur-sm" \/>/);
});
