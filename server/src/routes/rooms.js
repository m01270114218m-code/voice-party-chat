const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { buildToken } = require('../services/agoraService');

const router = express.Router();

/** GET /api/rooms — list live rooms, filter by category / search */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { category, q, limit = 40 } = req.query;
  const filter = { isLive: true };
  if (category && category !== 'all') filter.category = category;
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { code: new RegExp(q, 'i') }];
  const rooms = await Room.find(filter)
    .sort({ totalGifts: -1, createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate('ownerId', 'username avatar vipTier level userId')
    .lean();
  res.json({ rooms: rooms.map((r) => ({ ...r, listenerCount: (r.listeners || []).length })) });
}));

/** GET /api/rooms/:id — room detail */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('ownerId', 'username avatar vipTier level userId')
    .populate('seats.userId', 'username avatar vipTier level userId');
  if (!room) throw new ApiError(404, 'room_not_found');
  res.json({ room });
}));

/** POST /api/rooms — create a room (creator becomes owner + host on seat 0) */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { name, category = 'chat', isPrivate = false, password = '', coverImage = '' } = req.body;
  if (!name) throw new ApiError(400, 'missing_name');
  const room = await Room.create({
    name, category, isPrivate, password, coverImage,
    ownerId: req.user._id,
    seats: Array.from({ length: 10 }, (_, i) => ({ index: i, userId: i === 0 ? req.user._id : null })),
    listeners: [req.user._id],
  });
  res.status(201).json({ room });
}));

/** POST /api/rooms/:id/join — join a room, returns an Agora RTC token */
router.post('/:id/join', requireAuth, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).select('+password');
  if (!room) throw new ApiError(404, 'room_not_found');
  if (room.isPrivate && room.password && room.password !== req.body.password) {
    throw new ApiError(403, 'wrong_password');
  }
  if (room.bannedUsers.some((u) => String(u) === String(req.user._id))) {
    throw new ApiError(403, 'banned_from_room');
  }
  if (!room.listeners.some((u) => String(u) === String(req.user._id))) {
    room.listeners.push(req.user._id);
    await room.save();
  }
  const uid = Math.floor(Math.random() * 100000) + 1;
  const rtc = buildToken({ channel: room.agoraChannel, uid, role: 'publisher' });
  res.json({ room, rtc, uid });
}));

/** POST /api/rooms/:id/rtc-token — refresh an RTC token mid-session */
router.post('/:id/rtc-token', requireAuth, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'room_not_found');
  const uid = req.body.uid || Math.floor(Math.random() * 100000) + 1;
  const rtc = buildToken({ channel: room.agoraChannel, uid, role: req.body.role || 'publisher' });
  res.json(rtc);
}));

/** POST /api/rooms/:id/leave */
router.post('/:id/leave', requireAuth, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'room_not_found');
  room.listeners = room.listeners.filter((u) => String(u) !== String(req.user._id));
  room.seats.forEach((s) => { if (String(s.userId) === String(req.user._id)) s.userId = null; });
  await room.save();
  res.json({ ok: true });
}));

/** GET /api/rooms/mine/list — rooms owned by the current user */
router.get('/mine/list', requireAuth, asyncHandler(async (req, res) => {
  const rooms = await Room.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json({ rooms });
}));

module.exports = router;
