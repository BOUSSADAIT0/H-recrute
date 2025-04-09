const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de conversation pour MongoDB
 */
const ConversationSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  subject: {
    type: String,
    trim: true
  },
  relatedJob: {
    type: Schema.Types.ObjectId,
    ref: 'Job'
  },
  relatedApplication: {
    type: Schema.Types.ObjectId,
    ref: 'Application'
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour accélérer la recherche des conversations d'un utilisateur
ConversationSchema.index({ participants: 1 });

// Index composé pour le job et l'application 
ConversationSchema.index({ relatedJob: 1, relatedApplication: 1 });

// Méthode pour ajouter un message à la conversation
ConversationSchema.methods.addMessage = async function(messageData) {
  const Message = mongoose.model('Message');
  
  // Créer le nouveau message
  const newMessage = new Message({
    conversation: this._id,
    ...messageData
  });
  
  await newMessage.save();
  
  // Mettre à jour le dernier message
  this.lastMessage = newMessage._id;
  await this.save();
  
  return newMessage;
};

// Méthode pour récupérer les messages d'une conversation
ConversationSchema.methods.getMessages = async function(limit = 50, skip = 0) {
  const Message = mongoose.model('Message');
  
  const messages = await Message.find({ conversation: this._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'firstName lastName profilePicture')
    .populate('recipient', 'firstName lastName profilePicture');
  
  return messages.reverse(); // Renvoyer dans l'ordre chronologique
};

// Méthode pour compter les messages non lus
ConversationSchema.methods.countUnreadMessages = async function(userId) {
  const Message = mongoose.model('Message');
  
  const count = await Message.countDocuments({
    conversation: this._id,
    recipient: userId,
    isRead: false
  });
  
  return count;
};

// Méthode statique pour trouver ou créer une conversation entre deux utilisateurs
ConversationSchema.statics.findOrCreateConversation = async function(user1Id, user2Id, metadata = {}) {
  // Chercher une conversation existante
  let conversation = await this.findOne({
    participants: { $all: [user1Id, user2Id] }
  }).populate('participants', 'firstName lastName profilePicture');
  
  // Si aucune conversation n'existe, en créer une nouvelle
  if (!conversation) {
    conversation = new this({
      participants: [user1Id, user2Id],
      ...metadata
    });
    
    await conversation.save();
    
    // Repeupler la conversation nouvellement créée
    conversation = await this.findById(conversation._id)
      .populate('participants', 'firstName lastName profilePicture');
  }
  
  return conversation;
};

// Créer et exporter le modèle
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;