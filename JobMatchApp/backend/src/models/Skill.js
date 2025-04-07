// JobMatchApp/backend/src/models/Skill.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language', 'certification', 'other'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  aliases: [{
    type: String,
    trim: true
  }],
  relatedSkills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  popularity: {
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
SkillSchema.index({
  name: 'text',
  'aliases': 'text',
  description: 'text'
});

// Méthode statique pour obtenir les compétences les plus populaires
SkillSchema.statics.getPopularSkills = async function(limit = 10, category = null) {
  const query = category ? { category } : {};
  
  return this.find(query)
    .sort({ popularity: -1 })
    .limit(limit);
};

// Méthode pour incrémenter la popularité
SkillSchema.methods.incrementPopularity = async function() {
  this.popularity += 1;
  return this.save();
};

// Créer et exporter le modèle
const Skill = mongoose.model('Skill', SkillSchema);
module.exports = Skill;