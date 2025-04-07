// JobMatchApp/backend/src/routes/application.routes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { validateApplication } = require('../middlewares/validation.middleware');

/**
 * @route POST /api/applications
 * @desc Soumettre une candidature pour un emploi
 * @access Private
 */
router.post(
  '/',
  authenticateJWT,
  validateApplication,
  applicationController.submitApplication
);

/**
 * @route GET /api/applications/:id
 * @desc Récupérer une candidature par ID
 * @access Private
 */
router.get('/:id', authenticateJWT, applicationController.getApplicationById);

/**
 * @route PUT /api/applications/:id/status
 * @desc Mettre à jour le statut d'une candidature
 * @access Private (Recruteur, Admin)
 */
router.put(
  '/:id/status',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  applicationController.updateApplicationStatus
);

/**
 * @route DELETE /api/applications/:id
 * @desc Supprimer une candidature
 * @access Private
 */
router.delete('/:id', authenticateJWT, applicationController.deleteApplication);

/**
 * @route GET /api/applications
 * @desc Récupérer toutes les candidatures (avec filtres)
 * @access Private (Admin)
 */
router.get(
  '/',
  authenticateJWT,
  authorizeRole(['admin']),
  applicationController.getAllApplications
);

/**
 * @route POST /api/applications/:id/message
 * @desc Ajouter un message à une candidature
 * @access Private
 */
router.post(
  '/:id/message',
  authenticateJWT,
  applicationController.addApplicationMessage
);

/**
 * @route GET /api/applications/:id/messages
 * @desc Récupérer les messages d'une candidature
 * @access Private
 */
router.get(
  '/:id/messages',
  authenticateJWT,
  applicationController.getApplicationMessages
);

module.exports = router;