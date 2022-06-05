const mongoose = require("mongoose");
const Users = require("./Users");

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of the document"],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  isCompressed: Boolean,
  compressSize: [Number]
  
});


module.exports = mongoose.model("Documents", docSchema);
