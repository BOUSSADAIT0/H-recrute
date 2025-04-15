// server.js
const http = require('http');
const app = require('./app'); // ou './src/app' selon ton arborescence
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
