const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  type: { 
    type: String, 
    enum: ['new_product', 'special_offer', 'price_drop', 'top_rated', 'recommendation'],
    required: true 
  },
  
  title: { type: String, required: true },
  titleAmharic: String,
  
  message: { type: String, required: true },
  messageAmharic: String,
  
  // Related items
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  
  // Notification data
  data: {
    oldPrice: Number,
    newPrice: Number,
    discount: Number,
    rating: Number,
    category: String
  },
  
  // Status
  isRead: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  sentAt: Date,
  readAt: Date,
  
  // Delivery channels
  channels: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  }
  
}, { timestamps: true });

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
