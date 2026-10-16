/**
 * NTP-style server time authority.
 * Clients sync against GET /api/time so they cannot cheat timers (gift boxes,
 * PK battles, luck envelopes) by changing the device clock.
 */
const startedAt = Date.now();

function serverTime() {
  return { now: Date.now(), uptimeMs: Date.now() - startedAt, iso: new Date().toISOString() };
}

/**
 * Verify a client-supplied timestamp is within tolerance of server time.
 * Used to reject replayed / clock-tampered requests.
 */
function isFresh(clientTs, toleranceMs = 30000) {
  const diff = Math.abs(Date.now() - Number(clientTs || 0));
  return diff <= toleranceMs;
}

module.exports = { serverTime, isFresh };
