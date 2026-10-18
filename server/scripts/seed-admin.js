/* eslint-disable no-console */
/**
 * Safely create/update only the demo owner account.
 * Does not delete or reset existing users, rooms, gifts, or posts.
 * Set ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD in the server environment
 * before using this outside a local demo.
 */
const bcrypt = require('bcryptjs');
const { connectDB, mongoose } = require('../src/config/db');
const env = require('../src/config/env');
const User = require('../src/models/User');

async function seedAdmin() {
  await connectDB();
  const passwordHash = await bcrypt.hash(env.admin.password, 12);
  const admin = await User.findOneAndUpdate(
    { $or: [{ username: env.admin.username }, { email: env.admin.email }] },
    {
      $set: {
        username: env.admin.username,
        email: env.admin.email.toLowerCase(),
        passwordHash,
        role: 'owner',
        isGuest: false,
        isBanned: false,
        avatar: 'assets/avatars/avatar_1.png',
      },
      $setOnInsert: {
        coins: 1000000,
        diamonds: 500000,
        vipTier: 'diamond',
        level: 99,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
  console.log('Demo owner account provisioned.');
  console.log('Username:', admin.username);
  console.log('Role:', admin.role);
  console.log('Password is set from ADMIN_PASSWORD (demo default only).');
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error('Unable to provision demo owner account:', error.message);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exitCode = 1;
});
