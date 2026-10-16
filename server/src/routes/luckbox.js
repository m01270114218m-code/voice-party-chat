const express = require('express');
const LuckBox = require('../models/LuckBox');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();

/** POST /api/luckbox — send a luck box / red envelope into a room */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { roomId, totalCoins, packets = 5, ttlSec = 60 } = req.body;
  if (!totalCoins || totalCoins <= 0) throw new ApiError(400, 'invalid_amount');
  if (req.user.coins < totalCoins) throw new ApiError(400, 'insufficient_coins');
  req.user.coins -= totalCoins;
  await req.user.save();
  const box = await LuckBox.create({
    roomId, senderId: req.user._id, totalCoins, packets,
    expiresAt: new Date(Date.now() + ttlSec * 1000),
  });
  res.status(201).json({ luckBox: box, expiresIn: ttlSec });
}));

/** POST /api/luckbox/:id/claim — claim a share (server-authoritative) */
router.post('/:id/claim', requireAuth, asyncHandler(async (req, res) => {
  const box = await LuckBox.findById(req.params.id);
  if (!box) throw new ApiError(404, 'box_not_found');
  if (box.status !== 'active' || box.expiresAt < new Date()) throw new ApiError(400, 'box_expired');
  if (box.claimedBy.some((c) => String(c.userId) === String(req.user._id))) throw new ApiError(400, 'already_claimed');
  const remainingPackets = box.packets - box.claimedBy.length;
  if (remainingPackets <= 0) { box.status = 'empty'; await box.save(); throw new ApiError(400, 'box_empty'); }
  const claimed = box.claimedBy.reduce((s, c) => s + c.coins, 0);
  const remainingCoins = box.totalCoins - claimed;
  const share = remainingPackets === 1 ? remainingCoins : Math.max(1, Math.floor(Math.random() * (remainingCoins / remainingPackets) * 2));
  box.claimedBy.push({ userId: req.user._id, coins: share, at: new Date() });
  if (box.claimedBy.length >= box.packets) box.status = 'empty';
  await box.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { coins: share } });
  await Transaction.create({ userId: req.user._id, type: 'luck_box', amount: share, currency: 'coins' });
  res.json({ claimed: share });
}));

module.exports = router;
