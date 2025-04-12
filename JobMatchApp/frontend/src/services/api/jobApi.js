import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Job API service
 */
const jobApi = {
  /**
   * Get all jobs with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} Response promise
   */
  getJobs: (params = {}) => {
    return api.get(API_ENDPOINTS.JOBS.LIST, { params });
  },
  
  /**
   * Get job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise} Response promise
   */
  getJobById: (jobId) => {
    const url = API_ENDPOINTS.JOBS.DETAIL.replace(':id', jobId);
    return api.get(url);
  },
  
  /**
   * Create new job
   * @param {string} companyId - Company ID
   * @param {Object} jobData - Job data
   * @returns {Promise} Response promise
   */
  createJob: (companyId, jobData) => {
    const url = `/companies/${companyId}/jobs`;
    return api.post(url, jobData);
  },
  
  /**
   * Update job
   * @param {string} jobId - Job ID
   * @param {Object} jobData - Updated job data
   * @returns {Promise} Response promise
   */
  updateJob: (jobId, jobData) => {
    const url = API_ENDPOINTS.JOBS.UPDATE.replace(':id', jobId);
    return api.put(url, jobData);
  },
  
  /**
   * Delete job
   * @param {string} jobId - Job ID
   * @returns {Promise} Response promise
   */
  deleteJob: (jobId) => {
    const url = API_ENDPOINTS.JOBS.DELETE.replace(':id', jobId);
    return api.delete(url);
  },
  
  /**
   * Search jobs
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Response promise
   */
  searchJobs: (searchParams) => {
    return api.get(API_ENDPOINTS.JOBS.SEARCH, { params: searchParams });
  },
  
  /**
   * Get recommended jobs for user
   * @returns {Promise} Response promise
   */
  getRecommendedJobs: () => {
    return api.get(API_ENDPOINTS.JOBS.RECOMMENDED);
  },
  
  /**
   * Get jobs posted by current user
   * @returns {Promise} Response promise
   */
  getMyJobs: () => {
    return api.get(API_ENDPOINTS.JOBS.MY_JOBS);
  },
  
  /**
   * Toggle job status (active/inactive)
   * @param {string} jobId - Job ID
   * @returns {Promise} Response promise
   */
  toggleJobStatus: (jobId) => {
    const url = `/jobs/${jobId}/toggle-status`;
    return api.put(url);
  },
  
  /**
   * Get job applications
   * @param {string} jobId - Job ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getJobApplications: (jobId, params = {}) => {
    const url = `/jobs/${jobId}/applications`;
    return api.get(url, { params });
  },
};

export default jobApi;