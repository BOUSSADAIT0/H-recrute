/**
 * Données de seeding pour les utilisateurs
 */

// Données pour les recruteurs
const recruiters = [
    {
      email: 'recruteur1@example.com',
      password: 'password123',
      firstName: 'Thomas',
      lastName: 'Durand',
      role: 'recruiter',
      location: 'Paris',
      phone: '+33123456789',
      bio: 'Recruteur expérimenté dans le domaine de la tech'
    },
    {
      email: 'recruteur2@example.com',
      password: 'password123',
      firstName: 'Sophie',
      lastName: 'Martin',
      role: 'recruiter',
      location: 'Lyon',
      phone: '+33678901234',
      bio: 'Responsable RH avec 8 ans d\'expérience dans le recrutement IT'
    },
    {
      email: 'recruteur3@example.com',
      password: 'password123',
      firstName: 'Antoine',
      lastName: 'Leroy',
      role: 'recruiter',
      location: 'Bordeaux',
      phone: '+33512345678',
      bio: 'Talent Acquisition Specialist passionné par l\'innovation'
    },
    {
      email: 'recruteur4@example.com',
      password: 'password123',
      firstName: 'Julie',
      lastName: 'Petit',
      role: 'recruiter',
      location: 'Nantes',
      phone: '+33698765432',
      bio: 'Recruteuse spécialisée dans le domaine du développement web et mobile'
    },
    {
      email: 'recruteur5@example.com',
      password: 'password123',
      firstName: 'Marc',
      lastName: 'Bernard',
      role: 'recruiter',
      location: 'Lille',
      phone: '+33754321098',
      bio: 'Directeur des ressources humaines avec une approche personnalisée du recrutement'
    }
  ];
  
  // Données pour les candidats (job seekers)
  const jobSeekers = [
    {
      email: 'candidat1@example.com',
      password: 'password123',
      firstName: 'Lucie',
      lastName: 'Dubois',
      role: 'jobseeker',
      location: 'Paris',
      phone: '+33612345678',
      bio: 'Développeuse frontend passionnée par les interfaces utilisateur'
    },
    {
      email: 'candidat2@example.com',
      password: 'password123',
      firstName: 'Paul',
      lastName: 'Moreau',
      role: 'jobseeker',
      location: 'Lyon',
      phone: '+33623456789',
      bio: 'Développeur backend avec 4 ans d\'expérience en Node.js'
    },
    {
      email: 'candidat3@example.com',
      password: 'password123',
      firstName: 'Emma',
      lastName: 'Lefebvre',
      role: 'jobseeker',
      location: 'Marseille',
      phone: '+33634567890',
      bio: 'Développeuse full-stack spécialisée en React et Express'
    },
    {
      email: 'candidat4@example.com',
      password: 'password123',
      firstName: 'Léo',
      lastName: 'Girard',
      role: 'jobseeker',
      location: 'Toulouse',
      phone: '+33645678901',
      bio: 'Ingénieur en développement mobile avec expertise en React Native'
    },
    {
      email: 'candidat5@example.com',
      password: 'password123',
      firstName: 'Chloé',
      lastName: 'Roux',
      role: 'jobseeker',
      location: 'Bordeaux',
      phone: '+33656789012',
      bio: 'Développeuse web avec un intérêt particulier pour le design UI/UX'
    },
    {
      email: 'candidat6@example.com',
      password: 'password123',
      firstName: 'Hugo',
      lastName: 'Lambert',
      role: 'jobseeker',
      location: 'Lille',
      phone: '+33667890123',
      bio: 'Développeur backend spécialisé en bases de données NoSQL'
    },
    {
      email: 'candidat7@example.com',
      password: 'password123',
      firstName: 'Inès',
      lastName: 'Fournier',
      role: 'jobseeker',
      location: 'Nantes',
      phone: '+33678901234',
      bio: 'Développeuse passionnée par le cloud computing et l\'architecture distribuée'
    },
    {
      email: 'candidat8@example.com',
      password: 'password123',
      firstName: 'Maxime',
      lastName: 'Vincent',
      role: 'jobseeker',
      location: 'Strasbourg',
      phone: '+33689012345',
      bio: 'Développeur JavaScript full-stack avec expertise en GraphQL'
    },
    {
      email: 'candidat9@example.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Dupont',
      role: 'jobseeker',
      location: 'Rennes',
      phone: '+33690123456',
      bio: 'Développeuse web avec expérience en cybersécurité'
    },
    {
      email: 'candidat10@example.com',
      password: 'password123',
      firstName: 'Nicolas',
      lastName: 'Michel',
      role: 'jobseeker',
      location: 'Montpellier',
      phone: '+33601234567',
      bio: 'Développeur mobile spécialisé dans les applications iOS et Android'
    }
  ];
  
  module.exports = {
    recruiters,
    jobSeekers
  };