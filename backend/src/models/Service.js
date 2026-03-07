const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAmharic: String,
  description: { type: String, required: true },
  descriptionAmharic: String,
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'laundry', 
      'daycare', 
      'cleaning', 
      'cooking', 
      'catering', 
      'sewing', 
      'hairdressing',
      'household',
      'childcare',
      'beauty',
      'tailoring',
      'tutoring',
      'massage',
      'event_planning',
      'other'
    ]
  },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String }, // Optional - which skill is used for this service
  duration: String,
  priceType: { type: String, enum: ['per_hour', 'per_day', 'per_service', 'per_item'], default: 'per_service' },
  availability: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: String,
    endTime: String
  }],
  location: {
    city: String,
    subcity: String
  },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
