const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma offre d'emploi pour MongoDB
 */
const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'EUR'
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid-level', 'senior', 'executive'],
    required: true
  },
  requiredSkills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  preferredSkills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  responsibilities: [String],
  requirements: [String],
  benefits: [String],
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application'
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  deadline: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour la recherche de texte
JobSchema.index({
  title: 'text',
  description: 'text',
  'requirements': 'text',
  'responsibilities': 'text'
});

// Middleware pour mettre à jour le compteur d'applications
JobSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Ajouter ce job à la liste des jobs de l'entreprise
    await mongoose.model('Company').updateOne(
      { _id: this.company },
      { $push: { jobs: this._id } }
    );
  }
  next();
});

// Méthode pour incrémenter le compteur de vues
JobSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Méthode pour marquer un emploi comme pourvu
JobSchema.methods.markAsFilled = async function() {
  this.status = 'filled';
  return this.save();
};

// Méthode statique pour rechercher des emplois
JobSchema.statics.searchJobs = async function(criteria = {}) {
  const query = {};
  
  // Filtrer par statut actif par défaut
  query.status = criteria.status || 'active';
  
  // Recherche par titre ou mot-clé
  if (criteria.keyword) {
    query.$text = { $search: criteria.keyword };
  }
  
  // Filtres supplémentaires si spécifiés
  if (criteria.location) {
    query.location = { $regex: criteria.location, $options: 'i' };
  }
  
  if (criteria.type) {
    query.type = criteria.type;
  }
  
  if (criteria.experienceLevel) {
    query.experienceLevel = criteria.experienceLevel;
  }
  
  if (criteria.skills && criteria.skills.length > 0) {
    query.requiredSkills = { $in: criteria.skills };
  }
  
  if (criteria.salaryMin) {
    query['salary.max'] = { $gte: criteria.salaryMin };
  }
  
  if (criteria.salaryMax) {
    query['salary.min'] = { $lte: criteria.salaryMax };
  }
  
  if (criteria.remote === true) {
    query.remote = true;
  }
  
  // Exécuter la requête
  return this.find(query)
    .populate('company', 'name logo location')
    .populate('requiredSkills', 'name category')
    .sort(criteria.sort || { createdAt: -1 });
};

// Créer et exporter le modèle
const Job = mongoose.model('Job', JobSchema);
module.exports = Job;