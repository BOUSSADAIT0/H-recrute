const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de compétence pour MongoDB
 */
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

// Méthode pour ajouter des compétences liées
SkillSchema.methods.addRelatedSkill = async function(skillId) {
  if (!this.relatedSkills.includes(skillId)) {
    this.relatedSkills.push(skillId);
    await this.save();
  }
  return this;
};

// Méthode pour rechercher des compétences par nom ou alias
SkillSchema.statics.searchByNameOrAlias = async function(term) {
  return this.find({
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { aliases: { $regex: term, $options: 'i' } }
    ]
  });
};

// Créer et exporter le modèle
const Skill = mongoose.model('Skill', SkillSchema);
module.exports = Skill;