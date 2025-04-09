const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

/**
 * Schéma utilisateur pour MongoDB
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png'
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'admin'],
    default: 'jobseeker'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  resumeUrl: {
    type: String
  },
  socialLinks: {
    linkedin: String,
    github: String,
    website: String
  },
  jobPreferences: {
    jobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
    }],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'EUR'
      }
    },
    locations: [String]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware pour hacher le mot de passe avant l'enregistrement
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour générer un token JWT
UserSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  return token;
};

// Créer et exporter le modèle
const User = mongoose.model('User', UserSchema);
module.exports = User;