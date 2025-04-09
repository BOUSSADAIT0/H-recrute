// middleware.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const configureMiddleware = (app) => {
  // Enable CORS
  app.use(cors());
  
  // Security middleware
  app.use(helmet());
  
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Logging middleware
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
};

module.exports = configureMiddleware;
