const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAmharic: String,
  description: { type: String, required: true },
  descriptionAmharic: String,
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'handmade_crafts', 
      'crafts',
      'food', 
      'clothes', 
      'jewelry', 
      'baskets', 
      'textiles',
      'home_kitchen',
      'household',
      'beauty',
      'accessories',
      'art',
      'pottery',
      'weaving',
      'embroidery',
      'other'
    ]
  },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String }, // Optional - which skill is used for this product
  images: [String],
  stock: { type: Number, default: 0 },
  minOrderQuantity: { type: Number, default: 1 },
  bulkPricing: [{
    minQuantity: Number,
    price: Number
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
