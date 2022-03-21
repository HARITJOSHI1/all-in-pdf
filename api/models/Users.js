const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  sendTo: {
    type: String,
    trim: true,
    lowercase: true,
    default: "sender@noreply.com",
    validate: [validator.isEmail, "Please enter a valid email address"],
  },

  message: {
      type: String,
      trim: true,
      default: "Some msg"
  }
});

module.exports = mongoose.model("Users", userSchema);
