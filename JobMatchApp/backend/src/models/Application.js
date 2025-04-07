// JobMatchApp/backend/src/models/Application.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// Middleware pour mettre à jour le job et incrémenter le compteur d'applications
ApplicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Incrémenter le compteur d'applications pour le job
    await mongoose.models.Job.updateOne(
      { _id: this.job },
      { 
        $inc: { applicationCount: 1 },
        $push: { applications: this._id }
      }
    );
  }
  next();
});

// Méthode pour changer le statut
ApplicationSchema.methods.updateStatus = async function(newStatus, note = '') {
  this.status = newStatus;
  
  if (note) {
    this.notes.push({
      content: `Status updated to ${newStatus}: ${note}`,
      createdBy: this.applicant // Ou un autre utilisateur qui fait la mise à jour
    });
  }
  
  return this.save();
};

// Créer et exporter le modèle
const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;