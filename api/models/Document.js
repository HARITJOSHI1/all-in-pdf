const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of the document"],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  type: String,
  isCompressed: Boolean,
  compressSize: [Number],
  isEncrypted: Boolean,
  password: String
});

docSchema.pre('save', async function(next){
  if(this.password){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Documents", docSchema);
