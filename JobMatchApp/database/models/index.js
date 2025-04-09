/**
 * Point d'entrée pour tous les modèles Mongoose
 * Exporte tous les modèles depuis un seul fichier
 */
const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');

// Éviter l'avertissement de méthode de recherche Mongoose
mongoose.set('strictQuery', false);

// Modèles
const User = require('./user.model');
const Job = require('./job.model');
const Company = require('./company.model');
const Application = require('./application.model');
const Skill = require('./skill.model');
const Message = require('./message.model');
const Conversation = require('./conversation.model');
const Notification = require('./notification.model');
const UserProfile = require('./userProfile.model');

// Exporter tous les modèles
module.exports = {
  User,
  Job,
  Company,
  Application,
  Skill,
  Message,
  Conversation,
  Notification,
  UserProfile,
  
  // Utiliser les promesses ES6 pour Mongoose
  mongoose
};