/**
 * Utilitaire de connexion à MongoDB
 */
const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');
const logger = require('../../src/utils/logger');

/**
 * Se connecte à la base de données MongoDB
 * @returns {Promise<mongoose.Connection>} La connexion Mongoose
 */
const connectDB = async () => {
  try {
    // Déterminer la configuration en fonction de l'environnement
    const environment = process.env.NODE_ENV || 'development';
    const config = environment === 'production' 
      ? dbConfig.production 
      : environment === 'test'
        ? dbConfig.test
        : dbConfig;
    
    // Se connecter à MongoDB
    const conn = await mongoose.connect(config.url, config.options);
    
    logger.info(`MongoDB connecté: ${conn.connection.host}`);
    
    // Gérer les événements de connexion
    mongoose.connection.on('error', err => {
      logger.error(`Erreur de connexion MongoDB: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB déconnecté');
    });
    
    // Gérer la fermeture propre lors de l'arrêt de l'application
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Connexion à MongoDB fermée suite à l\'arrêt de l\'application');
      process.exit(0);
    });
    
    return conn.connection;
  } catch (error) {
    logger.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Ferme la connexion à la base de données
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Connexion à MongoDB fermée');
  } catch (error) {
    logger.error(`Erreur lors de la fermeture de la connexion MongoDB: ${error.message}`);
  }
};

/**
 * Vide la base de données (utile pour les tests)
 * @returns {Promise<void>}
 */
const clearDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Cette opération est autorisée uniquement en environnement de test');
  }
  
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  
  const collections = await mongoose.connection.db.collections();
  
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  
  logger.info('Base de données vidée');
};

module.exports = {
  connectDB,
  closeConnection,
  clearDatabase
};