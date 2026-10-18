const rateLimit = require('express-rate-limit');
const { getRedis } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Anti-DDoS / rate limiting.
 * - Global limiter on the whole API
 * - Strict limiter on auth + payment routes
 * - Auto-ban an IP for 15 minutes after repeated abuse (Redis-backed)
 */
const BAN_SECONDS = 15 * 60;

async function isBanned(ip) {
  try {
    const redis = getRedis();
    return (await redis.get(`ban:${ip}`)) != null;
  } catch (_) { return false; }
}

async function banIp(ip, reason = 'rate_limit') {
  try {
    const redis = getRedis();
    await redis.set(`ban:${ip}`, reason, 'EX', BAN_SECONDS);
    logger.warn(`IP auto-banned for ${BAN_SECONDS}s: ${ip} (${reason})`);
  } catch (_) { /* ignore */ }
}

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await banIp(req.ip, 'global_rate_limit');
    res.status(429).json({ error: 'too_many_requests', retryAfter: BAN_SECONDS });
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await banIp(req.ip, 'auth_rate_limit');
    res.status(429).json({ error: 'too_many_auth_attempts', retryAfter: BAN_SECONDS });
  },
});

/** Middleware that rejects already-banned IPs before they reach a route. */
async function banGuard(req, res, next) {
  if (await isBanned(req.ip)) {
    return res.status(403).json({ error: 'ip_banned', retryAfter: BAN_SECONDS });
  }
  next();
}

module.exports = { globalLimiter, authLimiter, banGuard, banIp, isBanned, BAN_SECONDS };
