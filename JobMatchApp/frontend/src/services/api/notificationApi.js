import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Notification API service
 */
const notificationApi = {
  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  getNotifications: (params = {}) => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
  },
  
  /**
   * Get unread notifications count
   * @returns {Promise} Response promise
   */
  getUnreadCount: () => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },
  
  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Response promise
   */
  markAsRead: (notificationId) => {
    const url = API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':id', notificationId);
    return api.put(url);
  },
  
  /**
   * Mark all notifications as read
   * @returns {Promise} Response promise
   */
  markAllAsRead: () => {
    return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
  
  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Response promise
   */
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },
  
  /**
   * Delete all read notifications
   * @returns {Promise} Response promise
   */
  deleteReadNotifications: () => {
    return api.delete('/notifications/read');
  },
  
  /**
   * Get notifications by type
   * @param {string} type - Notification type
   * @returns {Promise} Response promise
   */
  getNotificationsByType: (type) => {
    return api.get(`/notifications/type/${type}`);
  }
};

export default notificationApi;