/**
 * Request Validation Middleware
 * Validates incoming request data against defined schemas
 */

const Joi = require('joi');
const { AppError } = require('./errorHandler');

/**
 * Creates a validation middleware with the specified schema
 * @param {Object} schema - Joi validation schema for request parts
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Skip validation if no schema provided
    if (!schema) return next();

    // Initialize validation errors object
    const validationErrors = {};

    // Validate request body if schema.body is provided
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        validationErrors.body = error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }));
      }
    }

    // Validate request query if schema.query is provided
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        validationErrors.query = error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }));
      }
    }

    // Validate request params if schema.params is provided
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        validationErrors.params = error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }));
      }
    }

    // Check if any validation errors occurred
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
        requestId: req.id
      });
    }

    // No validation errors, proceed to next middleware
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  id: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      .messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
      })
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  
  // Add more common schemas as needed
};

module.exports = {
  validateRequest,
  schemas
};