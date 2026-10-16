const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * Redis client with a graceful in-memory fallback.
 * In production REDIS_URL must be set (presence, rate-limit, socket adapter).
 */
let client = null;
let usingFallback = false;

const memory = new Map();
const memoryFallback = {
  async get(k) { return memory.has(k) ? memory.get(k) : null; },
  async set(k, v, mode, ttl) {
    memory.set(k, v);
    if (ttl) setTimeout(() => memory.delete(k), ttl * 1000);
    return 'OK';
  },
  async del(k) { memory.delete(k); return 1; },
  async incr(k) { const v = (parseInt(memory.get(k) || '0', 10) + 1); memory.set(k, String(v)); return v; },
  async expire(k, ttl) { setTimeout(() => memory.delete(k), ttl * 1000); return 1; },
  async keys(p) { const re = new RegExp('^' + p.replace('*', '.*') + '$'); return [...memory.keys()].filter((k) => re.test(k)); },
  async sadd(k, v) { const s = memory.get(k) || new Set(); s.add(v); memory.set(k, s); return 1; },
  async srem(k, v) { const s = memory.get(k) || new Set(); s.delete(v); return 1; },
  async smembers(k) { return [...(memory.get(k) || new Set())]; },
};

function getRedis() {
  if (client) return client;
  if (!env.redisUrl) {
    usingFallback = true;
    logger.warn('REDIS_URL not set — using in-memory fallback (dev only)');
    return memoryFallback;
  }
  client = new Redis(env.redisUrl, { maxRetriesPerRequest: 2, lazyConnect: false });
  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (e) => {
    logger.error(`Redis error: ${e.message}`);
    if (!usingFallback) {
      usingFallback = true;
      logger.warn('Falling back to in-memory store');
    }
  });
  return client;
}

module.exports = { getRedis, isFallback: () => usingFallback };
