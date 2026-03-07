const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Subscription preferences
  preferences: {
    rankingType: { 
      type: String, 
      enum: ['rating', 'price', 'both'], 
      default: 'rating' 
    },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 }
    },
    categories: [{ 
      type: String 
    }],
    locations: [{ 
      type: String 
    }]
  },
  
  // Notification settings
  notifications: {
    newProducts: { type: Boolean, default: true },
    specialOffers: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    topRated: { type: Boolean, default: true },
    frequency: { 
      type: String, 
      enum: ['instant', 'daily', 'weekly'], 
      default: 'daily' 
    }
  },
  
  // Contact preferences
  contactMethod: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  
  isActive: { type: Boolean, default: true },
  lastNotificationSent: { type: Date }
  
}, { timestamps: true });

// Index for faster queries
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ 'preferences.categories': 1 });
subscriptionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
