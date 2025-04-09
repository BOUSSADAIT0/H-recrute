/**
 * Script principal de seeding pour la base de données
 * Exécuter avec : node database/seeds/seeder.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, closeConnection } = require('../utils/db.connect');
const userSeeds = require('./users.seed');
const jobSeeds = require('./jobs.seed');

// Modèles
const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const Skill = require('../models/skill.model');
const Application = require('../models/application.model');
const UserProfile = require('../models/userProfile.model');

// Fonction principale de seeding
const seedDatabase = async () => {
  try {
    console.log('Démarrage du processus de seeding...');
    
    // Se connecter à la base de données
    await connectDB();
    
    // Vider la base de données si l'option est activée
    if (process.env.CLEAR_DB === 'true') {
      console.log('Nettoyage de la base de données...');
      await clearCollections();
    }
    
    // Ajouter les compétences
    await seedSkills();
    
    // Ajouter les utilisateurs (recruteurs et candidats)
    await seedUsers();
    
    // Ajouter les entreprises
    await seedCompanies();
    
    // Ajouter les offres d'emploi
    await seedJobs();
    
    // Ajouter les candidatures
    await seedApplications();
    
    console.log('Seeding terminé avec succès !');
    
    // Fermer la connexion à la base de données
    await closeConnection();
    
  } catch (error) {
    console.error('Erreur lors du seeding de la base de données:', error);
    process.exit(1);
  }
};

// Vider les collections existantes
const clearCollections = async () => {
  await User.deleteMany({});
  await Company.deleteMany({});
  await Job.deleteMany({});
  await Skill.deleteMany({});
  await Application.deleteMany({});
  await UserProfile.deleteMany({});
  console.log('Collections vidées');
};

// Ajouter les compétences
const seedSkills = async () => {
  console.log('Ajout des compétences...');
  
  // Compétences techniques
  const technicalSkills = [
    { name: 'JavaScript', category: 'technical', description: 'Langage de programmation frontend et backend', popularity: 100 },
    { name: 'React Native', category: 'technical', description: 'Framework mobile cross-platform', popularity: 85 },
    { name: 'Node.js', category: 'technical', description: 'Runtime JavaScript côté serveur', popularity: 90 },
    { name: 'MongoDB', category: 'technical', description: 'Base de données NoSQL', popularity: 80 },
    { name: 'Express.js', category: 'technical', description: 'Framework backend pour Node.js', popularity: 75 },
    { name: 'React', category: 'technical', description: 'Bibliothèque frontend JavaScript', popularity: 95 },
    { name: 'HTML/CSS', category: 'technical', description: 'Technologies de base pour le web', popularity: 90 },
    { name: 'Git', category: 'technical', description: 'Système de contrôle de version', popularity: 85 },
    { name: 'Redux', category: 'technical', description: 'Gestion d\'état pour applications JavaScript', popularity: 70 },
    { name: 'TypeScript', category: 'technical', description: 'JavaScript typé', popularity: 80 },
    { name: 'AWS', category: 'technical', description: 'Services cloud Amazon', popularity: 85 },
    { name: 'Docker', category: 'technical', description: 'Conteneurisation d\'applications', popularity: 75 },
    { name: 'GraphQL', category: 'technical', description: 'Langage de requête pour API', popularity: 65 },
    { name: 'Python', category: 'technical', description: 'Langage de programmation polyvalent', popularity: 90 },
    { name: 'SQL', category: 'technical', description: 'Langage de requête pour bases de données relationnelles', popularity: 85 }
  ];
  
  // Compétences non techniques
  const softSkills = [
    { name: 'Communication', category: 'soft', description: 'Capacité à communiquer clairement et efficacement', popularity: 95 },
    { name: 'Travail d\'équipe', category: 'soft', description: 'Capacité à travailler efficacement avec d\'autres personnes', popularity: 90 },
    { name: 'Résolution de problèmes', category: 'soft', description: 'Capacité à résoudre des problèmes complexes', popularity: 85 },
    { name: 'Adaptabilité', category: 'soft', description: 'Capacité à s\'adapter au changement', popularity: 80 },
    { name: 'Leadership', category: 'soft', description: 'Capacité à diriger et motiver une équipe', popularity: 75 },
    { name: 'Gestion du temps', category: 'soft', description: 'Capacité à gérer efficacement son temps et ses priorités', popularity: 85 },
    { name: 'Créativité', category: 'soft', description: 'Capacité à penser de manière originale et innovante', popularity: 70 },
    { name: 'Esprit critique', category: 'soft', description: 'Capacité à analyser et évaluer objectivement des informations', popularity: 80 }
  ];
  
  // Compétences linguistiques
  const languageSkills = [
    { name: 'Anglais', category: 'language', description: 'Maîtrise de l\'anglais', popularity: 100 },
    { name: 'Français', category: 'language', description: 'Maîtrise du français', popularity: 90 },
    { name: 'Espagnol', category: 'language', description: 'Maîtrise de l\'espagnol', popularity: 80 },
    { name: 'Allemand', category: 'language', description: 'Maîtrise de l\'allemand', popularity: 70 },
    { name: 'Chinois', category: 'language', description: 'Maîtrise du chinois (mandarin)', popularity: 65 },
    { name: 'Arabe', category: 'language', description: 'Maîtrise de l\'arabe', popularity: 60 }
  ];
  
  // Ajouter toutes les compétences
  const allSkills = [...technicalSkills, ...softSkills, ...languageSkills];
  
  // Vérifier si les compétences existent déjà
  const existingSkillsCount = await Skill.countDocuments();
  
  if (existingSkillsCount === 0) {
    await Skill.insertMany(allSkills);
    console.log(`${allSkills.length} compétences ajoutées`);
  } else {
    console.log(`Les compétences existent déjà (${existingSkillsCount} trouvées)`);
  }
};

// Ajouter les utilisateurs
const seedUsers = async () => {
  console.log('Ajout des utilisateurs...');
  
  // Créer un utilisateur admin
  const adminExists = await User.findOne({ email: 'admin@jobmatchapp.com' });
  
  if (!adminExists) {
    const adminUser = new User({
      email: 'admin@jobmatchapp.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true
    });
    
    await adminUser.save();
    console.log('Utilisateur admin créé');
  }
  
  // Ajouter les recruteurs
  const recruitersCount = await User.countDocuments({ role: 'recruiter' });
  
  if (recruitersCount < 5) {
    // Utiliser les données de seeding pour les recruteurs
    for (const recruiterData of userSeeds.recruiters) {
      const existingRecruiter = await User.findOne({ email: recruiterData.email });
      
      if (!existingRecruiter) {
        const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
        const recruiter = new User({
          ...recruiterData,
          password: hashedPassword,
          isVerified: true
        });
        
        await recruiter.save();
      }
    }
    console.log(`${userSeeds.recruiters.length} recruteurs ajoutés`);
  } else {
    console.log(`Les recruteurs existent déjà (${recruitersCount} trouvés)`);
  }
  
  // Ajouter les candidats
  const jobSeekersCount = await User.countDocuments({ role: 'jobseeker' });
  
  if (jobSeekersCount < 10) {
    // Utiliser les données de seeding pour les candidats
    for (const jobSeekerData of userSeeds.jobSeekers) {
      const existingJobSeeker = await User.findOne({ email: jobSeekerData.email });
      
      if (!existingJobSeeker) {
        const hashedPassword = await bcrypt.hash(jobSeekerData.password, 10);
        const jobSeeker = new User({
          ...jobSeekerData,
          password: hashedPassword,
          isVerified: true
        });
        
        await jobSeeker.save();
        
        // Créer le profil utilisateur
        await createUserProfile(jobSeeker._id);
      }
    }
    console.log(`${userSeeds.jobSeekers.length} candidats ajoutés`);
  } else {
    console.log(`Les candidats existent déjà (${jobSeekersCount} trouvés)`);
  }
};

// Créer un profil utilisateur pour un candidat
const createUserProfile = async (userId) => {
  // Récupérer des compétences aléatoires
  const skills = await Skill.aggregate([{ $sample: { size: 8 } }]);
  
  const skillsArray = skills.map(skill => ({
    skill: skill._id,
    level: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)],
    yearsOfExperience: Math.floor(Math.random() * 8) + 1
  }));
  
  const userProfile = new UserProfile({
    user: userId,
    headline: 'Professionnel passionné cherchant de nouvelles opportunités',
    summary: 'Expérience professionnelle variée avec une forte capacité d\'adaptation et d\'apprentissage. À la recherche de nouveaux défis professionnels.',
    skills: skillsArray,
    workExperience: [
      {
        title: 'Développeur Frontend',
        company: 'TechCorp',
        location: 'Paris',
        startDate: new Date('2019-05-01'),
        endDate: new Date('2021-06-30'),
        description: 'Développement d\'interfaces utilisateur avec React et Redux.'
      },
      {
        title: 'Développeur Junior',
        company: 'StartupInc',
        location: 'Lyon',
        startDate: new Date('2017-09-01'),
        endDate: new Date('2019-04-30'),
        description: 'Développement full-stack avec Node.js et Angular.'
      }
    ],
    education: [
      {
        institution: 'Université de Paris',
        degree: 'Master en Informatique',
        fieldOfStudy: 'Développement Logiciel',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2017-06-30')
      },
      {
        institution: 'École Supérieure d\'Informatique',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Sciences Informatiques',
        startDate: new Date('2012-09-01'),
        endDate: new Date('2015-06-30')
      }
    ],
    languages: [
      { language: 'Français', proficiency: 'native' },
      { language: 'Anglais', proficiency: 'advanced' },
      { language: 'Espagnol', proficiency: 'intermediate' }
    ],
    availability: ['immediate', '2_weeks', '1_month', 'more_than_1_month'][Math.floor(Math.random() * 4)],
    desiredJobTypes: ['full-time', 'remote'],
    remotePreference: 'hybrid',
    willingToRelocate: Math.random() > 0.5
  });
  
  // Calculer la complétude du profil
  userProfile.calculateProfileCompleteness();
  
  await userProfile.save();
  
  // Mettre à jour les compétences de l'utilisateur
  await User.findByIdAndUpdate(userId, {
    skills: skills.map(skill => skill._id)
  });
};

// Ajouter les entreprises
const seedCompanies = async () => {
  console.log('Ajout des entreprises...');
  
  const companiesCount = await Company.countDocuments();
  
  if (companiesCount > 0) {
    console.log(`Les entreprises existent déjà (${companiesCount} trouvées)`);
    return;
  }
  
  // Récupérer les recruteurs
  const recruiters = await User.find({ role: 'recruiter' });
  
  if (recruiters.length === 0) {
    console.log('Aucun recruteur trouvé. Les entreprises ne peuvent pas être créées.');
    return;
  }
  
  const companyData = [
    {
      name: 'TechSolutions Inc.',
      description: 'Entreprise leader dans le développement de logiciels et solutions informatiques.',
      industry: 'Technologie',
      size: '201-500',
      headquarters: {
        city: 'Paris',
        country: 'France'
      },
      companyValues: ['Innovation', 'Excellence', 'Collaboration'],
      benefits: ['Horaires flexibles', 'Télétravail possible', 'Formation continue']
    },
    {
      name: 'MobileDev Studio',
      description: 'Studio spécialisé dans le développement d\'applications mobiles innovantes.',
      industry: 'Mobile',
      size: '51-200',
      headquarters: {
        city: 'Lyon',
        country: 'France'
      },
      companyValues: ['Créativité', 'Esprit d\'équipe', 'Qualité'],
      benefits: ['Ambiance startup', 'Équipement dernier cri', 'Événements d\'entreprise']
    },
    {
      name: 'DataInsight Analytics',
      description: 'Entreprise spécialisée dans l\'analyse de données et l\'intelligence artificielle.',
      industry: 'Data & IA',
      size: '51-200',
      headquarters: {
        city: 'Bordeaux',
        country: 'France'
      },
      companyValues: ['Innovation', 'Rigueur scientifique', 'Transparence'],
      benefits: ['Projets stimulants', 'Formation avancée en IA', 'Conférences internationales']
    },
    {
      name: 'CloudNative Systems',
      description: 'Société spécialisée dans les infrastructures cloud et les architectures distribuées.',
      industry: 'Cloud Computing',
      size: '11-50',
      headquarters: {
        city: 'Nantes',
        country: 'France'
      },
      companyValues: ['Agilité', 'Excellence technique', 'Apprentissage continu'],
      benefits: ['Semaine de 4 jours', '100% télétravail possible', 'Budget formation']
    },
    {
      name: 'SecureNet Cybersecurity',
      description: 'Entreprise de cybersécurité offrant des services de protection et audit pour les entreprises.',
      industry: 'Cybersécurité',
      size: '51-200',
      headquarters: {
        city: 'Lille',
        country: 'France'
      },
      companyValues: ['Sécurité', 'Intégrité', 'Vigilance'],
      benefits: ['Certification professionnelle', 'Challenges hackatons', 'Primes de performance']
    }
  ];
  
  // Créer les entreprises et les associer à des recruteurs
  for (let i = 0; i < companyData.length; i++) {
    const recruiter = recruiters[i % recruiters.length];
    
    const company = new Company({
      ...companyData[i],
      createdBy: recruiter._id
    });
    
    await company.save();
    
    // Ajouter le recruteur à l'entreprise
    await company.addRecruiter(recruiter._id);
  }
  
  console.log(`${companyData.length} entreprises ajoutées`);
};

// Ajouter les offres d'emploi
const seedJobs = async () => {
  console.log('Ajout des offres d\'emploi...');
  
  const jobsCount = await Job.countDocuments();
  
  if (jobsCount > 0) {
    console.log(`Les offres d'emploi existent déjà (${jobsCount} trouvées)`);
    return;
  }
  
  // Récupérer les entreprises
  const companies = await Company.find().populate('recruiters');
  
  if (companies.length === 0) {
    console.log('Aucune entreprise trouvée. Les offres d\'emploi ne peuvent pas être créées.');
    return;
  }
  
  // Récupérer les compétences par catégorie
  const technicalSkills = await Skill.find({ category: 'technical' });
  const softSkills = await Skill.find({ category: 'soft' });
  
  // Pour chaque entreprise, créer plusieurs offres d'emploi
  for (const company of companies) {
    const numJobs = Math.floor(Math.random() * 3) + 2; // 2 à 4 jobs par entreprise
    
    for (let i = 0; i < numJobs; i++) {
      // Sélectionner un recruteur pour cette entreprise
      const postedBy = company.recruiters.length > 0 
        ? company.recruiters[Math.floor(Math.random() * company.recruiters.length)]
        : company.createdBy;
      
      // Sélectionner des compétences aléatoires
      const reqSkills = technicalSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 3); // 3-7 compétences requises
        
      const prefSkills = softSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 compétences préférées
      
      // Créer l'offre d'emploi à partir des données de seeding
      const jobTemplate = jobSeeds.getRandomJob();
      
      const job = new Job({
        title: jobTemplate.title,
        description: jobTemplate.description,
        company: company._id,
        postedBy: postedBy,
        location: company.headquarters.city,
        remote: Math.random() > 0.4, // 60% de chance d'être en remote
        type: ['full-time', 'part-time', 'contract', 'internship', 'remote'][Math.floor(Math.random() * 5)],
        salary: {
          min: 30000 + Math.floor(Math.random() * 20000),
          max: 60000 + Math.floor(Math.random() * 40000),
          currency: 'EUR',
          isPublic: Math.random() > 0.2 // 80% de chance d'être public
        },
        experienceLevel: ['entry', 'junior', 'mid-level', 'senior', 'executive'][Math.floor(Math.random() * 5)],
        requiredSkills: reqSkills.map(skill => skill._id),
        preferredSkills: prefSkills.map(skill => skill._id),
        responsibilities: jobTemplate.responsibilities,
        requirements: jobTemplate.requirements,
        benefits: company.benefits,
        status: 'active',
        deadline: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Date d'échéance aléatoire dans les 30 jours
      });
      
      await job.save();
    }
  }
  
  const totalJobs = await Job.countDocuments();
  console.log(`${totalJobs} offres d'emploi ajoutées`);
};

// Ajouter les candidatures
const seedApplications = async () => {
  console.log('Ajout des candidatures...');
  
  const applicationsCount = await Application.countDocuments();
  
  if (applicationsCount > 0) {
    console.log(`Les candidatures existent déjà (${applicationsCount} trouvées)`);
    return;
  }
  
  // Récupérer les jobs actifs
  const jobs = await Job.find({ status: 'active' });
  
  if (jobs.length === 0) {
    console.log('Aucune offre d\'emploi trouvée. Les candidatures ne peuvent pas être créées.');
    return;
  }
  
  // Récupérer les candidats
  const jobSeekers = await User.find({ role: 'jobseeker' });
  
  if (jobSeekers.length === 0) {
    console.log('Aucun candidat trouvé. Les candidatures ne peuvent pas être créées.');
    return;
  }
  
  // Pour chaque candidat, créer plusieurs candidatures
  for (const jobSeeker of jobSeekers) {
    // Sélectionner 1 à 3 jobs aléatoirement
    const numApplications = Math.floor(Math.random() * 3) + 1;
    const selectedJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, numApplications);
    
    for (const job of selectedJobs) {
      // Vérifier si une candidature existe déjà
      const existingApplication = await Application.findOne({
        job: job._id,
        applicant: jobSeeker._id
      });
      
      if (existingApplication) continue;
      
      // Créer la candidature
      const application = new Application({
        job: job._id,
        applicant: jobSeeker._id,
        company: job.company,
        status: ['pending', 'reviewed', 'interviewed', 'rejected', 'offered', 'hired'][Math.floor(Math.random() * 6)],
        coverLetter: `Je suis très intéressé(e) par ce poste de ${job.title} chez votre entreprise. Avec mon expérience en développement, je pense pouvoir apporter une contribution significative à votre équipe.`,
        resumeUrl: 'resumes/default-resume.pdf',
        isRead: Math.random() > 0.5
      });
      
      // Si la candidature est dans un statut avancé, ajouter des notes
      if (['reviewed', 'interviewed', 'rejected', 'offered', 'hired'].includes(application.status)) {
        application.notes.push({
          content: `Candidature ${application.status === 'rejected' ? 'rejetée' : 'intéressante'}. ${application.status === 'interviewed' ? 'À programmer un entretien.' : ''}`,
          createdBy: job.postedBy
        });
      }
      
      // Si la candidature est au stade d'entretien ou plus avancé, ajouter un entretien
      if (['interviewed', 'offered', 'hired'].includes(application.status)) {
        application.interviews.push({
          date: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
          type: ['phone', 'video', 'in-person'][Math.floor(Math.random() * 3)],
          status: ['scheduled', 'completed'][Math.floor(Math.random() * 2)],
          interviewers: [job.postedBy]
        });
      }
      
      // Calculer un score de correspondance
      await application.calculateMatchScore();
      
      await application.save();
    }
  }
  
  const totalApplications = await Application.countDocuments();
  console.log(`${totalApplications} candidatures ajoutées`);
};

// Exécuter le seeding si ce fichier est exécuté directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Script de seeding exécuté avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erreur lors de l\'exécution du script de seeding:', error);
      process.exit(1);
    });
} else {
  // Exporter les fonctions pour une utilisation dans d'autres fichiers
  module.exports = {
    seedDatabase,
    seedSkills,
    seedUsers,
    seedCompanies,
    seedJobs,
    seedApplications
  };
}