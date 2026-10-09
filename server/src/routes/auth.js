const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signTokens, verifyRefresh, requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { authLimiter } = require('../middleware/rateLimit');
const { issueOtp, verifyOtp } = require('../services/otpService');
const { verifyGoogleIdToken } = require('../services/googleService');

const router = express.Router();

/** POST /api/auth/register — email + password */
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) throw new ApiError(400, 'missing_fields');
  if (await User.findOne({ email })) throw new ApiError(409, 'email_taken');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash, coins: 100 });
  const tokens = signTokens(user);
  res.json({ ...tokens, user: user.toPublic() });
}));

/** POST /api/auth/login — email + password */
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.passwordHash) throw new ApiError(401, 'invalid_credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'invalid_credentials');
  if (user.isBanned) throw new ApiError(403, 'account_banned');
  const tokens = signTokens(user);
  res.json({ ...tokens, user: user.toPublic() });
}));

/** POST /api/auth/otp/request — send OTP to a phone number */
router.post('/otp/request', authLimiter, asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) throw new ApiError(400, 'missing_phone');
  const result = await issueOtp(phone);
  res.json(result);
}));

/** POST /api/auth/otp/verify — verify OTP, create-or-login the user */
router.post('/otp/verify', authLimiter, asyncHandler(async (req, res) => {
  const { phone, code, username } = req.body;
  const ok = await verifyOtp(phone, code);
  if (!ok) throw new ApiError(401, 'invalid_otp');
  let user = await User.findOne({ phone });
  if (!user) user = await User.create({ phone, username: username || `user_${phone.slice(-4)}`, coins: 100 });
  const tokens = signTokens(user);
  res.json({ ...tokens, user: user.toPublic() });
}));

/** POST /api/auth/google — verify a Google ID token */
router.post('/google', authLimiter, asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const profile = await verifyGoogleIdToken(idToken);
  let user = await User.findOne({ $or: [{ googleId: profile.googleId }, { email: profile.email }] });
  if (!user) {
    user = await User.create({
      googleId: profile.googleId, email: profile.email,
      username: profile.name || 'Google User', avatar: profile.picture || '', coins: 100,
    });
  }
  const tokens = signTokens(user);
  res.json({ ...tokens, user: user.toPublic() });
}));

/** POST /api/auth/guest — limited-permission guest session */
router.post('/guest', authLimiter, asyncHandler(async (req, res) => {
  const user = await User.create({
    username: `Guest_${Math.floor(1000 + Math.random() * 9000)}`,
    isGuest: true, coins: 0,
  });
  const tokens = signTokens(user);
  res.json({ ...tokens, user: user.toPublic() });
}));

/** POST /api/auth/refresh — exchange a refresh token for a new access token */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'missing_refresh_token');
  const decoded = verifyRefresh(refreshToken);
  const user = await User.findById(decoded.sub);
  if (!user) throw new ApiError(401, 'user_not_found');
  const tokens = signTokens(user);
  res.json(tokens);
}));

/** GET /api/auth/me — current user */
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
}));

/** POST /api/auth/logout — client-side token discard (stateless JWT) */
router.post('/logout', requireAuth, asyncHandler(async (_req, res) => res.json({ ok: true })));

module.exports = router;
