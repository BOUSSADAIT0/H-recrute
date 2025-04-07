/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the application and formats appropriate responses
 */

const logger = require('../utils/logger');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Indicates this is a known operational error
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
    errorCode,
    requestId: req.id
  });

  // Format response based on environment
  const response = {
    success: false,
    message: statusCode === 500 && !isDevelopment 
      ? 'Internal server error' 
      : err.message,
    errorCode,
    requestId: req.id,
  };

  // Include stack trace in development
  if (isDevelopment && err.stack) {
    response.stack = err.stack.split('\n');
  }
  
  // Send error response
  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
  AppError
};