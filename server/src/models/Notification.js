const mongoose = require('mongoose');

/** Global push notifications sent from the admin dashboard. */
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  audience: { type: String, enum: ['all', 'vip', 'resellers', 'specific'], default: 'all' },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deliveredCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
