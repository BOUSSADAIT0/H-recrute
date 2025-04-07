// JobMatchApp\backend\src\utils\validation.js
const Joi = require('joi');

// Schéma de validation pour l'inscription des utilisateurs
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('candidat', 'recruteur').required()
  });
  
  return schema.validate(data);
};

// Schéma de validation pour la connexion
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  return schema.validate(data);
};

// Schéma de validation pour le profil candidat
const candidateProfileValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    experience: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        company: Joi.string().required(),
        period: Joi.string().required(),
        description: Joi.string().required()
      })
    ),
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().required(),
        institution: Joi.string().required(),
        year: Joi.string().required()
      })
    ),
    location: Joi.string().required(),
    about: Joi.string().min(10).max(1000).required()
  });
  
  return schema.validate(data);
};

// Schéma de validation pour les offres d'emploi
const jobOfferValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    type: Joi.string().valid('CDI', 'CDD', 'Stage', 'Freelance').required(),
    description: Joi.string().min(10).required(),
    requirements: Joi.array().items(Joi.string()).min(1).required(),
    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string().default('EUR')
    })
  });
  
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  candidateProfileValidation,
  jobOfferValidation
};