const mongoose = require('mongoose');

const dataPlanSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true,
    enum: ['MTN', 'AirtelTigo', 'Telecel']
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
  validity: {
    type: String,
    default: '30 days'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DataPlan', dataPlanSchema);
