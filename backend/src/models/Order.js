const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderType: { type: String, enum: ['individual', 'bulk'], default: 'individual' },
  items: [{
    itemType: { type: String, enum: ['product', 'service'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemName: String,
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['telebirr', 'mpesa', 'bank_transfer', 'cash'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  deliveryAddress: {
    city: String,
    subcity: String,
    woreda: String,
    specificLocation: String,
    phone: String
  },
  scheduledDate: Date,
  notes: String,
  smsNotificationSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
