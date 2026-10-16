const logger = require('../utils/logger');

/** Central error handler — never leaks stack traces in production. */
function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) logger.error(`${req.method} ${req.path} →`, err.message, err.stack);
  res.status(status).json({
    error: err.code || 'server_error',
    message: err.message || 'Unexpected error',
  });
}

/** Wrap async route handlers so thrown errors reach errorHandler. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class ApiError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.status = status;
    this.code = code;
  }
}

module.exports = { errorHandler, asyncHandler, ApiError };
