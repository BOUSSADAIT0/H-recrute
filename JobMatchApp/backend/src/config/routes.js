// routes.js
const userRoutes = require('../routes/userRoutes');
const jobRoutes = require('../routes/jobRoutes');
const matchRoutes = require('../routes/matchRoutes');
const authRoutes = require('../routes/authRoutes');

const configureRoutes = (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/auth', authRoutes);
  
  // Handle 404s
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  // Error handler
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });
};

module.exports = configureRoutes;

