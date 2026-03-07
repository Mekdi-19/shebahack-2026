const mongoose = require('mongoose');

const serviceRatingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  commentAmharic: String,
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure one rating per customer per service per order
serviceRatingSchema.index({ service: 1, customer: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('ServiceRating', serviceRatingSchema);
