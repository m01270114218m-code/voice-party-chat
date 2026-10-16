const express = require('express');
const Gift = require('../models/Gift');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { sendGift } = require('../services/giftService');

const router = express.Router();

/** GET /api/gifts — gift catalog */
router.get('/', asyncHandler(async (_req, res) => {
  const gifts = await Gift.find({ isActive: true }).sort({ price: 1 });
  res.json({ gifts });
}));

/** POST /api/gifts/send — send a gift (REST fallback; realtime path is via socket) */
router.post('/send', requireAuth, asyncHandler(async (req, res) => {
  const { giftId, receiverId, quantity = 1, roomId = null } = req.body;
  const result = await sendGift({ senderId: req.user._id, receiverId, giftId, quantity, roomId });
  res.json(result);
}));

module.exports = router;
