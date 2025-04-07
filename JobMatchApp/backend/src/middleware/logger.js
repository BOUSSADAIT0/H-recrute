/**
 * Request Logger Middleware
 * Logs information about incoming requests and outgoing responses
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { isProduction } = require('../config/environment');

/**
 * Middleware to log request and response details
 */
const requestLogger = (req, res, next) => {
  // Generate unique request ID
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;
  
  // Attach request ID to response headers
  res.setHeader('x-request-id', requestId);
  
  // Get request start time
  const startTime = Date.now();
  
  // Log request
  logger.info({
    message: 'Incoming request',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    requestId,
    userId: req.user?.id // If user is authenticated
  });

  // Sanitize request body for logging (remove sensitive fields)
  const sanitizeData = (data) => {
    if (!data) return undefined;
    
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'passwordConfirmation', 'token', 'apiKey', 'secret'];
    
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  };

  // Log request body in development or if explicitly enabled
  if (!isProduction || process.env.LOG_REQUEST_BODY === 'true') {
    logger.debug({
      message: 'Request body',
      body: sanitizeData(req.body),
      query: req.query,
      params: req.params,
      requestId
    });
  }

  // Capture response data
  const originalSend = res.send;
  res.send = function(body) {
    res.responseBody = body;
    return originalSend.apply(res, arguments);
  };

  // Log after response is sent
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]({
      message: 'Response sent',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      requestId,
      userId: req.user?.id
    });

    // Log response body in development or if explicitly enabled
    // Only log for non-success responses or if debug logging is enabled
    if ((!isProduction || process.env.LOG_RESPONSE_BODY === 'true') && 
        (res.statusCode >= 400 || process.env.LOG_LEVEL === 'debug')) {
      try {
        let responseBody;
        
        if (typeof res.responseBody === 'string') {
          responseBody = res.responseBody.length < 1000 
            ? JSON.parse(res.responseBody) 
            : { truncated: true, size: res.responseBody.length };
        } else {
          responseBody = res.responseBody;
        }
        
        logger.debug({
          message: 'Response body',
          body: sanitizeData(responseBody),
          requestId
        });
      } catch (error) {
        // If we can't parse the response body, log that fact but don't crash
        logger.debug({
          message: 'Could not parse response body for logging',
          requestId
        });
      }
    }
  });

  next();
};

module.exports = requestLogger;