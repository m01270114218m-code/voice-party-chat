require('dotenv').config();

/**
 * Central, validated environment configuration.
 * Every other module reads config from here — never from process.env directly.
 */
const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voicechat',
  redisUrl: process.env.REDIS_URL || '',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '30d',
  },

  agora: {
    appId: process.env.AGORA_APP_ID || '',
    appCertificate: process.env.AGORA_APP_CERTIFICATE || '',
    tokenTtl: parseInt(process.env.AGORA_TOKEN_TTL_SECONDS || '3600', 10),
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  paymob: {
    apiKey: process.env.PAYMOB_API_KEY || '',
    integrationId: process.env.PAYMOB_INTEGRATION_ID || '',
  },

  google: { clientId: process.env.GOOGLE_CLIENT_ID || '' },
  translate: { apiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '' },
  fcm: { serverKey: process.env.FCM_SERVER_KEY || '' },

  sms: {
    provider: process.env.SMS_PROVIDER || 'console',
    twilioSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioFrom: process.env.TWILIO_FROM || '',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@voicechat.app',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },

  isProd: (process.env.NODE_ENV || 'development') === 'production',
};

module.exports = env;
