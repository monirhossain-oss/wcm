import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The profile bio is written in the language of the page it is edited on; the server derives the
// other language. These checks cover the form's half of that contract.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const client = () =>
  readFileSync(path.join(SRC, 'app', '(public)', 'profile', 'OwnProfileClient.jsx'), 'utf8');

test('the bio is no longer English-only', () => {
  const source = client();
  assert.doesNotMatch(source, /English only/);
  assert.doesNotMatch(source, /anglais uniquement/);
  assert.match(source, /Rédigez en français\. La version anglaise est générée automatiquement\./);
});

test('a save tells the server which language the bio was written in', () => {
  assert.match(client(), /formData\.append\('sourceLanguage', locale\)/);
});

// Sent back untouched in French, the bio would read as a French rewrite and reach the English master.
test('the bio is sent only when it was edited', () => {
  const source = client();
  assert.match(source, /const bioEdited = \(data\.bio \|\| ''\)\.trim\(\) !== shownBio\.trim\(\)/);
  assert.match(source, /\.filter\(\(field\) => field !== 'bio' \|\| bioEdited\)/);
});

test('in another language the form edits the owner\'s own version, not the English master', () => {
  const source = client();
  assert.match(source, /localizedProfile\?\.editableBio/);
  assert.match(source, /bio: shownBio,/);
});

test('the profile language is a choice between English and French that keeps an older value', () => {
  const source = client();
  assert.match(source, /<LanguageSelect /);
  assert.doesNotMatch(source, /<InputField[^>]*name="language"/);
  assert.match(source, /value: 'English', label: \{ en: 'English', fr: 'Anglais' \}/);
  assert.match(source, /value: 'French', label: \{ en: 'French', fr: 'Français' \}/);
  assert.match(source, /\{legacy && <option value=\{legacy\}>\{legacy\}<\/option>\}/);
});
