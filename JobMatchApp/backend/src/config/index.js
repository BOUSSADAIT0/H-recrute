// index.js
const server = require('./server');
const connectDB = require('./database');
const logger = require('./logger');
const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');

module.exports = {
  server,
  connectDB,
  logger,
  configureMiddleware,
  configureRoutes
};