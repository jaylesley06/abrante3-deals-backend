const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit', 'commission']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    unique: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate transaction reference before saving
transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
