const mongoose = require('mongoose');

/** Luck box / red envelope with a server-authoritative countdown. */
const luckBoxSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalCoins: { type: Number, required: true },
  packets: { type: Number, default: 5 },
  claimedBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, coins: Number, at: Date }],
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'empty'], default: 'active', index: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('LuckBox', luckBoxSchema);
