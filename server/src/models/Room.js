const mongoose = require('mongoose');
const { newRoomCode } = require('../utils/ids');

const seatSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isMuted: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
}, { _id: false });

const roomSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true, default: newRoomCode },
  name: { type: String, required: true, trim: true },
  coverImage: { type: String, default: '' },
  category: {
    type: String,
    enum: ['all', 'games', 'music', 'chat', 'country', 'vip'],
    default: 'chat', index: true,
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seats: { type: [seatSchema], default: [] },
  listeners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bannedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isLive: { type: Boolean, default: true, index: true },
  isPrivate: { type: Boolean, default: false },
  password: { type: String, default: '', select: false },
  agoraChannel: { type: String, index: true },
  totalGifts: { type: Number, default: 0 },
  totalCoins: { type: Number, default: 0 },
  country: { type: String, default: '' },
  pkBattle: { type: mongoose.Schema.Types.ObjectId, ref: 'PkBattle', default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

roomSchema.pre('save', function (next) {
  if (!this.agoraChannel) this.agoraChannel = `room_${this.code}`;
  if (!this.seats || this.seats.length === 0) {
    this.seats = Array.from({ length: 10 }, (_, i) => ({ index: i, userId: null }));
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
