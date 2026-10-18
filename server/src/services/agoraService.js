const { RtcTokenBuilder, RtcRole } = require('agora-token');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Agora RTC token service.
 * The App Certificate NEVER leaves the server — clients only ever receive a
 * short-lived token scoped to a single channel + uid.
 */
function buildToken({ channel, uid, role = 'publisher' }) {
  if (!env.agora.appId || !env.agora.appCertificate) {
    logger.warn('Agora credentials missing — returning a dev placeholder token');
    return { token: 'dev-token', appId: env.agora.appId || 'dev-app-id', expiresIn: env.agora.tokenTtl };
  }
  const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const expireAt = Math.floor(Date.now() / 1000) + env.agora.tokenTtl;
  const token = RtcTokenBuilder.buildTokenWithUid(
    env.agora.appId, env.agora.appCertificate, channel, uid, rtcRole, expireAt, expireAt,
  );
  return { token, appId: env.agora.appId, expiresIn: env.agora.tokenTtl };
}

module.exports = { buildToken };
