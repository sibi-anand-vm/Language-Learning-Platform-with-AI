const levenshtein = require('fast-levenshtein');

function calculateAccuracy(word, transcribedText) {
  const distance = levenshtein.get(word.toLowerCase(), transcribedText.toLowerCase());
  const maxLength = Math.max(word.length, transcribedText.length);
  const accuracy = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.min(accuracy, 100));
}

module.exports = { calculateAccuracy };