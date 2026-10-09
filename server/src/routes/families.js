const express = require('express');
const Family = require('../models/Family');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();
const FAMILY_COST = 5000;

/** GET /api/families/leaderboard — weekly ranking */
router.get('/leaderboard', asyncHandler(async (_req, res) => {
  const families = await Family.find().sort({ weeklyScore: -1 }).limit(50)
    .populate('ownerId', 'username avatar');
  res.json({ families });
}));

/** GET /api/families/mine */
router.get('/mine', requireAuth, asyncHandler(async (req, res) => {
  const family = req.user.familyId ? await Family.findById(req.user.familyId).populate('members', 'username avatar userId level') : null;
  res.json({ family });
}));

/** POST /api/families — create a family (costs 5000 coins) */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { name, logo = '', description = '' } = req.body;
  if (!name) throw new ApiError(400, 'missing_name');
  if (req.user.coins < FAMILY_COST) throw new ApiError(400, 'insufficient_coins', `Creating a family costs ${FAMILY_COST} coins`);
  if (await Family.findOne({ name })) throw new ApiError(409, 'name_taken');
  req.user.coins -= FAMILY_COST;
  const family = await Family.create({ name, logo, description, ownerId: req.user._id, members: [req.user._id] });
  req.user.familyId = family._id;
  await req.user.save();
  res.status(201).json({ family });
}));

/** POST /api/families/:id/join — request to join */
router.post('/:id/join', requireAuth, asyncHandler(async (req, res) => {
  const family = await Family.findById(req.params.id);
  if (!family) throw new ApiError(404, 'family_not_found');
  if (!family.joinRequests.some((u) => String(u) === String(req.user._id))) {
    family.joinRequests.push(req.user._id);
    await family.save();
  }
  res.json({ ok: true, pending: true });
}));

/** POST /api/families/:id/approve — owner approves a join request */
router.post('/:id/approve', requireAuth, asyncHandler(async (req, res) => {
  const family = await Family.findById(req.params.id);
  if (!family) throw new ApiError(404, 'family_not_found');
  if (String(family.ownerId) !== String(req.user._id)) throw new ApiError(403, 'not_owner');
  const { userId } = req.body;
  family.joinRequests = family.joinRequests.filter((u) => String(u) !== String(userId));
  if (!family.members.some((u) => String(u) === String(userId))) family.members.push(userId);
  await family.save();
  await User.findByIdAndUpdate(userId, { familyId: family._id });
  res.json({ family });
}));

module.exports = router;
