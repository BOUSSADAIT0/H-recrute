const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de notification pour MongoDB
 */
const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['application', 'status', 'message', 'interview', 'offer', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  relatedId: {
    type: Schema.Types.ObjectId
  },
  relatedType: {
    type: String,
    enum: ['job', 'application', 'message', 'conversation', 'user']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour accélérer la recherche des notifications non lues d'un utilisateur
NotificationSchema.index({ recipient: 1, isRead: 1 });

// Méthode pour marquer la notification comme lue
NotificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Méthode statique pour obtenir les notifications non lues d'un utilisateur
NotificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Méthode statique pour marquer toutes les notifications d'un utilisateur comme lues
NotificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  
  return result.nModified || 0;
};

// Méthode statique pour créer une notification avec population automatique du document associé
NotificationSchema.statics.createWithRelated = async function(notificationData) {
  try {
    // Créer la notification
    const notification = new this(notificationData);
    await notification.save();
    
    // Peupler le document associé si nécessaire
    if (notification.relatedId && notification.relatedType) {
      let populatedNotification;
      
      switch (notification.relatedType) {
        case 'job':
          populatedNotification = await this.findById(notification._id)
            .populate('relatedId', 'title company');
          break;
        case 'application':
          populatedNotification = await this.findById(notification._id)
            .populate({
              path: 'relatedId',
              select: 'job applicant status',
              populate: {
                path: 'job',
                select: 'title'
              }
            });
          break;
        case 'message':
          populatedNotification = await this.findById(notification._id)
            .populate({
              path: 'relatedId',
              select: 'sender content'
            });
          break;
        case 'user':
          populatedNotification = await this.findById(notification._id)
            .populate('relatedId', 'firstName lastName profilePicture');
          break;
        default:
          populatedNotification = notification;
      }
      
      return populatedNotification;
    }
    
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

// Créer et exporter le modèle
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;