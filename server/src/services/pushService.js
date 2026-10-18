const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Push notification service (Firebase Cloud Messaging).
 * Falls back to logging when FCM is not configured.
 */
async function sendPush({ token, title, body, data = {} }) {
  if (!env.fcm.serverKey || !token) {
    logger.info(`[push:dev] → ${title}: ${body}`);
    return { ok: true, mock: true };
  }
  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${env.fcm.serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: token, notification: { title, body }, data }),
    });
    return { ok: res.ok };
  } catch (e) {
    logger.error('push failed:', e.message);
    return { ok: false };
  }
}

async function sendBulk(tokens = [], title, body) {
  return Promise.all(tokens.map((t) => sendPush({ token: t, title, body })));
}

module.exports = { sendPush, sendBulk };
