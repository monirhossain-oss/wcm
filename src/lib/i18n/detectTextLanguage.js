// Which authoring language a piece of creator text is written in: 'en', 'fr', or null when it cannot
// be told with confidence.
//
// A listing and a profile bio are filed in the language of the page they were typed on, so French
// typed on the English page lands in the English master (and English typed on the French page becomes
// the creator's "French"). The forms use this to notice the mismatch and ask the creator before saving.
// It never decides on its own: null means "don't ask", and the page's language is used as before.
//
// Only English and French, the authoring languages (wcm-server/src/constants/authoringLanguages.js).
// Deliberately simple and local — no provider call — so it costs nothing and answers while typing.

// Short words that are common in one language and rare in the other. Words both languages share
// ("a", "on", "son", "plus", "main", "pour", "par") are left out: they would only add noise.
const FRENCH_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'est', 'en', 'dans', 'avec', 'sur', 'au',
  'aux', 'ce', 'cet', 'cette', 'ces', 'qui', 'que', 'ou', 'où', 'mais', 'pas', 'ne', 'sont', 'nous',
  'vous', 'je', 'il', 'elle', 'ils', 'elles', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'sa', 'ses',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'très', 'fait', 'faite', 'être', 'été', 'chaque',
  'aussi', 'entre', 'comme', 'depuis', 'chez', 'sans', 'sous',
]);

const ENGLISH_WORDS = new Set([
  'the', 'and', 'is', 'are', 'was', 'were', 'of', 'to', 'in', 'with', 'for', 'this', 'that', 'these',
  'those', 'it', 'its', 'by', 'from', 'our', 'we', 'you', 'your', 'my', 'i', 'he', 'she', 'they',
  'their', 'has', 'have', 'had', 'be', 'been', 'will', 'can', 'not', 'at', 'an', 'which', 'who',
  'each', 'every', 'made', 'handmade', 'also', 'into', 'about', 'since', 'without', 'under',
]);

// Letters French uses and English words almost never do (a borrowed "café" in English text is
// outweighed by the English around it).
const FRENCH_LETTERS = /[éèêëàâçùûîïôœ]/;
// l'atelier, d'Afrique, qu'il, c'est, n'est, j'ai, s'il…
const FRENCH_ELISION = /^(?:l|d|j|qu|c|n|s|m|t)['’]\p{L}/u;

// Below this many words there is too little to go on.
const MIN_WORDS = 4;
// The winning language needs at least this many signals…
const MIN_SIGNALS = 3;
// …and at least this many times the other language's.
const MIN_RATIO = 2;

export const detectTextLanguage = (text) => {
  if (typeof text !== 'string') return null;
  const words = text.toLowerCase().match(/\p{L}+(?:['’]\p{L}+)*/gu) || [];
  if (words.length < MIN_WORDS) return null;

  let french = 0;
  let english = 0;
  for (const word of words) {
    if (FRENCH_ELISION.test(word) || FRENCH_WORDS.has(word) || FRENCH_LETTERS.test(word)) french += 1;
    if (ENGLISH_WORDS.has(word)) english += 1;
  }

  if (french >= MIN_SIGNALS && french >= english * MIN_RATIO) return 'fr';
  if (english >= MIN_SIGNALS && english >= french * MIN_RATIO) return 'en';
  return null;
};

export default detectTextLanguage;
