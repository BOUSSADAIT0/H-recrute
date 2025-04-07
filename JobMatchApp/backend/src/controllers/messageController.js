const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/Notification');

// @desc    Get all conversations for a user
// @route   GET /api/v1/messages/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user.id] }
  })
    .populate({
      path: 'participants',
      select: 'name avatar'
    })
    .populate({
      path: 'lastMessage'
    })
    .sort({ updatedAt: -1 });
  
  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations
  });
});

// @desc    Create or get a conversation with another user
// @route   POST /api/v1/messages/conversations
// @access  Private
exports.createConversation = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.body;
  
  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  
  if (!receiver) {
    return next(
      new ErrorResponse(`User not found with id of ${receiverId}`, 404)
    );
  }
  
  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, receiverId] }
  });
  
  // If not, create a new conversation
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, receiverId]
    });
  }
  
  // Populate the participants
  conversation = await Conversation.findById(conversation._id).populate({
    path: 'participants',
    select: 'name avatar'
  });
  
  res.status(200).json({
    success: true,
    data: conversation
  });
});

// @desc    Get messages in a conversation
// @route   GET /api/v1/messages/conversations/:conversationId
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  
  if (!conversation) {
    return next(
      new ErrorResponse(
        `Conversation not found with id of ${req.params.conversationId}`,
        404
      )
    );
  }
  
  // Make sure user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse('Not authorized to access this conversation', 401)
    );
  }
  
  // Get messages for this conversation
  const messages = await Message.find({
    conversation: req.params.conversationId
  }).sort({ createdAt: 1 });
  
  // Mark messages as read if they were sent to current user
  await Message.updateMany(
    {
      conversation: req.params.conversationId,
      sender: { $ne: req.user.id },
      read: false
    },
    { read: true }
  );
  
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, content } = req.body;
  
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    return next(
      new ErrorResponse(
        `Conversation not found with id of ${conversationId}`,
        404
      )
    );
  }
  
  // Make sure user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse('Not authorized to access this conversation', 401)
    );
  }
  
  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: req.user.id,
    content
  });
  
  // Update conversation's lastMessage and updatedAt
  conversation.lastMessage = message._id;
  await conversation.save();
  
  // Find receiver id (the other participant)
  const receiverId = conversation.participants.find(
    p => p.toString() !== req.user.id.toString()
  );
  
  // Create notification for receiver
  const sender = await User.findById(req.user.id).select('name');
  
  await Notification.create({
    recipient: receiverId,
    type: 'message',
    message: `New message from ${sender.name}`,
    link: `/messages/${conversationId}`,
    relatedId: message._id
  });
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get unread messages count
// @route   GET /api/v1/messages/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  // Find all conversations user is part of
  const conversations = await Conversation.find({
    participants: { $in: [req.user.id] }
  }).select('_id');
  
  const conversationIds = conversations.map(c => c._id);
  
  // Count unread messages
  const count = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: req.user.id },
    read: false
  });
  
  res.status(200).json({
    success: true,
    data: count
  });
});

// @desc    Delete a conversation
// @route   DELETE /api/v1/messages/conversations/:conversationId
// @access  Private
exports.deleteConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  
  if (!conversation) {
    return next(
      new ErrorResponse(
        `Conversation not found with id of ${req.params.conversationId}`,
        404
      )
    );
  }
  
  // Make sure user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse('Not authorized to delete this conversation', 401)
    );
  }
  
  // Delete all messages in the conversation
  await Message.deleteMany({ conversation: req.params.conversationId });
  
  // Delete the conversation
  await conversation.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete a message
// @route   DELETE /api/v1/messages/:id
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return next(
      new ErrorResponse(`Message not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is the sender of the message
  if (message.sender.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to delete this message', 401)
    );
  }
  
  // Check if this is the last message in conversation
  const conversation = await Conversation.findById(message.conversation);
  
  if (conversation.lastMessage.toString() === message._id.toString()) {
    // Find the previous message
    const previousMessage = await Message.findOne({
      conversation: message.conversation,
      _id: { $ne: message._id }
    }).sort({ createdAt: -1 });
    
    if (previousMessage) {
      conversation.lastMessage = previousMessage._id;
    } else {
      conversation.lastMessage = undefined;
    }
    
    await conversation.save();
  }
  
  await message.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark all messages in a conversation as read
// @route   PUT /api/v1/messages/conversations/:conversationId/read
// @access  Private
exports.markConversationAsRead = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  
  if (!conversation) {
    return next(
      new ErrorResponse(
        `Conversation not found with id of ${req.params.conversationId}`,
        404
      )
    );
  }
  
  // Make sure user is part of conversation
  if (!conversation.participants.includes(req.user.id)) {
    return next(
      new ErrorResponse('Not authorized to access this conversation', 401)
    );
  }
  
  // Mark all messages as read that were sent to current user
  await Message.updateMany(
    {
      conversation: req.params.conversationId,
      sender: { $ne: req.user.id },
      read: false
    },
    { read: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'All messages marked as read'
  });
});