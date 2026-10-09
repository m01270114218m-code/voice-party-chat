const express = require('express');
const Report = require('../models/Report');
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();

const FAQ = [
  { q: 'كيف أشحن العملات؟', a: 'من المحفظة → تبويب العملات الذهبية → اختر باقة → ادفع عبر Google Play / Apple / Stripe.' },
  { q: 'كيف أحول الماس إلى أرباح؟', a: 'المحفظة → تبويب الماس → طلب سحب، بحد أدنى 1000 ماسة.' },
  { q: 'كيف أحذف حسابي؟', a: 'الإعدادات → الخصوصية → طلب حذف الحساب (مهلة 14 يوماً).' },
  { q: 'كيف أصبح مضيفاً؟', a: 'اضغط زر (+) في الرئيسية لإنشاء غرفة، وستكون المالك والمضيف على المقعد 1.' },
];

/** GET /api/support/faq */
router.get('/faq', asyncHandler(async (_req, res) => res.json({ faq: FAQ })));

/** POST /api/support/tickets — open a support ticket */
router.post('/tickets', requireAuth, asyncHandler(async (req, res) => {
  const { subject, category = 'general', body = '', images = [] } = req.body;
  if (!subject) throw new ApiError(400, 'missing_subject');
  const ticket = await Ticket.create({ userId: req.user._id, subject, category, body, images });
  res.status(201).json({ ticket });
}));

/** GET /api/support/tickets — my tickets */
router.get('/tickets', requireAuth, asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ tickets });
}));

/** POST /api/support/report — report a user / room, attaching the chat log */
router.post('/report', requireAuth, asyncHandler(async (req, res) => {
  const { targetType, targetId, category = 'other', reason = '', images = [] } = req.body;
  if (!targetType || !targetId) throw new ApiError(400, 'missing_target');
  // Attach the last messages of the room as evidence.
  let chatLog = [];
  if (targetType === 'room') {
    chatLog = await Message.find({ roomId: targetId }).sort({ createdAt: -1 }).limit(50).lean();
  }
  const report = await Report.create({ reporterId: req.user._id, targetType, targetId, category, reason, images, chatLog });
  res.status(201).json({ report });
}));

module.exports = router;
