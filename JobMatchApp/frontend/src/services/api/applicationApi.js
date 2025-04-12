import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Application API service
 */
const applicationApi = {
  /**
   * Get all applications (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getApplications: (params = {}) => {
    return api.get(API_ENDPOINTS.APPLICATIONS.LIST, { params });
  },
  
  /**
   * Get application by ID
   * @param {string} applicationId - Application ID
   * @returns {Promise} Response promise
   */
  getApplicationById: (applicationId) => {
    const url = API_ENDPOINTS.APPLICATIONS.DETAIL.replace(':id', applicationId);
    return api.get(url);
  },
  
  /**
   * Apply for a job
   * @param {string} jobId - Job ID
   * @param {Object} applicationData - Application data
   * @returns {Promise} Response promise
   */
  applyForJob: (jobId, applicationData) => {
    return api.post(`/jobs/${jobId}/applications`, applicationData);
  },
  
  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} status - New status
   * @param {string} [notes] - Optional notes about status change
   * @returns {Promise} Response promise
   */
  updateApplicationStatus: (applicationId, status, notes) => {
    const url = API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS.replace(':id', applicationId);
    return api.put(url, { status, notes });
  },
  
  /**
   * Delete application
   * @param {string} applicationId - Application ID
   * @returns {Promise} Response promise
   */
  deleteApplication: (applicationId) => {
    const url = API_ENDPOINTS.APPLICATIONS.DETAIL.replace(':id', applicationId);
    return api.delete(url);
  },
  
  /**
   * Get user's applications
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getUserApplications: (params = {}) => {
    return api.get(API_ENDPOINTS.APPLICATIONS.USER_APPLICATIONS, { params });
  },
  
  /**
   * Add notes to application
   * @param {string} applicationId - Application ID
   * @param {string} notes - Notes content
   * @returns {Promise} Response promise
   */
  addApplicationNotes: (applicationId, notes) => {
    return api.put(`/applications/${applicationId}/notes`, { notes });
  },
  
  /**
   * Schedule interview for application
   * @param {string} applicationId - Application ID
   * @param {Object} interviewData - Interview details
   * @returns {Promise} Response promise
   */
  scheduleInterview: (applicationId, interviewData) => {
    return api.post(`/applications/${applicationId}/interview`, interviewData);
  },
  
  /**
   * Withdraw application
   * @param {string} applicationId - Application ID
   * @param {string} [reason] - Withdrawal reason
   * @returns {Promise} Response promise
   */
  withdrawApplication: (applicationId, reason = '') => {
    return api.put(`/applications/${applicationId}/withdraw`, { reason });
  },
};

export default applicationApi;