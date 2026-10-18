const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  category: { type: String, default: 'general' },
  body: { type: String, default: '' },
  images: [{ type: String }],
  status: { type: String, enum: ['open', 'pending', 'closed'], default: 'open', index: true },
  replies: [{
    by: { type: String, enum: ['user', 'support'], default: 'support' },
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
