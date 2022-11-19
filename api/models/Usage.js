const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  toolName: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    required: true,
  },

  timesUsed: {
    type: Number,
    required: true,
    default: 0
  },

  docId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Documents",
    required: true
  }
});

Schema.pre('save', function(next){
  this.timesUsed++;
  next();
});


module.exports = mongoose.model('Usages', Schema);