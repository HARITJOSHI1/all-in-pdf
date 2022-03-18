const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  sendTo: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },

  message: {
      type: String,
      trim: true,
      unique: true
  }
});

module.exports = mongoose.model("User", userSchema);
