const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  diamonds: { type: Number, required: true },
  amountUsd: { type: Number, required: true },
  method: { type: String, default: 'bank' }, // bank | paypal | wallet
  accountInfo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending', index: true },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
