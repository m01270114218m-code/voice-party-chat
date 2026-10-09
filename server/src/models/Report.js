const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['user', 'room', 'message'], required: true },
  targetId: { type: String, required: true },
  category: { type: String, default: 'other' },
  reason: { type: String, default: '' },
  images: [{ type: String }],
  chatLog: [{ type: mongoose.Schema.Types.Mixed }],
  status: { type: String, enum: ['open', 'reviewing', 'resolved', 'rejected'], default: 'open', index: true },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
