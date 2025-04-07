// JobMatchApp/backend/src/routes/company.routes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { validateCompanyCreation, validateCompanyUpdate } = require('../middlewares/validation.middleware');

/**
 * @route GET /api/companies
 * @desc Récupérer toutes les entreprises
 * @access Public
 */
router.get('/', companyController.getAllCompanies);

/**
 * @route POST /api/companies
 * @desc Créer une nouvelle entreprise
 * @access Private (Recruteur, Admin)
 */
router.post(
  '/',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  validateCompanyCreation,
  companyController.createCompany
);

/**
 * @route GET /api/companies/:id
 * @desc Récupérer une entreprise par ID
 * @access Public
 */
router.get('/:id', companyController.getCompanyById);

/**
 * @route PUT /api/companies/:id
 * @desc Mettre à jour une entreprise
 * @access Private (Recruteur de l'entreprise, Admin)
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  validateCompanyUpdate,
  companyController.updateCompany
);

/**
 * @route DELETE /api/companies/:id
 * @desc Supprimer une entreprise
 * @access Private (Admin)
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(['admin']),
  companyController.deleteCompany
);

/**
 * @route GET /api/companies/:id/jobs
 * @desc Récupérer les offres d'emploi d'une entreprise
 * @access Public
 */
router.get('/:id/jobs', companyController.getCompanyJobs);

/**
 * @route PUT /api/companies/:id/logo
 * @desc Mettre à jour le logo d'une entreprise
 * @access Private (Recruteur de l'entreprise, Admin)
 */
router.put(
  '/:id/logo',
  authenticateJWT,
  authorizeRole(['recruiter', 'admin']),
  companyController.updateCompanyLogo
);

/**
 * @route GET /api/companies/search
 * @desc Rechercher des entreprises
 * @access Public
 */
router.get('/search', companyController.searchCompanies);

module.exports = router;