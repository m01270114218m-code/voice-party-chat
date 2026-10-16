const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  logo: { type: String, default: '' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  weeklyScore: { type: Number, default: 0, index: true },
  totalScore: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Family', familySchema);
