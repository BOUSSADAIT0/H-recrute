// JobMatchApp/backend/src/models/index.js
const mongoose = require('mongoose');
const config = require('../config/database');

// Import modèles
const User = require('./User');
const Company = require('./Company');
const Job = require('./Job');
const Application = require('./Application');
const Skill = require('./Skill');
const Message = require('./Message');

// Connexion à la base de données
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Exporter les modèles
module.exports = {
  User,
  Company,
  Job,
  Application,
  Skill,
  Message
};