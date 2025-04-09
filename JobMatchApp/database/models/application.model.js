const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de candidature pour MongoDB
 */
const ApplicationSchema = new Schema({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'offered', 'hired', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  answers: [{
    question: String,
    answer: String
  }],
  notes: [{
    content: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  interviews: [{
    date: Date,
    location: String,
    interviewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person'],
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: String
  }],
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  isWithdrawn: {
    type: Boolean,
    default: false
  },
  withdrawReason: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index composé pour garantir qu'un utilisateur ne puisse postuler qu'une seule fois à un emploi
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Middleware pour mettre à jour le job et incrémenter le compteur d'applications
ApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Incrémenter le compteur d'applications pour le job
      await mongoose.model('Job').updateOne(
        { _id: this.job },
        { 
          $inc: { applicationCount: 1 },
          $push: { applications: this._id }
        }
      );
      
      // Créer une notification pour l'employeur
      const job = await mongoose.model('Job').findById(this.job).populate('postedBy');
      
      if (job && job.postedBy) {
        const Notification = mongoose.model('Notification');
        await Notification.create({
          recipient: job.postedBy._id,
          type: 'application',
          message: `Nouvelle candidature pour : ${job.title}`,
          relatedId: this._id,
          relatedType: 'application'
        });
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Méthode pour changer le statut
ApplicationSchema.methods.updateStatus = async function(newStatus, note = '') {
  this.status = newStatus;
  
  if (note) {
    this.notes.push({
      content: `Statut mis à jour vers ${newStatus}: ${note}`,
      createdBy: this.applicant
    });
  }
  
  // Créer une notification pour le candidat
  try {
    const Notification = mongoose.model('Notification');
    const job = await mongoose.model('Job').findById(this.job);
    
    await Notification.create({
      recipient: this.applicant,
      type: 'status',
      message: `Votre candidature pour ${job.title} a été mise à jour : ${newStatus}`,
      relatedId: this._id,
      relatedType: 'application'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
  
  return this.save();
};

// Méthode pour ajouter un entretien
ApplicationSchema.methods.scheduleInterview = async function(interviewData) {
  this.interviews.push(interviewData);
  this.status = 'interviewed';
  
  // Créer une notification pour le candidat
  try {
    const Notification = mongoose.model('Notification');
    const job = await mongoose.model('Job').findById(this.job);
    
    await Notification.create({
      recipient: this.applicant,
      type: 'interview',
      message: `Entretien programmé pour votre candidature à ${job.title}`,
      relatedId: this._id,
      relatedType: 'application'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
  
  return this.save();
};

// Méthode pour retirer la candidature
ApplicationSchema.methods.withdraw = async function(reason) {
  this.status = 'withdrawn';
  this.isWithdrawn = true;
  this.withdrawReason = reason;
  return this.save();
};

// Méthode pour calculer le score de correspondance
ApplicationSchema.methods.calculateMatchScore = async function() {
  try {
    // Récupérer le job et les compétences du candidat
    const job = await mongoose.model('Job').findById(this.job)
      .populate('requiredSkills')
      .populate('preferredSkills');
    
    const applicant = await mongoose.model('User').findById(this.applicant)
      .populate('skills');
    
    if (!job || !applicant) {
      this.matchScore = 0;
      return this.save();
    }
    
    // Convertir les compétences en ensembles d'IDs pour faciliter la comparaison
    const candidateSkillIds = applicant.skills.map(skill => skill._id.toString());
    const requiredSkillIds = job.requiredSkills.map(skill => skill._id.toString());
    const preferredSkillIds = job.preferredSkills.map(skill => skill._id.toString());
    
    // Calculer le match des compétences requises (pondération plus élevée)
    let requiredMatchCount = 0;
    requiredSkillIds.forEach(skillId => {
      if (candidateSkillIds.includes(skillId)) {
        requiredMatchCount++;
      }
    });
    
    const requiredMatchScore = requiredSkillIds.length > 0
      ? (requiredMatchCount / requiredSkillIds.length) * 70
      : 70;
    
    // Calculer le match des compétences préférées (pondération moins élevée)
    let preferredMatchCount = 0;
    preferredSkillIds.forEach(skillId => {
      if (candidateSkillIds.includes(skillId)) {
        preferredMatchCount++;
      }
    });
    
    const preferredMatchScore = preferredSkillIds.length > 0
      ? (preferredMatchCount / preferredSkillIds.length) * 30
      : 30;
    
    // Calculer le score total
    const totalScore = Math.round(requiredMatchScore + preferredMatchScore);
    
    // Mettre à jour le score
    this.matchScore = totalScore;
    return this.save();
  } catch (error) {
    console.error('Erreur lors du calcul du score de correspondance:', error);
    return this;
  }
};

// Créer et exporter le modèle
const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;