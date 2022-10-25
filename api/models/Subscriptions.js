const mongoose = require('mongoose');

const subscriptionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: [true, 'Please provide the user for this subscription'],
  },

  priceForSub: {
    type: String,
    required: [true, 'Please provide the price id for the subscription'],
  },

  customerId: {
    type: String,
    required: [true, 'Please provide the customer id for the subscription'],
  },

  transactionId: {
    type: String,
    required: [true, 'Please provide the transaction id for the subscription'],
  },

  createdAt: {
    type: Date,
    required: [
      true,
      'Please provide the date at which subscription is created',
    ],
  },
  reccur: {
    type: Date,
    required: [
      true,
      'Please provide the date at which subscription is reccur',
    ],
  },
});

subscriptionsSchema.index({ createdAt: 1, customerId: 1 });

module.exports = mongoose.model('Subscriptions', subscriptionsSchema);
