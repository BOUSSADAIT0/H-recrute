module.exports = new BookmarkService();const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Service for handling bookmarks
 */
class BookmarkService {
  /**
   * Create a new bookmark
   * @param {string} userId - User ID
   * @param {string} itemId - ID of item to bookmark
   * @param {string} itemType - Type of item (job, profile)
   * @returns {Promise<Object>} - Newly created bookmark
   */
  async createBookmark(userId, itemId, itemType) {
    try {
      // Validate item type
      if (!['job', 'profile'].includes(itemType)) {
        throw new Error('Invalid item type');
      }
      
      // Check if bookmark already exists
      const existingBookmark = await Bookmark.findOne({
        user: userId,
        itemId,
        itemType
      });
      
      if (existingBookmark) {
        throw new Error(`This ${itemType} is already bookmarked`);
      }
      
      // Validate item exists
      if (itemType === 'job') {
        const job = await Job.findById(itemId);
        if (!job) {
          throw new Error('Job not found');
        }
      } else if (itemType === 'profile') {
        const user = await User.findById(itemId);
        if (!user) {
          throw new Error('Profile not found');
        }
      }
      
      // Create new bookmark
      const newBookmark = new Bookmark({
        user: userId,
        itemId,
        itemType,
        createdAt: new Date()
      });
      
      await newBookmark.save();
      return newBookmark;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a bookmark
   * @param {string} bookmarkId - Bookmark ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteBookmark(bookmarkId, userId) {
    try {
      const bookmark = await Bookmark.findById(bookmarkId);
      
      if (!bookmark) {
        throw new Error('Bookmark not found');
      }
      
      // Verify ownership
      if (bookmark.user.toString() !== userId) {
        throw new Error('You are not authorized to delete this bookmark');
      }
      
      await Bookmark.findByIdAndDelete(bookmarkId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove bookmark by item
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @param {string} itemType - Item type
   * @returns {Promise<boolean>} - Success status
   */
  async removeBookmarkByItem(userId, itemId, itemType) {
    try {
      // Validate item type
      if (!['job', 'profile'].includes(itemType)) {
        throw new Error('Invalid item type');
      }
      
      const result = await Bookmark.deleteOne({
        user: userId,
        itemId,
        itemType
      });
      
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's bookmarks
   * @param {string} userId - User ID
   * @param {string} itemType - Item type filter (optional)
   * @returns {Promise<Array>} - Array of bookmarks
   */
  async getUserBookmarks(userId, itemType = null) {
    try {
      const query = { user: userId };
      
      // Apply item type filter if provided
      if (itemType) {
        if (!['job', 'profile'].includes(itemType)) {
          throw new Error('Invalid item type');
        }
        query.itemType = itemType;
      }
      
      const bookmarks = await Bookmark.find(query)
        .sort({ createdAt: -1 });
      
      // Populate bookmark items with relevant details
      const populatedBookmarks = [];
      
      for (const bookmark of bookmarks) {
        let itemDetails = null;
        
        if (bookmark.itemType === 'job') {
          itemDetails = await Job.findById(bookmark.itemId)
            .select('title company location salary jobType status')
            .populate('employer', 'companyName companyLogo');
        } else if (bookmark.itemType === 'profile') {
          itemDetails = await User.findById(bookmark.itemId)
            .select('firstName lastName title avatar role');
        }
        
        if (itemDetails) {
          populatedBookmarks.push({
            _id: bookmark._id,
            itemId: bookmark.itemId,
            itemType: bookmark.itemType,
            createdAt: bookmark.createdAt,
            itemDetails
          });
        }
      }
      
      return populatedBookmarks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if an item is bookmarked by user
   * @param {string} userId - User ID
   * @param {string} itemId - Item ID
   * @param {string} itemType - Item type
   * @returns {Promise<boolean>} - True if bookmarked
   */
  async isBookmarked(userId, itemId, itemType) {
    try {
      // Validate item type
      if (!['job', 'profile'].includes(itemType)) {
        throw new Error('Invalid item type');
      }
      
      const bookmark = await Bookmark.findOne({
        user: userId,
        itemId,
        itemType
      });
      
      return bookmark !== null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get bookmark count for an item
   * @param {string} itemId - Item ID
   * @param {string} itemType - Item type
   * @returns {Promise<number>} - Bookmark count
   */
  async getBookmarkCount(itemId, itemType) {
    try {
      // Validate item type
      if (!['job', 'profile'].includes(itemType)) {
        throw new Error('Invalid item type');
      }
      
      const count = await Bookmark.countDocuments({
        itemId,
        itemType
      });
      
      return count;
    } catch (error) {
      throw error;
    }
  }
}