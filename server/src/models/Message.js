const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', index: true, default: null },
  conversationId: { type: String, index: true, default: null }, // for DMs
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  text: { type: String, default: '' },
  originalText: { type: String, default: '' },
  type: {
    type: String,
    enum: ['text', 'system', 'gift', 'join', 'leave', 'voice', 'image', 'danmaku'],
    default: 'text',
  },
  mediaUrl: { type: String, default: '' },
  durationMs: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', default: null },
  flags: [{ type: String }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
