const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'organization', 'admin'], default: 'customer' },
  phone: { type: String, required: true },
  location: {
    city: String,
    subcity: String,
    woreda: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  language: { type: String, enum: ['amharic', 'afaan_oromo', 'tigrinya', 'english'], default: 'amharic' },
  
  // Vendor specific fields
  skills: [String],
  bio: String,
  portfolio: [String], // Image URLs
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  
  // Vendor offering type
  offeringType: { 
    type: String, 
    enum: ['products', 'services', 'both', 'not_set'], 
    default: 'not_set' 
  },
  // Can be set later if vendor chooses "skip for now"
  hasCompletedProfile: { type: Boolean, default: false },
  
  // Organization specific fields
  organizationType: { type: String, enum: ['restaurant', 'office', 'shop', 'hotel', 'other'] },
  businessName: String,
  
  // Verification
  isVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIdVerified: { type: Boolean, default: false },
  verificationDocuments: [String],
  rejectionReason: String,
  
  // Account Status
  isActive: { type: Boolean, default: true },
  suspensionReason: String,
  
  // Financial
  paymentMethod: { type: String, enum: ['telebirr', 'mpesa', 'bank_transfer', 'cash'], default: 'telebirr' },
  telebirrNumber: String,
  mpesaNumber: String,
  bankAccount: {
    bankName: String,
    accountNumber: String
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
