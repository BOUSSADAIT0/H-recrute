import api from '../../config/api';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Message API service
 */
const messageApi = {
  /**
   * Get user conversations
   * @returns {Promise} Response promise
   */
  getConversations: () => {
    return api.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  },
  
  /**
   * Create new conversation or get existing one
   * @param {string} receiverId - Receiver user ID
   * @returns {Promise} Response promise
   */
  createConversation: (receiverId) => {
    return api.post(API_ENDPOINTS.MESSAGES.CONVERSATIONS, { receiverId });
  },
  
  /**
   * Get messages from a conversation
   * @param {string} conversationId - Conversation ID
   * @param {Object} params - Query parameters (pagination, etc.)
   * @returns {Promise} Response promise
   */
  getMessages: (conversationId, params = {}) => {
    const url = API_ENDPOINTS.MESSAGES.MESSAGES.replace(':id', conversationId);
    return api.get(url, { params });
  },
  
  /**
   * Send a message
   * @param {string} conversationId - Conversation ID
   * @param {string} content - Message content
   * @param {Object} [attachments] - Optional attachments
   * @returns {Promise} Response promise
   */
  sendMessage: (conversationId, content, attachments = null) => {
    return api.post(API_ENDPOINTS.MESSAGES.SEND, {
      conversationId,
      content,
      attachments,
    });
  },
  
  /**
   * Get unread messages count
   * @returns {Promise} Response promise
   */
  getUnreadCount: () => {
    return api.get(API_ENDPOINTS.MESSAGES.UNREAD_COUNT);
  },
  
  /**
   * Mark messages as read
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Response promise
   */
  markAsRead: (conversationId) => {
    return api.put(`/messages/conversations/${conversationId}/read`);
  },
  
  /**
   * Delete a message
   * @param {string} messageId - Message ID
   * @returns {Promise} Response promise
   */
  deleteMessage: (messageId) => {
    return api.delete(`/messages/${messageId}`);
  },
  
  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Response promise
   */
  deleteConversation: (conversationId) => {
    return api.delete(`/messages/conversations/${conversationId}`);
  }
};

export default messageApi;