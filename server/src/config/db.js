const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

/** Connect to MongoDB. Retries with backoff so the server survives a cold DB. */
async function connectDB(retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5000,
        autoIndex: !env.isProd,
      });
      logger.info(`MongoDB connected → ${mongoose.connection.name}`);
      return mongoose.connection;
    } catch (err) {
      logger.error(`MongoDB connect failed (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

module.exports = { connectDB, mongoose };
