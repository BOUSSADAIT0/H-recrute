/**
 * Configuration de la base de données MongoDB
 */
module.exports = {
  // URL de connexion à MongoDB
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatchapp',
  
  // Options de connexion à MongoDB
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex et useFindAndModify ne sont plus nécessaires à partir de Mongoose 6
  },
  
  // Configuration de production
  production: {
    url: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Paramètres supplémentaires recommandés pour la production
      poolSize: 10, // Nombre maximum de sockets maintenus ouverts
      serverSelectionTimeoutMS: 5000, // Délai de sélection du serveur
      socketTimeoutMS: 45000, // Délai d'expiration pour les opérations sur socket
    }
  },
  
  // Configuration de test
  test: {
    url: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/jobmatchapp_test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};