// JobMatchApp/backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { validateUserUpdate } = require('../middlewares/validation.middleware');

/**
 * @route GET /api/users
 * @desc Récupérer tous les utilisateurs
 * @access Private (Admin)
 */
router.get('/', authenticateJWT, authorizeRole(['admin']), userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Récupérer un utilisateur par ID
 * @access Private
 */
router.get('/:id', authenticateJWT, userController.getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Mettre à jour un utilisateur
 * @access Private
 */
router.put('/:id', authenticateJWT, validateUserUpdate, userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Supprimer un utilisateur
 * @access Private
 */
router.delete('/:id', authenticateJWT, userController.deleteUser);

/**
 * @route GET /api/users/:id/profile
 * @desc Récupérer le profil complet d'un utilisateur
 * @access Private
 */
router.get('/:id/profile', authenticateJWT, userController.getUserProfile);

/**
 * @route PUT /api/users/:id/resume
 * @desc Mettre à jour le CV d'un utilisateur
 * @access Private
 */
router.put('/:id/resume', authenticateJWT, userController.updateResume);

/**
 * @route GET /api/users/:id/applications
 * @desc Récupérer les candidatures d'un utilisateur
 * @access Private
 */
router.get('/:id/applications', authenticateJWT, userController.getUserApplications);

/**
 * @route PUT /api/users/:id/skills
 * @desc Mettre à jour les compétences d'un utilisateur
 * @access Private
 */
router.put('/:id/skills', authenticateJWT, userController.updateUserSkills);

module.exports = router;