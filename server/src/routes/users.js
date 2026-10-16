const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();

/** GET /api/users/search?q= — search by name / ID */
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ users: [] });
  const users = await User.find({ $or: [{ username: new RegExp(q, 'i') }, { userId: new RegExp(q, 'i') }] }).limit(30);
  res.json({ users: users.map((u) => u.toPublic()) });
}));

/** GET /api/users/:id — public profile */
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'user_not_found');
  res.json({ user: user.toPublic() });
}));

/** PUT /api/users/me — update profile */
router.put('/me', requireAuth, asyncHandler(async (req, res) => {
  const allowed = ['username', 'bio', 'avatar', 'avatarFrame', 'chatBubble', 'entryEffect', 'country', 'settings'];
  for (const k of allowed) if (req.body[k] !== undefined) req.user[k] = req.body[k];
  await req.user.save();
  res.json({ user: req.user.toPublic() });
}));

/** POST /api/users/me/block/:id — block a user */
router.post('/me/block/:id', requireAuth, asyncHandler(async (req, res) => {
  if (!req.user.blockedUsers.some((u) => String(u) === req.params.id)) req.user.blockedUsers.push(req.params.id);
  await req.user.save();
  res.json({ blocked: req.user.blockedUsers });
}));

/** POST /api/users/me/delete — GDPR account deletion (14-day grace) */
router.post('/me/delete', requireAuth, asyncHandler(async (req, res) => {
  req.user.deletionRequestedAt = new Date();
  await req.user.save();
  res.json({ ok: true, graceDays: 14, scheduledFor: new Date(Date.now() + 14 * 24 * 3600 * 1000) });
}));

/** POST /api/users/me/delete/cancel — cancel a pending deletion */
router.post('/me/delete/cancel', requireAuth, asyncHandler(async (req, res) => {
  req.user.deletionRequestedAt = null;
  await req.user.save();
  res.json({ ok: true });
}));

module.exports = router;
