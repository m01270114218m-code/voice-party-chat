const env = require('../config/env');
const logger = require('../utils/logger');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');

/**
 * OTP service for phone login.
 * Providers: console (dev), twilio (prod). Codes are hashed at rest.
 */
async function issueOtp(phone) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 8);
  await Otp.deleteMany({ phone });
  await Otp.create({ phone, codeHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

  if (env.sms.provider === 'twilio' && env.sms.twilioSid) {
    // Real Twilio send would go here.
    logger.info(`OTP for ${phone} dispatched via Twilio`);
  } else {
    logger.info(`[OTP:dev] ${phone} → ${code}`);
  }
  return { sent: true, devCode: env.isProd ? undefined : code };
}

async function verifyOtp(phone, code) {
  const rec = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!rec) return false;
  if (rec.expiresAt < new Date()) return false;
  if (rec.attempts >= 5) return false;
  const ok = await bcrypt.compare(String(code), rec.codeHash);
  if (!ok) { rec.attempts += 1; await rec.save(); return false; }
  await Otp.deleteMany({ phone });
  return true;
}

module.exports = { issueOtp, verifyOtp };
