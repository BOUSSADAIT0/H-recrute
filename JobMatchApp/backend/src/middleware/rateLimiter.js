/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting the number of requests from a single client
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

/**
 * Create a rate limiter with specific configuration
 * @param {Object} options - Rate limiting options
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes by default
    max = 100, // Limit each IP to 100 requests per window by default
    message = 'Too many requests from this IP, please try again later',
    standardHeaders = true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders = false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests = false, // Count successful requests (status < 400)
    skipFailedRequests = false, // Count failed requests (status >= 400)
    keyGenerator = (req) => req.ip, // Use IP as the default key
    handler = (req, res) => {
      res.status(429).json({
        success: false,
        message,
        requestId: req.id
      });
    }
  } = options;

  // Use Redis store in production for distributed rate limiting
  const store = process.env.NODE_ENV === 'production'
    ? new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix: 'rl:'
      })
    : undefined; // Default memory store for development

  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders,
    legacyHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator,
    handler,
    store
  });
};

// Default rate limiter for all routes
const defaultLimiter = createRateLimiter();

// More strict rate limiter for authentication routes
const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // 10 login attempts per hour
  message: 'Too many login attempts, please try again later'
});

// Stricter limiter for sensitive operations
const strictLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // 5 requests per hour
  message: 'Too many sensitive operations, please try again later'
});

module.exports = {
  defaultLimiter,
  authLimiter,
  strictLimiter,
  createRateLimiter
};