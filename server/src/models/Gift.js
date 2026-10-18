const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '' },        // static preview (3D render)
  svgaFile: { type: String, default: '' },    // animated SVGA asset URL
  lottieFile: { type: String, default: '' },  // fallback Lottie JSON
  price: { type: Number, required: true },    // in coins
  category: { type: String, default: 'popular', index: true },
  animationDuration: { type: Number, default: 3000 },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  isFullscreen: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gift', giftSchema);
