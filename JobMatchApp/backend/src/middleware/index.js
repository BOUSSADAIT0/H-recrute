/**
 * Middleware index file
 * Export all middleware from this file
 */

const authMiddleware = require('./authMiddleware');
const errorHandler = require('./errorHandler');
const rateLimiter = require('./rateLimiter');
const validateRequest = require('./validateRequest');
const logger = require('./logger');
const cors = require('./cors');

module.exports = {
  authMiddleware,
  errorHandler,
  rateLimiter,
  validateRequest,
  logger,
  cors
};