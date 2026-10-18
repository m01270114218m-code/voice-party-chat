const mongoose = require('mongoose');

const pkBattleSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  hostA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  durationSec: { type: Number, default: 300 }, // 5 minutes
  startedAt: { type: Date, default: Date.now },
  endsAt: { type: Date },
  status: { type: String, enum: ['active', 'finished', 'cancelled'], default: 'active', index: true },
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  supporters: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, side: String, coins: Number }],
}, { timestamps: true });

module.exports = mongoose.model('PkBattle', pkBattleSchema);
