const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  text: { type: String, default: '' },
  images: [{ type: String }],
  audioUrl: { type: String, default: '' },
  roomCard: {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    name: { type: String, default: '' },
    cover: { type: String, default: '' },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isRecommended: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
