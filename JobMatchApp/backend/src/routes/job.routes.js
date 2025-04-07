// JobMatchApp/backend/src/routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { validateJobCreation, validateJobUpdate } = require('../middlewares/validation.middleware');

/**
 * @route GET /api/jobs
 * @desc Récupérer toutes les offres d'emploi avec filtrage
 * @access Public
 */
router.get('/', jobController.getAllJobs);

/**
 * @route POST /api/jobs
 * @desc Créer une nouvelle offre d'emploi
 * @access Private (Recruteur, Admin)
 */
router.post(
  '/',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  validateJobCreation,
  jobController.createJob
);

/**
 * @route GET /api/jobs/:id
 * @desc Récupérer une offre d'emploi par ID
 * @access Public
 */
router.get('/:id', jobController.getJobById);

/**
 * @route PUT /api/jobs/:id
 * @desc Mettre à jour une offre d'emploi
 * @access Private (Recruteur, Admin)
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  validateJobUpdate,
  jobController.updateJob
);

/**
 * @route DELETE /api/jobs/:id
 * @desc Supprimer une offre d'emploi
 * @access Private (Recruteur, Admin)
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  jobController.deleteJob
);

/**
 * @route GET /api/jobs/:id/applications
 * @desc Récupérer les candidatures pour une offre d'emploi
 * @access Private (Recruteur, Admin)
 */
router.get(
  '/:id/applications',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  jobController.getJobApplications
);

/**
 * @route GET /api/jobs/search
 * @desc Rechercher des offres d'emploi
 * @access Public
 */
router.get('/search', jobController.searchJobs);

/**
 * @route GET /api/jobs/recommended/:userId
 * @desc Obtenir des offres d'emploi recommandées pour un utilisateur
 * @access Private
 */
router.get('/recommended/:userId', authenticateJWT, jobController.getRecommendedJobs);

module.exports = router;