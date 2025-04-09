const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma entreprise pour MongoDB
 */
const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    default: 'default-company-logo.png'
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true
  },
  foundedYear: {
    type: Number
  },
  headquarters: {
    address: String,
    city: String,
    country: String,
    postalCode: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  recruiters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  companyValues: [String],
  benefits: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Méthode pour obtenir les statistiques de l'entreprise
CompanySchema.methods.getStats = async function() {
  const Job = mongoose.model('Job');
  const Application = mongoose.model('Application');
  
  const totalJobs = await Job.countDocuments({ company: this._id });
  const activeJobs = await Job.countDocuments({ 
    company: this._id,
    status: 'active'
  });
  const totalApplications = await Application.countDocuments({
    job: { $in: this.jobs }
  });
  
  return {
    totalJobs,
    activeJobs,
    totalApplications
  };
};

// Méthode pour ajouter un job à l'entreprise
CompanySchema.methods.addJob = async function(jobId) {
  if (!this.jobs.includes(jobId)) {
    this.jobs.push(jobId);
    await this.save();
  }
  return this;
};

// Méthode pour ajouter un recruteur à l'entreprise
CompanySchema.methods.addRecruiter = async function(recruiterId) {
  if (!this.recruiters.includes(recruiterId)) {
    this.recruiters.push(recruiterId);
    await this.save();
  }
  return this;
};

// Index de recherche texte
CompanySchema.index({ 
  name: 'text',
  description: 'text',
  industry: 'text'
});

// Créer et exporter le modèle
const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;