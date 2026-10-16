/**
 * Profanity + PII filter.
 * - Masks banned words with ****
 * - Masks phone numbers and emails
 * - Detects hate-speech / extortion / impersonation keywords for reporting
 */
const BANNED = [
  // Arabic
  'كلب', 'حمار', 'غبي', 'قذر', 'خرا', 'زبالة', 'لعنة', 'تافه',
  // English
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'idiot', 'stupid', 'dick',
];

const HATE = ['اكره', 'اقتل', 'موت', 'hate', 'kill', 'die'];
const EXTORT = ['ابتزاز', 'افضحك', 'صورك', 'blackmail', 'leak', 'expose'];
const IMPERSONATE = ['انتحال', 'انا المدير', 'impersonate', 'i am admin'];

const PHONE_RE = /(\+?\d[\d\s\-]{7,}\d)/g;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

function maskWord(text, word) {
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return text.replace(re, (m) => '*'.repeat(m.length));
}

function filterText(text = '') {
  let out = String(text);
  for (const w of BANNED) out = maskWord(out, w);
  out = out.replace(PHONE_RE, (m) => '*'.repeat(m.length));
  out = out.replace(EMAIL_RE, (m) => '*'.repeat(m.length));
  return out;
}

function classify(text = '') {
  const t = String(text).toLowerCase();
  const flags = [];
  if (HATE.some((w) => t.includes(w))) flags.push('hate_speech');
  if (EXTORT.some((w) => t.includes(w))) flags.push('extortion');
  if (IMPERSONATE.some((w) => t.includes(w))) flags.push('impersonation');
  if (BANNED.some((w) => t.includes(w))) flags.push('profanity');
  return { clean: filterText(text), flags, blocked: flags.includes('hate_speech') || flags.includes('extortion') };
}

module.exports = { filterText, classify, BANNED };
