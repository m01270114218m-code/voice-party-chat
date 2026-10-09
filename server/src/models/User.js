const mongoose = require('mongoose');
const { newUserId } = require('../utils/ids');

const VipTier = ['none', 'silver', 'gold', 'diamond'];
const Role = ['user', 'reseller', 'moderator', 'admin', 'owner'];

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true, default: newUserId },
  username: { type: String, required: true, trim: true, index: true },
  email: { type: String, lowercase: true, sparse: true, index: true },
  phone: { type: String, sparse: true, index: true },
  passwordHash: { type: String, select: false },
  googleId: { type: String, sparse: true },
  isGuest: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  avatarFrame: { type: String, default: '' },
  chatBubble: { type: String, default: '' },
  entryEffect: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 200 },
  country: { type: String, default: '' },
  role: { type: String, enum: Role, default: 'user', index: true },

  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  vipTier: { type: String, enum: VipTier, default: 'none', index: true },
  vipExpiresAt: { type: Date },

  coins: { type: Number, default: 0 },        // purchased currency
  diamonds: { type: Number, default: 0 },     // earned from gifts
  wealthLevel: { type: Number, default: 1 },  // supporter matrix
  talentLevel: { type: Number, default: 1 },  // talent matrix
  totalSpent: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },

  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  badges: [{ type: String }],
  ownedItems: [{ type: String }],

  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  fcmToken: { type: String, default: '' },
  deviceIds: [{ type: String }],
  lastIp: { type: String, default: '' },

  isBanned: { type: Boolean, default: false, index: true },
  banReason: { type: String, default: '' },
  deletionRequestedAt: { type: Date, default: null }, // GDPR 14-day grace

  settings: {
    notifications: { type: Boolean, default: true },
    audioQuality: { type: String, enum: ['low', 'medium', 'high'], default: 'high' },
    language: { type: String, default: 'ar' },
  },

  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.methods.toPublic = function () {
  return {
    _id: this._id, userId: this.userId, username: this.username,
    avatar: this.avatar, avatarFrame: this.avatarFrame, bio: this.bio,
    level: this.level, xp: this.xp, vipTier: this.vipTier,
    coins: this.coins, diamonds: this.diamonds,
    wealthLevel: this.wealthLevel, talentLevel: this.talentLevel,
    followers: this.followers, following: this.following,
    badges: this.badges, role: this.role, isGuest: this.isGuest,
    familyId: this.familyId, country: this.country,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.VipTier = VipTier;
module.exports.Role = Role;
