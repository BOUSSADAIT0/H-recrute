const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');

/**
 * Service for handling feedback operations
 */
class FeedbackService {
  /**
   * Create a new feedback
   * @param {Object} feedbackData - Feedback data
   * @param {string} userId - User ID of person giving feedback
   * @returns {Promise<Object>} - Newly created feedback
   */
  async createFeedback(feedbackData, userId) {
    try {
      // Validate referenced entities exist
      if (feedbackData.targetType === 'user') {
        const targetUser = await User.findById(feedbackData.targetId);
        if (!targetUser) {
          throw new Error('Target user not found');
        }
      } else if (feedbackData.targetType === 'job') {
        const job = await Job.findById(feedbackData.targetId);
        if (!job) {
          throw new Error('Target job not found');
        }
      } else if (feedbackData.targetType === 'application') {
        const application = await Application.findById(feedbackData.targetId);
        if (!application) {
          throw new Error('Target application not found');
        }
      } else {
        throw new Error('Invalid target type');
      }
      
      // Create new feedback
      const newFeedback = new Feedback({
        provider: userId,
        targetId: feedbackData.targetId,
        targetType: feedbackData.targetType,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        createdAt: new Date()
      });
      
      await newFeedback.save();
      
      // Populate provider details
      const populatedFeedback = await Feedback.findById(newFeedback._id)
        .populate('provider', 'firstName lastName avatar role');
      
      return populatedFeedback;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback by ID
   * @param {string} feedbackId - Feedback ID
   * @returns {Promise<Object>} - Feedback object
   */
  async getFeedbackById(feedbackId) {
    try {
      const feedback = await Feedback.findById(feedbackId)
        .populate('provider', 'firstName lastName avatar role');
      
      if (!feedback) {
        throw new Error('Feedback not found');
      }
      
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a feedback
   * @param {string} feedbackId - Feedback ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Updated feedback
   */
  async updateFeedback(feedbackId, updateData, userId) {
    try {
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        throw new Error('Feedback not found');
      }
      
      // Verify ownership
      if (feedback.provider.toString() !== userId) {
        throw new Error('You are not authorized to update this feedback');
      }
      
      // Update feedback
      if (updateData.rating !== undefined) {
        feedback.rating = updateData.rating;
      }
      
      if (updateData.comment !== undefined) {
        feedback.comment = updateData.comment;
      }
      
      feedback.updatedAt = new Date();
      await feedback.save();
      
      // Populate provider details
      const populatedFeedback = await Feedback.findById(feedback._id)
        .populate('provider', 'firstName lastName avatar role');
      
      return populatedFeedback;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a feedback
   * @param {string} feedbackId - Feedback ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFeedback(feedbackId, userId) {
    try {
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        throw new Error('Feedback not found');
      }
      
      // Verify ownership or admin
      const user = await User.findById(userId);
      const isAdmin = user && user.role === 'admin';
      const isOwner = feedback.provider.toString() === userId;
      
      if (!isOwner && !isAdmin) {
        throw new Error('You are not authorized to delete this feedback');
      }
      
      await Feedback.findByIdAndDelete(feedbackId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback for a target
   * @param {string} targetId - Target ID
   * @param {string} targetType - Target type (user, job, application)
   * @returns {Promise<Array>} - Array of feedback
   */
  async getFeedbackForTarget(targetId, targetType) {
    try {
      // Validate target type
      if (!['user', 'job', 'application'].includes(targetType)) {
        throw new Error('Invalid target type');
      }
      
      const feedback = await Feedback.find({
        targetId,
        targetType
      })
        .populate('provider', 'firstName lastName avatar role')
        .sort({ createdAt: -1 });
      
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback statistics for a target
   * @param {string} targetId - Target ID
   * @param {string} targetType - Target type (user, job, application)
   * @returns {Promise<Object>} - Feedback statistics
   */
  async getFeedbackStats(targetId, targetType) {
    try {
      // Validate target type
      if (!['user', 'job', 'application'].includes(targetType)) {
        throw new Error('Invalid target type');
      }
      
      // Get all feedback for the target
      const allFeedback = await Feedback.find({
        targetId,
        targetType
      });
      
      if (allFeedback.length === 0) {
        return {
          averageRating: 0,
          totalCount: 0,
          ratingDistribution: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
          }
        };
      }
      
      // Calculate average rating
      const sum = allFeedback.reduce((acc, feedback) => acc + feedback.rating, 0);
      const averageRating = sum / allFeedback.length;
      
      // Calculate rating distribution
      const ratingDistribution = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
      };
      
      allFeedback.forEach(feedback => {
        ratingDistribution[feedback.rating.toString()]++;
      });
      
      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalCount: allFeedback.length,
        ratingDistribution
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback from a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of feedback
   */
  async getFeedbackFromUser(userId) {
    try {
      const feedback = await Feedback.find({ provider: userId })
        .populate('provider', 'firstName lastName avatar role')
        .sort({ createdAt: -1 });
      
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user has already provided feedback
   * @param {string} userId - User ID
   * @param {string} targetId - Target ID
   * @param {string} targetType - Target type
   * @returns {Promise<boolean>} - True if feedback exists
   */
  async hasFeedback(userId, targetId, targetType) {
    try {
      const feedback = await Feedback.findOne({
        provider: userId,
        targetId,
        targetType
      });
      
      return feedback !== null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FeedbackService();