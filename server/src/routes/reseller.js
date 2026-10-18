const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();
router.use(requireAuth, requireRole('reseller', 'admin', 'owner'));

/** GET /api/reseller/balance — agent's own coin balance */
router.get('/balance', asyncHandler(async (req, res) => {
  res.json({ coins: req.user.coins, role: req.user.role });
}));

/** POST /api/reseller/transfer — instantly credit a customer by User ID */
router.post('/transfer', asyncHandler(async (req, res) => {
  const { customerUserId, coins } = req.body;
  if (!customerUserId || !coins || coins <= 0) throw new ApiError(400, 'invalid_request');
  if (req.user.coins < coins) throw new ApiError(400, 'insufficient_coins');
  const customer = await User.findOne({ userId: customerUserId });
  if (!customer) throw new ApiError(404, 'customer_not_found');
  req.user.coins -= coins;
  customer.coins += coins;
  await req.user.save();
  await customer.save();
  await Transaction.create({ userId: req.user._id, type: 'reseller_transfer', amount: -coins, currency: 'coins', targetUserId: customer._id, provider: 'reseller' });
  await Transaction.create({ userId: customer._id, type: 'reseller_transfer', amount: coins, currency: 'coins', targetUserId: req.user._id, provider: 'reseller' });
  res.json({ ok: true, customerCoins: customer.coins, agentCoins: req.user.coins });
}));

/** GET /api/reseller/history — transfer log */
router.get('/history', asyncHandler(async (req, res) => {
  const txs = await Transaction.find({ userId: req.user._id, type: 'reseller_transfer' }).sort({ createdAt: -1 }).limit(100).populate('targetUserId', 'username userId');
  res.json({ transactions: txs });
}));

module.exports = router;
