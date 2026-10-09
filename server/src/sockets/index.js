const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');
const logger = require('../utils/logger');
const { verifyAccess } = require('../middleware/auth');
const { sendGift } = require('../services/giftService');
const { classify } = require('../utils/profanity');
const { buildToken } = require('../services/agoraService');

/**
 * Socket.io realtime gateway for voice rooms.
 *
 * Events (client → server):
 *   room:join, room:leave, seat:request, seat:accept, seat:reject,
 *   seat:leave, seat:mute, seat:kick, seat:ban, seat:lock,
 *   gift:send, chat:message, mod:mute_all, pk:start, pk:support, luckbox:send
 *
 * Events (server → client):
 *   room:state, room:user_joined, room:user_left, seat:*, gift:received,
 *   chat:message, chat:history, mod:mute_all, pk:update, luckbox:new
 */
function initSockets(io) {
  // Auth handshake — every socket must present a valid access token.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('missing_token'));
      const decoded = verifyAccess(token);
      const user = await User.findById(decoded.sub);
      if (!user || user.isBanned) return next(new Error('unauthorized'));
      socket.user = user;
      next();
    } catch (e) {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    logger.info(`socket connected: ${user.username} (${socket.id})`);

    const roomChannel = (roomId) => `room:${roomId}`;

    const broadcastState = async (roomId) => {
      const room = await Room.findById(roomId)
        .populate('seats.userId', 'username avatar vipTier level userId')
        .populate('ownerId', 'username avatar userId');
      if (room) io.to(roomChannel(roomId)).emit('room:state', room);
    };

    // ── Join / leave ─────────────────────────────────────
    socket.on('room:join', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;
        socket.join(roomChannel(roomId));
        socket.currentRoom = roomId;
        if (!room.listeners.some((u) => String(u) === String(user._id))) {
          room.listeners.push(user._id);
          await room.save();
        }
        io.to(roomChannel(roomId)).emit('room:user_joined', {
          userId: user._id, username: user.username, avatar: user.avatar, vipTier: user.vipTier,
        });
        await broadcastState(roomId);
      } catch (e) { logger.error('room:join', e.message); }
    });

    socket.on('room:leave', async ({ roomId }) => {
      try {
        socket.leave(roomChannel(roomId));
        const room = await Room.findById(roomId);
        if (room) {
          room.listeners = room.listeners.filter((u) => String(u) !== String(user._id));
          room.seats.forEach((s) => { if (String(s.userId) === String(user._id)) s.userId = null; });
          await room.save();
          io.to(roomChannel(roomId)).emit('room:user_left', { userId: user._id, username: user.username });
          await broadcastState(roomId);
        }
      } catch (e) { logger.error('room:leave', e.message); }
    });

    // ── Seats ────────────────────────────────────────────
    socket.on('seat:request', async ({ roomId, seatIndex }) => {
      const room = await Room.findById(roomId).populate('ownerId', '_id');
      if (!room) return;
      // Notify the host / moderators that someone raised their hand.
      io.to(roomChannel(roomId)).emit('seat:request', {
        userId: user._id, username: user.username, avatar: user.avatar, seatIndex,
      });
    });

    socket.on('seat:accept', async ({ roomId, userId, seatIndex }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      if (!isHost) return;
      const seat = room.seats.find((s) => s.index === seatIndex);
      if (seat && !seat.isLocked) {
        seat.userId = userId;
        await room.save();
        io.to(roomChannel(roomId)).emit('seat:accept', { userId, seatIndex });
        await broadcastState(roomId);
      }
    });

    socket.on('seat:reject', async ({ roomId, userId }) => {
      io.to(roomChannel(roomId)).emit('seat:reject', { userId });
    });

    socket.on('seat:leave', async ({ roomId }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      room.seats.forEach((s) => { if (String(s.userId) === String(user._id)) s.userId = null; });
      await room.save();
      await broadcastState(roomId);
    });

    socket.on('seat:mute', async ({ roomId, muted, targetUserId }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      const target = targetUserId || user._id;
      if (String(target) !== String(user._id) && !isHost) return;
      const seat = room.seats.find((s) => String(s.userId) === String(target));
      if (seat) { seat.isMuted = muted; await room.save(); }
      io.to(roomChannel(roomId)).emit('seat:mute', { userId: target, muted });
    });

    socket.on('seat:kick', async ({ roomId, userId }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      if (!isHost) return;
      room.seats.forEach((s) => { if (String(s.userId) === String(userId)) s.userId = null; });
      room.listeners = room.listeners.filter((u) => String(u) !== String(userId));
      await room.save();
      io.to(roomChannel(roomId)).emit('seat:kick', { userId });
      await broadcastState(roomId);
    });

    socket.on('seat:ban', async ({ roomId, userId }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      if (!isHost) return;
      if (!room.bannedUsers.some((u) => String(u) === String(userId))) room.bannedUsers.push(userId);
      room.seats.forEach((s) => { if (String(s.userId) === String(userId)) s.userId = null; });
      room.listeners = room.listeners.filter((u) => String(u) !== String(userId));
      await room.save();
      io.to(roomChannel(roomId)).emit('seat:ban', { userId });
      await broadcastState(roomId);
    });

    socket.on('seat:lock', async ({ roomId, seatIndex, locked }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      if (!isHost) return;
      const seat = room.seats.find((s) => s.index === seatIndex);
      if (seat) { seat.isLocked = locked; await room.save(); }
      io.to(roomChannel(roomId)).emit('seat:lock', { seatIndex, locked });
    });

    socket.on('mod:mute_all', async ({ roomId, muted }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isHost = String(room.ownerId) === String(user._id) || room.moderators.some((m) => String(m) === String(user._id));
      if (!isHost) return;
      room.seats.forEach((s) => { if (s.index !== 0) s.isMuted = muted; });
      await room.save();
      io.to(roomChannel(roomId)).emit('mod:mute_all', { muted });
    });

    // ── Chat ─────────────────────────────────────────────
    socket.on('chat:message', async ({ roomId, text, isPaid = false }) => {
      try {
        const { clean, flags, blocked } = classify(text);
        if (blocked) return socket.emit('chat:blocked', { reason: flags });
        const msg = await Message.create({
          roomId, senderId: user._id, text: clean, originalText: text,
          type: isPaid ? 'danmaku' : 'text', isPaid, flags,
        });
        io.to(roomChannel(roomId)).emit('chat:message', {
          _id: msg._id, userId: user._id, username: user.username, avatar: user.avatar,
          text: clean, type: msg.type, isPaid, level: user.level, vipTier: user.vipTier,
          createdAt: msg.createdAt,
        });
      } catch (e) { logger.error('chat:message', e.message); }
    });

    // ── Gifts ────────────────────────────────────────────
    socket.on('gift:send', async ({ roomId, giftId, receiverId, quantity = 1 }) => {
      try {
        const result = await sendGift({ senderId: user._id, receiverId, giftId, quantity, roomId });
        const receiver = await User.findById(receiverId);
        io.to(roomChannel(roomId)).emit('gift:received', {
          gift: result.gift, senderId: user._id, senderName: user.username,
          receiverId, receiverName: receiver?.username || '', quantity,
        });
        socket.emit('wallet:update', { coins: result.senderCoins });
      } catch (e) {
        socket.emit('gift:error', { error: e.message });
      }
    });

    // ── PK battles ───────────────────────────────────────
    socket.on('pk:start', async ({ roomId, hostBId, durationSec = 300 }) => {
      io.to(roomChannel(roomId)).emit('pk:update', { event: 'start', hostA: user._id, hostB: hostBId, durationSec });
    });
    socket.on('pk:support', async ({ roomId, side, coins }) => {
      io.to(roomChannel(roomId)).emit('pk:update', { event: 'support', side, coins, userId: user._id });
    });

    // ── Luck box ─────────────────────────────────────────
    socket.on('luckbox:send', async ({ roomId, totalCoins, packets = 5, ttlSec = 60 }) => {
      io.to(roomChannel(roomId)).emit('luckbox:new', {
        senderId: user._id, senderName: user.username, totalCoins, packets, ttlSec,
        expiresAt: Date.now() + ttlSec * 1000,
      });
    });

    // ── Voice effects / role ─────────────────────────────
    socket.on('voice:effect', async ({ roomId, effect }) => {
      io.to(roomChannel(roomId)).emit('voice:effect', { userId: user._id, effect });
    });

    socket.on('disconnect', async () => {
      logger.info(`socket disconnected: ${user.username}`);
      if (socket.currentRoom) {
        try {
          const room = await Room.findById(socket.currentRoom);
          if (room) {
            room.listeners = room.listeners.filter((u) => String(u) !== String(user._id));
            room.seats.forEach((s) => { if (String(s.userId) === String(user._id)) s.userId = null; });
            await room.save();
            io.to(roomChannel(socket.currentRoom)).emit('room:user_left', { userId: user._id, username: user.username });
            await broadcastState(socket.currentRoom);
          }
        } catch (_) { /* ignore */ }
      }
    });
  });
}

module.exports = { initSockets };
