const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['recharge', 'gift_sent', 'gift_received', 'withdrawal', 'reseller_transfer', 'diamond_convert', 'game_reward', 'luck_box'],
    required: true, index: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['coins', 'diamonds', 'usd'], default: 'coins' },
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', default: null },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  provider: { type: String, default: '' },   // stripe | paymob | google_play | apple | reseller
  providerRef: { type: String, default: '' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
