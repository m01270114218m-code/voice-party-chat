/* eslint-disable no-console */
/**
 * Seed script — populates the database with a demo admin, reseller, users,
 * rooms, gifts and posts so the app is immediately usable after install.
 *
 *   npm run seed
 */
const bcrypt = require('bcryptjs');
const { connectDB, mongoose } = require('../src/config/db');
const env = require('../src/config/env');
const User = require('../src/models/User');
const Room = require('../src/models/Room');
const Gift = require('../src/models/Gift');
const Post = require('../src/models/Post');
const Family = require('../src/models/Family');

const GIFTS = [
  { name: 'Rose', icon: 'assets/gifts/rose.png', svgaFile: 'assets/svga/rose.svga', price: 10, category: 'popular', rarity: 'common' },
  { name: 'Heart', icon: 'assets/gifts/heart.png', svgaFile: 'assets/svga/heart.svga', price: 25, category: 'popular', rarity: 'common' },
  { name: 'Teddy Bear', icon: 'assets/gifts/teddy.png', svgaFile: 'assets/svga/teddy.svga', price: 99, category: 'popular', rarity: 'rare' },
  { name: 'Sports Car', icon: 'assets/gifts/car.png', svgaFile: 'assets/svga/car.svga', price: 999, category: 'luxury', rarity: 'epic', isFullscreen: true },
  { name: 'Lion', icon: 'assets/gifts/lion.png', svgaFile: 'assets/svga/lion.svga', price: 1999, category: 'luxury', rarity: 'epic', isFullscreen: true },
  { name: 'Castle', icon: 'assets/gifts/castle.png', svgaFile: 'assets/svga/castle.svga', price: 9999, category: 'legendary', rarity: 'legendary', isFullscreen: true },
  { name: 'Rocket', icon: 'assets/gifts/rocket.png', svgaFile: 'assets/svga/rocket.svga', price: 4999, category: 'legendary', rarity: 'legendary', isFullscreen: true },
  { name: 'Crown', icon: 'assets/gifts/crown.png', svgaFile: 'assets/svga/crown.svga', price: 2999, category: 'luxury', rarity: 'epic', isFullscreen: true },
];

const ROOMS = [
  { name: 'ليلة طربية', category: 'music', coverImage: 'assets/rooms/room_music.png' },
  { name: 'تحدي الألعاب', category: 'games', coverImage: 'assets/rooms/room_games.png' },
  { name: 'دردشة حرة', category: 'chat', coverImage: 'assets/rooms/room_chat.png' },
  { name: 'غرفة مصر', category: 'country', coverImage: 'assets/rooms/room_country.png' },
  { name: 'VIP Lounge', category: 'vip', coverImage: 'assets/rooms/room_vip.png' },
  { name: 'سهرة موسيقى', category: 'music', coverImage: 'assets/rooms/room_music.png' },
];

async function seed() {
  await connectDB();
  console.log('🌱 Seeding…');

  await Promise.all([User.deleteMany({}), Room.deleteMany({}), Gift.deleteMany({}), Post.deleteMany({}), Family.deleteMany({})]);

  const pass = await bcrypt.hash(env.admin.password, 10);
  const admin = await User.create({
    username: 'Owner', email: env.admin.email, passwordHash: pass, role: 'owner',
    coins: 1000000, diamonds: 500000, vipTier: 'diamond', level: 99, avatar: 'assets/avatars/avatar_1.png',
  });
  const reseller = await User.create({
    username: 'ResellerPro', email: 'reseller@voicechat.app', passwordHash: pass, role: 'reseller',
    coins: 500000, vipTier: 'gold', level: 40, avatar: 'assets/avatars/avatar_2.png',
  });
  const hosts = [];
  for (let i = 1; i <= 6; i++) {
    hosts.push(await User.create({
      username: `Host_${i}`, email: `host${i}@voicechat.app`, passwordHash: pass,
      coins: 5000, diamonds: 2000, vipTier: i % 3 === 0 ? 'gold' : 'silver', level: 10 + i,
      avatar: `assets/avatars/avatar_${(i % 6) + 1}.png`,
    }));
  }

  const gifts = await Gift.insertMany(GIFTS);
  console.log(`  ✓ ${gifts.length} gifts`);

  for (let i = 0; i < ROOMS.length; i++) {
    const owner = hosts[i % hosts.length];
    await Room.create({
      ...ROOMS[i], ownerId: owner._id,
      seats: Array.from({ length: 10 }, (_, s) => ({ index: s, userId: s === 0 ? owner._id : null })),
      listeners: [owner._id], totalGifts: Math.floor(Math.random() * 50000),
    });
  }
  console.log(`  ✓ ${ROOMS.length} rooms`);

  await Family.create({ name: 'أسود الصحراء', ownerId: admin._id, members: [admin._id, hosts[0]._id], weeklyScore: 12500, logo: 'assets/avatars/avatar_1.png' });
  await Family.create({ name: 'نجوم الليل', ownerId: hosts[1]._id, members: [hosts[1]._id, hosts[2]._id], weeklyScore: 9800, logo: 'assets/avatars/avatar_2.png' });

  await Post.create({ authorId: hosts[0]._id, text: 'أهلاً بكم في غرفتي الليلة! 🎤', isRecommended: true, images: ['assets/rooms/room_music.png'] });
  await Post.create({ authorId: hosts[1]._id, text: 'تحدي Ludo الليلة، من يتحدى؟ 🎲', isRecommended: true });

  console.log('✅ Seed complete');
  console.log(`   Admin:    ${env.admin.email} / ${env.admin.password}`);
  console.log('   Reseller: reseller@voicechat.app / ' + env.admin.password);
  console.log('   Hosts:    host1@voicechat.app … host6@voicechat.app / ' + env.admin.password);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
