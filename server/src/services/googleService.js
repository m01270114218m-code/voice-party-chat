const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Google OAuth — verifies an ID token issued by Google Sign-In on the client.
 * Uses Google's tokeninfo endpoint (no extra SDK needed).
 */
async function verifyGoogleIdToken(idToken) {
  if (!idToken) throw Object.assign(new Error('missing_id_token'), { status: 400 });
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!res.ok) throw new Error('invalid_token');
    const data = await res.json();
    if (env.google.clientId && data.aud !== env.google.clientId) {
      throw new Error('audience_mismatch');
    }
    return { googleId: data.sub, email: data.email, name: data.name, picture: data.picture };
  } catch (e) {
    logger.error('google verify failed:', e.message);
    throw Object.assign(new Error('google_auth_failed'), { status: 401 });
  }
}

module.exports = { verifyGoogleIdToken };
