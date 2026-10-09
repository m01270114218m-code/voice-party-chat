/* eslint-disable no-console */
/**
 * Smoke test — boots the real server against an in-memory MongoDB and exercises
 * the core endpoints end-to-end. Run with:  node scripts/smoke.js
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri('voicechat');
  process.env.REDIS_URL = ''; // use in-memory fallback
  process.env.PORT = '4123';
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_access';
  process.env.JWT_REFRESH_SECRET = 'test_refresh';

  // Boot the server (it reads env at require-time, so set env first).
  require('../src/index');

  const base = 'http://127.0.0.1:4123';
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await wait(2500);

  const results = [];
  const check = async (name, fn) => {
    try {
      const r = await fn();
      results.push({ name, ok: true, detail: r });
    } catch (e) {
      results.push({ name, ok: false, detail: e.message });
    }
  };

  const j = async (res) => {
    const t = await res.text();
    try { return JSON.parse(t); } catch { return t; }
  };

  await check('GET /health', async () => {
    const r = await fetch(`${base}/health`);
    const d = await j(r);
    if (!r.ok) throw new Error(JSON.stringify(d));
    return d.status;
  });

  await check('GET /api/time (NTP)', async () => {
    const r = await fetch(`${base}/api/time`);
    const d = await j(r);
    if (!d.now) throw new Error('no now');
    return `now=${d.now}`;
  });

  let token = null;
  await check('POST /api/auth/register', async () => {
    const r = await fetch(`${base}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Tester', email: 't@t.com', password: 'secret123' }),
    });
    const d = await j(r);
    if (!d.accessToken) throw new Error(JSON.stringify(d));
    token = d.accessToken;
    return `user=${d.user.username} coins=${d.user.coins}`;
  });

  await check('POST /api/auth/guest', async () => {
    const r = await fetch(`${base}/api/auth/guest`, { method: 'POST' });
    const d = await j(r);
    if (!d.accessToken) throw new Error(JSON.stringify(d));
    return `guest=${d.user.username}`;
  });

  await check('POST /api/auth/otp/request', async () => {
    const r = await fetch(`${base}/api/auth/otp/request`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201000000000' }),
    });
    const d = await j(r);
    if (!d.sent) throw new Error(JSON.stringify(d));
    return `devCode=${d.devCode}`;
  });

  const auth = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });

  let roomId = null;
  await check('POST /api/rooms (create)', async () => {
    const r = await fetch(`${base}/api/rooms`, {
      method: 'POST', headers: auth(),
      body: JSON.stringify({ name: 'غرفة اختبار', category: 'music' }),
    });
    const d = await j(r);
    if (!d.room) throw new Error(JSON.stringify(d));
    roomId = d.room._id;
    return `room=${d.room.name} seats=${d.room.seats.length}`;
  });

  await check('GET /api/rooms (list)', async () => {
    const r = await fetch(`${base}/api/rooms`);
    const d = await j(r);
    if (!Array.isArray(d.rooms)) throw new Error(JSON.stringify(d));
    return `count=${d.rooms.length}`;
  });

  await check('POST /api/rooms/:id/join (RTC token)', async () => {
    const r = await fetch(`${base}/api/rooms/${roomId}/join`, { method: 'POST', headers: auth() });
    const d = await j(r);
    if (!d.rtc) throw new Error(JSON.stringify(d));
    return `token=${String(d.rtc.token).slice(0, 12)}… uid=${d.uid}`;
  });

  await check('GET /api/wallet/packages', async () => {
    const r = await fetch(`${base}/api/wallet/packages`);
    const d = await j(r);
    if (!Array.isArray(d.packages)) throw new Error(JSON.stringify(d));
    return `packages=${d.packages.length}`;
  });

  await check('POST /api/wallet/recharge', async () => {
    const r = await fetch(`${base}/api/wallet/recharge`, {
      method: 'POST', headers: auth(),
      body: JSON.stringify({ packageId: 'coins_500', provider: 'stripe' }),
    });
    const d = await j(r);
    if (!d.checkoutUrl) throw new Error(JSON.stringify(d));
    return `coins=${d.coins}`;
  });

  await check('POST /api/translate', async () => {
    const r = await fetch(`${base}/api/translate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'مرحبا', target: 'en' }),
    });
    const d = await j(r);
    if (!d.translated) throw new Error(JSON.stringify(d));
    return d.translated;
  });

  await check('POST /api/moderate (profanity)', async () => {
    const r = await fetch(`${base}/api/moderate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'you are stupid, call 01012345678' }),
    });
    const d = await j(r);
    if (!d.clean) throw new Error(JSON.stringify(d));
    return `clean="${d.clean}" flags=${JSON.stringify(d.flags)}`;
  });

  await check('POST /api/posts (create)', async () => {
    const r = await fetch(`${base}/api/posts`, {
      method: 'POST', headers: auth(),
      body: JSON.stringify({ text: 'أول منشور 🎉' }),
    });
    const d = await j(r);
    if (!d.post) throw new Error(JSON.stringify(d));
    return `post=${d.post._id}`;
  });

  await check('GET /api/families/leaderboard', async () => {
    const r = await fetch(`${base}/api/families/leaderboard`);
    const d = await j(r);
    if (!Array.isArray(d.families)) throw new Error(JSON.stringify(d));
    return `families=${d.families.length}`;
  });

  await check('GET /api/games', async () => {
    const r = await fetch(`${base}/api/games`);
    const d = await j(r);
    if (!Array.isArray(d.games)) throw new Error(JSON.stringify(d));
    return `games=${d.games.map((g) => g.id).join(',')}`;
  });

  await check('GET /api/support/faq', async () => {
    const r = await fetch(`${base}/api/support/faq`);
    const d = await j(r);
    if (!Array.isArray(d.faq)) throw new Error(JSON.stringify(d));
    return `faq=${d.faq.length}`;
  });

  await check('GET /api/admin/stats (forbidden for user)', async () => {
    const r = await fetch(`${base}/api/admin/stats`, { headers: auth() });
    if (r.status !== 403) throw new Error(`expected 403 got ${r.status}`);
    return 'correctly forbidden';
  });

  console.log('\n──────── SMOKE TEST RESULTS ────────');
  let pass = 0;
  for (const r of results) {
    console.log(`${r.ok ? '✅' : '❌'} ${r.name}  →  ${r.detail}`);
    if (r.ok) pass++;
  }
  console.log(`\n${pass}/${results.length} passed\n`);

  await mongod.stop();
  process.exit(pass === results.length ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
