const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Google Cloud Translation wrapper.
 * Falls back to a passthrough when no API key is configured so the UI's
 * "translate" button still works in dev.
 */
async function translate(text, target = 'en', source = 'auto') {
  if (!text) return '';
  if (!env.translate.apiKey) {
    return `[${target}] ${text}`; // dev passthrough marker
  }
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${env.translate.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target, source, format: 'text' }),
    });
    const data = await res.json();
    return data?.data?.translations?.[0]?.translatedText || text;
  } catch (e) {
    logger.error('translate failed:', e.message);
    return text;
  }
}

module.exports = { translate };
