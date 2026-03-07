const mongoose = require('mongoose');

const productRatingSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  commentAmharic: String,
  images: [String], // Customer can upload images with review
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure one rating per customer per product per order
productRatingSchema.index({ product: 1, customer: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('ProductRating', productRatingSchema);
