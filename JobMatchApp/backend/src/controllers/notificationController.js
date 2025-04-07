const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get unread notifications count
// @route   GET /api/v1/notifications/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    read: false
  });
  
  res.status(200).json({
    success: true,
    data: count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this notification`,
        401
      )
    );
  }
  
  notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read/all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { read: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this notification`,
        401
      )
    );
  }
  
  await notification.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/v1/notifications/read
// @access  Private
exports.deleteReadNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({ recipient: req.user.id, read: true });
  
  res.status(200).json({
    success: true,
    message: 'All read notifications deleted'
  });
});

// @desc    Create notification (for admin or testing)
// @route   POST /api/v1/notifications
// @access  Private/Admin
exports.createNotification = asyncHandler(async (req, res, next) => {
  // Only allow admins to create notifications directly
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'Not authorized to create notifications directly',
        401
      )
    );
  }
  
  const notification = await Notification.create(req.body);
  
  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Get notifications by type
// @route   GET /api/v1/notifications/type/:type
// @access  Private
exports.getNotificationsByType = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
    type: req.params.type
  }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});