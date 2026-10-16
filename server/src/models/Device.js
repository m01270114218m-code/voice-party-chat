const mongoose = require('mongoose');

/** Device / IP ban registry for the admin firewall. */
const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, index: true },
  ip: { type: String, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isBanned: { type: Boolean, default: false, index: true },
  reason: { type: String, default: '' },
  bannedUntil: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
