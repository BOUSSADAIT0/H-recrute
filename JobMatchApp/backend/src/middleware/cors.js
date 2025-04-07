/**
 * CORS Middleware Configuration
 * Configures Cross-Origin Resource Sharing for the API
 */

const cors = require('cors');
const { ALLOWED_ORIGINS, isProduction } = require('../config/environment');

/**
 * Parse and validate the list of allowed origins
 * @returns {Array} Array of allowed origin strings
 */
const parseAllowedOrigins = () => {
  if (!ALLOWED_ORIGINS) {
    return isProduction ? [] : ['http://localhost:3000'];
  }
  
  return ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
};

/**
 * CORS configuration options
 */
const corsOptions = {
  // Dynamically determine if origin is allowed
  origin: (origin, callback) => {
    const allowedOrigins = parseAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all origins if not explicitly set
    if (!isProduction && allowedOrigins.length === 0) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Origin not allowed
    callback(new Error('CORS: Request origin not allowed'), false);
  },
  
  // Allow credentials to be sent with requests (cookies, auth headers)
  credentials: true,
  
  // Set allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Set allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-ID'
  ],
  
  // Set exposed headers
  exposedHeaders: ['X-Request-ID', 'X-Total-Count', 'X-Total-Pages'],
  
  // Preflight requests will be cached for 24 hours
  maxAge: 86400,
  
  // Pass the CORS preflight response to the next handler
  preflightContinue: false,
  
  // Return 204 for preflight requests
  optionsSuccessStatus: 204
};

// Create and export the configured CORS middleware
module.exports = cors(corsOptions);