import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Company API service
 */
const companyApi = {
  /**
   * Get all companies
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getCompanies: (params = {}) => {
    return api.get(API_ENDPOINTS.COMPANIES.LIST, { params });
  },
  
  /**
   * Get company by ID
   * @param {string} companyId - Company ID
   * @returns {Promise} Response promise
   */
  getCompanyById: (companyId) => {
    const url = API_ENDPOINTS.COMPANIES.DETAIL.replace(':id', companyId);
    return api.get(url);
  },
  
  /**
   * Create new company
   * @param {Object} companyData - Company data
   * @returns {Promise} Response promise
   */
  createCompany: (companyData) => {
    return api.post(API_ENDPOINTS.COMPANIES.CREATE, companyData);
  },
  
  /**
   * Update company
   * @param {string} companyId - Company ID
   * @param {Object} companyData - Updated company data
   * @returns {Promise} Response promise
   */
  updateCompany: (companyId, companyData) => {
    const url = API_ENDPOINTS.COMPANIES.UPDATE.replace(':id', companyId);
    return api.put(url, companyData);
  },
  
  /**
   * Delete company
   * @param {string} companyId - Company ID
   * @returns {Promise} Response promise
   */
  deleteCompany: (companyId) => {
    const url = API_ENDPOINTS.COMPANIES.DETAIL.replace(':id', companyId);
    return api.delete(url);
  },
  
  /**
   * Get company jobs
   * @param {string} companyId - Company ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getCompanyJobs: (companyId, params = {}) => {
    const url = API_ENDPOINTS.COMPANIES.JOBS.replace(':id', companyId);
    return api.get(url, { params });
  },
  
  /**
   * Upload company logo
   * @param {string} companyId - Company ID
   * @param {FormData} formData - Form data with logo file
   * @returns {Promise} Response promise
   */
  uploadCompanyLogo: (companyId, formData) => {
    const url = API_ENDPOINTS.COMPANIES.LOGO.replace(':id', companyId);
    return api.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  /**
   * Get user's companies
   * @returns {Promise} Response promise
   */
  getUserCompanies: () => {
    return api.get('/companies/user');
  },
  
  /**
   * Search companies
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Response promise
   */
  searchCompanies: (searchParams) => {
    return api.get('/companies/search', { params: searchParams });
  }
};

export default companyApi;