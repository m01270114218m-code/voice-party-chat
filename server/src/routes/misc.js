const express = require('express');
const { serverTime } = require('../utils/ntp');
const { translate } = require('../services/translateService');
const { classify } = require('../utils/profanity');
const { asyncHandler } = require('../middleware/error');

const router = express.Router();

/** GET /api/time — NTP-style server time for client clock sync */
router.get('/time', asyncHandler(async (_req, res) => res.json(serverTime())));

/** POST /api/translate — translate a chat message */
router.post('/translate', asyncHandler(async (req, res) => {
  const { text, target = 'en', source = 'auto' } = req.body;
  const translated = await translate(text, target, source);
  res.json({ translated, target });
}));

/** POST /api/moderate — filter text (profanity / PII) */
router.post('/moderate', asyncHandler(async (req, res) => {
  res.json(classify(req.body.text || ''));
}));

module.exports = router;
