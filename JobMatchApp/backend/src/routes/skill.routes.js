// JobMatchApp/backend/src/routes/skill.routes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { validateSkill } = require('../middlewares/validation.middleware');

/**
 * @route GET /api/skills
 * @desc Récupérer toutes les compétences
 * @access Public
 */
router.get('/', skillController.getAllSkills);

/**
 * @route POST /api/skills
 * @desc Créer une nouvelle compétence
 * @access Private (Admin)
 */
router.post(
  '/',
  authenticateJWT,
  authorizeRole(['admin']),
  validateSkill,
  skillController.createSkill
);

/**
 * @route GET /api/skills/:id
 * @desc Récupérer une compétence par ID
 * @access Public
 */
router.get('/:id', skillController.getSkillById);

/**
 * @route PUT /api/skills/:id
 * @desc Mettre à jour une compétence
 * @access Private (Admin)
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizeRole(['admin']),
  validateSkill,
  skillController.updateSkill
);

/**
 * @route DELETE /api/skills/:id
 * @desc Supprimer une compétence
 * @access Private (Admin)
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(['admin']),
  skillController.deleteSkill
);

/**
 * @route GET /api/skills/categories
 * @desc Récupérer toutes les catégories de compétences
 * @access Public
 */
router.get('/categories', skillController.getSkillCategories);

/**
 * @route GET /api/skills/trending
 * @desc Récupérer les compétences tendance
 * @access Public
 */
router.get('/trending', skillController.getTrendingSkills);

/**
 * @route GET /api/skills/search
 * @desc Rechercher des compétences
 * @access Public
 */
router.get('/search', skillController.searchSkills);

module.exports = router;