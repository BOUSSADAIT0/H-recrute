// JobMatchApp/backend/src/models/Job.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
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
    await mongoose.models.Company.updateOne(
      { _id: this.company },
      { $push: { jobs: this._id } }
    );
  }
  next();
});

// Méthode pour marquer un emploi comme pourvu
JobSchema.methods.markAsFilled = async function() {
  this.status = 'filled';
  return this.save();
};

// Créer et exporter le modèle
const Job = mongoose.model('Job', JobSchema);
module.exports = Job;