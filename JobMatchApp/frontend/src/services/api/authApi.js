import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Authentication API service
 */
const authApi = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response promise
   */
  login: (email, password) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },
  
  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response promise
   */
  register: (userData) => {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
  
  /**
   * Log out user
   * @returns {Promise} Response promise
   */
  logout: () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  /**
   * Get current user profile
   * @returns {Promise} Response promise
   */
  getProfile: () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },
  
  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Response promise
   */
  updateProfile: (userData) => {
    return api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, userData);
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Response promise
   */
  forgotPassword: (email) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} Response promise
   */
  resetPassword: (token, password) => {
    return api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password });
  },
  
  /**
   * Update user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Response promise
   */
  updatePassword: (currentPassword, newPassword) => {
    return api.put(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, { 
      currentPassword, 
      newPassword 
    });
  },
  
  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} Response promise
   */
  refreshToken: (refreshToken) => {
    return api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },
};

export default authApi;