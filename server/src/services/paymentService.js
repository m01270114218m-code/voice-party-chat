const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Payment abstraction.
 * Providers: stripe (global), paymob (MENA), google_play / apple (in-app).
 * In dev, when no keys are configured, it returns a mock checkout so the
 * whole recharge flow is testable end-to-end.
 */
const PACKAGES = [
  { id: 'coins_100', coins: 100, priceUsd: 0.99, bonus: 0 },
  { id: 'coins_500', coins: 500, priceUsd: 4.99, bonus: 25 },
  { id: 'coins_1200', coins: 1200, priceUsd: 9.99, bonus: 100 },
  { id: 'coins_2500', coins: 2500, priceUsd: 19.99, bonus: 300 },
  { id: 'coins_6500', coins: 6500, priceUsd: 49.99, bonus: 1000 },
  { id: 'coins_14000', coins: 14000, priceUsd: 99.99, bonus: 3000 },
];

function getPackages() { return PACKAGES; }

async function createCheckout({ provider, packageId, userId }) {
  const pkg = PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw Object.assign(new Error('unknown_package'), { status: 400, code: 'unknown_package' });

  if (provider === 'stripe' && env.stripe.secretKey) {
    // Real integration point: create a Stripe Checkout Session here.
    return { provider, checkoutUrl: `https://checkout.stripe.com/pay/mock_${pkg.id}`, packageId, coins: pkg.coins + pkg.bonus };
  }
  if (provider === 'paymob' && env.paymob.apiKey) {
    return { provider, checkoutUrl: `https://accept.paymob.com/api/acceptance/iframes/mock?pkg=${pkg.id}`, packageId, coins: pkg.coins + pkg.bonus };
  }
  // Dev / in-app fallback
  logger.warn(`Payment provider '${provider}' not configured — issuing mock checkout`);
  return {
    provider: provider || 'mock',
    checkoutUrl: `mock://checkout/${pkg.id}?user=${userId}`,
    packageId, coins: pkg.coins + pkg.bonus, mock: true,
  };
}

/** Verify a provider webhook signature (stub — wire real verification in prod). */
function verifyWebhook(provider, _payload, _signature) {
  if (provider === 'stripe' && env.stripe.webhookSecret) return true;
  return true; // dev
}

module.exports = { getPackages, createCheckout, verifyWebhook, PACKAGES };
