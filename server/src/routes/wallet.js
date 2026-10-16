const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { getPackages, createCheckout, verifyWebhook } = require('../services/paymentService');

const router = express.Router();

/** GET /api/wallet/balance */
router.get('/balance', requireAuth, asyncHandler(async (req, res) => {
  res.json({ coins: req.user.coins, diamonds: req.user.diamonds });
}));

/** GET /api/wallet/packages — recharge catalog */
router.get('/packages', asyncHandler(async (_req, res) => res.json({ packages: getPackages() })));

/** POST /api/wallet/recharge — create a checkout for a coin package */
router.post('/recharge', requireAuth, asyncHandler(async (req, res) => {
  const { provider = 'stripe', packageId } = req.body;
  const checkout = await createCheckout({ provider, packageId, userId: req.user._id });
  await Transaction.create({
    userId: req.user._id, type: 'recharge', amount: checkout.coins,
    currency: 'coins', status: 'pending', provider, providerRef: packageId,
  });
  res.json(checkout);
}));

/** POST /api/wallet/webhook/:provider — payment provider callback */
router.post('/webhook/:provider', asyncHandler(async (req, res) => {
  const { provider } = req.params;
  if (!verifyWebhook(provider, req.body, req.headers['stripe-signature'])) {
    throw new ApiError(400, 'invalid_signature');
  }
  const { userId, coins, providerRef } = req.body;
  if (userId && coins) {
    await User.findByIdAndUpdate(userId, { $inc: { coins } });
    await Transaction.create({ userId, type: 'recharge', amount: coins, currency: 'coins', status: 'completed', provider, providerRef });
  }
  res.json({ received: true });
}));

/** POST /api/wallet/convert — convert diamonds → coins */
router.post('/convert', requireAuth, asyncHandler(async (req, res) => {
  const { diamonds } = req.body;
  if (!diamonds || diamonds <= 0) throw new ApiError(400, 'invalid_amount');
  if (req.user.diamonds < diamonds) throw new ApiError(400, 'insufficient_diamonds');
  const coins = diamonds * 2; // 1 diamond → 2 coins
  req.user.diamonds -= diamonds;
  req.user.coins += coins;
  await req.user.save();
  await Transaction.create({ userId: req.user._id, type: 'diamond_convert', amount: coins, currency: 'coins', meta: { diamonds } });
  res.json({ coins: req.user.coins, diamonds: req.user.diamonds });
}));

/** POST /api/wallet/withdraw — request a payout of diamonds */
router.post('/withdraw', requireAuth, asyncHandler(async (req, res) => {
  const { diamonds, method = 'bank', accountInfo = '' } = req.body;
  if (!diamonds || diamonds < 1000) throw new ApiError(400, 'min_withdrawal_1000');
  if (req.user.diamonds < diamonds) throw new ApiError(400, 'insufficient_diamonds');
  const amountUsd = +(diamonds / 1000 * 5).toFixed(2); // 1000 diamonds = $5
  req.user.diamonds -= diamonds;
  await req.user.save();
  const w = await Withdrawal.create({ userId: req.user._id, diamonds, amountUsd, method, accountInfo });
  await Transaction.create({ userId: req.user._id, type: 'withdrawal', amount: diamonds, currency: 'diamonds', status: 'pending', meta: { amountUsd } });
  res.status(201).json({ withdrawal: w });
}));

/** GET /api/wallet/transactions */
router.get('/transactions', requireAuth, asyncHandler(async (req, res) => {
  const txs = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ transactions: txs });
}));

module.exports = router;
