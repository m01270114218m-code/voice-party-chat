const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Transaction = require('../models/Transaction');
const Report = require('../models/Report');
const Withdrawal = require('../models/Withdrawal');
const Device = require('../models/Device');
const Notification = require('../models/Notification');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');
const { sendBulk } = require('../services/pushService');

const router = express.Router();
router.use(requireAuth, requireRole('admin', 'owner'));

/** GET /api/admin/stats — dashboard KPIs */
router.get('/stats', asyncHandler(async (_req, res) => {
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000);
  const [activeUsers, openRooms, totalUsers, revenueAgg, pendingWithdrawals, openReports] = await Promise.all([
    User.countDocuments({ lastSeen: { $gte: dayAgo } }),
    Room.countDocuments({ isLive: true }),
    User.countDocuments(),
    Transaction.aggregate([{ $match: { type: 'recharge', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Withdrawal.countDocuments({ status: 'pending' }),
    Report.countDocuments({ status: 'open' }),
  ]);
  res.json({
    activeUsers, openRooms, totalUsers,
    revenueCoins: revenueAgg[0]?.total || 0,
    pendingWithdrawals, openReports,
  });
}));

/** GET /api/admin/users — paginated user list */
router.get('/users', asyncHandler(async (req, res) => {
  const { q, limit = 50, page = 1 } = req.query;
  const filter = q ? { $or: [{ username: new RegExp(q, 'i') }, { userId: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] } : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit, 10));
  res.json({ users: users.map((u) => u.toPublic()) });
}));

/** POST /api/admin/users/:id/ban — ban an account */
router.post('/users/:id/ban', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true, banReason: req.body.reason || 'policy_violation' }, { new: true });
  if (!user) throw new ApiError(404, 'user_not_found');
  res.json({ user: user.toPublic() });
}));

/** POST /api/admin/users/:id/unban */
router.post('/users/:id/unban', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false, banReason: '' }, { new: true });
  res.json({ user: user?.toPublic() });
}));

/** POST /api/admin/ban-device — ban by device ID / IP */
router.post('/ban-device', asyncHandler(async (req, res) => {
  const { deviceId, ip, reason = 'abuse' } = req.body;
  const rec = await Device.create({ deviceId, ip, isBanned: true, reason });
  res.status(201).json({ device: rec });
}));

/** GET /api/admin/rooms — all rooms */
router.get('/rooms', asyncHandler(async (_req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 }).limit(200).populate('ownerId', 'username userId');
  res.json({ rooms });
}));

/** POST /api/admin/rooms/:id/close */
router.post('/rooms/:id/close', asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { isLive: false }, { new: true });
  res.json({ room });
}));

/** GET /api/admin/withdrawals — payout queue */
router.get('/withdrawals', asyncHandler(async (_req, res) => {
  const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).populate('userId', 'username userId');
  res.json({ withdrawals });
}));

/** POST /api/admin/withdrawals/:id/decide — approve / reject */
router.post('/withdrawals/:id/decide', asyncHandler(async (req, res) => {
  const { approve, note = '' } = req.body;
  const w = await Withdrawal.findById(req.params.id);
  if (!w) throw new ApiError(404, 'withdrawal_not_found');
  w.status = approve ? 'approved' : 'rejected';
  w.note = note;
  w.handledBy = req.user._id;
  await w.save();
  if (!approve) await User.findByIdAndUpdate(w.userId, { $inc: { diamonds: w.diamonds } });
  res.json({ withdrawal: w });
}));

/** GET /api/admin/reports */
router.get('/reports', asyncHandler(async (_req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 }).populate('reporterId', 'username userId');
  res.json({ reports });
}));

/** POST /api/admin/reports/:id/resolve */
router.post('/reports/:id/resolve', asyncHandler(async (req, res) => {
  const r = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status || 'resolved', handledBy: req.user._id }, { new: true });
  res.json({ report: r });
}));

/** POST /api/admin/notify — broadcast a push notification */
router.post('/notify', asyncHandler(async (req, res) => {
  const { title, body, audience = 'all' } = req.body;
  const filter = audience === 'vip' ? { vipTier: { $ne: 'none' } } : audience === 'resellers' ? { role: 'reseller' } : {};
  const users = await User.find({ ...filter, fcmToken: { $ne: '' } }).select('fcmToken');
  await sendBulk(users.map((u) => u.fcmToken), title, body);
  const notif = await Notification.create({ title, body, audience, sentBy: req.user._id, deliveredCount: users.length });
  res.status(201).json({ notification: notif });
}));

module.exports = router;
