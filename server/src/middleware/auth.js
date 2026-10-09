const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

/** Sign a short-lived access token + long-lived refresh token. */
function signTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });
  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl });
  return { accessToken, refreshToken };
}

function verifyAccess(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}
function verifyRefresh(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

/** Express middleware — requires a valid Bearer access token. */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing_token' });
    const decoded = verifyAccess(token);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'user_not_found' });
    if (user.isBanned) return res.status(403).json({ error: 'account_banned', reason: user.banReason });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

/** Optional auth — attaches req.user when a token is present, never blocks. */
async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      const decoded = verifyAccess(token);
      req.user = await User.findById(decoded.sub);
    }
  } catch (_) { /* ignore */ }
  next();
}

/** Role gate — requireRole('admin') or requireRole('admin','owner'). */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

module.exports = { signTokens, verifyAccess, verifyRefresh, requireAuth, optionalAuth, requireRole };
