const express = require('express');
const PkBattle = require('../models/PkBattle');
const Room = require('../models/Room');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

const router = express.Router();

/** POST /api/pk/start — start a 5-minute PK battle between two hosts */
router.post('/start', requireAuth, asyncHandler(async (req, res) => {
  const { roomId, hostBId, durationSec = 300 } = req.body;
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, 'room_not_found');
  if (String(room.ownerId) !== String(req.user._id)) throw new ApiError(403, 'not_host');
  const battle = await PkBattle.create({
    roomId, hostA: req.user._id, hostB: hostBId,
    durationSec, endsAt: new Date(Date.now() + durationSec * 1000),
  });
  room.pkBattle = battle._id;
  await room.save();
  res.status(201).json({ battle });
}));

/** GET /api/pk/:id — battle state (server-authoritative timer) */
router.get('/:id', asyncHandler(async (req, res) => {
  const battle = await PkBattle.findById(req.params.id)
    .populate('hostA', 'username avatar').populate('hostB', 'username avatar');
  if (!battle) throw new ApiError(404, 'battle_not_found');
  const remaining = Math.max(0, Math.floor((new Date(battle.endsAt) - Date.now()) / 1000));
  res.json({ battle, remainingSec: remaining });
}));

/** POST /api/pk/:id/support — support a host with coins (adds to their score) */
router.post('/:id/support', requireAuth, asyncHandler(async (req, res) => {
  const { side, coins } = req.body;
  const battle = await PkBattle.findById(req.params.id);
  if (!battle) throw new ApiError(404, 'battle_not_found');
  if (battle.status !== 'active') throw new ApiError(400, 'battle_finished');
  if (side === 'A') battle.scoreA += coins; else battle.scoreB += coins;
  battle.supporters.push({ userId: req.user._id, side, coins });
  await battle.save();
  res.json({ scoreA: battle.scoreA, scoreB: battle.scoreB });
}));

/** POST /api/pk/:id/finish — end the battle and declare a winner */
router.post('/:id/finish', requireAuth, asyncHandler(async (req, res) => {
  const battle = await PkBattle.findById(req.params.id);
  if (!battle) throw new ApiError(404, 'battle_not_found');
  battle.status = 'finished';
  battle.winnerId = battle.scoreA >= battle.scoreB ? battle.hostA : battle.hostB;
  await battle.save();
  res.json({ battle });
}));

module.exports = router;
