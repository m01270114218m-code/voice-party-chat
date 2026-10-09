const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const router = express.Router();

const GAMES = [
  { id: 'ludo', name: 'Ludo', minPlayers: 2, maxPlayers: 4, entryCoins: 100 },
  { id: 'domino', name: 'Domino', minPlayers: 2, maxPlayers: 4, entryCoins: 50 },
  { id: 'uno', name: 'Uno', minPlayers: 2, maxPlayers: 6, entryCoins: 75 },
  { id: 'wheel', name: 'Lucky Wheel', minPlayers: 1, maxPlayers: 1, entryCoins: 20 },
];

/** GET /api/games — mini-game catalog */
router.get('/', asyncHandler(async (_req, res) => res.json({ games: GAMES })));

/** POST /api/games/:id/challenge — invite a user to a game */
router.post('/:id/challenge', requireAuth, asyncHandler(async (req, res) => {
  const game = GAMES.find((g) => g.id === req.params.id);
  res.json({ ok: true, game, invitedUserId: req.body.userId, roomId: req.body.roomId });
}));

/** POST /api/games/:id/result — record a result and award coins */
router.post('/:id/result', requireAuth, asyncHandler(async (req, res) => {
  const { won, reward = 0 } = req.body;
  if (won && reward > 0) {
    req.user.coins += reward;
    await req.user.save();
  }
  res.json({ coins: req.user.coins, reward: won ? reward : 0 });
}));

module.exports = router;
