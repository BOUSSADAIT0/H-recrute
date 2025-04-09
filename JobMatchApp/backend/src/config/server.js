
// server.js
const express = require('express');
const http = require('http');
require('dotenv').config();

const createServer = () => {
  const app = express();
  const server = http.createServer(app);
  
  const PORT = process.env.PORT || 5000;
  
  const startServer = () => {
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  };
  
  return {
    app,
    server,
    startServer
  };
};

module.exports = createServer;
