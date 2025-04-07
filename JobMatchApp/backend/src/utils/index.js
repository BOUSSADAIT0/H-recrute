// JobMatchApp\backend\src\utils\index.js

// Exporter tous les utilitaires depuis un seul fichier
const { connectDB } = require('./db');
const { generateToken, hashPassword, comparePassword } = require('./auth');
const { 
  registerValidation, 
  loginValidation, 
  candidateProfileValidation, 
  jobOfferValidation 
} = require('./validation');
const { 
  preprocessText, 
  calculateSkillMatch, 
  calculateJobMatch 
} = require('./matching');
const { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} = require('./response');
const { logger, logRequest } = require('./logger');

module.exports = {
  // Database
  connectDB,
  
  // Authentication
  generateToken,
  hashPassword,
  comparePassword,
  
  // Validation
  registerValidation,
  loginValidation,
  candidateProfileValidation,
  jobOfferValidation,
  
  // Matching
  preprocessText,
  calculateSkillMatch,
  calculateJobMatch,
  
  // Response formatting
  successResponse,
  errorResponse,
  validationErrorResponse,
  
  // Logging
  logger,
  logRequest
};