const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de profil utilisateur pour MongoDB
 */

// Sous-schéma pour l'expérience professionnelle
const WorkExperienceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: String
});

// Sous-schéma pour l'éducation
const EducationSchema = new Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: String,
  grade: String
});

// Sous-schéma pour les certifications
const CertificationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  issuingOrganization: {
    type: String,
    required: true
  },
  issueDate: Date,
  expirationDate: Date,
  credentialId: String,
  credentialUrl: String
});

// Sous-schéma pour les projets
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: Date,
  endDate: Date,
  url: String,
  technologies: [String]
});

// Schéma principal de profil utilisateur
const UserProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  headline: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native']
    }
  }],
  skills: [{
    skill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number
  }],
  workExperience: [WorkExperienceSchema],
  education: [EducationSchema],
  certifications: [CertificationSchema],
  projects: [ProjectSchema],
  availability: {
    type: String,
    enum: ['immediate', '2_weeks', '1_month', 'more_than_1_month']
  },
  desiredSalary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  desiredLocations: [String],
  desiredJobTypes: [{
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
  }],
  remotePreference: {
    type: String,
    enum: ['remote_only', 'hybrid', 'on_site', 'no_preference']
  },
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour mettre à jour lastUpdated lors des modifications
UserProfileSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Méthode pour calculer la complétude du profil
UserProfileSchema.methods.calculateProfileCompleteness = function() {
  let score = 0;
  const totalFields = 10; // Nombre total de sections importantes
  
  // Vérifier les différentes sections du profil
  if (this.headline) score += 1;
  if (this.summary) score += 1;
  if (this.skills && this.skills.length > 0) score += 1;
  if (this.workExperience && this.workExperience.length > 0) score += 2;
  if (this.education && this.education.length > 0) score += 2;
  if (this.certifications && this.certifications.length > 0) score += 1;
  if (this.languages && this.languages.length > 0) score += 1;
  if (this.projects && this.projects.length > 0) score += 1;
  
  // Calcul du pourcentage
  this.profileCompleteness = Math.round((score / totalFields) * 100);
  return this.profileCompleteness;
};

// Méthode pour obtenir les compétences les plus pertinentes
UserProfileSchema.methods.getTopSkills = function(limit = 5) {
  // Trier par niveau d'expertise et années d'expérience
  const sortedSkills = [...this.skills].sort((a, b) => {
    const levelOrder = { 'expert': 4, 'advanced': 3, 'intermediate': 2, 'beginner': 1 };
    
    // D'abord par niveau
    const levelDiff = levelOrder[b.level] - levelOrder[a.level];
    if (levelDiff !== 0) return levelDiff;
    
    // Ensuite par années d'expérience
    return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
  });
  
  return sortedSkills.slice(0, limit);
};

// Créer et exporter le modèle
const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;