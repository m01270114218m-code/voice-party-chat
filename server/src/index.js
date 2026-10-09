const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');

const env = require('./config/env');
const logger = require('./utils/logger');
const { connectDB } = require('./config/db');
const { globalLimiter, banGuard } = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/error');
const { initSockets } = require('./sockets');

// ── Routes ──────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const walletRoutes = require('./routes/wallet');
const giftRoutes = require('./routes/gifts');
const messageRoutes = require('./routes/messages');
const postRoutes = require('./routes/posts');
const familyRoutes = require('./routes/families');
const adminRoutes = require('./routes/admin');
const supportRoutes = require('./routes/support');
const resellerRoutes = require('./routes/reseller');
const pkRoutes = require('./routes/pk');
const userRoutes = require('./routes/users');
const miscRoutes = require('./routes/misc');
const luckboxRoutes = require('./routes/luckbox');
const gameRoutes = require('./routes/games');

async function bootstrap() {
  await connectDB();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: env.corsOrigin, methods: ['GET', 'POST'] },
    maxHttpBufferSize: 1e6,
  });

  // ── Global middleware ─────────────────────────────────
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: env.corsOrigin }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan(env.isProd ? 'combined' : 'dev'));
  app.use(banGuard);
  app.use('/api', globalLimiter);

  // ── Health ────────────────────────────────────────────
  app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime(), env: env.nodeEnv }));

  // ── API ───────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/wallet', walletRoutes);
  app.use('/api/gifts', giftRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/families', familyRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/reseller', resellerRoutes);
  app.use('/api/pk', pkRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/luckbox', luckboxRoutes);
  app.use('/api/games', gameRoutes);
  app.use('/api', miscRoutes); // /api/time, /api/translate, /api/moderate

  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  app.use(errorHandler);

  // ── Realtime ──────────────────────────────────────────
  initSockets(io);

  server.listen(env.port, () => {
    logger.success(`VoiceChat API listening on :${env.port} (${env.nodeEnv})`);
  });

  process.on('unhandledRejection', (e) => logger.error('unhandledRejection', e));
  process.on('SIGTERM', () => { logger.info('SIGTERM — shutting down'); server.close(() => process.exit(0)); });
}

bootstrap().catch((e) => { logger.error('bootstrap failed', e); process.exit(1); });
