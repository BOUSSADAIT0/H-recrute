const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const mongoose = require('mongoose');
const notificationService = require('./notificationService');

/**
 * Service for handling messages and conversations
 */
class MessageService {
  /**
   * Start a new conversation or get existing one
   * @param {string} senderId - Sender user ID
   * @param {string} receiverId - Receiver user ID
   * @param {Object} conversationData - Optional additional conversation data
   * @returns {Promise<Object>} - Conversation object
   */
  async startConversation(senderId, receiverId, conversationData = {}) {
    try {
      // Check if users exist
      const [sender, receiver] = await Promise.all([
        User.findById(senderId),
        User.findById(receiverId)
      ]);
      
      if (!sender || !receiver) {
        throw new Error('One or both users not found');
      }
      
      // Check if conversation already exists between these users
      const existingConversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });
      
      if (existingConversation) {
        return existingConversation;
      }
      
      // Create new conversation
      const newConversation = new Conversation({
        participants: [senderId, receiverId],
        ...conversationData,
        lastMessage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newConversation.save();
      return newConversation;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a message
   * @param {string} conversationId - Conversation ID
   * @param {string} senderId - Sender user ID
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} - Newly created message
   */
  async sendMessage(conversationId, senderId, messageData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Check if conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Verify sender is a participant
      if (!conversation.participants.includes(senderId)) {
        throw new Error('You are not a participant in this conversation');
      }
      
      // Create new message
      const newMessage = new Message({
        conversation: conversationId,
        sender: senderId,
        content: messageData.content,
        contentType: messageData.contentType || 'text',
        attachment: messageData.attachment || null,
        createdAt: new Date()
      });
      
      await newMessage.save({ session });
      
      // Update conversation's last message and timestamp
      conversation.lastMessage = newMessage._id;
      conversation.updatedAt = new Date();
      await conversation.save({ session });
      
      // Get the receiver ID (the other participant)
      const receiverId = conversation.participants.find(
        id => id.toString() !== senderId
      );
      
      // Send notification to receiver
      await notificationService.createNotification({
        recipient: receiverId,
        type: 'newMessage',
        message: 'You have a new message',
        referenceId: conversationId,
        referenceType: 'conversation'
      }, session);
      
      await session.commitTransaction();
      
      // Populate sender details in response
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'firstName lastName avatar');
      
      return populatedMessage;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get messages from a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID (for authorization)
   * @param {Object} options - Query options (pagination, etc.)
   * @returns {Promise<Array>} - Array of messages
   */
  async getMessages(conversationId, userId, options = {}) {
    try {
      // Check if conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Verify user is a participant
      if (!conversation.participants.includes(userId)) {
        throw new Error('You are not a participant in this conversation');
      }
      
      // Set up pagination
      const limit = options.limit || 20;
      const skip = options.skip || 0;
      
      // Get messages with pagination and sort by newest first
      const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      // Reverse array to show oldest messages first
      return messages.reverse();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's conversations
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of conversations
   */
  async getUserConversations(userId) {
    try {
      const conversations = await Conversation.find({
        participants: userId
      })
        .populate('participants', 'firstName lastName avatar companyName role')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
      
      // Format conversations to include other participant's details
      return conversations.map(conversation => {
        const otherParticipant = conversation.participants.find(
          participant => participant._id.toString() !== userId
        );
        
        return {
          _id: conversation._id,
          participant: otherParticipant,
          lastMessage: conversation.lastMessage,
          updatedAt: conversation.updatedAt,
          createdAt: conversation.createdAt
        };
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of messages marked as read
   */
  async markMessagesAsRead(conversationId, userId) {
    try {
      // Check if conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Verify user is a participant
      if (!conversation.participants.includes(userId)) {
        throw new Error('You are not a participant in this conversation');
      }
      
      // Mark all unread messages sent by the other participant as read
      const result = await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          isRead: false
        },
        { isRead: true }
      );
      
      return result.nModified || 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread message count
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Count of unread messages
   */
  async getUnreadCount(userId) {
    try {
      // Get all conversations the user is part of
      const conversations = await Conversation.find({
        participants: userId
      });
      
      const conversationIds = conversations.map(conversation => conversation._id);
      
      // Count unread messages in these conversations
      const count = await Message.countDocuments({
        conversation: { $in: conversationIds },
        sender: { $ne: userId },
        isRead: false
      });
      
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a message
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }
      
      // Verify sender
      if (message.sender.toString() !== userId) {
        throw new Error('You are not authorized to delete this message');
      }
      
      // Don't actually delete, just mark as deleted
      message.isDeleted = true;
      message.content = 'This message has been deleted';
      await message.save();
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteConversation(conversationId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Verify participant
      if (!conversation.participants.includes(userId)) {
        throw new Error('You are not authorized to delete this conversation');
      }
      
      // Delete all messages in conversation
      await Message.deleteMany({ conversation: conversationId }, { session });
      
      // Delete conversation
      await Conversation.findByIdAndDelete(conversationId, { session });
      
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new MessageService();