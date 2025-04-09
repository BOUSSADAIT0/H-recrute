const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de message pour MongoDB
 */
const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  relatedJob: {
    type: Schema.Types.ObjectId,
    ref: 'Job'
  },
  relatedApplication: {
    type: Schema.Types.ObjectId,
    ref: 'Application'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

// Méthodes statiques pour les conversations
MessageSchema.statics.getConversation = async function(user1Id, user2Id, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { sender: user1Id, recipient: user2Id },
      { sender: user2Id, recipient: user1Id }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'firstName lastName profilePicture')
    .populate('recipient', 'firstName lastName profilePicture');
};

// Méthode pour marquer un message comme lu
MessageSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Méthode statique pour obtenir les conversations d'un utilisateur
MessageSchema.statics.getUserConversations = async function(userId) {
  // Trouver tous les utilisateurs avec lesquels l'utilisateur a échangé des messages
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
            '$recipient',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        user: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1
        },
        lastMessage: 1,
        unreadCount: 1
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  return conversations;
};

// Créer et exporter le modèle
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;