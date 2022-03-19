const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide name of the document"],
  },

  size: {
    type: Number,
    required: [true, "Please provide size of the document"],
  },

  type: {
    type: String,
    required: [true, "Please provide type of the document"],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },
  
});

module.exports = mongoose.model("Document", docSchema);
