const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Service for handling notifications
 */
class NotificationService {
  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @param {mongoose.ClientSession} session - MongoDB session for transactions
   * @returns {Promise<Object>} - Newly created notification
   */
  async createNotification(notificationData, session = null) {
    try {
      const newNotification = new Notification({
        ...notificationData,
        isRead: false,
        createdAt: new Date()
      });
      
      if (session) {
        await newNotification.save({ session });
      } else {
        await newNotification.save();
      }
      
      return newNotification;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get notifications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const query = { recipient: userId };
      
      // Apply read/unread filter if provided
      if (options.isRead !== undefined) {
        query.isRead = options.isRead;
      }
      
      // Apply type filter if provided
      if (options.type) {
        query.type = options.type;
      }
      
      // Get notifications with pagination
      const limit = options.limit || 20;
      const skip = options.skip || 0;
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return notifications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
      });
      
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Updated notification
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      // Verify recipient
      if (notification.recipient.toString() !== userId) {
        throw new Error('You are not authorized to update this notification');
      }
      
      // Update notification
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
      
      return notification;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of notifications updated
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      
      return result.nModified || 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      // Verify recipient
      if (notification.recipient.toString() !== userId) {
        throw new Error('You are not authorized to delete this notification');
      }
      
      // Delete notification
      await Notification.findByIdAndDelete(notificationId);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete all read notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of notifications deleted
   */
  async deleteAllRead(userId) {
    try {
      const result = await Notification.deleteMany({
        recipient: userId,
        isRead: true
      });
      
      return result.deletedCount || 0;
    } catch (error) {
      throw error;
    }
  }
}