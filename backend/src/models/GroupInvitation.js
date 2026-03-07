const mongoose = require('mongoose');

const groupInvitationSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VendorGroup', 
    required: true 
  },
  
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  invitedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  
  message: String,
  messageAmharic: String,
  
  // Why this vendor was invited
  matchCriteria: {
    location: Boolean,
    price: Boolean,
    category: Boolean,
    rating: Boolean
  },
  
  // Vendor's response
  response: {
    message: String,
    respondedAt: Date
  },
  
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  
  isRead: { type: Boolean, default: false },
  readAt: Date
  
}, { timestamps: true });

// Indexes
groupInvitationSchema.index({ vendor: 1, status: 1 });
groupInvitationSchema.index({ group: 1, status: 1 });
groupInvitationSchema.index({ invitedBy: 1 });
groupInvitationSchema.index({ expiresAt: 1 });

// Compound unique index to prevent duplicate invitations
groupInvitationSchema.index({ group: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('GroupInvitation', groupInvitationSchema);
