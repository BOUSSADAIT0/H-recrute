// JobMatchApp/backend/src/config/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('../middlewares/errorHandler');
const routes = require('../routes');

/**
 * Application configuration and setup
 */
class App {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configure and set up application middlewares
   */
  setupMiddlewares() {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());

    // Performance middlewares
    this.app.use(compression());

    // Logging in development mode
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  /**
   * Configure application routes
   */
  setupRoutes() {
    // API routes
    this.app.use('/api', routes);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', message: 'Server is running' });
    });

    // Handle 404 routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  /**
   * Configure error handling
   */
  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  /**
   * Get the configured Express application
   * @returns {express.Application} The Express application
   */
  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();