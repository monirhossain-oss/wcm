import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));

const sourceFiles = (directory) => readdirSync(directory).flatMap((entry) => {
  const target = path.join(directory, entry);
  if (statSync(target).isDirectory()) return sourceFiles(target);
  return /\.(js|jsx|mjs)$/.test(entry) ? [target] : [];
});

// UTF-8 text decoded as Windows-1252 and re-saved leaves these signatures: "é" becomes "Ã©" and the
// typographic apostrophe becomes "â€™". Neither can occur in correctly stored French, while the bare
// "â" of "grâce" is followed by an ASCII letter and so is not matched here.
const MOJIBAKE = /Ã[-ÿ]|â€|Â[ -¿]/;

test('no source file carries double-encoded French text', () => {
  const damaged = [];
  for (const file of sourceFiles(src)) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (MOJIBAKE.test(line)) damaged.push(`${path.relative(src, file)}:${index + 1}`);
    });
  }
  assert.deepEqual(damaged, [], `double-encoded text found in: ${damaged.join(', ')}`);
});

test('the French catalog keeps its accented characters', () => {
  const catalog = readFileSync(new URL('../src/lib/i18n/catalogs/fr.js', import.meta.url), 'utf8');
  for (const expected of ['Fermer la fenêtre', 'accéder à votre compte', 'Créer un compte', 'grâce']) {
    assert.ok(catalog.includes(expected), expected);
  }
});
