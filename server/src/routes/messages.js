const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { classify } = require('../utils/profanity');

const router = express.Router();

const convId = (a, b) => [String(a), String(b)].sort().join('_');

/** GET /api/messages/conversations — DM inbox with unread counts */
router.get('/conversations', requireAuth, asyncHandler(async (req, res) => {
  const me = String(req.user._id);
  const msgs = await Message.find({ conversationId: new RegExp(me) })
    .sort({ createdAt: -1 }).limit(500)
    .populate('senderId', 'username avatar userId vipTier')
    .populate('receiverId', 'username avatar userId vipTier');
  const map = new Map();
  for (const m of msgs) {
    const other = String(m.senderId?._id) === me ? m.receiverId : m.senderId;
    if (!other) continue;
    const key = String(other._id);
    if (!map.has(key)) {
      map.set(key, { peer: other, lastMessage: m.text, lastAt: m.createdAt, unread: 0 });
    }
    if (String(m.receiverId?._id) === me && !(m.readBy || []).some((u) => String(u) === me)) {
      map.get(key).unread += 1;
    }
  }
  res.json({ conversations: [...map.values()] });
}));

/** GET /api/messages/:peerId — thread with a peer */
router.get('/:peerId', requireAuth, asyncHandler(async (req, res) => {
  const cid = convId(req.user._id, req.params.peerId);
  const msgs = await Message.find({ conversationId: cid }).sort({ createdAt: 1 }).limit(200);
  await Message.updateMany({ conversationId: cid, receiverId: req.user._id }, { $addToSet: { readBy: req.user._id } });
  res.json({ messages: msgs });
}));

/** POST /api/messages/:peerId — send a DM (text / voice / image) */
router.post('/:peerId', requireAuth, asyncHandler(async (req, res) => {
  const { text = '', type = 'text', mediaUrl = '', durationMs = 0 } = req.body;
  const peer = await User.findById(req.params.peerId);
  if (!peer) throw new ApiError(404, 'peer_not_found');
  const { clean, flags, blocked } = classify(text);
  if (blocked) throw new ApiError(400, 'message_blocked', 'Message violates community guidelines');
  const msg = await Message.create({
    conversationId: convId(req.user._id, peer._id),
    senderId: req.user._id, receiverId: peer._id,
    text: clean, originalText: text, type, mediaUrl, durationMs, flags,
  });
  res.status(201).json({ message: msg });
}));

module.exports = router;
