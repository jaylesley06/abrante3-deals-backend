const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  network: {
    type: String,
    required: true,
    enum: ['MTN', 'AirtelTigo', 'Telecel']
  },
  dataPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataPlan',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^0\d{9}$/, 'Please provide a valid phone number']
  },
  dataAmount: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  orderReference: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate order reference before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderReference) {
    this.orderReference = 'ABR' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
