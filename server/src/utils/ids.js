const { customAlphabet } = require('nanoid');

/** Human-friendly numeric-ish user IDs (8 digits) and room codes. */
const numeric = customAlphabet('0123456789', 8);
const code = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

const newUserId = () => numeric();
const newRoomCode = () => code();

module.exports = { newUserId, newRoomCode };
